import { EventIcon } from "../events/icons/EventIcon"
import { EVENT_ICON_SIZE } from "../events/icons/event-icon-sizes"

export function CreateEventFieldHint({ children }: { children: string }) {
  return (
    <p className="flex items-start gap-1.5 text-xs font-normal leading-5 tracking-[-0.1px] text-text-table-header">
      <EventIcon name="info-fill" size={EVENT_ICON_SIZE.fieldHint} className="mt-0.5 shrink-0" aria-hidden />
      <span>{children}</span>
    </p>
  )
}
