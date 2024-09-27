import { duration, notification } from "@/api/notification"
import EmptyGroupImage from "@/assets/images/crew-empty.png"
import RoutePath from "@/constants/routes.json"
import { useModals } from "@/hooks/useModals"
import useMyGroup from "@/hooks/useMyGroup"
import useNotification from "@/hooks/useNotification"
import { useModifyNoti } from "@/hooks/useNotiMutation"
import usePushNotification from "@/hooks/usePushNotification"
import { useAuthStore } from "@/store"
import { useSnapShotStore } from "@/store/SnapshotStore"
import CloseCrewPanelIcon from "@assets/icons/crew-panel-close-button.svg?react"
import PostureGuide from "@assets/icons/posture-guide-button-icon.svg?react"
import PostureRetakeIcon from "@assets/icons/posture-snapshot-retake-icon.svg?react"
import QuestionIcon from "@assets/icons/question-info-icon.svg?react"
import RankingGuideToolTip from "@assets/images/ranking-guide.png"
import SelectBox from "@components/SelectBox"
import { ReactElement, useCallback, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { modals } from "../Modal/Modals"

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

const NOTI_VALUE_MAP = (value: string | undefined) => {
  switch (value) {
    case "IMMEDIATELY":
      return "틀어진 즉시"
    case "MIN_15":
      return "15분 간격"
    case "MIN_30":
      return "30분 간격"
    case "MIN_45":
      return "45분 간격"
    case "MIN_60":
      return "1시간 간격"
  }
  return "틀어진 즉시"
}

const useWebSocket = (url: string) => {
  const [isConnected, setIsConnected] = useState<"loading" | "success" | "disconnected">("loading")
  const [crews, setCrews] = useState<IPostureCrew[]>([])
  const socketRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const connect = useCallback(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      return
    }

    socketRef.current = new WebSocket(url)

    socketRef.current.onopen = () => {
      console.log("WebSocket connected")
      setIsConnected("success")
    }

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data)
      console.log("Received message:", data)
      if (data.groupUsers) {
        setCrews(data.groupUsers)
      }
    }

    socketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error)
    }

    socketRef.current.onclose = (event) => {
      console.log("WebSocket disconnected. Code:", event.code, "Reason:", event.reason)
      setIsConnected("disconnected")
      reconnect()
    }
  }, [url])

  const reconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    reconnectTimeoutRef.current = setTimeout(() => {
      console.log("Attempting to reconnect...")
      connect()
    }, 5000) // 5초 후 재연결 시도
  }, [connect])

  useEffect(() => {
    connect()

    return () => {
      if (socketRef.current) {
        socketRef.current.close()
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [connect])

  return { isConnected, crews }
}

export default function PostrueCrew(props: PostureCrewProps): ReactElement {
  const { toggleSidebar } = props
  const accessToken = useAuthStore((state) => state.accessToken)
  const { resetSnapShot } = useSnapShotStore()
  const { openModal } = useModals()
  const wsUrl = `wss://api.alignlab.site/ws/v1/groups/1/users?X-HERO-AUTH-TOKEN=${accessToken}`
  const { isConnected, crews } = useWebSocket(wsUrl)

  const { notification, setNotification } = useNotification()
  const updateNotiMutation = useModifyNoti()
  const { hasPermission } = usePushNotification()
  const { myGroupData } = useMyGroup()
  const navigate = useNavigate()

  const onClickCloseSideNavButton = (): void => {
    toggleSidebar()
  }

  const onClickNotiAlarmTime = (option: NotiOption): void => {
    updateNotiMutation.mutate(
      { isActive: notification?.isActive, duration: option.value },
      {
        onSuccess: (data: notification) => {
          setNotification(data)
        },
      }
    )
  }

  const onClickNotiAlarm = (): void => {
    if (!notification) {
      updateNotiMutation.mutate(
        { isActive: true, duration: "IMMEDIATELY" },
        {
          onSuccess: (data: notification) => {
            setNotification(data)
          },
        }
      )
    } else {
      updateNotiMutation.mutate(
        { isActive: !notification?.isActive, duration: notification?.duration || "IMMEDIATELY" },
        {
          onSuccess: (data: notification) => {
            setNotification(data)
          },
        }
      )
    }
  }

  const onClickPostureGuide = () => {
    openModal(modals.postureGuideModal, {})
  }

  const onClickReTakeSnapShot = () => {
    resetSnapShot()
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
              checked={notification ? notification?.isActive && hasPermission : false}
              onChange={onClickNotiAlarm}
            />
            <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
          </label>
        </div>

        <div className="pb-8 pl-2 pr-2">
          <SelectBox
            isDisabled={!notification?.isActive || !hasPermission}
            options={NOTI_OPTIONS}
            value={NOTI_VALUE_MAP(notification?.duration)}
            onClick={onClickNotiAlarmTime}
          />
          {!hasPermission && (
            <div className="pt-2 text-sm text-amber-500">브라우저의 알람 권한 설정이 필요 합니다.</div>
          )}
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
          {isConnected === "loading" && myGroupData && <p>서버와 연결 중입니다.</p>}
          {isConnected === "disconnected" && myGroupData && <p>서버와 연결 끊어졌습니다.</p>}
          {isConnected === "success" && myGroupData && crews.length === 0 && (
            <p className="text-center text-gray-500">접속자가 없습니다.</p>
          )}
          {isConnected === "success" && myGroupData && crews.length > 0 && (
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
          {!myGroupData && (
            <div className="flex flex-col items-center justify-center rounded-2xl bg-zinc-100 px-4 py-8">
              <div className="text-center text-sm font-medium">
                아직 가입한
                <br />
                크루가 없어요
              </div>
              <img src={EmptyGroupImage} />
              <button
                className="flex w-[144px] justify-center rounded-full bg-[#1A75FF] py-[10px] text-sm font-semibold text-white"
                onClick={() => {
                  navigate(RoutePath.CREW)
                }}
              >
                크루 가입하기
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="mt-auto pb-[7px] pl-0.5">
        <button className="pb-[10px]" onClick={onClickReTakeSnapShot}>
          <div className="flex items-center gap-[10px]">
            <PostureRetakeIcon />
            <div>스냅샷 재촬영</div>
          </div>
        </button>
        <button onClick={onClickPostureGuide}>
          <div className="flex items-center gap-[10px]">
            <PostureGuide />
            <div>바른자세 가이드</div>
          </div>
        </button>
      </div>
    </div>
  )
}
