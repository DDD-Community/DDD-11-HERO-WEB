import { FC } from "react"
import { cn } from "@/utils"
import { ButtonProps } from "./types"
import { ButtonVariants } from "./styles"

export const Button: FC<ButtonProps> = ({ variant, size, fullWidth, children = "button", ...props }) => {
  return (
    <button className={cn(ButtonVariants({ variant, size, fullWidth }))} {...props}>
      {children}
    </button>
  )
}
