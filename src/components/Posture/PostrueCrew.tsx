import CloseCrewPanelIcon from "@assets/icons/crew-panel-close-button.svg?react"
import QuestionIcon from "@assets/icons/question-info-icon.svg?react"
import PostureGuide from "@assets/icons/posture-guide-button-icon.svg?react"
import RankingGuideToolTip from "@assets/images/ranking-guide.png"
import { useEffect, useState } from "react"
import SelectBox from "@components/SelectBox"

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

export default function PostrueCrew(props: PostureCrewProps) {
  const { toggleSidebar } = props
  const [crews, setCrews] = useState<IPostureCrew[]>([])
  const [isConnected, setIsConnected] = useState<"loading" | "success" | "disconnected">("loading")
  const [isEnabled, setIsEnabled] = useState(true)
  const [notiAlarmTime, setNotiAlarmTime] = useState("틀어진 즉시")

  useEffect(() => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJoZXJvLWFsaWdubGFiLWFwaSIsImF1ZCI6Imhlcm8tYWxpZ25sYWItYXBpIiwiaWQiOjIwMDAwMSwidHlwZSI6ImFjY2Vzc1Rva2VuIiwiZXhwIjoxNzM1Mzk4MDAwfQ.pIl87yrMX4EVoLlBOG0A2X5AMRRUXalwMKnfH6cSDE8"
    const socket = new WebSocket(`wss://api.alignlab.site/ws/v1/groups/1/users?X-HERO-AUTH-TOKEN=${token}`)

    socket.onopen = () => {
      console.log("WebSocket connected")
      setIsConnected("success")
    }

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setCrews(data.groupUsers || [])
    }

    socket.onerror = (error) => {
      console.error("WebSocket error:", error)
    }

    socket.onclose = (event) => {
      console.log("WebSocket disconnected. Code:", event.code, "Reason:", event.reason)
      setIsConnected("disconnected")
    }

    return () => {
      socket.close()
    }
  }, [])

  const onClickCloseSideNavButton = () => {
    toggleSidebar()
  }

  const onClickNotiAlarmTime = (value: string) => {
    setNotiAlarmTime(value)
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
              checked={isEnabled}
              onChange={() => setIsEnabled(!isEnabled)}
            />
            <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
          </label>
        </div>

        <div className="pb-8 pl-2 pr-2">
          <SelectBox
            options={["틀어진 즉시", "15분 간격", "30분 간격", "45분 간격", "1시간 간격"]}
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
      <div className="mt-auto pb-0.5 pl-0.5">
        <div className="flex cursor-pointer items-center gap-3">
          <PostureGuide />
          <span>바른자세 가이드</span>
        </div>
      </div>
    </div>
  )
}
