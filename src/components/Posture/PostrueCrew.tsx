import CloseCrewPanelIcon from "@assets/icons/crew-panel-close-button.svg?react"
import QuestionIcon from "@assets/icons/question-info-icon.svg?react"
import { useEffect, useState } from "react"

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
  // const [isConnected, setIsConnected] = useState(false)
  const [isEnabled, setIsEnabled] = useState(true)

  useEffect(() => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJoZXJvLWFsaWdubGFiLWFwaSIsImF1ZCI6Imhlcm8tYWxpZ25sYWItYXBpIiwiaWQiOjIwMDAwMSwidHlwZSI6ImFjY2Vzc1Rva2VuIiwiZXhwIjoxNzM1Mzk4MDAwfQ.pIl87yrMX4EVoLlBOG0A2X5AMRRUXalwMKnfH6cSDE8"
    const socket = new WebSocket(`wss://api.alignlab.site/ws/v1/groups/1/users?X-HERO-AUTH-TOKEN=${token}`)

    socket.onopen = () => {
      console.log("WebSocket connected")
      // setIsConnected(true)
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
      // setIsConnected(false)
    }

    return () => {
      socket.close()
    }
  }, [])

  const onClickCloseSideNavButton = () => {
    toggleSidebar()
  }

  return (
    <div className="rounded-lg bg-white p-4">
      <button onClick={onClickCloseSideNavButton}>
        <CloseCrewPanelIcon />
      </button>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <span className="mr-2 font-medium">자세 알림</span>
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
      <div className="flex gap-0.5">
        자세 랭킹
        <button>
          <QuestionIcon />
        </button>
      </div>
      <div>
        {crews.length === 0 ? (
          <p className="text-center text-gray-500">접속자가 없습니다.</p>
        ) : (
          <ul className="space-y-2">
            {crews.map((user, index) => (
              <li key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="mr-2 w-6 text-center font-medium">{user.rank}</span>
                  <span className="font-medium">{user.nickname}</span>
                </div>
                <span className="text-sm text-gray-600">{user.score}회</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
