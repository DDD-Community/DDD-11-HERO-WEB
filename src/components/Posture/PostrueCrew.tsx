import { duration, notification } from "@/api"
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
import PostureCrewItem from "./PostureCrewItem"
import { getMyCheerUpInfo, requestSendCrewCheer } from "@/api/crewCheer"
import toast from "react-hot-toast"
import dayjs from "dayjs"

interface MyPostureCrewData {
  myInfo: IPostureCrew
  countCheeredUp: number
}

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
  const [crewMyInfo, setCrewMyInfo] = useState<MyPostureCrewData | null>(null)
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
      if (data.groupUsers && data.groupUser) {
        const crewListExceptForMe = data.groupUsers.filter((user: any) => user.uid !== data.groupUser.uid)
        setCrews(crewListExceptForMe)
      }
      setCrewMyInfo({
        myInfo: data.groupUser,
        countCheeredUp: data.cheerUp.countCheeredUp,
      })
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

  return { isConnected, crews, crewMyInfo }
}

export default function PostrueCrew(props: PostureCrewProps): ReactElement {
  const { toggleSidebar } = props
  const accessToken = useAuthStore((state) => state.accessToken)
  const { resetSnapShot } = useSnapShotStore()
  const { openModal } = useModals()
  const wsUrl = `wss://api.alignlab.site/ws/v1/groups/1/users?X-HERO-AUTH-TOKEN=${accessToken}`
  const { isConnected, crewMyInfo, crews } = useWebSocket(wsUrl)
  const { notification, setNotification } = useNotification()
  const updateNotiMutation = useModifyNoti()
  const { hasPermission } = usePushNotification()
  const { myGroupData, isLoading } = useMyGroup()
  const navigate = useNavigate()
  const [cheeredUpCrewList, setCheeredUpCrewList] = useState<number[]>([])

  useEffect(() => {
    const today = dayjs().format("YYYY-MM-DD")
    getMyCheerUpInfo(today).then(({ data }) => {
      setCheeredUpCrewList(data.cheeredUpUids)
    })
  }, [])

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

  const onClickCrewCheer = (uid: number, nickname: string) => {
    if (!uid) {
      toast.error("에러가 발생했습니다. 잠시 후 다시 시도해주세요")
      return
    }
    requestSendCrewCheer({
      uids: [uid],
    }).then(({ data }) => {
      if (data) {
        toast.success(`${nickname}님에게 응원하기 전송이 성공했습니다.`)
        const today = dayjs().format("YYYY-MM-DD")
        getMyCheerUpInfo(today).then(({ data }) => {
          setCheeredUpCrewList(data.cheeredUpUids)
        })
      }
    })
  }

  const onClickAllCrewCheer = async () => {
    const allCrewUids = crews.map((item) => item.uid)
    if (!allCrewUids || allCrewUids.length === 0) {
      toast.error("접속한 크루가 없습니다.")
      return
    }
    const today = dayjs().format("YYYY-MM-DD")
    try {
      const { data } = await getMyCheerUpInfo(today)
      const sortedCheeredUpUids = data.cheeredUpUids.sort()
      const sortedCrewUids = allCrewUids.sort()
      if (
        sortedCheeredUpUids.length === sortedCrewUids.length &&
        sortedCheeredUpUids.every((value, index) => value === sortedCrewUids[index])
      ) {
        toast.error("현재 접속 중인 크루들에게 이미 응원하기를 보냈습니다.")
        return
      }
    } catch (error) {
      console.log("error: ", error)
    }

    requestSendCrewCheer({
      uids: allCrewUids,
    }).then(({ data }) => {
      if (data) {
        toast.success("모든 크루에게 응원하기 전송이 성공했습니다")
        getMyCheerUpInfo(today).then(({ data }) => {
          setCheeredUpCrewList(data.cheeredUpUids)
        })
      }
    })
  }

  return (
    <div className="flex h-full flex-col rounded-lg bg-[#FAFAFA] p-4">
      <button onClick={onClickCloseSideNavButton} className="mb-8 shrink-0 p-1">
        <CloseCrewPanelIcon />
      </button>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="shrink-0">
          <div className="flex items-center justify-between p-2 pb-3">
            <div className="flex items-center">
              <span className="text-[15px] font-medium">자세 알림</span>
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
        </div>

        <div className="group relative shrink-0">
          <div className="flex items-center gap-2 p-2">
            <span className="text-[15px] font-medium">자세 랭킹</span>
            <QuestionIcon />
          </div>

          <div className="invisible absolute left-4 top-6 z-10 h-full w-full opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100">
            <img src={RankingGuideToolTip} alt="랭킹 가이드" />
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {isConnected === "loading" && myGroupData && <p className="pl-2">서버와 연결 중입니다.</p>}
          {isConnected === "disconnected" && myGroupData && <p className="pl-2">서버와 연결 끊어졌습니다.</p>}
          {isConnected === "success" && myGroupData && (
            <>
              <div className="min-h-0 flex-1 overflow-y-auto">
                <ul className="space-y-2">
                  {crewMyInfo && (
                    <PostureCrewItem
                      uid={crewMyInfo.myInfo.uid}
                      rank={crewMyInfo.myInfo.rank}
                      nickname={crewMyInfo.myInfo.nickname}
                      score={crewMyInfo.myInfo.score}
                      isMyCheerCount={crewMyInfo.countCheeredUp}
                      isMe
                    />
                  )}
                  {crews.length > 0 &&
                    crews.map((user) => (
                      <PostureCrewItem
                        key={user.uid}
                        uid={user.uid}
                        rank={user.rank}
                        nickname={user.nickname}
                        score={user.score}
                        onClickCheer={() => onClickCrewCheer(user.uid, user.nickname)}
                        cheerButtonDisabled={cheeredUpCrewList.includes(user.uid)}
                      />
                    ))}
                </ul>
              </div>
              <div className="mt-3 shrink-0">
                <button
                  className="w-full rounded-full bg-zinc-800 py-3 text-center text-[13px] font-semibold text-white"
                  onClick={onClickAllCrewCheer}
                >
                  접속한 크루원 모두 응원하기
                </button>
              </div>
            </>
          )}
          {!myGroupData && !isLoading && (
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

      <div className="mt-4 shrink-0">
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
