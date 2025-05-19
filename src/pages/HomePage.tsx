import IntroImage from "@/assets/images/home-intro.png"
import MonitoringImage from "@/assets/images/home-monitoring.png"
import { logAnalytics } from "@/utils/log"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
const REST_API_KEY = import.meta.env.VITE_OAUTH_KAKAO_REST_API_KEY
const REDIRECT_URI = import.meta.env.VITE_OAUTH_KAKAO_REDIRECT_URI
import RoutePath from "@/constants/routes.json"
import { useExperiencingStore } from "@/store/ExperiencingStore"

export const LOGIN_LINK = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`

// const SHARE_DATA = {
//   title: "자세공작소와 함께하는 일상의 변화",
//   url: window.location.origin,
// }

const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const { setIsExperiencing } = useExperiencingStore()
  const loginHandler = (): void => {
    window.location.href = LOGIN_LINK
  }

  // const shareLinkHandler = async (): Promise<void> => {
  //   try {
  //     await navigator.share(SHARE_DATA)
  //     console.log("공유 성공")
  //   } catch (e) {
  //     console.log("공유 실패")
  //   }
  // }

  const experiencingHandler = (): void => {
    setIsExperiencing(true)
    navigate(RoutePath.MONITORING)
  }

  useEffect(() => {
    logAnalytics("view_login")
  }, [])

  return (
    <div className="flex h-[704px] justify-end">
      {/* left */}
      <div className="relative pl-[120px] pr-[72px] pt-24">
        <div className="mb-16">
          <div className="text-5xl font-bold leading-tight">
            <div className="text-blue-600">자세공작소와 함께하는</div>
            <div>일상의 변화</div>
          </div>
          <div className="mt-4 text-lg font-normal">간단하게 회원가입 후 이용을 시작하세요!</div>
        </div>
        <div className="flex gap-3">
          <div
            className="flex w-fit cursor-pointer rounded-full bg-[#1A75FF] px-7 py-2 leading-[34px] text-white"
            onClick={loginHandler}
          >
            카카오톡으로 계속하기
          </div>
          <div
            className="flex w-fit cursor-pointer rounded-full bg-zinc-900 px-7 py-2 leading-[34px] text-white"
            onClick={experiencingHandler}
          >
            5분 체험해보기
          </div>
        </div>
        <div className="absolute bottom-0 left-10 h-[292px] w-[528px]">
          <img src={IntroImage} alt="Intro" />
        </div>
      </div>
      {/* right */}
      <div className="relative w-[56.9%] overflow-hidden bg-gradient-to-br from-[#F5F5FA] to-[#A0C1F2]">
        <div className="absolute bottom-[-10px] left-[104px] h-[583px] w-[883px]">
          <img src={MonitoringImage} alt="Monitoring" />
        </div>
      </div>
    </div>
  )
}

export default HomePage
