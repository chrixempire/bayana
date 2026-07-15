import type { ButtonHTMLAttributes, ReactNode } from "react"
import type { VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"
import { buttonVariants } from "./button-variants"

type ButtonFamily = "primary" | "neutral" | "ghost" | "text" | "destructive"

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  variant?: ButtonFamily
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export function Button({
  className,
  variant = "primary",
  size,
  block,
  leftIcon,
  rightIcon,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const resolvedVariant =
    disabled ? (variant === "text" ? "textDisabled" : "disabled") : variant

  return (
    <button
      className={cn(buttonVariants({ variant: resolvedVariant, size, block }), className)}
      disabled={disabled}
      {...props}
    >
      {leftIcon ? <span className="shrink-0">{leftIcon}</span> : null}
      <span>{children}</span>
      {rightIcon ? <span className="shrink-0">{rightIcon}</span> : null}
    </button>
  )
}
