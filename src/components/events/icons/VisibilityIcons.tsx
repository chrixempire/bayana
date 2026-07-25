import { EventIcon } from "./EventIcon"
import { EVENT_ICON_SIZE } from "./event-icon-sizes"

type IconProps = {
  className?: string
}

export function PublicVisibilityIcon({ className }: IconProps) {
  return <EventIcon name="earth-fill" size={EVENT_ICON_SIZE.tableVisibility} className={className} />
}

export function PrivateVisibilityIcon({ className }: IconProps) {
  return <EventIcon name="lock-fill-red" size={EVENT_ICON_SIZE.tableVisibility} className={className} />
}

export function DraftsVisibilityIcon({ className }: IconProps) {
  return <EventIcon name="draft-fill" size={EVENT_ICON_SIZE.tableVisibility} className={className} />
}
