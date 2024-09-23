import { duration, notification } from "@/api/notification"
import { useModals } from "@/hooks/useModals"
import { usePatchNoti } from "@/hooks/useNotiMutation"
import usePushNotification from "@/hooks/usePushNotification"
import { useAuthStore } from "@/store"
import { useNotificationStore } from "@/store/NotificationStore"
import CloseCrewPanelIcon from "@assets/icons/crew-panel-close-button.svg?react"
import PostureGuide from "@assets/icons/posture-guide-button-icon.svg?react"
import PostureRetakeIcon from "@assets/icons/posture-snapshot-retake-icon.svg?react"
import QuestionIcon from "@assets/icons/question-info-icon.svg?react"
import RankingGuideToolTip from "@assets/images/ranking-guide.png"
import SelectBox from "@components/SelectBox"
import { ReactElement, useCallback, useEffect, useRef, useState } from "react"
import { modals } from "../Modal/Modals"
import { useSnapshotStore } from "@/store/SnapㄴhotStore"
import { useCreateSnaphot } from "@/hooks/useSnapshotMutation"

interface IPostureCrew {
  groupUserId: number
  uid: number
  nickname: string
  rank: number
  score: number
}

interface PostureCrewProps {
  toggleSidebar: () => void
}

interface NotiOption {
  value: duration
  label: string
}

const NOTI_OPTIONS: NotiOption[] = [
  { value: "IMMEDIATELY", label: "틀어진 즉시" },
  { value: "MIN_15", label: "15분 간격" },
  { value: "MIN_30", label: "30분 간격" },
  { value: "MIN_45", label: "45분 간격" },
  { value: "MIN_60", label: "1시간 간격" },
]

const MAX_RECONNECT_ATTEMPTS = 5
const INITIAL_RECONNECT_DELAY = 1000
const UPDATE_INTERVAL = 1000 // 1초마다 상태 업데이트

export default function PostrueCrew(props: PostureCrewProps): ReactElement {
  const { toggleSidebar } = props
  const accessToken = useAuthStore((state) => state.accessToken)
  const { resetSnapShot } = useSnapshotStore()
  const { openModal } = useModals()
  const createSnapMutation = useCreateSnaphot()
  const [crews, setCrews] = useState<IPostureCrew[]>([])
  const [isConnected, setIsConnected] = useState<"loading" | "success" | "disconnected">("loading")
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [reconnectAttempts, setReconnectAttempts] = useState(0)
  const latestCrewsRef = useRef<IPostureCrew[]>([])
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const throttledUpdateCrews = useCallback(() => {
    if (!updateTimeoutRef.current) {
      updateTimeoutRef.current = setTimeout(() => {
        setCrews(latestCrewsRef.current)
        updateTimeoutRef.current = null
      }, UPDATE_INTERVAL)
    }
  }, [])

  const userNoti = useNotificationStore((state) => state.notification)
  const setUserNoti = useNotificationStore((state) => state.setNotification)
  const patchNotiMutation = usePatchNoti()
  const { hasPermission } = usePushNotification()

  const [isEnabled, setIsEnabled] = useState(userNoti?.isActive)
  const [notiAlarmTime, setNotiAlarmTime] = useState(NOTI_OPTIONS.find((n) => n.value === userNoti?.duration)?.label)

  const connectWebSocket = useCallback(() => {
    const newSocket = new WebSocket(`wss://api.alignlab.site/ws/v1/groups/1/users?X-HERO-AUTH-TOKEN=${accessToken}`)

    newSocket.onopen = () => {
      console.log("WebSocket connected")
      setIsConnected("success")
      setReconnectAttempts(0)
    }

    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      console.log("Received message:", data)
      if (data.groupUsers) {
        latestCrewsRef.current = data.groupUsers
        throttledUpdateCrews()
      }
    }

    newSocket.onerror = (error) => {
      console.error("WebSocket error:", error)
    }

    newSocket.onclose = (event) => {
      console.log("WebSocket disconnected. Code:", event.code, "Reason:", event.reason)
      setIsConnected("disconnected")

      if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        const delay = INITIAL_RECONNECT_DELAY * Math.pow(2, reconnectAttempts)
        console.log(`Attempting to reconnect in ${delay}ms...`)
        setTimeout(() => {
          setReconnectAttempts((prev) => prev + 1)
          connectWebSocket()
        }, delay)
      } else {
        console.log("Max reconnection attempts reached. Please try again later.")
      }
    }

    setSocket(newSocket)
  }, [accessToken, reconnectAttempts, throttledUpdateCrews])

  useEffect(() => {
    connectWebSocket()

    return () => {
      if (socket) {
        socket.close()
      }
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }
    }
  }, [connectWebSocket])

  const onClickCloseSideNavButton = (): void => {
    toggleSidebar()
  }

  const onClickNotiAlarmTime = (option: NotiOption): void => {
    setNotiAlarmTime(option.label)
    patchNotiMutation.mutate(
      { id: userNoti?.id, duration: option.value },
      {
        onSuccess: (data: notification) => {
          setNotiAlarmTime(option.label)
          setUserNoti(data)
        },
      }
    )
  }

  const onClickNotiAlarm = (): void => {
    patchNotiMutation.mutate(
      { id: userNoti?.id, isActive: !userNoti?.isActive },
      {
        onSuccess: (data: notification) => {
          setIsEnabled(data.isActive)
          setUserNoti(data)
        },
      }
    )
  }

  const onClickPostureGuide = () => {
    openModal(modals.postureGuideModal, {})
  }

  const onClickReTakeSnapShot = () => {
    resetSnapShot()
    createSnapMutation.mutate({
      points: [],
    })
  }

  return (
    <div className="flex h-full flex-col rounded-lg bg-[#FAFAFA] p-4">
      <button onClick={onClickCloseSideNavButton} className="mb-8 p-1">
        <CloseCrewPanelIcon />
      </button>
      <div className="flex-grow">
        <div className="flex items-center justify-between p-2 pb-3">
          <div className="flex items-center">
            <span className="font-medium">자세 알림</span>
          </div>

          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={isEnabled && hasPermission}
              onChange={onClickNotiAlarm}
            />
            <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
          </label>
        </div>

        <div className="pb-8 pl-2 pr-2">
          <SelectBox
            isDisabled={!userNoti?.isActive || !hasPermission}
            options={NOTI_OPTIONS}
            value={notiAlarmTime}
            onClick={onClickNotiAlarmTime}
          />
        </div>

        <div className="group relative">
          <div className="flex items-center gap-2 p-2">
            <span>자세 랭킹</span>
            <QuestionIcon />
          </div>

          <div className="invisible absolute left-4 top-6 z-10 h-full w-full opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100">
            <img src={RankingGuideToolTip} alt="랭킹 가이드" />
          </div>
        </div>
        <div>
          {isConnected === "loading" && <p>서버와 연결 중입니다.</p>}
          {isConnected === "disconnected" && <p>서버와 연결 끊어졌습니다.</p>}
          {isConnected === "success" && crews.length === 0 && (
            <p className="text-center text-gray-500">접속자가 없습니다.</p>
          )}
          {isConnected === "success" && crews.length > 0 && (
            <ul className="space-y-2">
              {crews.map((user, index) => (
                <li key={index} className="flex h-14 w-[200px] items-center justify-between rounded-full bg-white">
                  <div className="flex w-full items-center justify-between">
                    <div>
                      <span
                        className={`ml-6 mr-4 text-center font-semibold ${
                          user.rank <= 3 ? "text-[#1F76F8]" : "text-[#9D9DA2]"
                        }`}
                      >
                        {user.rank}
                      </span>
                      <span className="font-semibold text-[#202124]">{user.nickname}</span>
                    </div>
                    <span className="text-normal mr-6 text-[13px] text-[#999]">{user.score}회</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="mt-auto pb-[7px] pl-0.5">
        <button className="pb-[10px]" onClick={onClickReTakeSnapShot}>
          <div className="flex gap-[10px]">
            <PostureRetakeIcon />
            <div>스냅샷 재촬영</div>
          </div>
        </button>
        <button onClick={onClickPostureGuide}>
          <div className="flex gap-[10px]">
            <PostureGuide />
            <div>바른자세 가이드</div>
          </div>
        </button>
      </div>
    </div>
  )
}
