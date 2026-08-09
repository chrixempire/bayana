import { useEffect, useRef } from "react"
import { CREATE_EVENT_FORM_MAX_WIDTH_PX } from "../../lib/dashboard-layout"
import {
  CREATE_EVENT_INSET_BORDER_CLASS,
  CREATE_EVENT_INSET_PANEL_PADDING,
} from "./create-event-surface-styles"
import { GoogleMeetIcon } from "./icons/GoogleMeetIcon"
import { cn } from "../../lib/utils"

type VirtualGoogleMeetCalloutProps = {
  value: string
  onChange: (value: string) => void
  autoFocus?: boolean
}

export function VirtualGoogleMeetCallout({
  value,
  onChange,
  autoFocus = true,
}: VirtualGoogleMeetCalloutProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!autoFocus) return
    const frame = window.requestAnimationFrame(() => {
      inputRef.current?.focus()
    })
    return () => window.cancelAnimationFrame(frame)
  }, [autoFocus])

  return (
    <div
      className={cn(
        "flex min-h-[70px] w-full items-center gap-2",
        CREATE_EVENT_INSET_BORDER_CLASS,
        "bg-bg-canvas",
        CREATE_EVENT_INSET_PANEL_PADDING,
      )}
      style={{ maxWidth: CREATE_EVENT_FORM_MAX_WIDTH_PX }}
    >
      <GoogleMeetIcon className="size-10 shrink-0" />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="type-create-event-field-label">Google Meet</p>
        <input
          ref={inputRef}
          type="url"
          name="google_meet_link"
          autoComplete="off"
          placeholder="enter google meet"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-label="Google Meet link"
          className="google-meet-link-input w-full border-0 bg-transparent p-0 type-create-event-caption text-text-events-strong outline-none placeholder:text-text-table-header"
        />
      </div>
    </div>
  )
}
