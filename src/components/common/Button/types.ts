import { type VariantProps } from "class-variance-authority"
import { ButtonHTMLAttributes, ReactNode } from "react"
import { ButtonVariants } from "./styles"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof ButtonVariants> {
  children?: ReactNode
}
