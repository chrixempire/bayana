import { cn } from "../../lib/utils"
import type { VerificationStatus } from "../../pages/dashboard/verification-data"
import { VERIFICATION_STATUS_LABELS } from "../../pages/dashboard/verification-data"
import { EventIcon } from "../events/icons/EventIcon"
import { EVENT_ICON_SIZE } from "../events/icons/event-icon-sizes"

const STATUS_CONFIG: Record<
  VerificationStatus,
  { className: string; withIcons: boolean }
> = {
  "requires-action": {
    className: "bg-[#e9eefd] text-[#14317f]",
    withIcons: true,
  },
  incomplete: {
    className: "bg-bg-default-100 text-text-events-strong",
    withIcons: false,
  },
  "in-review": {
    className: "bg-[#fef5e8] text-[#88570e]",
    withIcons: true,
  },
  verified: {
    className: "bg-[#e7fbed] text-[#087629]",
    withIcons: true,
  },
  rejected: {
    className: "bg-[#feebef] text-[#861f34]",
    withIcons: true,
  },
}

export function VerificationStatusTag({ status }: { status: VerificationStatus }) {
  const { className, withIcons } = STATUS_CONFIG[status]
  const label = VERIFICATION_STATUS_LABELS[status]
  const iconSize = EVENT_ICON_SIZE.statusBadge

  return (
    <span
      className={cn(
        "inline-flex h-6 shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-[510] leading-5",
        className,
      )}
    >
      {withIcons ? <EventIcon name="add-circle-fill" size={iconSize} /> : null}
      <span className={withIcons ? "px-0.5" : undefined}>{label}</span>
      {withIcons ? <EventIcon name="add-circle-fill" size={iconSize} /> : null}
    </span>
  )
}

export function verificationRowShowsNavArrow(status: VerificationStatus) {
  return status === "requires-action" || status === "incomplete"
}
