import type { ReactNode } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

/** Figma: Type=Tags, Size=Medium, Colour=Default, State=Outline */
const statusTagVariants = cva(
  "inline-flex max-w-full shrink-0 items-center truncate rounded-lg border border-border-default-100 bg-[#EDF0F2] font-[510] text-text-events-strong",
  {
    variants: {
      size: {
        medium: "h-6 gap-1 px-2 py-1 text-xs leading-4",
      },
      color: {
        default: "",
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
