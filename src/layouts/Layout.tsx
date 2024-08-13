import React from "react"
import { Outlet } from "react-router-dom"

const Layout: React.FC = () => {
  return (
    <div className="flex min-h-screen w-screen bg-gray-100">
      <div className="flex w-full">
        <aside className="w-[224px] flex-none flex-shrink-0 bg-[#1C1D20]">
          <nav className="p-4">
            <ul>
              <li className="mb-2">
                <a href="#home" className="text-gray-700">
                  Home
                </a>
              </li>
              <li className="mb-2">
                <a href="#about" className="text-gray-700">
                  About
                </a>
              </li>
              <li className="mb-2">
                <a href="#contact" className="text-gray-700">
                  Contact
                </a>
              </li>
            </ul>
          </nav>
        </aside>
        <main className="min-w-[652px] flex-1 overflow-y-auto bg-[#1C1D20] p-[6px]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
