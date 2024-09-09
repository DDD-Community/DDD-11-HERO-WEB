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
import { useSendPose } from "@/hooks/usePoseMutation"
import { poseType } from "@/api/pose"
import PostureMessage from "./Posture/PostureMessage"
import Controls from "./Posture/Controls"
import { useNotificationStore } from "@/store/NotificationStore"
import { duration } from "@/api/notification"
import { useCameraPermission } from "@/hooks/useCameraPermission"

const PoseDetector: React.FC = () => {
  const [isScriptLoaded, setIsScriptLoaded] = useState<boolean>(false)
  const [isScriptError, setIsScriptError] = useState<boolean>(false)
  const [isTextNeck, setIsTextNeck] = useState<boolean | null>(null)
  const [isShoulderTwist, setIsShoulderTwist] = useState<boolean | null>(null)
  const [isTailboneSit, setIsTailboneSit] = useState<boolean | null>(null)
  const [isHandOnChin, setIsHandOnChin] = useState<boolean | null>(null)
  const [isModelLoaded, setIsModelLoaded] = useState<boolean>(false)
  const [isSnapSaved, setIsSnapSaved] = useState<boolean>(false)
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(true)

  const { showNotification } = usePushNotification()
  const modelRef = useRef<any>(null)
  const snapRef = useRef<pose[] | null>(null)
  const resultRef = useRef<pose[] | null>(null)
  const notificationTimer = useRef<any>(null)
  const turtleNeckTimer = useRef<any>(null)
  const shoulderTwistTimer = useRef<any>(null)
  const chinUtpTimer = useRef<any>(null)
  const tailboneSitTimer = useRef<any>(null)

  const turtleNeckCnt = useRef<number>(0)
  const shoulderTwistCnt = useRef<number>(0)
  const chinUtpCnt = useRef<number>(0)
  const tailboneSitCnt = useRef<number>(0)

  const canvasRef = useRef<HTMLCanvasElement>(null)

  const snapshot = useSnapshotStore((state) => state.snapshot)
  const createSnapMutation = useCreateSnaphot()
  const sendPoseMutation = useSendPose()

  const setSnap = useSnapshotStore((state) => state.setSnapshot)
  const userNoti = useNotificationStore((state) => state.notification)

  const { requestNotificationPermission } = usePushNotification()
  const { hasPermission } = useCameraPermission()
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

  const getPoseName = (poseType: poseType): string => {
    switch (poseType) {
      case "TURTLE_NECK":
        return "거북목"
      case "SHOULDER_TWIST":
        return "어깨 틀어짐"
      case "CHIN_UTP":
        return "턱 괴기"
      case "TAILBONE_SIT":
        return "꼬리뼈 앉기"
    }
    return ""
  }

  const managePoseTimer = useCallback(
    (
      condition: boolean | null,
      timerRef: React.MutableRefObject<any>,
      poseType: poseType,
      isSnapSaved: boolean,
      cntRef: React.MutableRefObject<any>,
      isShowNoti: boolean | undefined
    ): void => {
      if (condition && isSnapSaved) {
        if (!timerRef.current) {
          timerRef.current = setInterval(() => {
            if (resultRef.current) {
              const { keypoints, score } = resultRef.current[0]
              const req = { snapshot: { keypoints, score }, type: poseType }
              sendPoseMutation.mutate(req)
              cntRef.current = cntRef.current + 1
              if (isShowNoti) showNotification(`척추 건강 위험! ${getPoseName(poseType)} 감지! 자세를 바르게 앉아주세요.`)
            }
          }, 30 * 1000)
        }
      } else {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    },
    [sendPoseMutation, showNotification]
  )

  const detect = useCallback(
    (results: pose[]): void => {
      resultRef.current = results
      if (snapRef.current) {
        const _isShoulderTwist = detectSlope(snapRef.current, results, false)
        const _isTextNeck = detectTextNeck(snapRef.current, results, true)
        const _isHandOnChin = detectHandOnChin(results)
        const _isTailboneSit = detectTailboneSit(snapRef.current, results)
        const _isShowNoti = userNoti?.duration === "IMMEDIATELY" && userNoti?.isActive

        if (_isShoulderTwist !== null) setIsShoulderTwist(_isShoulderTwist)
        if (_isTextNeck !== null) setIsTextNeck(_isTextNeck)
        if (_isHandOnChin !== null) setIsHandOnChin(_isHandOnChin)
        if (_isTailboneSit !== null) setIsTailboneSit(_isTailboneSit)

        // 공통 타이머 관리 함수 호출
        managePoseTimer(_isTextNeck, turtleNeckTimer, "TURTLE_NECK", isSnapSaved, turtleNeckCnt, _isShowNoti)
        managePoseTimer(
          _isShoulderTwist,
          shoulderTwistTimer,
          "SHOULDER_TWIST",
          isSnapSaved,
          shoulderTwistCnt,
          _isShowNoti
        )
        managePoseTimer(_isTailboneSit, tailboneSitTimer, "TAILBONE_SIT", isSnapSaved, tailboneSitCnt, _isShowNoti)
        managePoseTimer(_isHandOnChin, chinUtpTimer, "CHIN_UTP", isSnapSaved, chinUtpCnt, _isShowNoti)
        const isRight = !_isTextNeck && !_isHandOnChin && !_isShoulderTwist && !_isTailboneSit
        if (canvasRef.current) drawPose(results, canvasRef.current, isRight)
      } else {
        if (canvasRef.current) drawPose(results, canvasRef.current)
      }
    },
    [setIsShoulderTwist, setIsTextNeck, setIsHandOnChin, setIsTailboneSit, isSnapSaved, managePoseTimer, userNoti]
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

  const getInitSnap = useCallback((): void => {
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
  }, [createSnapMutation, snapshot, setSnap])

  const getUserSnap = (): void => {
    if (snapshot) {
      snapRef.current = [{ keypoints: snapshot }]
      setIsSnapSaved(true)
    }
  }

  const clearTimers = (): void => {
    clearInterval(turtleNeckTimer.current)
    clearInterval(shoulderTwistTimer.current)
    clearInterval(tailboneSitTimer.current)
    clearInterval(chinUtpTimer.current)
    clearInterval(notificationTimer.current)
    turtleNeckTimer.current = null
    shoulderTwistTimer.current = null
    tailboneSitTimer.current = null
    chinUtpTimer.current = null
    notificationTimer.current = null
  }

  const clearSnap = (): void => {
    if (snapshot) {
      snapRef.current = null
      setIsSnapSaved(false)
      setSnap(null)
      clearTimers() // 타이머들을 초기화
    }
  }

  const clearCnt = (): void => {
    turtleNeckCnt.current = 0
    shoulderTwistCnt.current = 0
    tailboneSitCnt.current = 0
    chinUtpCnt.current = 0
  }

  const getDurationInMinutes = (duration: duration): number => {
    switch (duration) {
      case "MIN_15":
        return 15
      case "MIN_30":
        return 30
      case "MIN_45":
        return 45
      default:
        return 60
    }
  }

  const sendNotification = (): void => {
    const message: string[] = []
    if (turtleNeckCnt.current > 0) message.push("거북목")
    if (shoulderTwistCnt.current > 0) message.push("어깨 틀어짐")
    if (chinUtpCnt.current > 0) message.push("턱 괴기")
    if (tailboneSitCnt.current > 0) message.push("꼬리뼈로 앉기")

    if (message.length > 0) {
      showNotification(`척추 건강 위험! ${message.join(", ")} 감지! 자세를 바르게 앉아주세요.`)
    } else {
      showNotification(`좋은 자세를 유지해주세요.`)
    }
  }

  useEffect(() => {
    requestNotificationPermission()
    getScript()
    clearTimers()
    return () => {
      clearTimers()
      clearCnt()
      worker.postMessage({ type: "terminate", data: {} })
    }
  }, [])

  useEffect(() => {
    if (!isSnapSaved || !hasPermission) {
      clearTimers() // 스냅샷이 저장되지 않았을 때 타이머들을 초기화
      clearCnt() // 횟수도 초기화
    }
  }, [isSnapSaved, hasPermission])

  useEffect(() => {
    if (isModelLoaded && hasPermission) {
      const video = document.querySelector("video")
      if (video) {
        detectStart(video)
      }
    }
  }, [isModelLoaded, hasPermission, detectStart])

  useEffect(() => {
    if (snapshot) getUserSnap()
  }, [snapshot])

  useEffect(() => {
    if (!isSnapSaved || !userNoti) return

    clearCnt()
    clearInterval(notificationTimer.current)
    notificationTimer.current = null

    if (userNoti.isActive && userNoti.duration && userNoti.duration !== "IMMEDIATELY") {
      const t = getDurationInMinutes(userNoti?.duration)
      notificationTimer.current = setInterval(() => {
        if (userNoti.duration) {
          sendNotification()
          clearCnt()
        }
      }, 1000 * 60 * t)
    }
  }, [userNoti, isSnapSaved])

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
              <PostureMessage
                isSnapSaved={isSnapSaved}
                isShoulderTwist={isShoulderTwist}
                isTextNeck={isTextNeck}
                isHandOnChin={isHandOnChin}
                isTailboneSit={isTailboneSit}
                hasPermission={hasPermission}
              />
              <Controls
                isSnapSaved={isSnapSaved}
                getInitSnap={getInitSnap}
                clearSnap={clearSnap}
                handleShowPopup={handleShowPopup}
                hasPermission={hasPermission}
              />
            </>
          )}
          {isPopupVisible && <GuidePopup onClose={handleClosePopup} />}
        </div>
      )}
    </>
  )
}

export default PoseDetector
