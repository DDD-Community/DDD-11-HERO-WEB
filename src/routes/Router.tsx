import React from "react"
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"
import { AuthPage, MonitoringPage, HomePage } from "@/pages"
import { Layout } from "@/layouts"
import RoutePath from "@/constants/routes.json"
// import AuthRoute from "@/routes/AuthRoute" // ToDo: 로그인 정상화 될때까지 routing 보호하지 않도록 수정

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={RoutePath.AUTH} element={<AuthPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/" element={<Layout />}>
          {/* AuthRoute로 보호된 경로를 감쌉니다 */}
          {/* <Route element={<AuthRoute />}> */}
          <Route path={RoutePath.MONITORING} element={<MonitoringPage />} />
          {/* </Route> */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Router
