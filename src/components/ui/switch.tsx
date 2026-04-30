import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const switchVariants = cva(
  "peer flex shrink-0 cursor-pointer items-center leading-none rounded-[6px] border-0 transition-all outline-none focus-visible:ring-2 focus-visible:ring-border-input-active focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-100 data-[state=checked]:bg-bg-accent data-[state=unchecked]:bg-bg-active-200 disabled:data-[state=checked]:bg-switch-disabled-checked disabled:data-[state=unchecked]:bg-switch-disabled-unchecked",
  {
    variants: {
      size: {
        default: "h-[22px] w-[40px] gap-[2px] p-[3px]",
        sm: "h-[18px] w-[32px] gap-[2px] p-[2px] rounded-[5px]",
      },
    },
    defaultVariants: { size: "default" },
  },
)

const thumbVariants = cva(
  "pointer-events-none flex shrink-0 items-center justify-center bg-white font-semibold shadow-control-elevated transition-transform data-[state=unchecked]:translate-x-0",
  {
    variants: {
      size: {
        default: "size-4 rounded-[3px] data-[state=checked]:translate-x-[18px]",
        sm: "size-[14px] rounded-[2px] data-[state=checked]:translate-x-[14px]",
      },
    },
    defaultVariants: { size: "default" },
  },
)

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M5 12.5 10 17l9-10" />
    </svg>
  )
}

function CrossIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className={className} aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  )
}

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>,
    VariantProps<typeof switchVariants> {}

export function Switch({ className, size, checked, disabled, ...props }: SwitchProps) {
  const iconColor = disabled
    ? "text-text-disabled-300"
    : checked
      ? "text-bg-accent"
      : "text-control-muted"

  return (
    <SwitchPrimitive.Root checked={checked} disabled={disabled} className={cn(switchVariants({ size }), className)} {...props}>
      <SwitchPrimitive.Thumb className={cn(thumbVariants({ size }), iconColor)}>
        {checked ? <CheckIcon className={size === "sm" ? "size-2.5" : "size-3"} /> : <CrossIcon className={size === "sm" ? "size-2.5" : "size-3"} />}
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  )
}
