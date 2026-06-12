import { cn } from "../../lib/utils"

export type EventsProgressBadgeProps = {
  current: number
  total: number
  label: string
  className?: string
}

export function EventsProgressBadge({ current, total, label, className }: EventsProgressBadgeProps) {
  const percent = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0

  return (
    <div
      className={cn(
        "inline-flex min-w-[108px] flex-col gap-1.5 rounded-lg bg-bg-accent-soft px-3 py-2",
        className,
      )}
    >
      <span className="type-events-progress text-center">
        {current} / {total} {label}
      </span>
      <div className="h-1 w-full overflow-hidden rounded-full bg-bg-canvas">
        <div
          className="h-full rounded-full bg-bg-accent transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
