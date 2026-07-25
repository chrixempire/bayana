import { cn } from "../../../lib/utils"
import { EventIcon } from "../../events/icons/EventIcon"
import { EVENT_ICON_SIZE } from "../../events/icons/event-icon-sizes"

export function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <EventIcon name="down-fill" size={EVENT_ICON_SIZE.meta} className={cn("text-icon-neutral", className)} />
  )
}
