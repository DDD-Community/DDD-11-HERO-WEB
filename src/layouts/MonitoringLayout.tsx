import { Outlet } from "react-router-dom"

export default function MonitoringLayout() {
  return (
    <div className="h-full bg-zinc-900 p-3">
      <Outlet />
    </div>
  )
}
