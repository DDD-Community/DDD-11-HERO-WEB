import React from "react"
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"
import { AuthPage, MonitoringPage, HomePage } from "@/pages"
import { Layout } from "@/layouts"
import RoutePath from "@/constants/routes.json"
import AuthRoute from "@/routes/AuthRoute"

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={RoutePath.AUTH} element={<AuthPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/" element={<Layout />}>
          {/* AuthRoute로 보호된 경로를 감쌉니다 */}
          <Route element={<AuthRoute />}>
            <Route path={RoutePath.MONITORING} element={<MonitoringPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Router
