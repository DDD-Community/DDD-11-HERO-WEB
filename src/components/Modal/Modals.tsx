import { ModalsDispatchContext, ModalsStateContext } from "@/contexts/ModalsContext"
import { useContext } from "react"
import CreateCrewModal from "./CreateCrewModal"
import InviteCrewModal from "./InviteCrewModal"
import JoinCrewModal from "./JoinCrewModal"
import WithdrawCrewModal from "./WithdrawCrewModal"
import ToWithdrawModal from "./ToWithdrawModal"

export const modals = {
  createCrewModal: CreateCrewModal,
  inviteCrewModal: InviteCrewModal,
  joinCrewModal: JoinCrewModal,
  withdrawCrewModal: WithdrawCrewModal,
  ToWithdrawModal: ToWithdrawModal,
}

const Modals = (): React.ReactNode => {
  const openedModals = useContext(ModalsStateContext)
  const { close } = useContext(ModalsDispatchContext)

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
