import { cn } from "../../../lib/utils"
import { EventIcon } from "../../events/icons/EventIcon"
import { EVENT_ICON_SIZE } from "../../events/icons/event-icon-sizes"

export function ContinueArrowIcon({ className }: { className?: string }) {
  return (
    <EventIcon
      name="arrow-right-fill"
      size={EVENT_ICON_SIZE.meta}
      inverted
      className={cn(className)}
    />
  )
}
