import usePushNotification from "@/hooks/usePushNotification"
import type { pose } from "@/utils/detector"
import { detectHandOnChin, detectSlope, detectTextNeck, detectTailboneSit } from "@/utils/detector"
import { drawPose } from "@/utils/drawer"
import { worker } from "@/utils/worker"
import { useCallback, useEffect, useRef, useState } from "react"
import Camera from "./Camera"
import GuidePopup from "./Posture/GuidePopup"
import { useSnapshotStore } from "@/store/SnapshotStore"
import { useCreateSnaphot } from "@/hooks/useSnapshotMutation"
import { position } from "@/api"
import PostureCheckIcon from "@assets/icons/good-posture-check-button-icon.svg?react"
import GuideIcon from "@assets/icons/posture-guide-button-icon.svg?react"
import { useSendPose } from "@/hooks/usePoseMutation"
import { poseType } from "@/api/pose"

const PoseDetector: React.FC = () => {
  const [isScriptLoaded, setIsScriptLoaded] = useState<boolean>(false)
  const [isScriptError, setIsScriptError] = useState<boolean>(false)
  const [isTextNeck, setIsTextNeck] = useState<boolean | null>(null)
  const [isShoulderTwist, setIsShoulderTwist] = useState<boolean | null>(null)
  const [isTailboneSit, setIsTailboneSit] = useState<boolean | null>(null)
  const [isHandOnChin, setIsHandOnChin] = useState<boolean | null>(null)
  const [isModelLoaded, setIsModelLoaded] = useState<boolean>(false)
  const [isSnapSaved, setIsSnapSaved] = useState<boolean>(false)
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false)
  const modelRef = useRef<any>(null)
  const snapRef = useRef<pose[] | null>(null)
  const resultRef = useRef<pose[] | null>(null)

  const turtleNeckTimer = useRef<any>(null)
  const shoulderTwistTimer = useRef<any>(null)
  const chinUtpTimer = useRef<any>(null)
  const tailboneSitTimer = useRef<any>(null)

  const canvasRef = useRef<HTMLCanvasElement>(null)

  const snapshot = useSnapshotStore((state) => state.snapshot)
  const createSnapMutation = useCreateSnaphot()
  const sendPoseMutation = useSendPose()

  const setSnap = useSnapshotStore((state) => state.setSnapshot)

  const { requestNotificationPermission, showNotification } = usePushNotification()

  // webgl 설정
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

  const managePoseTimer = (
    condition: boolean | null,
    timerRef: React.MutableRefObject<any>,
    poseType: poseType,
    isSnapSaved: boolean
  ): void => {
    if (condition && isSnapSaved) {
      if (!timerRef.current) {
        timerRef.current = setInterval(() => {
          if (resultRef.current) {
            const { keypoints, score } = resultRef.current[0]
            const req = { snapshot: { keypoints, score }, type: poseType }
            sendPoseMutation.mutate(req)
          }
        }, 5000)
      }
    } else {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const detect = useCallback(
    (results: pose[]): void => {
      resultRef.current = results

      if (canvasRef.current) {
        drawPose(results, canvasRef.current)
      }

      if (snapRef.current) {
        const _isShoulderTwist = detectSlope(snapRef.current, results, false)
        const _isTextNeck = detectTextNeck(snapRef.current, results, true)
        const _isHandOnChin = detectHandOnChin(results)
        const _isTailboneSit = detectTailboneSit(snapRef.current, results)

        if (_isShoulderTwist !== null) setIsShoulderTwist(_isShoulderTwist)
        if (_isTextNeck !== null) setIsTextNeck(_isTextNeck)
        if (_isHandOnChin !== null) setIsHandOnChin(_isHandOnChin)
        if (_isTailboneSit !== null) setIsTailboneSit(_isTailboneSit)

        // 공통 타이머 관리 함수 호출
        managePoseTimer(_isTextNeck, turtleNeckTimer, "TURTLE_NECK", isSnapSaved)
        managePoseTimer(_isShoulderTwist, shoulderTwistTimer, "SHOULDER_TWIST", isSnapSaved)
        managePoseTimer(_isTailboneSit, tailboneSitTimer, "TAILBONE_SIT", isSnapSaved)
      }
    },
    [setIsShoulderTwist, setIsTextNeck, setIsHandOnChin, setIsTailboneSit, isSnapSaved, showNotification]
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
      if (snapshot === null) {
        if (snapRef.current) {
          const req = snapRef.current[0].keypoints.map((p) => ({
            position: p.name.toUpperCase() as position,
            x: p.x,
            y: p.y,
          }))
          createSnapMutation.mutate(
            { points: req },
            {
              onSuccess: () => {
                if (snapRef.current) {
                  setSnap(snapRef.current[0].keypoints)
                  setIsSnapSaved(true)
                }
              },
            }
          )
        }
      }
    }
  }

  const getUserSnap = (): void => {
    if (snapshot) {
      snapRef.current = [{ keypoints: snapshot }]
      setIsSnapSaved(true)
    }
  }

  const clearTimers = () => {
    clearInterval(turtleNeckTimer.current)
    clearInterval(shoulderTwistTimer.current)
    clearInterval(tailboneSitTimer.current)

    turtleNeckTimer.current = null
    shoulderTwistTimer.current = null
    tailboneSitTimer.current = null
  }

  const clearSnap = (): void => {
    if (snapshot) {
      snapRef.current = null
      setIsSnapSaved(false)
      setSnap(null)
      clearTimers() // 타이머들을 초기화
    }
  }

  const getIsRight = (
    _isShoulderTwist: boolean | null,
    _isTextNeck: boolean | null,
    _isTailboneSit: boolean | null
  ): boolean => {
    if (!_isShoulderTwist && !_isTextNeck && !_isTailboneSit) return true
    return false
  }

  useEffect(() => {
    requestNotificationPermission()
    getScript()
  }, [])

  useEffect(() => {
    if (!isSnapSaved) {
      clearTimers() // 스냅샷이 저장되지 않았을 때 타이머들을 초기화
    }
  }, [isSnapSaved])

  useEffect(() => {
    if (isModelLoaded) {
      const video = document.querySelector("video")
      if (video) {
        detectStart(video)
      }
    }
  }, [isModelLoaded, detectStart])

  useEffect(() => {
    if (snapshot) getUserSnap()
  }, [snapshot])

  // 팝업 열기
  const handleShowPopup = (): void => {
    setIsPopupVisible(true)
  }

  // 팝업 닫기
  const handleClosePopup = (): void => {
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
                  : getIsRight(isShoulderTwist, isTextNeck, isHandOnChin, isTailboneSit)
                  ? "올바른 자세입니다."
                  : "올바르지 않은 자세입니다."}
              </div>
              <div className="absolute bottom-0 flex w-full items-center justify-center gap-[16px] p-[50px] text-white">
                {!isSnapSaved ? (
                  <>
                    <button
                      className="flex w-[260px] items-center justify-center rounded rounded-full bg-white bg-opacity-80 p-[20px] text-black"
                      onClick={handleShowPopup}
                    >
                      <div className="flex flex-row items-center gap-2">
                        <GuideIcon />
                        <span>가이드 다시 볼게요!</span>
                      </div>
                    </button>
                    <button
                      className="flex w-[260px] items-center justify-center rounded rounded-full bg-[#1A75FF] bg-opacity-80 p-[20px] text-white"
                      onClick={getInitSnap}
                    >
                      <div className="flex flex-row items-center gap-2">
                        <PostureCheckIcon />
                        바른자세를 취했어요!
                      </div>
                    </button>
                  </>
                ) : (
                  <button
                    className="flex w-[260px] items-center justify-center rounded rounded-full bg-[#1A75FF] bg-opacity-80 p-[20px] text-white"
                    onClick={clearSnap}
                  >
                    <div className="flex flex-row items-center gap-2">
                      <PostureCheckIcon />
                      스냅샷 다시찍기
                    </div>
                  </button>
                )}
              </div>
            </>
          )}
          {isPopupVisible && <GuidePopup onClose={handleClosePopup} />} {/* 팝업 표시 */}
        </div>
      )}
    </>
  )
}

export default PoseDetector
