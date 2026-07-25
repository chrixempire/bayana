import { useState } from "react"
import { EventIcon } from "../events/icons/EventIcon"
import { EVENT_ICON_SIZE } from "../events/icons/event-icon-sizes"
import type { DateRange } from "react-day-picker"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import { Calendar } from "../ui/calendar"
import { formatDateRangeDisplay } from "../../lib/create-event-format"
import {
  DATE_RANGE_PRESETS,
  detectPreset,
  formatPickerInputDate,
  getPresetRange,
  isoFromRange,
  rangeFromIso,
  type DateRangePresetId,
} from "../../lib/event-date-range"
import { cn } from "../../lib/utils"

export function CreateEventDateRangeField({
  start,
  end,
  onStartChange,
  onEndChange,
}: {
  start: string
  end: string
  onStartChange: (value: string) => void
  onEndChange: (value: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<DateRange | undefined>()
  const [preset, setPreset] = useState<DateRangePresetId>("custom")

  const display = formatDateRangeDisplay(start, end)
  const { start: draftStart, end: draftEnd } = isoFromRange(draft)

  const openPicker = () => {
    const initial = rangeFromIso(start, end)
    setDraft(initial)
    setPreset(detectPreset(initial))
    setOpen(true)
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      openPicker()
      return
    }
    setOpen(false)
  }

  const handleApply = () => {
    const { start: nextStart, end: nextEnd } = isoFromRange(draft)
    onStartChange(nextStart)
    onEndChange(nextEnd)
    setOpen(false)
  }

  const handlePreset = (id: DateRangePresetId) => {
    setPreset(id)
    if (id === "custom") return
    setDraft(getPresetRange(id))
  }

  const handleSelect = (range: DateRange | undefined) => {
    setDraft(range)
    setPreset("custom")
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange} modal={false}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex h-10 w-full cursor-pointer items-center justify-between rounded-xl border border-border-input-default-200 bg-input-surface px-4 text-left text-sm leading-[22px] shadow-input-default outline-none focus-visible:ring-2 focus-visible:ring-border-input-active focus-visible:ring-offset-2",
            display ? "text-text-events-strong" : "text-input-placeholder",
          )}
        >
          <span>{display || "Choose date(s)"}</span>
          <EventIcon name="calendar-fill" size={EVENT_ICON_SIZE.meta} className="shrink-0" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        collisionPadding={12}
        className="flex w-max max-w-[min(100vw-24px,var(--radix-popover-content-available-width))] overflow-hidden rounded-xl border border-border-default-100 bg-bg-canvas p-0 shadow-[0_8px_24px_rgba(44,50,55,0.12)]"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <nav
          className="flex w-[132px] shrink-0 flex-col gap-1 border-r border-border-default-100 p-3"
          aria-label="Date range presets"
        >
          {DATE_RANGE_PRESETS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={cn(
                "cursor-pointer rounded-lg px-3 py-2 text-left text-sm font-medium leading-[22px] text-text-events-strong transition-colors",
                preset === item.id
                  ? "bg-bg-nav-tab-active text-text-nav-tab-active"
                  : "hover:bg-bg-default-100",
              )}
              onClick={() => handlePreset(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex min-w-0 flex-col">
          <div className="px-4 pt-4">
            <Calendar
              mode="range"
              numberOfMonths={2}
              selected={draft}
              onSelect={handleSelect}
              defaultMonth={draft?.from ?? new Date()}
              captionLayout="dropdown"
              startMonth={new Date(2020, 0)}
              endMonth={new Date(2036, 11)}
              weekStartsOn={0}
            />
          </div>

          <div className="flex flex-wrap items-end justify-between gap-4 border-t border-border-default-100 px-4 py-3">
            <div className="flex flex-wrap gap-4">
              <label className="flex flex-col gap-2">
                <span className="text-xs font-medium leading-5 text-text-table-header">Start</span>
                <div className="flex h-10 min-w-[148px] items-center rounded-xl border border-border-input-default-200 bg-input-surface px-3 text-sm leading-[22px] text-text-events-strong">
                  {formatPickerInputDate(draftStart) || "—"}
                </div>
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-xs font-medium leading-5 text-text-table-header">End</span>
                <div className="flex h-10 min-w-[148px] items-center rounded-xl border border-border-input-default-200 bg-input-surface px-3 text-sm leading-[22px] text-text-events-strong">
                  {formatPickerInputDate(draftEnd) || "—"}
                </div>
              </label>
            </div>

            <div className="flex shrink-0 gap-2">
              <Button
                type="button"
                variant="neutral"
                size="sm"
                className="rounded-xl"
                onClick={() => setOpen(false)}
              >
                Close
              </Button>
              <Button type="button" size="sm" className="rounded-xl" onClick={handleApply}>
                Apply
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
