import { useState, useEffect, useRef } from "react"
import { Camera } from "."
import type { pose } from "@/utils/detector"
import { detectSlope, detectTextNeck } from "@/utils/detector"
import { drawPose } from "@/utils/drawer"
import usePushNotification from "@/hooks/usePushNotification"

const PoseDetector: React.FC = () => {
  const [isScriptLoaded, setIsScriptLoaded] = useState<boolean>(false)
  const [isScriptError, setIsScriptError] = useState<boolean>(false)
  const [slope, setSlope] = useState<string | null>(null)
  const [isTextNeck, setIsTextNeck] = useState<boolean>(false)
  const [isModelLoaded, setIsModelLoaded] = useState<boolean>(false)

  const snapRef = useRef<pose[] | null>(null)
  const resultRef = useRef<pose[] | null>(null)
  const textNeckStartTime = useRef<number | null>(null)
  const timer = useRef<any>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const { showNotification } = usePushNotification()

  const requestApi = (delay: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, delay))

  const getScript = (): void => {
    console.log("getScript")
    const script = document.createElement("script")
    script.src = "https://unpkg.com/ml5@1/dist/ml5.min.js"

    script.onload = (): void => {
      setIsScriptLoaded(true)
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

  const detect = (results: pose[]): void => {
    resultRef.current = results
    if (canvasRef.current) drawPose(results, canvasRef.current)
    if (snapRef.current) {
      const _slope = detectSlope(snapRef.current, results)
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

  // pose detecting 시작
  const detectStart = async (video: HTMLVideoElement): Promise<void> => {
    const detector = window.ml5.bodyPose("MoveNet", {
      modelType: "SINGLEPOSE_THUNDER",
    })
    await detector.loadModel()
    await initializeBackend()
    setIsModelLoaded(true)
    detector.detectStart(video, detect)
  }

  const getInitSnap = (): void => {
    if (isModelLoaded) snapRef.current = resultRef.current
  }

  useEffect(() => {
    getScript()
  }, [])

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
          {isModelLoaded ? <button onClick={getInitSnap}>get snap</button> : null}
          <div>{`거북목 상태 ${isTextNeck}`}</div>
          <div>{`어깨 기울기 ${slope}`}</div>
        </>
      )}
    </div>
  )
}

export default PoseDetector
