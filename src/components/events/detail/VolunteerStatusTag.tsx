import { cn } from "../../../lib/utils"
import type { VolunteerStatus } from "../../../pages/dashboard/event-detail-types"

const STATUS_CONFIG: Record<VolunteerStatus, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-bg-warning-soft text-text-warning" },
  accepted: { label: "Accepted", className: "bg-bg-success-soft text-text-success" },
  waitlist: { label: "Waitlist", className: "bg-bg-info-soft text-text-info" },
}

export function VolunteerStatusTag({ status }: { status: VolunteerStatus }) {
  const { label, className } = STATUS_CONFIG[status]
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-lg px-2 text-xs font-[510] leading-4",
        className,
      )}
    >
      {label}
    </span>
  )
}
