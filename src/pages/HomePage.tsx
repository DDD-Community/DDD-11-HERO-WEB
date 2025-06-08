import ChromePushAlarm from "@/assets/images/home/chrome-push-alarm.png"
import GoodPosture from "@/assets/images/home/home-good-posture.png"
import IntroImage from "@/assets/images/home/home-intro.png"
import PostureSimulatorImage from "@/assets/images/home/posture-simulation.png"
import RoutePath from "@/constants/routes.json"
import { useExperiencingStore } from "@/store/ExperiencingStore"
import { logAnalytics } from "@/utils/log"
import { Share2 } from "lucide-react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
const REST_API_KEY = import.meta.env.VITE_OAUTH_KAKAO_REST_API_KEY
const REDIRECT_URI = import.meta.env.VITE_OAUTH_KAKAO_REDIRECT_URI

export const LOGIN_LINK = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`

const SHARE_DATA = {
  title: "자세공작소와 함께하는 일상의 변화",
  url: window.location.origin,
}

const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const { setIsExperiencing } = useExperiencingStore()
  const loginHandler = (): void => {
    logAnalytics("click_login_button", {
      from: "main",
    })
    window.location.href = LOGIN_LINK
  }

  const shareLinkHandler = async (element: string): Promise<void> => {
    try {
      logAnalytics("click_shared_link", {
        from: element,
      })
      await navigator.share(SHARE_DATA)
      console.log("공유 성공")
    } catch (e) {
      console.log("공유 실패")
    }
  }

  const experiencingHandler = (): void => {
    setIsExperiencing(true)
    logAnalytics("click_experience_button")
    navigate(RoutePath.MONITORING)
  }

  useEffect(() => {
    logAnalytics("view_login")
  }, [])

  return (
    <>
      <button
        className="fixed bottom-0 left-0 z-10 flex w-full items-center justify-center bg-align_blue-500 py-[22px] lg:hidden"
        onClick={() => shareLinkHandler("sticky-button")}
      >
        <span className="text-[17px] font-semibold leading-[24px] text-white">링크 공유하기</span>
      </button>
      <div className="flex flex-col items-center">
        <section className="flex flex-col items-center">
          <div className="mt-[52px] flex flex-col items-center">
            <div className="text-center text-[36px] font-bold leading-[46px] md:text-[42px] md:leading-[60px]">
              <div className="text-align_blue-500">
                자세공작소와 <div className="block xxs:hidden" /> 함께하는
              </div>
              <div className="text-zinc-900">일상 속 자세 변화</div>
            </div>
            <div className="mt-4 hidden text-[18px] leading-[26px] text-zinc-900 md:mt-5 lg:block">
              간단하게 회원가입 후 이용을 시작하세요!
            </div>
            {/* desktop */}
            <div className="mt-[62px] hidden items-center gap-3 text-[16px] font-semibold leading-[24px] lg:flex">
              <button
                className="flex w-fit cursor-pointer rounded-full bg-align_blue-500 px-7 py-2 leading-[34px] text-white"
                onClick={loginHandler}
              >
                카카오톡으로 계속하기
              </button>
              <button
                className="flex w-fit cursor-pointer rounded-full bg-zinc-900 px-7 py-2 leading-[34px] text-white"
                onClick={experiencingHandler}
              >
                5분 체험해보기
              </button>
            </div>
            {/* mobile */}
            <div className="mt-5 flex flex-col items-center text-center text-[15px] font-medium leading-[24px] text-zinc-900 lg:hidden">
              <span>🖥️ 열심히 일했을 뿐인데, 왜 몸이 😥아플까요?</span>
              <p className="mt-[36px]">
                바르지 못한 자세로 발생하는 목·어깨·허리 통증
                <br />
                지금 바로 실시간 자세 모니터링을 통해
                <br />
                바른 자세 습관을 만들어보세요!
              </p>
            </div>
            <div className="mt-10 flex flex-col items-center xs:mt-12 md:mt-10 lg:mt-[92px]">
              <img src={IntroImage} alt="Intro" className="w-[284px] md:w-[426px]  lg:w-full" />
              <div className="h-[15px] w-[284px] rounded-[8px] bg-zinc-900 md:w-[426px] lg:h-[20px] lg:w-[568px]" />
            </div>
            <div className="mb-[80px] mt-7 flex flex-col gap-3 lg:hidden">
              <div className="flex h-[42px] items-center justify-center rounded-[60px] bg-align_blue-100 px-[25px] py-[6px] ">
                <span className="text-[15px] font-semibold leading-[24px] text-align_blue-500">
                  자세공작소는 PC에 최적화 되어있어요!
                </span>
              </div>
              <div className="text-center text-[13px] font-medium leading-[20px] text-zinc-500">
                웹에서도 빠르게 써보려면?!{" "}
                <button className="hover:underline" onClick={() => shareLinkHandler("link-share-text")}>
                  ‘링크 공유하기'
                </button>{" "}
                클릭
              </div>
            </div>
          </div>
        </section>
        <section className="flex w-full flex-col items-center bg-zinc-800 ">
          <div className="mt-[60px] inline-flex w-28 items-center justify-center gap-2.5 rounded-md bg-zinc-700 px-5 py-1 md:mt-[80px] lg:mt-[120px]">
            <div className="justify-start text-xs font-medium leading-tight text-blue-400">핵심기능 소개</div>
          </div>
          <h2 className="mt-12 text-center text-[28px] font-semibold leading-10 text-zinc-50 md:mt-[60px] md:text-[32px]">
            실시간으로 <br />
            흐트러진 자세를 감지해요
          </h2>
          <div className="mt-7 flex flex-col items-center lg:mt-10">
            <img
              src={PostureSimulatorImage}
              className="w-[472px] px-[18px] md:w-[575px] lg:w-full"
              alt="PostureSimulator"
            />
            <p className="mt-7 w-full text-center text-center text-[15px] font-light leading-[24px] text-zinc-300">
              스냅샷 기능과 머신러닝을 통해 자세를 실시간으로 <div className="block xs:hidden" /> 모니터링해요.{" "}
              <div className="hidden xs:block lg:hidden" />
              어깨 틀어짐, 거북목, 꼬리뼈로 앉기, <div className="inline lg:block" />턱 괴기와
              <div className="block xs:hidden" /> 같은 자세를 감지하며
              <div className="hidden xs:block lg:hidden" />
              올바르지 못한 자세는 직관적으로
              <div className="block xs:hidden" /> 자세를 시각화하여 인지를 도와요.
              {/* 스냅샷 기능과 머신러닝을 통해 자세를 실시간으로 모니터링해요. 어깨 틀어짐, 거북목, 꼬리뼈로 앉기, 턱 괴기와
            같은 자세를 감지하며 올바르지 못한 자세는 직관적으로 자세를 시각화하여 인지를 도와요. */}
            </p>
          </div>
          <div className="relative mt-[146px] flex h-[160px] w-full flex-col items-center bg-zinc-900 pb-10 md:h-[180px] lg:mt-[170px]">
            <div className="absolute bottom-[40px] flex flex-col items-center px-[18px]">
              <img src={ChromePushAlarm} alt="posture-warning-alarm-chrome" className="w-[440px] md:w-full" />
              <p className="mt-7 text-center text-[15px] font-light leading-[24px] text-zinc-300">
                ✨ 자세공작소 페이지에 머물러 있지 않더라도 <br />
                브라우저 푸시 알림을 보내 자세 교정을 도와요.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center bg-[#27272A] pb-[92px] pt-[92px] lg:pb-[142px] lg:pt-[120px]">
            <h2 className="text-[28px] font-semibold leading-[38px] text-zinc-50 lg:text-[32px] lg:leading-[40px]">
              바른 자세를 알려드려요
            </h2>
            <img src={GoodPosture} alt="good-posture" className="mt-7 w-[272px] lg:mt-10 lg:w-full" />
            <p className="mt-7 w-[280px] text-center text-[15px] font-light leading-[24px] text-zinc-300 xxs:w-[331px] md:w-[431px]">
              {/* 바른 자세가 무엇인지 알기 어려운 사용자들을 위해 매일
            <div className="block md:hidden" /> 모니터링 시작 전<div className="hidden md:block" />
            그리고 모니터링 화면에서 언제든 볼 수<div className="block md:hidden" /> 있도록 제공해요. */}
              바른 자세가 무엇인지 알기 어려운 사용자들을 위해 매일 모니터링 시작 전 그리고 모니터링 화면에서 언제든 볼
              수 있도록 제공해요.
            </p>
          </div>
        </section>
        <section className="flex w-full flex-col items-center bg-align_blue-200 pb-[92px] pt-[88px] text-center md:pb-[108px] lg:hidden">
          <h2 className="text-[28px] font-bold leading-[38px] text-zinc-900">
            자세공작소와 <div className="block md:hidden" /> PC에서 만나요!
          </h2>
          <div className="mt-7 text-[16px] font-medium leading-[24px]">
            🔥 자세공작소 링크를 까먹지 않으려면?!
            <br /> 지금 ‘링크 공유하기' 클릭!
          </div>
          <button
            className="mt-[60px] flex h-[54px] w-[220px] items-center justify-center rounded-full bg-white px-6 py-3 text-[16px] leading-[24px]"
            onClick={() => shareLinkHandler("bottom-share-button")}
          >
            <Share2 className="mr-2" size={16} />
            <span className="text-[16px] font-semibold leading-[24px] text-zinc-900">링크 공유하기</span>
          </button>
        </section>
      </div>
    </>
  )
}

export default HomePage
