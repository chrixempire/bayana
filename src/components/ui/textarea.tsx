import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"

const textareaVariants = cva(
  "flex w-full gap-3 rounded-[20px] border bg-[var(--color-input-surface)] text-[var(--color-text-default-500)] shadow-[var(--shadow-input-default)] transition-colors focus-within:border-[var(--color-border-input-active)] focus-within:ring-2 focus-within:ring-[rgb(255,122,26,0.12)]",
  {
    variants: {
      state: {
        default: "border-[var(--color-border-input-default-200)]",
        invalid:
          "border-[var(--color-border-input-negative)] bg-[var(--color-bg-negative-soft)] focus-within:border-[var(--color-border-input-negative)] focus-within:ring-[rgb(244,59,97,0.12)]",
      },
      disabled: {
        true: "bg-[var(--color-input-surface-disabled)] text-[var(--color-text-disabled-300)]",
        false: "",
      },
    },
    defaultVariants: {
      state: "default",
      disabled: false,
    },
  },
)

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  leadingAdornment?: React.ReactNode
  invalid?: boolean
}

export function Textarea({
  className,
  leadingAdornment,
  invalid,
  disabled,
  ...props
}: TextareaProps) {
  return (
    <div
      className={cn(textareaVariants({ state: invalid ? "invalid" : "default", disabled }), className)}
    >
      {leadingAdornment ? (
        <span className="pl-3 pt-3 text-[var(--color-icon-neutral)]">{leadingAdornment}</span>
      ) : null}
      <textarea
        className="min-h-[96px] w-full resize-y border-0 bg-transparent p-4 text-sm outline-none placeholder:text-[var(--color-input-placeholder)] disabled:cursor-not-allowed"
        disabled={disabled}
        {...props}
      />
    </div>
  )
}
