import LogoImage from "@assets/icons/home-logo.svg?react"
import { Outlet } from "react-router-dom"

const REST_API_KEY = import.meta.env.VITE_OAUTH_KAKAO_REST_API_KEY
const REDIRECT_URI = import.meta.env.VITE_OAUTH_KAKAO_REDIRECT_URI
const LOGIN_LINK = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`

const HomeLayout: React.FC = () => {
  const loginHandler = (): void => {
    window.location.href = LOGIN_LINK
  }

  return (
    <div className="flex h-screen min-h-[981px] w-screen min-w-[1440px] flex-col justify-start">
      {/* header */}
      <div className="flex w-full flex-none border border-[#F0F2F9] px-[120px] py-5">
        {/* logo */}
        <div className="flex flex-grow items-center">
          <LogoImage />
        </div>
        <button
          className="rounded-full bg-blue-600 px-6 py-1 text-sm font-semibold leading-6 text-white"
          onClick={loginHandler}
        >
          {"로그인"}
        </button>
      </div>
      {/* Main Content */}
      <div>
        <Outlet />
      </div>
      {/* footer */}
      <div className="flex-grow bg-[#1C1D20] px-[120px] py-10">
        <div className="flex items-center text-[#D9D9D9]">
          <div className="mr-20 text-2xl font-bold">ALIGN LAB</div>
          <div className="flex gap-20 text-sm">
            <a href="https://swjg3gi.notion.site/89966f39e24a442a8eee5b1f91c4fde7" target="_blank" rel="noreferrer">
              <div>개인정보처리방침</div>
            </a>
            <a
              href="https://swjg3gi.notion.site/7c13aba015654e6f8e1acd300b440526?pvs=4"
              target="_blank"
              rel="noreferrer"
            >
              <div>이용약관</div>
            </a>
          </div>
        </div>
        <div className="mt-10 text-xs font-normal text-[#9D9DA2]">Copyright all reserved @2024</div>
      </div>
    </div>
  )
}

export default HomeLayout
