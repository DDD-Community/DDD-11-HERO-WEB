import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import qs from "qs"

const REST_API_KEY = "84b401e74d5a879d3fedfa7ba4366c68"
const REDIRECT_URI = "http://localhost:3000/auth"
const KAKAO_CLIENT_SECRET = "KlMbFCPi0ZAP8lMJEO3IDAsSVN5BoA2x"

const AuthPage: React.FC = () => {
  const [accessToken, setAccessToken] = useState("")

  const navigate = useNavigate()

  const getToken = async (): Promise<string> => {
    const code = new URL(window.location.href).searchParams.get("code")

    const formData = {
      grant_type: "authorization_code",
      client_id: REST_API_KEY,
      client_secret: KAKAO_CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      code,
    }

    const {
      data: { access_token },
    } = await axios
      .post(`https://kauth.kakao.com/oauth/token?${qs.stringify(formData)}`, null, {
        headers: { "Content-type": "application/x-www-form-urlencoded" },
      })
      .then((res) => {
        return res
      })

    setAccessToken(access_token)
    return access_token
  }

  const getServiceToken = async (_accessToken: string): Promise<any> => {
    const res = await axios.post("https://api.alignlab.site/api/v1/oauth/kakao/sign-in", { _accessToken })

    return res
  }

  const getIsSignUp = async (_accessToken: string): Promise<boolean> => {
    const res = await axios.get(
      `https://api.alignlab.site/api/v1/oauth/kakao/sign-up/check?accessToken=${_accessToken}`
    )

    return res.data.isExistsUser
  }

  useEffect(() => {
    getToken()
      .then((res) => {
        if (res) {
          // localStorage.setItem("token", JSON.stringify(res.data.access_token))
          navigate("/")
        }
      })
      .catch((err) => console.log(err))
  }, [])

  useEffect(() => {
    if (accessToken) {
      getIsSignUp(accessToken)
      getServiceToken(accessToken)
    }
  }, [accessToken])

  return <div>auth page</div>
}

export default AuthPage
