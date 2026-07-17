import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  isValid,
  parse,
  startOfMonth,
  startOfWeek,
} from "date-fns"
import type { DateRange } from "react-day-picker"

export type DateRangePresetId = "custom" | "this-week" | "this-month" | "weekdays" | "weekends"

export const DATE_RANGE_PRESETS: { id: DateRangePresetId; label: string }[] = [
  { id: "custom", label: "Custom" },
  { id: "this-week", label: "This week" },
  { id: "this-month", label: "This month" },
  { id: "weekdays", label: "Week days" },
  { id: "weekends", label: "Weekends" },
]

export function isoFromDate(date: Date): string {
  return format(date, "yyyy-MM-dd")
}

export function dateFromIso(value: string): Date | undefined {
  if (!value) return undefined
  const parsed = parse(value, "yyyy-MM-dd", new Date())
  return isValid(parsed) ? parsed : undefined
}

export function rangeFromIso(start: string, end: string): DateRange | undefined {
  const from = dateFromIso(start)
  const to = dateFromIso(end)
  if (!from && !to) return undefined
  return { from, to: to ?? from }
}

export function isoFromRange(range: DateRange | undefined): { start: string; end: string } {
  if (!range?.from) return { start: "", end: "" }
  return {
    start: isoFromDate(range.from),
    end: isoFromDate(range.to ?? range.from),
  }
}

export function formatPickerInputDate(value: string): string {
  const date = dateFromIso(value)
  if (!date) return ""
  return format(date, "dd / MM / yyyy")
}

export function getPresetRange(preset: DateRangePresetId, reference = new Date()): DateRange {
  const weekStart = startOfWeek(reference, { weekStartsOn: 0 })
  const weekEnd = endOfWeek(reference, { weekStartsOn: 0 })

  switch (preset) {
    case "this-week":
      return { from: weekStart, to: weekEnd }
    case "this-month":
      return { from: startOfMonth(reference), to: endOfMonth(reference) }
    case "weekdays": {
      const monday = addDays(weekStart, 1)
      const friday = addDays(weekStart, 5)
      return { from: monday, to: friday }
    }
    case "weekends": {
      const saturday = addDays(weekStart, 6)
      return { from: saturday, to: addDays(saturday, 1) }
    }
    case "custom":
    default:
      return { from: reference, to: addDays(reference, 7) }
  }
}

export function detectPreset(range: DateRange | undefined): DateRangePresetId {
  if (!range?.from || !range.to) return "custom"

  for (const preset of DATE_RANGE_PRESETS) {
    if (preset.id === "custom") continue
    const sample = getPresetRange(preset.id, range.from)
    if (
      sample.from &&
      sample.to &&
      isoFromDate(sample.from) === isoFromDate(range.from) &&
      isoFromDate(sample.to) === isoFromDate(range.to)
    ) {
      return preset.id
    }
  }

  return "custom"
}
