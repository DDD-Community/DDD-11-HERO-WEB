import { ModalComponent, ModalProps, ModalsDispatchContext } from "@/contexts/ModalsContext"
import { useContext } from "react"

interface UseModalResult {
  openModal: (Component: ModalComponent, props: ModalProps) => void
  closeModal: (Component: ModalComponent) => void
}

export const useModals = (): UseModalResult => {
  const { open, close } = useContext(ModalsDispatchContext)

  const openModal = (Component: ModalComponent, props: ModalProps): void => {
    open(Component, props)
  }

  const closeModal = (Component: ModalComponent): void => {
    close(Component)
  }

  return {
    openModal,
    closeModal,
  }
}
