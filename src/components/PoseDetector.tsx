import usePushNotification from "@/hooks/usePushNotification"
import type { pose } from "@/utils/detector"
import { detectSlope, detectTextNeck } from "@/utils/detector"
import { drawPose } from "@/utils/drawer"
import { worker } from "@/utils/worker"
import { useCallback, useEffect, useRef, useState } from "react"
import CameraContianer from "./CameraContianer"
import TrackingResult from "./TrackingResult"

const PoseDetector: React.FC = () => {
  const [isScriptLoaded, setIsScriptLoaded] = useState<boolean>(false)
  const [isScriptError, setIsScriptError] = useState<boolean>(false)
  const [slope, setSlope] = useState<string | null>(null)
  const [isTextNeck, setIsTextNeck] = useState<boolean | null>(null)
  const [isModelLoaded, setIsModelLoaded] = useState<boolean>(false)
  const [mode, setMode] = useState<string>("snapshot")
  const [canInit, setCanInit] = useState<boolean>(false)
  const [isSnapSaved, setIsSnapSaved] = useState<boolean>(false)
  const modelRef = useRef<any>(null)
  const snapRef = useRef<pose[] | null>(null)
  const resultRef = useRef<pose[] | null>(null)
  const textNeckStartTime = useRef<number | null>(null)
  const timer = useRef<any>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const dx = useRef<number>(0)
  const dy = useRef<number>(0)
  const scale = useRef<number>(1)

  const { requestNotificationPermission, showNotification } = usePushNotification()

  const requestApi = (delay: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, delay))

  const setup = async (): Promise<void> => {
    window.ml5.bodyPose(
      "MoveNet",
      {
        modelType: "SINGLEPOSE_THUNDER",
      },
      setupCallback
    )
  }

  const setupCallback = async (bodypose: any, error: Error): Promise<void> => {
    if (error) {
      console.log("bodypose 모델 불러오기를 실패했습니다.")
      return
    }
    await initializeBackend()
    setIsModelLoaded(true)
    modelRef.current = bodypose
    worker.postMessage({ type: "init", data: {} })
  }

  const getScript = (): void => {
    const script = document.createElement("script")
    script.src = "https://unpkg.com/ml5@1/dist/ml5.min.js"
    script.onload = (): void => {
      setIsScriptLoaded(true)
      setup()
    }
    script.onerror = (): void => {
      setIsScriptError(true)
    }
    document.body.appendChild(script)
  }

  // webgl설정
  const initializeBackend = async (): Promise<void> => {
    await window.ml5.setBackend("webgl")
  }

  const canInitCallback = (canInit: boolean) => {
    setCanInit(canInit)
  }

  const detect = useCallback(
    (results: pose[]): void => {
      resultRef.current = results
      if (canvasRef.current) {
        drawPose(results, canvasRef.current, dx.current, dy.current, scale.current, canInitCallback, !!snapRef.current)
      }
      if (snapRef.current) {
        const _slope = detectSlope(snapRef.current, results, mode === "snapshot")
        const _isTextNeck = detectTextNeck(snapRef.current, results, mode === "snapshot")
        if (_slope !== null) setSlope(_slope)
        if (_isTextNeck !== null) setIsTextNeck(_isTextNeck)

        if (_isTextNeck) {
          if (!textNeckStartTime || !textNeckStartTime.current) {
            textNeckStartTime.current = Date.now()
            // 거북목 자세 3초 유지 시, api 요청을 보내게 (콘솔 로그에서 확인)
          } else if (Date.now() - textNeckStartTime.current >= 3000) {
            if (!timer.current) {
              timer.current = setInterval(() => {
                requestApi(1000).then(() => console.log("api request"))
                showNotification()
              }, 2000)
            }
          }
        } else {
          clearInterval(timer.current)
          timer.current = null
          textNeckStartTime.current = null
        }
      }
    },
    [mode, setSlope, setIsTextNeck, showNotification]
  )

  const detectStart = useCallback(
    async (video: HTMLVideoElement): Promise<void> => {
      worker.onmessage = ({}: any) => {
        if (modelRef.current) {
          modelRef.current.detect(video, detect)
        }
      }
    },
    [detect]
  )

  const getInitSnap = (): void => {
    if (modelRef && modelRef.current) {
      snapRef.current = resultRef.current
      setIsSnapSaved(true)
    }
  }

  useEffect(() => {
    requestNotificationPermission()
    getScript()
  }, [])

  useEffect(() => {
    if (isModelLoaded) {
      const video = document.querySelector("video")
      if (video) {
        detectStart(video)
      }
    }
  }, [isModelLoaded, detectStart])

  const initializePoseMonitoring = () => {
    setIsTextNeck(null)
    setSlope(null)
    snapRef.current = null
    setIsSnapSaved(false)
    setCanInit(false)
  }

  const onChangeMode = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value) {
      setMode(e.target.value)
      initializePoseMonitoring()
    }
  }

  const onChangeTranslation = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.id
    if (e.target.value) {
      const value = Number.parseInt(e.target.value)
      switch (id) {
        case "vertical":
          dy.current = value
          return
        case "horizontal":
          dx.current = value
          return
        case "scale":
          scale.current = (value / 100) * 2
          return
        default:
      }
    }
  }

  const onCancelAutoPoseMonitoring = () => {
    initializePoseMonitoring()
  }

  return (
    <>
      {isScriptError ? (
        "스크립트 불러오기 실패"
      ) : !isScriptLoaded ? (
        "스크립트 불러오는 중"
      ) : (
        <div className="flex flex-col items-center justify-center">
          <CameraContianer
            detectStart={detectStart}
            canvasRef={canvasRef}
            isModelLoaded={isModelLoaded}
            onChangeTranslation={onChangeTranslation}
          />
          {isModelLoaded && (
            <div
              style={{
                display: "flex",
              }}
            >
              <div className="text-center">
                <div className="font-bold text-red-500">본 화면은 좌우가 반대로 보이고 있으니 주의하세요!</div>
                <div>
                  <select className="rounded border border-gray-400 bg-white p-2" onChange={onChangeMode}>
                    <option value={"snapshot"}>스냅샷 모드 (올바른 자세 촬영 후, 해당 자세 기준으로 측정)</option>
                    <option value={"skeleton"}>자동 모드 (올바른 자세 기준으로 측정)</option>
                  </select>
                </div>
                {mode === "snapshot" && (
                  <div
                    style={{
                      paddingTop: "5px",
                    }}
                  >
                    {canInit ? (
                      isSnapSaved ? (
                        <button
                          className="rounded bg-blue-500 px-4 py-2 font-bold text-white"
                          onClick={initializePoseMonitoring}
                        >
                          스냅샷 다시 찍기
                        </button>
                      ) : (
                        <button className="rounded bg-blue-500 px-4 py-2 font-bold text-white" onClick={getInitSnap}>
                          올바른 자세를 촬영한 후 자세 측정 시작!
                        </button>
                      )
                    ) : (
                      <div className="font-bold text-red-500">
                        스냅샷을 찍을 수 없습니다. 가이드 라인에 맞게 자세를 잡아주세요.
                      </div>
                    )}
                  </div>
                )}
                {mode === "skeleton" && (
                  <>
                    <div className="p-1 font-bold">자동 모드입니다. 자동으로 부적절한 자세를 추적합니다.</div>
                    <div className="flex gap-10">
                      <button
                        className="rounded bg-blue-500 px-4 py-2 font-bold text-white disabled:bg-gray-400"
                        onClick={getInitSnap}
                        // disabled={snapShoptPose.length > 0}
                      >
                        자세 모니터링 시작!
                      </button>
                      <button
                        className="rounded bg-red-500 px-4 py-2 font-bold text-white disabled:bg-gray-400"
                        onClick={onCancelAutoPoseMonitoring}
                        // disabled={snapShoptPose.length === 0}
                      >
                        자세 모니터링 취소
                      </button>
                    </div>
                  </>
                )}
              </div>
              <div
                style={{
                  paddingLeft: "20px",
                  paddingTop: "20px",
                }}
              >
                <TrackingResult isTextNeck={isTextNeck} slope={slope} />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default PoseDetector
