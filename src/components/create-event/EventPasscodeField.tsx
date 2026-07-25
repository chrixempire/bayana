import { useState } from "react"
import { EventIcon } from "../events/icons/EventIcon"
import { EVENT_ICON_SIZE } from "../events/icons/event-icon-sizes"
import { Input } from "../ui/input"
import { generateEventPasscode } from "../../lib/event-passcode"

export function EventPasscodeField({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="flex flex-col gap-2">
      <Input
        density="compact"
        type={visible ? "text" : "password"}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Enter passcode for volunteer required from volunteers"
        autoComplete="off"
        rightIcon={
          <button
            type="button"
            className="cursor-pointer text-icon-neutral"
            aria-label={visible ? "Hide passcode" : "Show passcode"}
            onClick={() => setVisible((show) => !show)}
          >
            {visible ? (
              <EventIcon name="lock-fill-red" size={EVENT_ICON_SIZE.meta} />
            ) : (
              <EventIcon name="eye-fill" size={EVENT_ICON_SIZE.meta} />
            )}
          </button>
        }
      />
      <button
        type="button"
        className="inline-flex w-fit cursor-pointer items-center gap-1.5 text-sm font-medium leading-[22px] text-text-nav-tab-active"
        onClick={() => onChange(generateEventPasscode())}
      >
        <EventIcon name="sparkles-fill" size={EVENT_ICON_SIZE.fieldHint} className="shrink-0" aria-hidden />
        Auto-generate passcode
      </button>
    </div>
  )
}
