import { cn } from "../../../lib/utils"
import type { VolunteerStatus } from "../../../pages/dashboard/event-detail-types"
import { EventIcon } from "../icons/EventIcon"
import { EVENT_ICON_SIZE } from "../icons/event-icon-sizes"

const STATUS_CONFIG: Record<
  VolunteerStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-[#fef5e8] text-[#88570e]",
  },
  accepted: {
    label: "Accepted",
    className: "bg-bg-success-soft text-text-success",
  },
  waitlist: {
    label: "Waitlist",
    className: "bg-bg-info-soft text-text-info",
  },
}

export function VolunteerStatusTag({ status }: { status: VolunteerStatus }) {
  const { label, className } = STATUS_CONFIG[status]
  const iconSize = EVENT_ICON_SIZE.statusBadge

  return (
    <span
      className={cn(
        "inline-flex h-6 shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium leading-5",
        className,
      )}
    >
      <EventIcon name="add-circle-fill" size={iconSize} />
      <span className="px-0.5">{label}</span>
      <EventIcon name="add-circle-fill" size={iconSize} />
    </span>
  )
}
