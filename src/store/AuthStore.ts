import { create } from "zustand"
import { persist } from "zustand/middleware"

interface UserInfo {
  uid: number
  nickname: string
}
interface AuthState {
  isAuthenticated: boolean
  user: UserInfo | null
  accessToken: string
  setUser: (user: UserInfo, accessToken: string) => void
  setNickName: (nickname: string) => void
  logout: (callback: () => void) => void
}

export const useAuthStore = create(
  persist<AuthState>(
    (set) => {
      return {
        isAuthenticated: false,
        user: null,
        accessToken: "",
        setUser: (user: UserInfo, accessToken: string) =>
          set({
            user,
            isAuthenticated: true,
            accessToken,
          }),
        setNickName: (nickname: string) =>
          set((state) => ({
            user: state.user ? { ...state.user, nickname } : null,
          })),
        logout: (callback) => {
          set({
            user: null,
            isAuthenticated: false,
            accessToken: "",
          })
          callback() // 로그아웃 후 콜백 실행
        },
      }
    },
    { name: "userStorage" }
  )
)
