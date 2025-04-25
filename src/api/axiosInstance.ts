// src/services/axiosInstance.ts
import { useAuthStore } from "@/store/AuthStore"
import axios, { AxiosError, AxiosResponse } from "axios"
import toast from "react-hot-toast"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const EXCEPT_HEADER_API = ["/token", "/user/me", "/oauth"]
const IS_DEVELOPMENT = import.meta.env.MODE === 'dev'

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10초 타임아웃 설정
})

const kakaoAxios = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// 요청 인터셉터 설정
axiosInstance.interceptors.request.use(
  (config) => {
    // 개발 환경에서 요청 로깅
    if (IS_DEVELOPMENT) {
      console.log(`🚀 Request: ${config.method?.toUpperCase()} ${config.url}`, config);
    }

    // 특정 API 경로에 대해 토큰을 제거
    if (config.url) {
      // 요청 URL이 EXCEPT_HEADER_API에 포함되어 있는지 확인
      if (EXCEPT_HEADER_API.some((api) => config.url?.includes(api))) {
        delete config.headers["X-HERO-AUTH-TOKEN"]
      }
    }
    return config
  },
  (error) => {
    if (IS_DEVELOPMENT) {
      console.error('❌ Request Error:', error);
    }
    return Promise.reject(error);
  }
);

// 응답 인터셉터 설정
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // 개발 환경에서 응답 로깅
    if (IS_DEVELOPMENT) {
      console.log(`✅ Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    }
    return response
  },
  async (error: AxiosError) => {
    // 개발 환경에서 에러 로깅
    if (IS_DEVELOPMENT) {
      console.error('❌ Response Error:', error.response || error);
    }

    // 에러 처리 로직
    if (error.response) {
      const { status, data } = error.response;
      
      // 401 Unauthorized - 로그인 필요
      if (status === 401) {
        toast.error('로그인이 필요합니다.');
        useAuthStore.getState().logout(() => {
          clearAccessToken()
          window.location.href = "/"
        });
      } 
    } 
    // 네트워크 오류
    else if (error.message === 'Network Error') {
      toast.error('네트워크 연결을 확인해주세요.');
    }
    // 타임아웃 오류
    else if (error.code === 'ECONNABORTED') {
      toast.error('요청 시간이 초과되었습니다. 다시 시도해주세요.');
    }

    return Promise.reject(error);
  }
);

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

export { kakaoAxios }
export default axiosInstance
