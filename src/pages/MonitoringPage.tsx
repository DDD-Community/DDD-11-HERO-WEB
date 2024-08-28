import { PoseDetector } from "@/components"
import PostrueCrew from "@/components/Posture/PostrueCrew"
import GroupSideIcon from "@assets/icons/group-side-nav-button.svg?react"
import React, { useEffect, useState } from "react"
import { useGetRecentSnapshot } from "@/hooks/useSnapshotMutation"
import { useSnapshotStore } from "@/store/SnapshotStore"

const MonitoringPage: React.FC = () => {
  const getRecentSnapMutation = useGetRecentSnapshot()
  const setSnap = useSnapshotStore((state) => state.setSnapshot)
  const snapshot = useSnapshotStore((state) => state.snapshot)

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)

  const toggleSidebar = (): void => {
    setIsSidebarOpen((prev) => !prev)
  }

  const init = async (): Promise<void> => {
    // 최근 스냅샷을 가져오기
    if (!snapshot) {
      const userSnap = await getRecentSnapMutation.mutateAsync()

      // 스냅샷이 있으면 store에 저장
      if (userSnap.id !== -1) {
        setSnap(userSnap.points.map((p) => ({ name: p.position.toLocaleLowerCase(), x: p.x, y: p.y, confidence: 1 })))
      }
    }
  }

  useEffect(() => {
    init()
  }, [])

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
        className={`transition-width absolute right-0 top-0 z-10 h-full rounded-2xl bg-[#fafafa] duration-300 ${
          isSidebarOpen ? "w-[224px]" : "w-0"
        }`}
      >
        {isSidebarOpen && <PostrueCrew toggleSidebar={toggleSidebar} />}
      </div>

      {/* 토글 버튼 */}
      {!isSidebarOpen && (
        <button className="z-1 fixed right-2 top-2 rounded-full p-4" onClick={toggleSidebar}>
          <GroupSideIcon />
        </button>
      )}
    </div>
  )
}

export default MonitoringPage
