import { create } from "zustand"

interface AuthState {
  isAuthenticated: boolean
  user: any
  accessToken: string
  setUser: (user: any, accessToken: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  accessToken: "",
  setUser: (user: any, accessToken: string) =>
    set({
      user,
      isAuthenticated: true,
      accessToken,
    }),
  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
      accessToken: "",
    }),
}))
