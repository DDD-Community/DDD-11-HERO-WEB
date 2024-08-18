import React from "react"
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"
import { AuthPage, MonitoringPage } from "@/pages"
import { Layout } from "@/layouts"
import RoutePath from "@/constants/routes.json"

const Router: React.FC = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path={RoutePath.AUTH} element={<AuthPage />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<MonitoringPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default Router
