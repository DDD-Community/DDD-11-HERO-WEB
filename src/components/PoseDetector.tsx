import { duration, poseType, position } from "@/api"
import { useCameraPermission } from "@/hooks/useCameraPermission"
import { useGuidePopup } from "@/hooks/useGuidePopup"
import { useModals } from "@/hooks/useModals"
import useNotification from "@/hooks/useNotification"
import { useSendPose } from "@/hooks/usePoseMutation"
import usePushNotification from "@/hooks/usePushNotification"
import { useCreateSnaphot } from "@/hooks/useSnapshotMutation"
import { useSnapShotStore } from "@/store/SnapshotStore"
import type { pose } from "@/utils/detector"
import { detectHandOnChin, detectSlope, detectTailboneSit, detectTextNeck } from "@/utils/detector"
import { drawPose } from "@/utils/drawer"
import { logAnalytics } from "@/utils/log"
import { worker } from "@/utils/worker"
import CheckLottie from "@assets/animation/check-lottie.json"
import ScriptLoadingLottie from "@assets/animation/script-loading-lottie.json"
import { useCallback, useEffect, useRef, useState } from "react"
import Lottie from "react-lottie"
import { useLocation } from "react-router-dom"
import Camera from "./Camera"
import { modals } from "./Modal/Modals"
import Controls from "./Posture/Controls"
import GuidePopupModal from "./Posture/GuidePopup/GuidePopupModal"
import PostureMessage from "./Posture/PostureMessage"

const PoseDetector: React.FC = () => {
  // const [isScriptLoaded, setIsScriptLoaded] = useState<boolean>(false)
  const [isScriptError, setIsScriptError] = useState<boolean>(false)
  const [isTextNeck, setIsTextNeck] = useState<boolean | null>(null)
  const [isShoulderTwist, setIsShoulderTwist] = useState<boolean | null>(null)
  const [isTailboneSit, setIsTailboneSit] = useState<boolean | null>(null)
  const [isHandOnChin, setIsHandOnChin] = useState<boolean | null>(null)
  const [isModelLoaded, setIsModelLoaded] = useState<boolean>(false)
  const [isClosedInitialGuidePopup, setIsClosedInitialGuidePopup] = useState(false)
  const [isSuccessSnapShotSaved, setIsSuccessSnapShotSaved] = useState(false)
  // const [isSnapShotSaved, setIsSnapSaved] = useState<boolean>(false)

  const { showNotification, hasPermission: hasNotiPermisson, requestNotificationPermission } = usePushNotification()

  const { openModal, isModalOpen } = useModals()

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
  const isShowImmediNotiRef = useRef<boolean>(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDetectingRef = useRef<boolean>(false)

  const { isSnapShotSaved, snapshot, setSnapShot, isInitialSnapShotExist } = useSnapShotStore()
  const createSnapMutation = useCreateSnaphot()
  const sendPoseMutation = useSendPose()
  const { isPopupOpen, handleClosePopup } = useGuidePopup(isClosedInitialGuidePopup)

  // const userNoti = useNotificationStore((state) => state.notification)
  const { notification } = useNotification()
  const { hasPermission } = useCameraPermission()

  const location = useLocation() // 페이지 이동 감지
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
    isDetectingRef.current = true
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
    if (document.getElementById("ml5-script")) {
      setup()
      return
    }
    const script = document.createElement("script")
    script.src = "https://unpkg.com/ml5@1.0.1/dist/ml5.min.js"
    script.id = "ml5-script"
    script.onload = (): void => {
      // setIsScriptLoaded(true)
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
      isSnapShotSaved: boolean,
      cntRef: React.MutableRefObject<any>
    ): void => {
      if (condition && isSnapShotSaved) {
        if (!timerRef.current) {
          clearInterval(timerRef.current)
          timerRef.current = null
          timerRef.current = setInterval(() => {
            if (resultRef.current) {
              const { keypoints, score } = resultRef.current[0]
              const req = { snapshot: { keypoints, score }, type: poseType }
              sendPoseMutation.mutate(req)
              cntRef.current = cntRef.current + 1
              if (isShowImmediNotiRef.current)
                showNotification(`척추 건강 위험! ${getPoseName(poseType)} 감지! 자세를 바르게 앉아주세요.`)
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
      if (!isDetectingRef.current) return
      resultRef.current = results
      if (!isSnapShotSaved || !isInitialSnapShotExist || isModalOpen) {
        if (canvasRef.current) drawPose(results, canvasRef.current)
        return
      }
      if (snapRef.current) {
        const _isShoulderTwist = detectSlope(snapRef.current, results, false)
        const _isTextNeck = detectTextNeck(snapRef.current, results, true, 0.88)
        const _isHandOnChin = detectHandOnChin(snapRef.current, results)
        const _isTailboneSit = detectTailboneSit(snapRef.current, results)

        if (_isShoulderTwist !== null) setIsShoulderTwist(_isShoulderTwist)
        if (_isTextNeck !== null) setIsTextNeck(_isTextNeck)
        if (_isHandOnChin !== null) setIsHandOnChin(_isHandOnChin)
        if (_isTailboneSit !== null) setIsTailboneSit(_isTailboneSit)

        // 공통 타이머 관리 함수 호출
        managePoseTimer(_isTextNeck, turtleNeckTimer, "TURTLE_NECK", isSnapShotSaved, turtleNeckCnt)
        managePoseTimer(_isShoulderTwist, shoulderTwistTimer, "SHOULDER_TWIST", isSnapShotSaved, shoulderTwistCnt)
        managePoseTimer(_isTailboneSit, tailboneSitTimer, "TAILBONE_SIT", isSnapShotSaved, tailboneSitCnt)
        managePoseTimer(_isHandOnChin, chinUtpTimer, "CHIN_UTP", isSnapShotSaved, chinUtpCnt)
        const isRight = !_isTextNeck && !_isHandOnChin && !_isShoulderTwist && !_isTailboneSit
        if (canvasRef.current) drawPose(results, canvasRef.current, isRight)
      } else {
        if (canvasRef.current) drawPose(results, canvasRef.current)
      }
    },
    [
      setIsShoulderTwist,
      setIsTextNeck,
      setIsHandOnChin,
      setIsTailboneSit,
      isSnapShotSaved,
      managePoseTimer,
      notification,
      isInitialSnapShotExist,
      isSnapShotSaved,
    ]
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
        if (snapRef.current && snapRef.current.length > 0) {
          const req = snapRef.current[0].keypoints.map((p) => ({
            position: p.name.toUpperCase() as position,
            x: p.x,
            y: p.y,
          }))
          logAnalytics("complete_take_snapshot", {
            posture_info: req,
          })
          createSnapMutation.mutate(
            { points: req },
            {
              onSuccess: () => {
                setIsSuccessSnapShotSaved(true)
                setTimeout(() => {
                  setIsSuccessSnapShotSaved(false)
                }, 3000)
                if (snapRef.current) {
                  setSnapShot(snapRef.current[0].keypoints)
                }
              },
            }
          )
        } else {
          alert("브라우저의 카메라 혹은 인공지능 모델에 문제가 발생했습니다. 새로고침 후 다시 시도해주시기 바랍니다.")
        }
      }
    }
  }, [createSnapMutation, snapshot, setSnapShot])

  const getUserSnap = (): void => {
    if (snapshot) {
      snapRef.current = [{ keypoints: snapshot }]
      // setIsSnapSaved(true)
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

  // 페이지가 변경될 때마다 타이머를 제거
  useEffect(() => {
    return () => {
      worker.postMessage({ type: "terminate", data: {} })
      isDetectingRef.current = false
      clearTimers()
      clearCnt()
    }
  }, [location])

  useEffect(() => {
    getScript()
  }, [])

  useEffect(() => {
    if (isPopupOpen && isInitialSnapShotExist) {
      openModal(modals.postureGuideModal, {
        onClose: () => [handleClosePopup()],
      })
    }
  }, [isPopupOpen, isInitialSnapShotExist])

  useEffect(() => {
    if (!isSnapShotSaved || !hasPermission) {
      clearTimers() // 스냅샷이 저장되지 않았을 때 타이머들을 초기화
      clearCnt() // 횟수도 초기화
    }
  }, [isSnapShotSaved, hasPermission])

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
    if (!isSnapShotSaved || !notification || !isInitialSnapShotExist || isModalOpen) return

    clearCnt()
    clearInterval(notificationTimer.current)
    notificationTimer.current = null

    if (notification.isActive && notification.duration && notification.duration !== "IMMEDIATELY") {
      const t = getDurationInMinutes(notification.duration)
      notificationTimer.current = setInterval(() => {
        sendNotification()
        clearCnt()
      }, 1000 * 60 * t)
    }
  }, [notification, isSnapShotSaved, isInitialSnapShotExist])

  // 즉시 알림을 사용 하는 경우, 푸시를 보낼지 여부를 저장
  useEffect(() => {
    isShowImmediNotiRef.current =
      notification?.duration === "IMMEDIATELY" && (notification?.isActive as boolean) && hasNotiPermisson
  }, [notification?.duration, notification?.isActive, hasNotiPermisson])

  // 팝업 열기
  const handleShowPopup = (): void => {
    // openPopup()
    openModal(modals.postureGuideModal, {})
  }

  useEffect(() => {
    requestNotificationPermission()
  }, [notification, requestNotificationPermission])

  const handleCloseInitialGuidePopup = () => {
    setIsClosedInitialGuidePopup(true)
  }

  return (
    <>
      {isScriptError ? (
        "자세를 트래킹 하기 위한 모델을 불러오는 것에 실패 했습니다. 잠시 후 다시 시도해 주시기 바랍니다."
      ) : !isModelLoaded ? (
        <div className="relative flex h-full w-full items-center justify-center">
          <Lottie
            options={{
              autoplay: true,
              animationData: ScriptLoadingLottie,
            }}
            height="50%"
            width="50%"
          />
          <div className="absolute translate-y-[120px] font-semibold text-white">스크립트를 불러오는 중입니다.</div>
        </div>
      ) : (
        <div className="relative flex h-full w-full flex-col items-center justify-center">
          <Camera detectStart={detectStart} canvasRef={canvasRef} />
          {isModelLoaded && (
            <>
              {!isModalOpen && (
                <PostureMessage
                  isSnapShotSaved={isSnapShotSaved}
                  isShoulderTwist={isShoulderTwist}
                  isTextNeck={isTextNeck}
                  isHandOnChin={isHandOnChin}
                  isTailboneSit={isTailboneSit}
                  hasPermission={hasPermission}
                />
              )}
              {!isSnapShotSaved && hasPermission && (
                <Controls getInitSnap={getInitSnap} handleShowPopup={handleShowPopup} />
              )}
              <div
                className={`
                  absolute bottom-2 flex h-[50px] items-center justify-center 
                  rounded-[20px] bg-[#1A1B1D] bg-opacity-60 pl-4 pr-6
                  transition-all duration-500 ease-in-out
                  ${isSuccessSnapShotSaved ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}
                `}
              >
                <Lottie
                  options={{
                    // loop: false,
                    autoplay: true,
                    animationData: CheckLottie,
                    rendererSettings: {
                      preserveAspectRatio: "xMidYMid slice",
                    },
                  }}
                  height={50}
                  width={50}
                />
                <span className="text-[14px] font-semibold text-white ">스냅샷이 성공적으로 저장되었습니다.</span>
              </div>
            </>
          )}

          {!isClosedInitialGuidePopup && !isInitialSnapShotExist && (
            <GuidePopupModal onClose={handleCloseInitialGuidePopup} />
          )}
        </div>
      )}
    </>
  )
}

export default PoseDetector
