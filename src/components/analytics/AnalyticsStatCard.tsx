import { EventIcon } from "../events/icons/EventIcon"
import { elevatedCardSurfaceClassName } from "../events/detail/detail-primitives"
import { cn } from "../../lib/utils"
import type { StatCard } from "../../pages/dashboard/analytics-data"

export type MetricCard = StatCard & {
  emptyValue?: string
}

/** Figma Analytics overview card — 128px metric tile with delta footer. */
export function AnalyticsStatCard({
  card,
  empty,
  embedded = false,
}: {
  card: MetricCard
  empty: boolean
  /** Render inside a parent card (no elevated surface). */
  embedded?: boolean
}) {
  const displayValue = empty ? (card.emptyValue ?? (card.star ? "0.0" : "0")) : card.value
  const displayDelta = empty ? "0.0%" : card.delta

  return (
    <div
      className={cn(
        "flex min-w-0 flex-1 flex-col gap-3 p-4",
        !embedded && elevatedCardSurfaceClassName,
      )}
    >
      <span className="truncate text-sm font-[510] leading-[22px] text-text-table-header">{card.label}</span>
      <div className="flex items-center gap-1">
        <span className="truncate font-display text-xl font-semibold leading-7 text-text-events-strong">
          {displayValue}
        </span>
        {card.star ? (
          <EventIcon name={empty ? "star-fill" : "star-fill-accent"} size={16} className="shrink-0" />
        ) : null}
      </div>
      <div className="flex gap-1.5 text-sm leading-[22px] tracking-[-0.1px]">
        <span
          className={cn(
            empty ? "text-text-table-header" : card.trend === "up" ? "text-text-success" : "text-text-negative",
          )}
        >
          {displayDelta}
        </span>
        <span className="text-text-table-header">from last 30 days</span>
      </div>
    </div>
  )
}
