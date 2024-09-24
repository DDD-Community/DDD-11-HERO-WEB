import { Outlet } from "react-router-dom"
import SideNav from "@/components/SideNav"

const BaseLayout: React.FC = () => {
  return (
    <div className="flex h-screen w-screen bg-gray-100">
      <div className="flex w-full">
        <SideNav />

        {/* Main Content */}
        <main id="main-content" className="relative flex-1 overflow-y-auto">
          <Outlet />
          <div id="modal-root"></div>
        </main>
      </div>
    </div>
  )
}

export default BaseLayout
