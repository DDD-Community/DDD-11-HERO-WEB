import usePushNotification from "@/hooks/usePushNotification"
import type { pose } from "@/utils/detector"
import { detectSlope, detectTextNeck } from "@/utils/detector"
import { drawPose } from "@/utils/drawer"
import { worker } from "@/utils/worker"
import { useCallback, useEffect, useRef, useState } from "react"
import Camera from "./Camera"
import GuidePopup from "./Posture/GuidePopup"

const PoseDetector: React.FC = () => {
  const [isScriptLoaded, setIsScriptLoaded] = useState<boolean>(false)
  const [isScriptError, setIsScriptError] = useState<boolean>(false)
  const [slope, setSlope] = useState<string | null>(null)
  const [isTextNeck, setIsTextNeck] = useState<boolean | null>(null)
  const [isModelLoaded, setIsModelLoaded] = useState<boolean>(false)
  const [mode] = useState<string>("snapshot")
  const [isSnapSaved, setIsSnapSaved] = useState<boolean>(false)
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false)
  const modelRef = useRef<any>(null)
  const snapRef = useRef<pose[] | null>(null)
  const resultRef = useRef<pose[] | null>(null)
  const textNeckStartTime = useRef<number | null>(null)
  const timer = useRef<any>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const { requestNotificationPermission, showNotification } = usePushNotification()

  const requestApi = (delay: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, delay))

  // webgl설정
  const initializeBackend = async (): Promise<void> => {
    await window.ml5.setBackend("webgl")
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

  const setup = async (): Promise<void> => {
    window.ml5.bodyPose(
      "MoveNet",
      {
        modelType: "SINGLEPOSE_THUNDER",
      },
      setupCallback
    )
  }

  const getScript = (): void => {
    const script = document.createElement("script")
    script.src = "https://unpkg.com/ml5@1.0.1/dist/ml5.min.js"
    script.onload = (): void => {
      setIsScriptLoaded(true)
      setup()
    }
    script.onerror = (): void => {
      setIsScriptError(true)
    }
    document.body.appendChild(script)
  }

  const detect = useCallback(
    (results: pose[]): void => {
      resultRef.current = results
      if (canvasRef.current) {
        drawPose(results, canvasRef.current)
      }
      if (snapRef.current) {
        const _slope = detectSlope(snapRef.current, results, false)
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

  const getIsRight = (_slope: string | null, _isTextNeck: boolean | null): boolean => {
    if (_slope === "적절한 자세입니다" && !_isTextNeck) return true
    return false
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

  // const initializePoseMonitoring = () => {
  //   setIsTextNeck(null)
  //   setSlope(null)
  //   snapRef.current = null
  //   setIsSnapSaved(false)
  // }

  // 팝업 열기
  const handleShowPopup = () => {
    setIsPopupVisible(true)
  }

  // 팝업 닫기
  const handleClosePopup = () => {
    setIsPopupVisible(false)
  }

  return (
    <>
      {isScriptError ? (
        "자세를 트래킹 하기 위한 모델을 불러오는 것에 실패 했습니다. 잠시 후 다시 시도해 주시기 바랍니다."
      ) : !isScriptLoaded ? (
        "스크립트 불러오는 중"
      ) : (
        <div className="relative flex h-full w-full flex-col items-center justify-center">
          <Camera detectStart={detectStart} canvasRef={canvasRef} />
          {isModelLoaded && (
            <>
              <div className="absolute top-0 flex w-full items-center justify-center rounded-t-lg bg-[#1A1B1D] bg-opacity-75 p-[20px] text-white">
                {!isSnapSaved
                  ? "바른 자세를 취한 후, 하단의 버튼을 눌러주세요."
                  : getIsRight(slope, isTextNeck)
                  ? "올바른 자세입니다."
                  : "올바르지 않은 자세입니다."}
              </div>
              {!isSnapSaved && (
                <div className="absolute bottom-0 flex w-full items-center justify-center gap-[20px] p-[50px] text-white">
                  <button
                    className="rounded rounded-full bg-white bg-opacity-80 p-[20px] text-black"
                    onClick={handleShowPopup}
                  >
                    가이드 다시 볼게요!
                  </button>
                  <button
                    className="rounded rounded-full bg-[#1A75FF] bg-opacity-80 p-[20px] text-white"
                    onClick={getInitSnap}
                  >
                    바른자세를 취했어요!
                  </button>
                </div>
              )}
            </>
          )}
          {isPopupVisible && <GuidePopup onClose={handleClosePopup} />} {/* 팝업 표시 */}
        </div>
      )}
    </>
  )
}

export default PoseDetector
