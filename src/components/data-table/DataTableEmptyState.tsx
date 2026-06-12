import type { ReactNode } from "react"
import { EventsTableEmptyIllustration } from "../events/EventsTableEmptyIllustration"
import { cn } from "../../lib/utils"

export type DataTableEmptyStateProps = {
  title: string
  description?: string
  illustration?: ReactNode
  /** Grow to fill the parent table body area. */
  fill?: boolean
  className?: string
}

export function DataTableEmptyState({
  title,
  description,
  illustration,
  fill = false,
  className,
}: DataTableEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 px-6 py-12 text-center",
        fill ? "min-h-0 flex-1" : "min-h-[280px] py-20",
        className,
      )}
    >
      {illustration ?? <EventsTableEmptyIllustration />}
      <div className="flex max-w-sm flex-col gap-1">
        <p className="type-events-empty-title">{title}</p>
        {description ? <p className="type-events-empty-description">{description}</p> : null}
      </div>
    </div>
  )
}
