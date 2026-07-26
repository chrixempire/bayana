import { cn } from "../../lib/utils"
import type { VerificationStatus } from "../../pages/dashboard/verification-data"
import { VERIFICATION_STATUS_LABELS } from "../../pages/dashboard/verification-data"

const STATUS_CONFIG: Record<VerificationStatus, { className: string }> = {
  "requires-action": {
    className: "bg-[#e9eefd] text-[#14317f]",
  },
  incomplete: {
    className: "bg-bg-default-100 text-text-events-strong",
  },
  "in-review": {
    className: "bg-[#fef5e8] text-[#88570e]",
  },
  verified: {
    className: "bg-[#e7fbed] text-[#087629]",
  },
  rejected: {
    className: "bg-[#feebef] text-[#861f34]",
  },
}

export function VerificationStatusTag({ status }: { status: VerificationStatus }) {
  const { className } = STATUS_CONFIG[status]
  const label = VERIFICATION_STATUS_LABELS[status]

  return (
    <span
      className={cn(
        "inline-flex h-7 w-fit shrink-0 items-center rounded-lg px-2 py-1.5 text-sm font-[510] leading-[22px]",
        className,
      )}
    >
      {label}
    </span>
  )
}

export function verificationRowShowsNavArrow(status: VerificationStatus) {
  return status === "requires-action" || status === "incomplete"
}
