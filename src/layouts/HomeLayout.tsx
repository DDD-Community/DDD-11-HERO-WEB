import { logAnalytics } from "@/utils/log"
import LogoImage from "@assets/icons/home-logo.svg?react"
import { Outlet } from "react-router-dom"

const REST_API_KEY = import.meta.env.VITE_OAUTH_KAKAO_REST_API_KEY
const REDIRECT_URI = import.meta.env.VITE_OAUTH_KAKAO_REDIRECT_URI
const LOGIN_LINK = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`

const HomeLayout: React.FC = () => {
  const loginHandler = (): void => {
    logAnalytics("click_login_button", {
      from: "header",
    })
    window.location.href = LOGIN_LINK
  }

  return (
    <div className="flex h-screen  flex-col justify-start">
      {/* header */}
      <header className="flex w-full flex-none border border-[#F0F2F9] px-[18px] py-5 md:px-8 lg:px-[120px]">
        {/* logo */}
        <div className="flex flex-grow items-center">
          <LogoImage />
        </div>
        <button
          className="hidden rounded-full bg-align_blue-500 px-6 py-1 text-sm font-semibold leading-6 text-white lg:block"
          onClick={loginHandler}
        >
          {"로그인"}
        </button>
      </header>
      {/* Main Content */}
      <main>
        <Outlet />
      </main>
      {/* footer */}
      <footer className="flex flex-col justify-center bg-[#1C1D20] px-0 pb-[54px] pt-12 md:px-[120px] lg:pb-[69px] lg:pt-10">
        <div className="flex flex-col items-center justify-between text-[#D9D9D9] lg:flex-row">
          <div className="text-2xl font-bold">ALIGN LAB</div>
          <div className="mt-3 flex w-[155px] justify-between text-sm lg:mt-0 lg:w-[232px]">
            <a href="https://swjg3gi.notion.site/89966f39e24a442a8eee5b1f91c4fde7" target="_blank" rel="noreferrer">
              개인정보처리방침
            </a>
            <a
              href="https://swjg3gi.notion.site/7c13aba015654e6f8e1acd300b440526?pvs=4"
              target="_blank"
              rel="noreferrer"
            >
              이용약관
            </a>
          </div>
        </div>
        <div className="mt-[14px] text-center text-[12px] leading-[20px] text-[#9D9DA2] lg:mt-10 lg:text-left">
          Copyright all reserved @2024
        </div>
      </footer>

      <div className="flex w-full bg-white py-[38px] lg:hidden">&nbsp;</div>
    </div>
  )
}

export default HomeLayout
