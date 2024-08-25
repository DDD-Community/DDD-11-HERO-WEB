import { useAuthStore } from "@/store/AuthStore"
import MainCraftIcon from "@assets/icons/posture-craft-side-nav-icon.svg?react"
import AnalysisIcon from "@assets/icons/side-nav-analysis-icon.svg?react"
import CrewIcon from "@assets/icons/side-nav-crew-icon.svg?react"
import MonitoringIcon from "@assets/icons/side-nav-monitor-icon.svg?react"
import { Link, useLocation } from "react-router-dom"

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

const footerLinks = ["이용약관", "의견보내기", "로그아웃"]

export default function SideNav() {
  const nickname = useAuthStore((state) => state.user?.nickname)
  const location = useLocation()

  return (
    <aside className="w-[224px] flex-none bg-[#1C1D20]">
      <div className="flex h-full flex-col justify-between text-white">
        {/* Top Section */}
        <div>
          {/* Logo and Title */}
          <div className="flex items-center p-6">
            <MainCraftIcon className="h-8 w-8" />
            <span className="ml-2 text-xl font-bold">자세공작소</span>
          </div>

          {/* User Info */}
          <div className="pl-6 pt-2">
            <div className="text-sm text-gray-400">바른자세 똑딱똑딱</div>
            <div>
              <span className="text-sm font-bold">{nickname}</span>
              <span className="text-sm text-gray-400"> 님</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-10">
            <ul>
              {navItems.map(({ icon: Icon, label, link }) => {
                const isActive = location.pathname === link
                return (
                  <li key={label} className={`mb-1 rounded-r-md ${isActive ? "bg-gray-700" : "hover:bg-gray-700"}`}>
                    <Link to={link} className={`nav-item flex w-full items-center p-3 ${isActive ? "active" : ""}`}>
                      <Icon className="ml-3 mr-2 h-5 w-5" />
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
          {/* Divider */}
          <div className="mb-6 border-t" style={{ borderColor: "#373C42" }} />

          {/* Footer Links */}
          <div className="mb-12">
            <ul>
              {footerLinks.map((link, index) => (
                <li key={index} className="mb-3 cursor-pointer text-sm">
                  {link}
                </li>
              ))}
            </ul>
          </div>

          {/* Footer Text */}
          <div className="text-xs text-gray-500">
            © 2024 주인공.
            <br />
            All rights reserved.
          </div>
        </div>
      </div>
    </aside>
  )
}
