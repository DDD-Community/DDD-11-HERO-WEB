import { ComponentType, createContext } from "react"

export type ModalProps = {
  id?: number
  onClose?: () => void
  onSubmit?: (() => void) | ((value?: string) => void)
}

export type ModalComponent = ComponentType<any>
export type ModalsState = Array<{ Component: ModalComponent; props?: ModalProps }>
export type ModalsDispatch = {
  open: (Component: ModalComponent, props: ModalProps) => void
  close: (Component: ModalComponent) => void
}

export const ModalsStateContext = createContext<ModalsState>([])

export const ModalsDispatchContext = createContext<ModalsDispatch>({
  open: () => {},
  close: () => {},
})
