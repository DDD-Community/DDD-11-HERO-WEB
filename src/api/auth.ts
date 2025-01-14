// src/api/auth.ts
import { setAccessToken, kakaoAxios } from "@/api/axiosInstance"
import qs from "qs"

const REST_API_KEY = import.meta.env.VITE_OAUTH_KAKAO_REST_API_KEY
const CLIENT_SECRET = import.meta.env.VITE_OAUTH_KAKAO_CLIENT_SECRET_CODE
const REDIRECT_URI = import.meta.env.VITE_OAUTH_KAKAO_REDIRECT_URI

export interface authUser {
  uid: number
  nickname: string
  accessToken: string
}

export interface oauthUser {
  nickname: string
}

export const oauth = async (code: string): Promise<string> => {
  const formData = {
    grant_type: "authorization_code",
    client_id: REST_API_KEY,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    code,
  }

  try {
    const res = await kakaoAxios.post(`https://kauth.kakao.com/oauth/token?${qs.stringify(formData)}`, null, {
      headers: { "Content-type": "application/x-www-form-urlencoded" },
    })
    return res.data.access_token
  } catch (e) {
    throw e
  }
}

export const getOauthUser = async (accessToken: string): Promise<oauthUser> => {
  const kakaoUser = await kakaoAxios.get(`https://kapi.kakao.com/v2/user/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  const { nickname } = kakaoUser.data.kakao_account.profile

  return { nickname }
}

export const signIn = async (_accessToken: string): Promise<authUser> => {
  try {
    const res = await kakaoAxios.post(`/oauth/kakao/sign-in`, { accessToken: _accessToken })
    const { uid, nickname, accessToken } = res.data.data

    // 로그인 성공 후 엑세스 토큰을 설정
    setAccessToken(accessToken)

    return { uid, nickname, accessToken }
  } catch (e) {
    throw e
  }
}

export const signUp = async (_accessToken: string): Promise<authUser> => {
  try {
    const res = await kakaoAxios.post(`/oauth/kakao/sign-up`, { accessToken: _accessToken })
    const { uid, nickname, accessToken } = res.data.data

    // 회원가입 성공 후 엑세스 토큰을 설정
    setAccessToken(accessToken)

    return { uid, nickname, accessToken }
  } catch (e) {
    throw e
  }
}

export const getIsSignUp = async (accessToken: string): Promise<boolean> => {
  try {
    const res = await kakaoAxios.get(`/oauth/kakao/sign-up/check`, {
      params: { accessToken },
    })
    console.log(res.data)
    return res.data.data.isExistsUser
  } catch (e) {
    throw e
  }
}
