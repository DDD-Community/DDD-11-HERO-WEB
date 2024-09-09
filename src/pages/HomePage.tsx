import MainCraftIcon from "@assets/icons/posture-craft-side-nav-icon.svg?react"
import KakaoSignupIcon from "@assets/icons/home-kakao-signup-button-icon.svg?react"
import IntroImage from "@/assets/images/home-intro.png"
import MonitoringImage from "@/assets/images/home-monitoring.png"

const REST_API_KEY = import.meta.env.VITE_OAUTH_KAKAO_REST_API_KEY
const REDIRECT_URI = import.meta.env.VITE_OAUTH_KAKAO_REDIRECT_URI
const LOGIN_LINK = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`

const HomePage: React.FC = () => {
  const loginHandler = (): void => {
    window.location.href = LOGIN_LINK
  }

  return (
    <div className="flex h-screen min-h-[981px] w-screen min-w-[1440px] flex-col justify-start">
      {/* header */}
      <div className="flex w-full flex-none border border-[#F0F2F9] px-[120px] py-5">
        {/* logo */}
        <div className="flex flex-grow items-center">
          <MainCraftIcon className="h-8 w-8" />
          <span className="ml-2 text-xl font-bold">자세공작소</span>
        </div>
        <button
          className="rounded-full bg-blue-600 px-6 py-1 text-sm font-semibold leading-6 text-white"
          onClick={loginHandler}
        >
          {"로그인"}
        </button>
      </div>

      {/* content */}
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
          <div
            className="flex w-fit cursor-pointer items-center gap-2 rounded-full bg-[#18181B] px-7 py-2 leading-[34px] text-white"
            onClick={loginHandler}
          >
            <KakaoSignupIcon />
            <div>카카오톡으로 계속하기</div>
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
      {/* footer */}
      <div className="flex-grow bg-[#1C1D20] px-[120px] py-10">
        <div className="flex items-center text-[#D9D9D9]">
          <div className="mr-20 text-2xl font-bold">ALIGN LAB</div>
          <div className="flex gap-20 text-sm">
            <div>개인정보처리방침</div>
            <div>이용약관</div>
          </div>
        </div>
        <div className="mt-10 text-xs font-normal text-[#9D9DA2]">Copyright all reserved @2024</div>
      </div>
    </div>
  )
}

export default HomePage
