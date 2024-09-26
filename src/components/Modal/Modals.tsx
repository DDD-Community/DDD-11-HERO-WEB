import { ModalsDispatchContext, ModalsStateContext } from "@/contexts/ModalsContext"
import { useContext, useEffect } from "react"
import { useLocation } from "react-router-dom"
import CreateCrewModal from "./CreateCrewModal"
import GoodPostureGuidePopupModal from "./GoodPostureGuideModal"
import InviteCrewModal from "./InviteCrewModal"
import JoinCrewModal from "./JoinCrewModal"
import ReportModal from "./ReportModal"
import ToWithdrawModal from "./ToWithdrawModal"
import WithdrawCrewModal from "./WithdrawCrewModal"

export const modals = {
  createCrewModal: CreateCrewModal,
  inviteCrewModal: InviteCrewModal,
  joinCrewModal: JoinCrewModal,
  withdrawCrewModal: WithdrawCrewModal,
  ToWithdrawModal: ToWithdrawModal,
  postureGuideModal: GoodPostureGuidePopupModal,
  reportModal: ReportModal,
}

const Modals = (): React.ReactNode => {
  const openedModals = useContext(ModalsStateContext)
  const { close } = useContext(ModalsDispatchContext)

  const location = useLocation() // 페이지 이동 감지

  // 페이지 이동 시 모든 모달 닫기 (context 상태 초기화)
  useEffect(() => {
    if (openedModals.length > 0) {
      openedModals.forEach((modal) => close(modal.Component))
    }
  }, [location.pathname]) // 경로가 변경될 때마다 실행

  return openedModals.map((modal, index) => {
    const { Component, props } = modal
    if (!props) return null

    const { onSubmit, onClose, ...rest } = props

    const handleClose = async (): Promise<void> => {
      if (typeof onClose === "function") {
        await onClose()
      }
      close(Component)
    }

    const handleSubmit = async (): Promise<void> => {
      if (typeof onSubmit === "function") {
        await onSubmit()
      }
      handleClose()
    }

    // eslint-disable-next-line max-len
    return <Component key={index} onClose={handleClose} onSubmit={handleSubmit} {...rest} />
  })
}
export default Modals
