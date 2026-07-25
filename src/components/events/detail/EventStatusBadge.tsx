import { cn } from "../../../lib/utils"
import type { EventDetailStatus } from "../../../pages/dashboard/event-detail-types"
import { EventChipBadge } from "../icons/EventChipBadge"
import type { EventIconName } from "../icons/EventIcon"

const STATUS_CONFIG: Record<
  EventDetailStatus,
  {
    className: string
    leadingIcon?: EventIconName
    flankingChecks?: boolean
    trailingCheck?: boolean
  }
> = {
  active: {
    className: "bg-bg-accent text-text-on-solid-bg",
    leadingIcon: "live-location-fill",
    trailingCheck: true,
  },
  upcoming: {
    className: "bg-[#f79e19] text-text-on-solid-bg",
    flankingChecks: true,
  },
  completed: {
    className: "bg-[#36b55c] text-text-on-solid-bg",
    leadingIcon: "check-fill-white",
  },
  "fully-fulfilled": {
    className: "bg-[#36b55c] text-text-on-solid-bg",
    leadingIcon: "check-fill-white",
  },
  draft: {
    className: "bg-bg-active-200 text-text-events-strong",
    leadingIcon: "pencil-fill",
  },
}

export function EventStatusBadge({
  status,
  label,
}: {
  status: EventDetailStatus
  label: string
}) {
  const config = STATUS_CONFIG[status]

  return (
    <EventChipBadge
      className={cn(config.className)}
      leadingIcon={config.leadingIcon}
      flankingChecks={config.flankingChecks}
      trailingCheck={config.trailingCheck}
    >
      {label}
    </EventChipBadge>
  )
}
