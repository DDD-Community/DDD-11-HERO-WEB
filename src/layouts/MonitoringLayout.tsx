import { Outlet } from "react-router-dom"

export default function MonitoringLayout() {
  return (
    <div className="h-full bg-[#1C1D20] p-3">
      <Outlet />
    </div>
  )
}
