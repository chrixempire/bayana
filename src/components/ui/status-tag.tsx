import type { ReactNode } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

/** Figma: Type=Tags, Size=Medium, Colour=Default, State=Outline */
const statusTagVariants = cva(
  "inline-flex max-w-full shrink-0 items-center truncate rounded-lg font-[510]",
  {
    variants: {
      size: {
        medium: "h-6 gap-1 rounded-lg px-2 py-1 text-xs leading-5",
        small: "h-5 gap-1 rounded-md px-1.5 text-[11px] leading-4",
      },
      color: {
        default: "border border-border-default-100 bg-[#EDF0F2] text-text-events-strong",
        accent: "border-0 bg-bg-accent text-text-on-solid-bg",
        dark: "border-0 bg-text-events-strong text-text-on-solid-bg",
      },
    },
    defaultVariants: {
      size: "medium",
      color: "default",
    },
  },
)

export type StatusTagProps = VariantProps<typeof statusTagVariants> & {
  children: ReactNode
  className?: string
}

export function StatusTag({
  children,
  className,
  size = "medium",
  color = "default",
}: StatusTagProps) {
  return (
    <span className={cn(statusTagVariants({ size, color }), className)}>
      {children}
    </span>
  )
}
