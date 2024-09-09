import { Outlet } from "react-router-dom"

export default function AnalysisLayout() {
  return (
    <div className="h-full bg-[#F9F9FD] px-28 py-12">
      <Outlet />
    </div>
  )
}
