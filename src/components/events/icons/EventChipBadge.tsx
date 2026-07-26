import type { ReactNode } from "react"
import { cn } from "../../../lib/utils"
import { EventIcon, type EventIconName } from "./EventIcon"
import { EVENT_ICON_SIZE } from "./event-icon-sizes"

/** Figma Tags & Chip with optional leading icon and check marks (12px). */
export function EventChipBadge({
  children,
  className,
  leadingIcon,
  flankingChecks = false,
}: {
  children: ReactNode
  className?: string
  leadingIcon?: EventIconName
  flankingChecks?: boolean
}) {
  const checkSize = EVENT_ICON_SIZE.statusBadge

  function ChipCheckIcon({ name }: { name: "check-fill-white" | "check-fill-grey" }) {
    return (
      <span className="inline-flex size-3 rotate-45 items-center justify-center overflow-hidden">
        <EventIcon name={name} size={checkSize} />
      </span>
    )
  }

  return (
    <span
      className={cn(
        "inline-flex h-6 w-fit items-center gap-1 self-start rounded-lg px-2 py-1 text-xs font-medium leading-5",
        className,
      )}
    >
      {flankingChecks ? (
        <ChipCheckIcon name="check-fill-white" />
      ) : leadingIcon === "check-fill-white" || leadingIcon === "check-fill-grey" ? (
        <ChipCheckIcon name={leadingIcon} />
      ) : leadingIcon ? (
        <EventIcon name={leadingIcon} size={checkSize} />
      ) : null}
      {children}
      {flankingChecks ? <ChipCheckIcon name="check-fill-white" /> : null}
    </span>
  )
}

export type EventCollabBadgeVariant = "new-request" | "organizer" | "pending"

const COLLAB_BADGE_CONFIG: Record<
  EventCollabBadgeVariant,
  { label: string; className: string; flankingChecks?: boolean }
> = {
  "new-request": {
    label: "New request",
    className: "bg-bg-accent text-text-on-solid-bg",
  },
  organizer: {
    label: "Organizer",
    className: "bg-text-events-strong text-text-on-solid-bg",
  },
  pending: {
    label: "Pending",
    className: "bg-bg-accent text-text-on-solid-bg",
    flankingChecks: true,
  },
}

export function EventCollabBadge({ variant }: { variant: EventCollabBadgeVariant }) {
  const config = COLLAB_BADGE_CONFIG[variant]

  return (
    <EventChipBadge className={config.className} flankingChecks={config.flankingChecks}>
      {config.label}
    </EventChipBadge>
  )
}
