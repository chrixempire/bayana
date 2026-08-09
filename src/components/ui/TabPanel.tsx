import type { ReactNode } from "react"
import { cn } from "../../lib/utils"

/**
 * Remounts on `activeKey` change so enter CSS can replay for tab/panel swaps.
 */
export function TabPanel({
  activeKey,
  children,
  className,
}: {
  activeKey: string
  children: ReactNode
  className?: string
}) {
  return (
    <div key={activeKey} className={cn("ui-tab-panel-enter", className)}>
      {children}
    </div>
  )
}
