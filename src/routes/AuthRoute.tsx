import React from "react"
import { Navigate, Outlet } from "react-router-dom"
import { useAuthStore } from "@/store/AuthStore"
import RoutePath from "@/constants/routes.json"

interface AuthRouteProps {
  children?: React.ReactNode
}

const AuthRoute: React.FC<AuthRouteProps> = ({ children }) => {
  const { accessToken } = useAuthStore()

  // 토큰이 없거나 유효하지 않은 경우 홈으로 리다이렉트
  if (!accessToken) {
    return <Navigate to={RoutePath.HOME} replace />
  }

  // 토큰이 유효하다면 자식 컴포넌트 또는 Outlet을 렌더링
  return children ? <>{children}</> : <Outlet />
}

export default AuthRoute
