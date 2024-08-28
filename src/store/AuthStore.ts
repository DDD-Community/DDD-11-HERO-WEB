import { create } from "zustand"
import { persist } from "zustand/middleware"

interface AuthState {
  isAuthenticated: boolean
  user: any
  accessToken: string
  setUser: (user: any, accessToken: string) => void
  logout: (callback: () => void) => void
}

export const useAuthStore = create(
  persist<AuthState>(
    (set) => {
      return {
        isAuthenticated: false,
        user: null,
        accessToken: "",
        setUser: (user: any, accessToken: string) =>
          set({
            user,
            isAuthenticated: true,
            accessToken,
          }),
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
