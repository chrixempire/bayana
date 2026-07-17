import type { ReactNode } from "react"
import { cn } from "../../lib/utils"
import { CREATE_EVENT_FORM_MAX_WIDTH_PX } from "../../lib/dashboard-layout"

/** 452px form column — inputs, chips, uploaders, and actions share this width. */
export function CreateEventFormColumn({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn("flex w-full min-w-0 shrink-0 flex-col gap-4", className)}
      style={{ maxWidth: CREATE_EVENT_FORM_MAX_WIDTH_PX }}
    >
      {children}
    </div>
  )
}
