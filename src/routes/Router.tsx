import Modals from "@/components/Modal/Modals"
import RoutePath from "@/constants/routes.json"
import AnalysisLayout from "@/layouts/AnalysisLayout"
import BaseLayout from "@/layouts/BaseLayout"
import MonitoringLayout from "@/layouts/MonitoringLayout"
import { AnalysisDashboard, AuthPage, Crew, HomePage, MonitoringPage } from "@/pages"
import MyCrew from "@/pages/MyCrew"
import MyPage from "@/pages/MyPage"
import AuthRoute from "@/routes/AuthRoute"
import { useAuthStore } from "@/store/AuthStore"
import React from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

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
            <Route path={RoutePath.MYPAGE} element={<MyPage />} />
            <Route element={<MonitoringLayout />}>
              <Route path={RoutePath.MONITORING} element={<MonitoringPage />} />
            </Route>

            <Route element={<AnalysisLayout />}>
              <Route path={RoutePath.ANALYSIS} element={<AnalysisDashboard />} />
            </Route>

            <Route element={<AnalysisLayout />}>
              <Route path={RoutePath.CREW} element={<Crew />} />
            </Route>

            <Route element={<AnalysisLayout />}>
              <Route path={RoutePath.MYCREW} element={<MyCrew />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Modals />
    </BrowserRouter>
  )
}

export default Router
