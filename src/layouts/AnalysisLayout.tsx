import { Outlet } from "react-router-dom"

export default function AnalysisLayout() {
  return (
    <div className="min-h-full min-w-[1216px] bg-[#F9F9FD] px-28 py-12">
      <Outlet />
    </div>
  )
}
