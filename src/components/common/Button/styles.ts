// styles.ts
import { cva } from "class-variance-authority"

export const ButtonVariants = cva(
  "flex gap-2 items-center justify-center rounded-[40px] font-semibold transition-colors disabled:bg-zinc-400 disabled:text-white-900 disabled:cursor-auto disabled:hover:bg-zinc-400 disabled:hover:text-white",
  {
    variants: {
      variant: {
        solid_blue: "bg-align_blue-500 text-white hover:bg-[#0061F5] hover:text-zinc-300 border border-transparent",
        solid_white: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 border border-transparent",
        solid_black: "bg-zinc-800 text-white hover:bg-zinc-900 hover:text-zinc-300 border border-transparent",
        outlined: "bg-white text-zinc-800 border border-gray-200 hover:bg-gray-100 box-border",
      },
      size: {
        large: "text-lg leading-6 h-14 px-[57px]",
        medium: "text-base leading-6 h-12 px-[50px]",
        small: "text-[13px] leading-6 h-10 px-[41px]",
        xsmall: "text-[13px] leading-6 h-8 px-[30px]",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "solid_blue",
      size: "large",
    },
  }
)
