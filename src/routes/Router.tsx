import React from "react"
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"
import { AuthPage, MonitoringPage, HomePage, AnalysisDashboard, Crew } from "@/pages"
import BaseLayout from "@/layouts/BaseLayout"
import MonitoringLayout from "@/layouts/MonitoringLayout"
import AnalysisLayout from "@/layouts/AnalysisLayout"
import RoutePath from "@/constants/routes.json"
import AuthRoute from "@/routes/AuthRoute"

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={RoutePath.AUTH} element={<AuthPage />} />
        <Route path="/" element={<HomePage />} />

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
