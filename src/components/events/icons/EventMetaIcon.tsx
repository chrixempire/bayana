import type { EventDetailMetaRow } from "../../../pages/dashboard/event-detail-types"
import { EventIcon, type EventIconName } from "./EventIcon"
import { EVENT_ICON_SIZE } from "./event-icon-sizes"

const META_ICON_MAP: Record<EventDetailMetaRow["icon"], EventIconName> = {
  calendar: "calendar-fill",
  volunteers: "group-fill",
  visibility: "earth-neutral-fill",
  type: "briefcase-fill",
  contact: "seal-fill",
  updated: "pencil-fill",
  "donation-type": "flag-2-fill",
  "target-amount": "wallet-2-fill-neutral",
  items: "box-3-fill",
  collaborator: "seal-fill",
}

type EventMetaIconProps = {
  icon: EventDetailMetaRow["icon"]
  isPrivate?: boolean
  size?: number
}

export function EventMetaIcon({ icon, isPrivate = false, size = EVENT_ICON_SIZE.meta }: EventMetaIconProps) {
  if (icon === "visibility") {
    return (
      <EventIcon
        name={isPrivate ? "lock-fill-red" : "earth-neutral-fill"}
        size={size}
      />
    )
  }

  return <EventIcon name={META_ICON_MAP[icon]} size={size} />
}
