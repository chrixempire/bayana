import type { ReactNode } from "react"
import { cn } from "../../lib/utils"

/** Wraps a pro-only control; clicks open the upgrade modal when not premium. */
export function ProLockedField({
  locked,
  onRequestUpgrade,
  children,
  className,
}: {
  locked: boolean
  onRequestUpgrade: () => void
  children: ReactNode
  className?: string
}) {
  if (!locked) return <>{children}</>

  return (
    <div
      role="presentation"
      className={cn("cursor-pointer", className)}
      onClick={onRequestUpgrade}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          onRequestUpgrade()
        }
      }}
    >
      {children}
    </div>
  )
}
