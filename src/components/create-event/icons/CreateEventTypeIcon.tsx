import type { CreateEventType } from "../../../lib/create-event-paths"
import { cn } from "../../../lib/utils"

const ICON_SRC: Record<CreateEventType, string> = {
  cause: "/create-event/cause-icon.svg",
  needs: "/create-event/needs-icon.svg",
}

export function CreateEventTypeIcon({
  type,
  className,
}: {
  type: CreateEventType
  className?: string
}) {
  return (
    <img
      src={ICON_SRC[type]}
      alt=""
      className={cn("size-4 shrink-0", className)}
      width={16}
      height={16}
    />
  )
}
