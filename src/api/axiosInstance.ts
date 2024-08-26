// src/services/axiosInstance.ts
import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const EXCEPT_HEADER_API = ["/token", "/user/me", "/oauth"]

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// 요청 인터셉터 설정
axiosInstance.interceptors.request.use((config) => {
  // 특정 API 경로에 대해 토큰을 제거
  if (config.url) {
    // 요청 URL이 EXCEPT_HEADER_API에 포함되어 있는지 확인
    if (EXCEPT_HEADER_API.some((api) => config.url?.includes(api))) {
      delete config.headers["X-HERO-AUTH-TOKEN"]
    }
  }
  return config
})

// localStorage에서 토큰 가져오기
const token = localStorage.getItem("accessToken")
if (token) {
  axiosInstance.defaults.headers.common["X-HERO-AUTH-TOKEN"] = token
}

// 엑세스 토큰 설정 함수
export const setAccessToken = (_token: string): void => {
  axiosInstance.defaults.headers.common["X-HERO-AUTH-TOKEN"] = _token
  localStorage.setItem("accessToken", _token)
}

// 엑세스 토큰 제거 함수
export const clearAccessToken = (): void => {
  delete axiosInstance.defaults.headers.common["X-HERO-AUTH-TOKEN"]
  localStorage.removeItem("accessToken")
}

export default axiosInstance
