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
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`
}

// 엑세스 토큰 설정 함수
export const setAccessToken = (token: string) => {
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`
  localStorage.setItem("accessToken", token)
}

// 엑세스 토큰 제거 함수
export const clearAccessToken = () => {
  delete axiosInstance.defaults.headers.common["Authorization"]
  localStorage.removeItem("accessToken")
}

export default axiosInstance
