import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const checkboxVariants = cva(
  "peer flex shrink-0 items-center justify-center gap-[8px] border transition-all outline-none focus-visible:ring-2 focus-visible:ring-border-input-active focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-100 data-[state=checked]:border-bg-accent data-[state=checked]:bg-bg-accent data-[state=unchecked]:border-border-default-100 data-[state=unchecked]:bg-white data-[state=indeterminate]:border-bg-accent data-[state=indeterminate]:bg-bg-accent disabled:data-[state=checked]:border-transparent disabled:data-[state=checked]:bg-control-disabled-checked disabled:data-[state=unchecked]:border-control-disabled-border disabled:data-[state=unchecked]:bg-white disabled:data-[state=indeterminate]:border-transparent disabled:data-[state=indeterminate]:bg-control-disabled-checked",
  {
    variants: {
      size: {
        default:
          "size-[22px] rounded-[6px] p-[6px] shadow-control-pressed data-[state=unchecked]:shadow-control-elevated disabled:data-[state=checked]:shadow-none disabled:data-[state=indeterminate]:shadow-none disabled:data-[state=unchecked]:shadow-none",
        sm: "size-[16px] rounded-[4px] p-[4px] shadow-control-pressed data-[state=unchecked]:shadow-control-elevated disabled:data-[state=checked]:shadow-none disabled:data-[state=indeterminate]:shadow-none disabled:data-[state=unchecked]:shadow-none",
      },
    },
    defaultVariants: { size: "default" },
  },
)

function CheckIcon({ className, strokeWidth = 3 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M5 12.5 10 17l9-10" />
    </svg>
  )
}

function MinusIcon({ className, strokeWidth = 3 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" className={className} aria-hidden="true">
      <path d="M6 12h12" />
    </svg>
  )
}

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
    VariantProps<typeof checkboxVariants> {}

export function Checkbox({ className, size, disabled, ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root disabled={disabled} className={cn(checkboxVariants({ size }), className)} {...props}>
      <CheckboxPrimitive.Indicator className="flex size-full items-center justify-center text-white">
        {props.checked === "indeterminate" ? (
          <MinusIcon className={size === "sm" ? "size-2" : "size-2.5"} strokeWidth={2.5} />
        ) : (
          <CheckIcon className={size === "sm" ? "size-2" : "size-2.5"} strokeWidth={2.5} />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}
