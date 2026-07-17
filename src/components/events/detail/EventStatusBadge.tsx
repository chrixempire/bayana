import { Activity, CircleCheck, Clock, PencilLine } from "lucide-react"
import { cn } from "../../../lib/utils"
import type { EventDetailStatus } from "../../../pages/dashboard/event-detail-types"

const STATUS_CONFIG: Record<
  EventDetailStatus,
  { icon: typeof Activity; className: string }
> = {
  active: { icon: Activity, className: "bg-bg-accent text-text-on-solid-bg" },
  upcoming: { icon: Clock, className: "bg-bg-accent text-text-on-solid-bg" },
  completed: { icon: CircleCheck, className: "bg-[#36b55c] text-text-on-solid-bg" },
  "fully-fulfilled": { icon: CircleCheck, className: "bg-[#36b55c] text-text-on-solid-bg" },
  draft: { icon: PencilLine, className: "bg-bg-active-200 text-text-events-strong" },
}

export function EventStatusBadge({
  status,
  label,
}: {
  status: EventDetailStatus
  label: string
}) {
  const { icon: Icon, className } = STATUS_CONFIG[status]

  return (
    <span
      className={cn(
        "inline-flex h-6 w-fit items-center gap-1 self-start rounded-lg px-2 py-1 text-xs font-[510] leading-5",
        className,
      )}
    >
      <Icon className="size-3" strokeWidth={2.25} />
      {label}
    </span>
  )
}
