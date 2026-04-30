import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"

const inputVariants = cva(
  "flex w-full items-center gap-3 overflow-hidden border bg-input-surface text-text-default-500 shadow-input-default transition-colors focus-within:border-border-input-active focus-within:ring-2 focus-within:ring-[rgb(255,122,26,0.12)]",
  {
    variants: {
      density: {
        comfortable: "rounded-[18px]",
        compact: "rounded-xl",
      },
      state: {
        default: "border-border-input-default-200",
        invalid:
          "border-border-input-negative bg-bg-negative-soft focus-within:border-border-input-negative focus-within:ring-[rgb(244,59,97,0.12)]",
      },
      disabled: {
        true: "bg-input-surface-disabled text-text-disabled-300",
        false: "",
      },
    },
    defaultVariants: {
      density: "comfortable",
      state: "default",
      disabled: false,
    },
  },
)

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  invalid?: boolean
  /** Figma onboarding fields: 12px radius, 40px row height */
  density?: "comfortable" | "compact"
}

export function Input({
  className,
  leftIcon,
  rightIcon,
  invalid,
  disabled,
  density = "comfortable",
  ...props
}: InputProps) {
  return (
    <div
      className={cn(
        inputVariants({ density, state: invalid ? "invalid" : "default", disabled }),
        className,
      )}
    >
      {leftIcon ? <span className="pl-3 text-icon-neutral">{leftIcon}</span> : null}
      <input
        className={cn(
          "w-full border-0 bg-transparent [border-radius:inherit] text-sm leading-[22px] tracking-[-0.1px] outline-none placeholder:text-input-placeholder disabled:cursor-not-allowed",
          density === "compact" ? "h-10 min-h-10 px-4 py-2" : "h-[44px] px-4 py-2",
        )}
        disabled={disabled}
        {...props}
      />
      {rightIcon ? <span className="pr-3 text-icon-neutral">{rightIcon}</span> : null}
    </div>
  )
}
