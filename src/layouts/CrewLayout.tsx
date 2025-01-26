import { Outlet } from "react-router-dom"

export default function CrewLayout() {
  return (
    <div className="flex min-h-full min-w-[1216px] bg-[#F9F9FD] px-28 py-12">
      <Outlet />
    </div>
  )
}
