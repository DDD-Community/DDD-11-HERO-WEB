import MainCraftIcon from "public/icons/posture-craft-side-nav-icon.svg?react"
import { useEffect } from "react"

const REST_API_KEY = import.meta.env.VITE_OAUTH_KAKAO_REST_API_KEY
const REDIRECT_URI = import.meta.env.VITE_OAUTH_KAKAO_REDIRECT_URI
const LOGIN_LINK = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`

const HomePage: React.FC = () => {
  const loginHandler = (): void => {
    window.location.href = LOGIN_LINK
  }

  return (
    <div className="w-[1440px]">
      {/* header */}
      <div className="flex w-full bg-white px-[120px] py-5">
        <div className="flex flex-grow items-center">
          <MainCraftIcon className="h-8 w-8" />
          <span className="ml-2 text-xl font-bold">자세공작소</span>
        </div>
        <button
          className="inline-flex items-center justify-center gap-2.5 rounded-[40px] bg-[#1F76F8] p-1 px-6 text-sm font-semibold leading-6 text-white"
          onClick={loginHandler}
        >
          로그인
        </button>
      </div>
      {/* contents */}
      <div className="w-full bg-[#F5F5FA] px-[120px]"></div>
    </div>
  )
}

export default HomePage
