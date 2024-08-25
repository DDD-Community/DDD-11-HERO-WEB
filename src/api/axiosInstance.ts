// src/services/axiosInstance.ts
import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// localStorage에서 토큰 가져오기
const token = localStorage.getItem("accessToken")
if (token) {
  axiosInstance.defaults.headers.common["X-HERO-AUTH-TOKEN"] = token
}

// 엑세스 토큰 설정 함수
export const setAccessToken = (_token: string): void => {
  axiosInstance.defaults.headers.common["X-HERO-AUTH-TOKEN"] = _token
  //   localStorage.setItem("accessToken", token)
}

// 엑세스 토큰 제거 함수
export const clearAccessToken = (): void => {
  delete axiosInstance.defaults.headers.common["X-HERO-AUTH-TOKEN"]
  //   localStorage.removeItem("accessToken")
}

export default axiosInstance
