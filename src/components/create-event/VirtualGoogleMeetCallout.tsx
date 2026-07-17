import { CREATE_EVENT_FORM_MAX_WIDTH_PX } from "../../lib/dashboard-layout"
import {
  CREATE_EVENT_INSET_BORDER_CLASS,
  CREATE_EVENT_INSET_PANEL_PADDING,
} from "./create-event-surface-styles"
import { GoogleMeetIcon } from "./icons/GoogleMeetIcon"
import { cn } from "../../lib/utils"

export function VirtualGoogleMeetCallout() {
  return (
    <div
      className={cn(
        "flex h-[70px] w-full items-center gap-2",
        CREATE_EVENT_INSET_BORDER_CLASS,
        "bg-bg-canvas",
        CREATE_EVENT_INSET_PANEL_PADDING,
      )}
      style={{ maxWidth: CREATE_EVENT_FORM_MAX_WIDTH_PX }}
    >
      <GoogleMeetIcon className="size-10 shrink-0" />
      <div className="flex min-w-0 flex-col gap-0.5">
        <p className="type-create-event-field-label">Google Meet</p>
        <p className="type-create-event-caption">
          Meeting links would be generated for virtual causes
        </p>
      </div>
    </div>
  )
}
