import React, { ReactNode } from "react"
import ReactDOM from "react-dom"
import CloseIcon from "@assets/icons/modal-close-icon.svg?react"

type ModalContainerProps = {
  onClose?: () => void
  children: ReactNode
  isMonitoring?: boolean
}

const ModalContainer: React.FC<ModalContainerProps> = ({ onClose, children, isMonitoring = false }) => {
  const handleClose = (): void => {
    if (onClose && typeof onClose === "function") onClose()
  }
  const getModalRoot = (): HTMLElement => {
    return isMonitoring
      ? (document.getElementById("monitoring-modal-root") as HTMLElement)
      : (document.getElementById("modal-root") as HTMLElement)
  }
  // Modal이 main 안에서 절대적으로 위치하도록 변경
  return ReactDOM.createPortal(
    <div
      className={`fixed top-0 z-50 flex h-full w-[calc(100%-224px)] items-center justify-center bg-zinc-900 bg-opacity-20 ${
        isMonitoring && "absolute w-full"
      }`}
    >
      <div className="relative w-[640px] rounded-lg bg-white px-10 pb-6 pt-10 shadow-lg">
        {/* Close Button */}
        <button className="absolute right-10 top-10 text-gray-500 hover:text-gray-800" onClick={handleClose}>
          <CloseIcon />
        </button>
        {/* Modal Content */}
        {children}
      </div>
    </div>,
    getModalRoot()
  )
}

export default ModalContainer
