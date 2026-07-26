import { useState } from "react"
import type { DateRange } from "react-day-picker"
import { cn } from "../../lib/utils"
import { EventIcon } from "../events/icons/EventIcon"
import { EVENT_ICON_SIZE } from "../events/icons/event-icon-sizes"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Calendar } from "../ui/calendar"
import { Button } from "../ui/button"
import {
  dashboardNeutralDropdownTriggerClassName,
  dropdownTriggerOpenClassName,
} from "../../lib/dropdown-trigger-styles"
import {
  formatDateRange,
  resolveDatePreset,
  type ResolvedDateRange,
} from "../../lib/event-date-filters"

export type DateRangeFilterProps = {
  label: string
  /** Preset options (e.g. "Any start date", "Today", …, "Custom range"). */
  options: string[]
  /** Current display label. */
  value: string
  onChange: (label: string, range: ResolvedDateRange | null) => void
  className?: string
  /** Disable dates before this day (e.g. an End date can't precede the Start date). */
  minDate?: Date | null
  /** Disable dates after this day (e.g. a Start date can't follow the End date). */
  maxDate?: Date | null
  /** Figma events filter chip — optional add-circle + label + down-fill, 32px tall. */
  appearance?: "default" | "events"
  /** When `appearance` is `events`, hide the leading add-circle icon. */
  showLeadingIcon?: boolean
}

export function DateRangeFilter({
  label,
  options,
  value,
  onChange,
  className,
  minDate,
  maxDate,
  appearance = "default",
  showLeadingIcon = true,
}: DateRangeFilterProps) {
  const [open, setOpen] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [range, setRange] = useState<DateRange | undefined>()
  const isEvents = appearance === "events"
  const showEventsLeadingIcon = isEvents && showLeadingIcon

  const anyOption = options[0]
  const isActive = value !== label && value !== anyOption
  const displayValue = isActive ? value : label

  const close = () => {
    setOpen(false)
    setShowCalendar(false)
  }

  const pickPreset = (option: string) => {
    if (option === "Custom range") {
      setShowCalendar(true)
      return
    }
    onChange(option, resolveDatePreset(option))
    close()
  }

  const applyCustom = () => {
    if (range?.from) {
      onChange(formatDateRange(range.from, range.to), {
        from: range.from,
        to: range.to ?? range.from,
      })
    }
    close()
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) setShowCalendar(false)
      }}
    >
      <PopoverTrigger
        className={cn(
          isEvents
            ? cn(
                dashboardNeutralDropdownTriggerClassName,
                dropdownTriggerOpenClassName,
                isActive && "border-border-input-active",
              )
            : cn(
                "type-events-filter inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border bg-input-surface px-3 shadow-input-default outline-none hover:bg-bg-on-canvas focus-visible:ring-2 focus-visible:ring-border-input-active focus-visible:ring-offset-2",
                dropdownTriggerOpenClassName,
              ),
          !isEvents && (isActive ? "border-border-input-active" : "border-border-input-default-200"),
          className,
        )}
      >
        {isEvents ? (
          <>
            {showEventsLeadingIcon ? (
              <EventIcon name="add-circle-fill" size={EVENT_ICON_SIZE.buttonLeading} />
            ) : null}
            <span className="max-w-[160px] truncate">{displayValue}</span>
            {!showEventsLeadingIcon ? (
              <EventIcon
                name="down-fill"
                size={EVENT_ICON_SIZE.buttonTrailing}
                className="shrink-0 text-icon-neutral"
              />
            ) : null}
            {isActive ? (
              <span
                role="button"
                tabIndex={0}
                aria-label={`Clear ${label}`}
                className="inline-flex shrink-0 items-center justify-center rounded-full p-0.5 text-icon-neutral transition-colors hover:bg-bg-default-100 hover:text-text-events-strong"
                onPointerDown={(event) => {
                  event.stopPropagation()
                  event.preventDefault()
                }}
                onClick={(event) => {
                  event.stopPropagation()
                  event.preventDefault()
                  setRange(undefined)
                  onChange(anyOption, null)
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    setRange(undefined)
                    onChange(anyOption, null)
                  }
                }}
              >
                <EventIcon name="close-fill" size={14} />
              </span>
            ) : null}
          </>
        ) : (
          <>
            <span className="max-w-[160px] truncate">{displayValue}</span>
            {isActive ? (
              <span
                role="button"
                tabIndex={0}
                aria-label={`Clear ${label}`}
                className="inline-flex shrink-0 items-center justify-center rounded-full p-0.5 text-icon-neutral transition-colors hover:bg-bg-default-100 hover:text-text-events-strong"
                onPointerDown={(event) => {
                  event.stopPropagation()
                  event.preventDefault()
                }}
                onClick={(event) => {
                  event.stopPropagation()
                  event.preventDefault()
                  setRange(undefined)
                  onChange(anyOption, null)
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    setRange(undefined)
                    onChange(anyOption, null)
                  }
                }}
              >
                <EventIcon name="close-fill" size={14} />
              </span>
            ) : (
              <EventIcon name="down-fill" size={EVENT_ICON_SIZE.buttonTrailing} className="shrink-0 text-icon-neutral" />
            )}
          </>
        )}
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-auto min-w-[12rem] overflow-hidden rounded-xl border border-border-default-100 bg-bg-dropdown-modal p-1 text-text-default-500 shadow-[0_8px_24px_rgba(44,50,55,0.12)]"
      >
        {showCalendar ? (
          <div className="flex flex-col gap-2 p-2">
            <Calendar
              mode="range"
              selected={range}
              onSelect={setRange}
              numberOfMonths={1}
              captionLayout="dropdown"
              disabled={[
                ...(minDate ? [{ before: minDate }] : []),
                ...(maxDate ? [{ after: maxDate }] : []),
              ]}
            />
            <div className="flex items-center justify-end gap-2 border-t border-border-default-100 pt-2">
              <Button
                variant="neutral"
                size="sm"
                className="h-8 min-h-8 rounded-[10px]"
                onClick={() => setShowCalendar(false)}
              >
                Back
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="h-8 min-h-8 rounded-[10px]"
                disabled={!range?.from}
                onClick={applyCustom}
              >
                Apply
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => pickPreset(option)}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-2 rounded-lg px-2 py-2 text-left text-sm outline-none transition-colors hover:bg-bg-default-100",
                  value === option && "bg-bg-accent-soft font-medium text-bg-accent",
                )}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
