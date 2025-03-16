import { clearAccessToken } from "@/api/axiosInstance"
import { useAuthStore } from "@/store/AuthStore"
import { useSnapShotStore } from "@/store/SnapshotStore"
import LogoImage from "@assets/icons/side-nav-logo.svg?react"
import AnalysisIcon from "@assets/icons/side-nav-analysis-icon.svg?react"
import CrewIcon from "@assets/icons/side-nav-crew-icon.svg?react"
import MonitoringIcon from "@assets/icons/side-nav-monitor-icon.svg?react"
import RightSmallArrow from "@assets/icons/arrow-small-right.svg?react"
import { useMemo } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useModals } from "@/hooks/useModals"
import { modals } from "./Modal/Modals"
import RoutePath from "@/constants/routes.json"
import { logAnalytics } from "@/utils/log"

const navItems = [
  {
    icon: MonitoringIcon,
    label: "모니터링",
    link: "/monitoring",
  },
  {
    icon: AnalysisIcon,
    label: "내 자세 분석",
    link: "/analysis",
  },
  {
    icon: CrewIcon,
    label: "공작소 크루",
    link: "/crew",
  },
]

export default function SideNav(): React.ReactElement {
  const nickname = useAuthStore((state) => state.user?.nickname)
  const location = useLocation()
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()
  const { openModal } = useModals()

  const logoutHandler = (): void => {
    const clearUser = useAuthStore.persist.clearStorage
    const clearSnapshot = useSnapShotStore.persist.clearStorage
    // const clearNotification = useNotificationStore.persist.clearStorage

    clearUser()
    clearSnapshot()
    clearAccessToken()
    // clearNotification()

    logout(() => {
      navigate("/")
    })
  }

  const footerLinks = useMemo(
    () => [
      {
        label: "이용약관",
        link: "",
        onClick: () => {
          window.open("https://swjg3gi.notion.site/7c13aba015654e6f8e1acd300b440526?pvs=4", "_blank")
        },
      },
      {
        label: "의견보내기",
        link: "",
        onClick: () => {
          logAnalytics("click_logout", {
            page: location.pathname,
          })
          openModal(modals.reportModal, {
            onSubmit: () => {
              // navigate(RoutePath.MYCREW)
            },
          })
        },
      },
      { label: "로그아웃", link: "", onClick: logoutHandler },
    ],
    [logoutHandler, location.pathname]
  )

  return (
    <aside className="w-[224px] flex-none border-r-[1px] border-zinc-700 bg-zinc-900">
      <div className="flex h-full flex-col justify-between text-white">
        {/* Top Section */}
        <div>
          {/* Logo and Title */}
          <div className="flex items-center p-6">
            <LogoImage />
          </div>

          {/* User Info */}
          <div className="flex flex-col gap-[2px] pl-6 pt-2">
            <div className="text-base text-zinc-500">바른자세 똑딱똑딱</div>
            <Link to={RoutePath.MYPAGE} className="flex items-center">
              <span className="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap text-lg font-bold">
                {nickname}
              </span>
              <RightSmallArrow />
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="mr-4 mt-10">
            <ul>
              {navItems.map(({ icon: Icon, label, link }) => {
                const isActive = location.pathname.includes(link)
                return (
                  <li key={label} className={`mb-1 rounded-r-md ${isActive ? "bg-zinc-700" : "hover:bg-zinc-700"}`}>
                    <Link to={link} className={`nav-item flex w-full items-center p-3 ${isActive ? "active" : ""}`}>
                      <Icon className="ml-3 mr-3 h-5 w-5" />
                      <span className={isActive ? "font-bold" : ""}>{label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-6">
          {/* Footer Links */}
          <div className="mb-12">
            <ul>
              {footerLinks.map(({ label, onClick }, index) => (
                <li key={index} className="mb-3 cursor-pointer text-sm" onClick={onClick}>
                  {label}
                </li>
              ))}
            </ul>
          </div>

          {/* Footer Text */}
          <div className="text-xs text-zinc-500">
            © 2024 주인공.
            <br />
            All rights reserved.
          </div>
        </div>
      </div>
    </aside>
  )
}
