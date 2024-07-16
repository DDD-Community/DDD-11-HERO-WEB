import { useState, useEffect, useRef } from "react"
import { Camera } from "."
import type { pose } from "@/utils/detector"
import { detectSlope, detectTextNeck } from "@/utils/detector"
import { drawPose } from "@/utils/drawer"
import usePushNotification from "@/hooks/usePushNotification"
import { worker } from "@/utils/worker"

declare let ml5: any

const PoseDetector: React.FC = () => {
  const [isScriptLoaded, setIsScriptLoaded] = useState<boolean>(false)
  const [isScriptError, setIsScriptError] = useState<boolean>(false)
  const [slope, setSlope] = useState<string | null>(null)
  const [isTextNeck, setIsTextNeck] = useState<boolean | null>(null)
  const [isModelLoaded, setIsModelLoaded] = useState<boolean>(false)
  const [mode, setMode] = useState<string>("snapshot")

  const modelRef = useRef<any>(null)
  const snapRef = useRef<pose[] | null>(null)
  const resultRef = useRef<pose[] | null>(null)
  const textNeckStartTime = useRef<number | null>(null)
  const timer = useRef<any>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const { requestNotificationPermission, showNotification } = usePushNotification()

  const requestApi = (delay: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, delay))

  const setup = async (): Promise<void> => {
    ml5.bodyPose(
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
    await ml5.setBackend("webgl")
  }

  const detect = (results: pose[]): void => {
    resultRef.current = results
    if (canvasRef.current) drawPose(results, canvasRef.current)
    if (snapRef.current) {
      const _slope = detectSlope(snapRef.current, results, mode === "snapshot")
      const _isTextNeck = detectTextNeck(snapRef.current, results)
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
  }

  const detectStart = async (video: HTMLVideoElement): Promise<void> => {
    worker.onmessage = ({ }: any) => {
      if (modelRef.current) {
        modelRef.current.detect(video, detect)
      }
    }
  }

  const getInitSnap = (): void => {
    if (modelRef && modelRef.current) snapRef.current = resultRef.current
  }

  useEffect(() => {
    requestNotificationPermission()
    getScript()
  }, [])

  const onChangeMode = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value) {
      setMode(e.target.value)
    }
  }

  return (
    <div>
      {isScriptError ? (
        "스크립트 불러오기 실패"
      ) : !isScriptLoaded ? (
        "스크립트 불러오는 중"
      ) : (
        <>
          <Camera onStreamReady={detectStart} />
          <canvas
            ref={canvasRef}
            width="640"
            height="480"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              border: "1px solid black",
            }}
          />
          {isModelLoaded && (
            <>
              <div className="font-bold text-red-500">본 화면은 좌우가 반대로 보이고 있으니 주의하세요!</div>
              <div className="w-1/2">
                <select
                  className="w-full appearance-none rounded border border-gray-400 bg-white p-2"
                  onChange={onChangeMode}
                >
                  <option value={"snapshot"}>스냅샷 모드 (올바른 자세 촬영 후, 해당 자세 기준으로 측정)</option>
                  <option value={"skeleton"}>스켈레톤 모드 (올바른 자세 제시 후, 해당 자세 기준으로 측정)</option>
                </select>
              </div>
              {mode === "snapshot" && (
                <>
                  <button
                    className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                    onClick={getInitSnap}
                  >
                    올바른 자세를 촬영한 후 자세 측정 시작!
                  </button>
                  <div>
                    거북목 상태:&nbsp;
                    {isTextNeck === null
                      ? "상태를 확인할 수 없습니다."
                      : isTextNeck
                        ? "거북목 상태 입니다"
                        : "정상적인 자세 입니다"}
                  </div>
                  <div>어깨 기울기: {slope === null ? "상태를 확인할 수 없습니다." : slope}</div>
                </>
              )}
              {mode === "skeleton" && (
                <>
                  <button
                    className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                    onClick={getInitSnap}
                  >
                    기준 그림에 몸을 맞춘 후 측정 시작!
                  </button>
                  <div>
                    거북목 상태:&nbsp;
                    {isTextNeck === null
                      ? "상태를 확인할 수 없습니다."
                      : isTextNeck
                        ? "거북목 상태 입니다"
                        : "정상적인 자세 입니다"}
                  </div>
                  <div>어깨 기울기: {slope === null ? "상태를 확인할 수 없습니다." : slope}</div>
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}

export default PoseDetector
