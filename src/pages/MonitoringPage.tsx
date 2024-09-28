import { getRecentSnapshot } from "@/api"
import { PoseDetector } from "@/components"
import PostrueCrew from "@/components/Posture/PostrueCrew"
import usePushNotification from "@/hooks/usePushNotification"
import { useSnapShotStore } from "@/store/SnapshotStore"
import GroupSideIcon from "@assets/icons/group-side-nav-button.svg?react"
import React, { useEffect, useState } from "react"

const MonitoringPage: React.FC = () => {
  const { hasPermission } = usePushNotification()
  const { snapshot, setSnapShot, isInitialSnapShotExist } = useSnapShotStore()
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true)

  const toggleSidebar = (): void => {
    setIsSidebarOpen((prev) => !prev)
  }

  useEffect(() => {
    const init = async (): Promise<void> => {
      // 최근 스냅샷을 가져오기

      const userSnap = await getRecentSnapshot()

      // 스냅샷이 있으면 store에 저장
      if (userSnap.id !== -1) {
        setSnapShot(
          userSnap.points.map((p) => ({ name: p.position.toLocaleLowerCase(), x: p.x, y: p.y, confidence: 1 }))
        )
      }
    }
    init()
  }, [])

  const checkMobile = () => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera

    // Regular expressions to check for mobile and tablet devices
    const mobileRegex =
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i
    const tabletRegex = /android|ipad|playbook|silk/i

    const isMobileDevice = mobileRegex.test(userAgent) || tabletRegex.test(userAgent)

    return isMobileDevice
  }

  if (checkMobile()) {
    return <div className="text-2xl font-bold text-white">모바일 디바이스는 현재 사용이 불가능 합니다</div>
  }

  return (
    <div className="relative flex h-full w-full overflow-hidden">
      {/* Main content area */}
      <div
        className={`flex-grow transition-all duration-300 ${
          isSidebarOpen && isInitialSnapShotExist ? "pr-[224px]" : ""
        }`}
      >
        <div id="monitoring-modal-root" className="relative flex h-full items-center justify-center">
          <div className="aspect-video w-full max-w-[1280px] p-8">
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
          isSidebarOpen && isInitialSnapShotExist ? "w-[224px]" : "w-0"
        }`}
      >
        {isSidebarOpen && isInitialSnapShotExist && <PostrueCrew toggleSidebar={toggleSidebar} />}
      </div>

      {/* 토글 버튼 */}
      {!isSidebarOpen && isInitialSnapShotExist && (
        <button className="z-1 fixed right-2 top-2 rounded-full p-4" onClick={toggleSidebar}>
          <GroupSideIcon />
        </button>
      )}
    </div>
  )
}

export default MonitoringPage
