import { Outlet } from "react-router-dom"

export default function MonitoringLayout() {
  return (
    <div className="h-full min-w-[652px] bg-zinc-900">
      <Outlet />
    </div>
  )
}
