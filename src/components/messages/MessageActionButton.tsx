import type { ReactNode } from "react"
import { cn } from "../../lib/utils"

type MessageActionButtonProps = {
  children: ReactNode
  leadingIcon?: ReactNode
  onClick?: () => void
  className?: string
  destructive?: boolean
}

/** Figma neutral chip button — leading icon and label. */
export function MessageActionButton({
  children,
  leadingIcon,
  onClick,
  className,
  destructive = false,
}: MessageActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-[10px] bg-button-neutral px-3 text-sm font-semibold leading-[22px] shadow-button-neutral transition-colors hover:bg-button-neutral-hover",
        destructive ? "text-text-negative" : "text-text-events-strong",
        className,
      )}
    >
      {leadingIcon}
      {children}
    </button>
  )
}
