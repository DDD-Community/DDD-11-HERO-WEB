import {
  ModalsDispatchContext,
  ModalsStateContext,
  ModalsState,
  ModalComponent,
  ModalProps,
} from "@/contexts/ModalsContext"
import { PropsWithChildren, useMemo, useState } from "react"

const ModalsProvider = ({ children }: PropsWithChildren): React.ReactNode => {
  const [openedModals, setOpenedModals] = useState<ModalsState>([])

  const open = (Component: ModalComponent, props: ModalProps): void => {
    console.log(Component, props)
    setOpenedModals((modals) => {
      return [...modals, { Component, props }]
    })
  }

  const close = (Component: ModalComponent): void => {
    setOpenedModals((modals) => {
      return modals.filter((modal) => {
        return modal.Component !== Component
      })
    })
  }

  const dispatch = useMemo(() => ({ open, close }), [])

  return (
    <ModalsStateContext.Provider value={openedModals}>
      <ModalsDispatchContext.Provider value={dispatch}>{children}</ModalsDispatchContext.Provider>
    </ModalsStateContext.Provider>
  )
}
export default ModalsProvider
