import React from "react"
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"
import { AuthPage, MonitoringPage, HomePage, AnalysisDashboard, Crew } from "@/pages"
import BaseLayout from "@/layouts/BaseLayout"
import MonitoringLayout from "@/layouts/MonitoringLayout"
import AnalysisLayout from "@/layouts/AnalysisLayout"
import RoutePath from "@/constants/routes.json"
import AuthRoute from "@/routes/AuthRoute"
import { useAuthStore } from "@/store/AuthStore"

const Router: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return (
    <BrowserRouter>
      <Routes>
        <Route path={RoutePath.AUTH} element={<AuthPage />} />

        {/* 로그인 상태에 따라 홈 페이지로 접근 시 리다이렉트 */}
        <Route path="/" element={isAuthenticated ? <Navigate to={RoutePath.MONITORING} replace /> : <HomePage />} />

        <Route element={<AuthRoute />}>
          <Route element={<BaseLayout />}>
            <Route element={<MonitoringLayout />}>
              <Route path={RoutePath.MONITORING} element={<MonitoringPage />} />
            </Route>

            <Route element={<AnalysisLayout />}>
              <Route path={RoutePath.ANALYSIS} element={<AnalysisDashboard />} />
            </Route>

            <Route element={<MonitoringLayout />}>
              <Route path={RoutePath.CREW} element={<Crew />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router
