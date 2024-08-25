import { Outlet } from "react-router-dom"

export default function AnalysisLayout() {
  return (
    <div className="h-full bg-[#F9F9FD] p-12">
      <Outlet />
    </div>
  )
}
