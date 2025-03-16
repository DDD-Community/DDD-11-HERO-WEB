import { logAnalytics } from "@/utils/log"

const Login: React.FC = () => {
  const REST_API_KEY = "84b401e74d5a879d3fedfa7ba4366c68"
  const REDIRECT_URI = "http://localhost:3000/auth"
  const link = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`

  const loginHandler = (): void => {
    logAnalytics("click_login")
    window.location.href = link
  }

  return (
    <button type="button" onClick={loginHandler}>
      로그인 하기
    </button>
  )
}

export default Login
