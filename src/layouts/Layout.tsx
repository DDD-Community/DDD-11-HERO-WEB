import React from "react"
import { Outlet } from "react-router-dom"
import SideNav from "@/components/SideNav"

const Layout: React.FC = () => {
  return (
    <div className="flex min-h-screen w-screen bg-gray-100">
      <div className="flex w-full">
        <SideNav />

        {/* Main Content */}
        <main className="min-w-[652px] flex-1 overflow-y-auto bg-[#1C1D20] p-3">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
