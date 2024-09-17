import React, { ReactNode } from "react"
import ReactDOM from "react-dom"
import CloseIcon from "@assets/icons/modal-close-icon.svg?react"

type ModalContainerProps = {
  onClose?: () => void
  children: ReactNode
}

const ModalContainer: React.FC<ModalContainerProps> = ({ onClose, children }) => {
  const handleClose = (): void => {
    if (onClose && typeof onClose === "function") onClose()
  }
  // Modal이 main 안에서 절대적으로 위치하도록 변경
  return ReactDOM.createPortal(
    <div className="fixed top-0 z-50 flex h-full w-[calc(100%-224px)] items-center justify-center bg-zinc-900 bg-opacity-20">
      <div className="relative w-[640px] rounded-lg bg-white px-10 pb-6 pt-10 shadow-lg">
        {/* Close Button */}
        <button className="absolute right-10 top-10 text-gray-500 hover:text-gray-800" onClick={handleClose}>
          <CloseIcon />
        </button>
        {/* Modal Content */}
        {children}
      </div>
    </div>,
    document.getElementById("modal-root") as HTMLElement // main 안의 #modal-root
  )
}

export default ModalContainer
