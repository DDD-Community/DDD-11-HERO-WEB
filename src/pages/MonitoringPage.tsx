import { PoseDetector } from "@/components"
import PostrueCrew from "@/components/Posture/PostrueCrew"
import GroupSideIcon from "@assets/icons/group-side-nav-button.svg?react"
import React, { useEffect, useState } from "react"
import { useGetRecentSnapshot } from "@/hooks/useSnapshotMutation"
import { useSnapShotStore } from "@/store/SnapshotStore"
import usePushNotification from "@/hooks/usePushNotification"
import { useGuidePopup } from "@/hooks/useGuidePopup"

const MonitoringPage: React.FC = () => {
  const { hasPermission } = usePushNotification()
  const getRecentSnapMutation = useGetRecentSnapshot()

  const { isPopupOpen } = useGuidePopup()
  const { snapshot, setSnapShot } = useSnapShotStore()

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true)

  const toggleSidebar = (): void => {
    setIsSidebarOpen((prev) => !prev)
  }

  const init = async (): Promise<void> => {
    // 최근 스냅샷을 가져오기
    if (!snapshot) {
      const userSnap = await getRecentSnapMutation.mutateAsync()

      // 스냅샷이 있으면 store에 저장
      if (userSnap.id !== -1) {
        setSnapShot(
          userSnap.points.map((p) => ({ name: p.position.toLocaleLowerCase(), x: p.x, y: p.y, confidence: 1 }))
        )
      }
    }
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <div className="relative flex h-full w-full overflow-hidden">
      {/* Main content area */}
      <div className={`flex-grow transition-all duration-300 ${isSidebarOpen && !isPopupOpen ? "pr-[232px]" : ""}`}>
        <div className="relative flex h-full items-center justify-center">
          <div className="aspect-video w-full max-w-[1280px]">
            <PoseDetector />
          </div>
          {!hasPermission && (
            <div className="absolute bottom-[74px] rounded-[42px] bg-[#787870]/20 px-10 py-3 text-lg font-medium text-orange-400">
              브라우저의 알림 기능을 허용해주세요.
            </div>
          )}
        </div>
      </div>

      {/* 사이드바 */}
      <div
        className={`transition-width absolute right-0 top-0 z-10 h-full rounded-2xl bg-[#fafafa] duration-300 ${
          isSidebarOpen && !isPopupOpen ? "w-[224px]" : "w-0"
        }`}
      >
        {isSidebarOpen && !isPopupOpen && <PostrueCrew toggleSidebar={toggleSidebar} />}
      </div>

      {/* 토글 버튼 */}
      {!isSidebarOpen && !isPopupOpen && (
        <button className="z-1 fixed right-2 top-2 rounded-full p-4" onClick={toggleSidebar}>
          <GroupSideIcon />
        </button>
      )}
    </div>
  )
}

export default MonitoringPage
