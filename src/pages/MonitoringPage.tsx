import { PoseDetector } from "@/components"
import PostrueCrew from "@/components/Posture/PostrueCrew"
import GroupSideIcon from "@assets/icons/group-side-nav-button.svg?react"
import React, { useState } from "react"

const MonitoringPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev)
  }

  return (
    <div className="relative flex h-full w-full overflow-hidden">
      {/* Main content area */}
      <div className={`flex-grow transition-all duration-300 ${isSidebarOpen ? "pr-[232px]" : ""}`}>
        <div className="flex h-full items-center justify-center">
          <div className="aspect-video w-full max-w-[1280px]">
            <PoseDetector />
          </div>
        </div>
      </div>

      {/* 사이드바 */}
      <div
        className={`transition-width absolute right-0 top-0 h-full bg-[#fafafa] duration-300 ${
          isSidebarOpen ? "w-[224px]" : "w-0"
        }`}
      >
        {isSidebarOpen && <PostrueCrew toggleSidebar={toggleSidebar} />}
      </div>

      {/* 토글 버튼 */}
      {!isSidebarOpen && (
        <button className="fixed right-4 top-4 z-50 rounded-full" onClick={toggleSidebar}>
          <GroupSideIcon className="h-6 w-6" />
        </button>
      )}
    </div>
  )
}

export default MonitoringPage
