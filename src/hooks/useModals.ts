import { ModalComponent, ModalProps, ModalsDispatchContext, ModalsStateContext } from "@/contexts/ModalsContext"
import { useContext } from "react"

interface UseModalResult {
  openModal: (Component: ModalComponent, props: ModalProps) => void
  closeModal: (Component: ModalComponent) => void
  isModalOpen: boolean
}

export const useModals = (): UseModalResult => {
  const { open, close } = useContext(ModalsDispatchContext)
  const modalsState = useContext(ModalsStateContext)

  const openModal = (Component: ModalComponent, props: ModalProps): void => {
    open(Component, props)
  }

  const closeModal = (Component: ModalComponent): void => {
    close(Component)
  }

  const isModalOpen = modalsState.length > 0

  return {
    openModal,
    closeModal,
    isModalOpen,
  }
}
