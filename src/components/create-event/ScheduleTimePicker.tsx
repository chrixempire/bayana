import { useCallback, useEffect, useRef, useState } from "react"
import { useAnchorWidth } from "../../hooks/use-anchor-width"
import { formatTime12h } from "../../lib/create-event-format"
import {
  clampHour12,
  clampMinute,
  formatClockDisplay,
  parseTime24OrDefault,
  toTime24,
  type ClockTimeParts,
  type TimePeriod,
} from "../../lib/time-picker"
import { cn } from "../../lib/utils"
import { EventIcon } from "../events/icons/EventIcon"
import { EVENT_ICON_SIZE } from "../events/icons/event-icon-sizes"
import { Button } from "../ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { ClockTimePickerFace } from "./ClockTimePickerFace"
import {
  CREATE_EVENT_DROPDOWN_PANEL_CLASS,
  CREATE_EVENT_DROPDOWN_SHADOW,
} from "./create-event-dropdown-styles"

type ClockMode = "hours" | "minutes"

type ScheduleTimePickerProps = {
  value: string
  onChange: (value: string) => void
  ariaLabel: string
  placeholder?: string
}

function PeriodToggle({
  value,
  onChange,
}: {
  value: TimePeriod
  onChange: (period: TimePeriod) => void
}) {
  return (
    <div className="inline-flex rounded-lg border border-border-default-100 bg-bg-default-100 p-0.5">
      {(["AM", "PM"] as const).map((period) => (
        <button
          key={period}
          type="button"
          className={cn(
            "min-w-[42px] cursor-pointer rounded-md px-2.5 py-1 text-xs font-semibold leading-5 transition-colors",
            value === period
              ? "bg-bg-canvas text-text-events-strong shadow-button-neutral"
              : "text-text-table-header hover:text-text-events-strong",
          )}
          onClick={() => onChange(period)}
        >
          {period}
        </button>
      ))}
    </div>
  )
}

export function ScheduleTimePicker({
  value,
  onChange,
  ariaLabel,
  placeholder = "Select time",
}: ScheduleTimePickerProps) {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<ClockMode>("hours")
  const [draft, setDraft] = useState<ClockTimeParts>(() => parseTime24OrDefault(value))
  const anchorRef = useRef<HTMLDivElement>(null)
  const panelWidth = useAnchorWidth(open, anchorRef)

  const displayLabel = value ? formatTime12h(value) : ""

  const syncDraftFromValue = useCallback(() => {
    setDraft(parseTime24OrDefault(value))
    setMode("hours")
  }, [value])

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) syncDraftFromValue()
    setOpen(nextOpen)
  }

  const applyDraft = () => {
    onChange(toTime24(draft))
    setOpen(false)
  }

  useEffect(() => {
    if (!open) syncDraftFromValue()
  }, [open, syncDraftFromValue])

  return (
    <Popover open={open} onOpenChange={handleOpenChange} modal={false}>
      <div ref={anchorRef} className="min-w-0 flex-1">
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label={ariaLabel}
            className={cn(
              "flex h-10 w-full cursor-pointer items-center justify-between rounded-xl border border-border-input-default-200 bg-input-surface px-4 text-left text-sm leading-[22px] shadow-input-default outline-none focus-visible:ring-2 focus-visible:ring-border-input-active focus-visible:ring-offset-2",
              displayLabel ? "text-text-events-strong" : "text-input-placeholder",
            )}
          >
            <span className="min-w-0 truncate">{displayLabel || placeholder}</span>
            <EventIcon name="time-fill" size={EVENT_ICON_SIZE.meta} className="shrink-0" aria-hidden />
          </button>
        </PopoverTrigger>
      </div>

      <PopoverContent
        style={panelWidth ? { width: Math.max(panelWidth, 300) } : { width: 300 }}
        className={cn(CREATE_EVENT_DROPDOWN_PANEL_CLASS, CREATE_EVENT_DROPDOWN_SHADOW, "p-3")}
        role="dialog"
        aria-label={ariaLabel}
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3 px-1">
            <div className="flex min-w-0 items-center gap-1.5">
              <label className="sr-only" htmlFor={`${ariaLabel}-hour`}>
                Hour
              </label>
              <input
                id={`${ariaLabel}-hour`}
                type="number"
                min={1}
                max={12}
                value={draft.hour12}
                onFocus={() => setMode("hours")}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, hour12: clampHour12(Number(event.target.value)) }))
                }
                className={cn(
                  "w-11 rounded-lg border bg-input-surface px-2 py-1.5 text-center text-lg font-semibold leading-7 text-text-events-strong outline-none focus-visible:ring-2 focus-visible:ring-border-input-active",
                  mode === "hours"
                    ? "border-bg-accent ring-2 ring-border-input-active/20"
                    : "border-border-input-default-200",
                )}
              />
              <span className="text-lg font-semibold leading-7 text-text-table-header">:</span>
              <label className="sr-only" htmlFor={`${ariaLabel}-minute`}>
                Minute
              </label>
              <input
                id={`${ariaLabel}-minute`}
                type="number"
                min={0}
                max={59}
                value={draft.minute}
                onFocus={() => setMode("minutes")}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, minute: clampMinute(Number(event.target.value)) }))
                }
                className={cn(
                  "w-11 rounded-lg border bg-input-surface px-2 py-1.5 text-center text-lg font-semibold leading-7 text-text-events-strong outline-none focus-visible:ring-2 focus-visible:ring-border-input-active",
                  mode === "minutes"
                    ? "border-bg-accent ring-2 ring-border-input-active/20"
                    : "border-border-input-default-200",
                )}
              />
            </div>
            <PeriodToggle
              value={draft.period}
              onChange={(period) => setDraft((prev) => ({ ...prev, period }))}
            />
          </div>

          <p className="px-1 text-center text-xs leading-5 text-text-table-header">
            {formatClockDisplay(draft)} · {mode === "hours" ? "Pick an hour" : "Pick minutes (e.g. 1:22 PM)"}
          </p>

          <ClockTimePickerFace
            parts={draft}
            mode={mode}
            onModeChange={setMode}
            onChange={setDraft}
          />

          <Button type="button" variant="primary" className="h-10 w-full rounded-xl" onClick={applyDraft}>
            Done
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
