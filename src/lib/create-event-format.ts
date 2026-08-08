/** Strip time/timezone from API values like `2026-08-10T00:00:00.000000Z`. */
export function normalizeApiDateInput(value: string): string {
  const trimmed = value.trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed

  const datePart = trimmed.match(/^(\d{4}-\d{2}-\d{2})/)
  if (datePart) return datePart[1]

  const parsed = new Date(trimmed)
  if (!Number.isNaN(parsed.getTime())) {
    const year = parsed.getFullYear()
    const month = String(parsed.getMonth() + 1).padStart(2, "0")
    const day = String(parsed.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  return trimmed
}

function parseDate(value: string) {
  if (!value) return null
  const normalized = normalizeApiDateInput(value)
  const date = new Date(`${normalized}T12:00:00`)
  return Number.isNaN(date.getTime()) ? null : date
}

function formatShortDate(date: Date) {
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

function formatDisplayDate(value: string) {
  const date = parseDate(value)
  if (!date) return ""
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()
  return `${day} / ${month} / ${year}`
}

export function formatDateRangeDisplay(start: string, end: string) {
  if (!start && !end) return ""
  if (start && !end) return formatDisplayDate(start)
  if (!start && end) return formatDisplayDate(end)
  return `${formatDisplayDate(start)} - ${formatDisplayDate(end)}`
}

export function formatTime12h(value: string) {
  const [hoursRaw, minutesRaw] = value.split(":")
  const hours = Number(hoursRaw)
  const minutes = Number(minutesRaw)
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return value

  const period = hours >= 12 ? "PM" : "AM"
  const hour12 = hours % 12 || 12
  return `${hour12}${minutes === 0 ? "" : `:${String(minutes).padStart(2, "0")}`}${period}`
}

export function formatDurationMessage(start: string, end: string, timeStart: string, timeEnd: string) {
  const startDate = parseDate(start)
  const endDate = parseDate(end)
  if (!startDate || !endDate || !timeStart || !timeEnd) return null

  const sameMonth =
    startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear()

  const datePart = sameMonth
    ? `${startDate.getDate()} ${startDate.toLocaleDateString("en-GB", { month: "short" })} till ${endDate.getDate()} ${endDate.toLocaleDateString("en-GB", { month: "short", year: "numeric" })}`
    : `${formatShortDate(startDate)} till ${formatShortDate(endDate)}`

  return `This cause will run from ${datePart}, from ${formatTime12h(timeStart)} to ${formatTime12h(timeEnd)}`
}

function ordinalSuffix(day: number) {
  const remainder = day % 100
  if (remainder >= 11 && remainder <= 13) return "th"
  switch (day % 10) {
    case 1:
      return "st"
    case 2:
      return "nd"
    case 3:
      return "rd"
    default:
      return "th"
  }
}

function formatOrdinalDate(value: string) {
  const date = parseDate(value)
  if (!date) return ""
  const day = date.getDate()
  const monthYear = date.toLocaleDateString("en-GB", { month: "short", year: "numeric" })
  return `${day}${ordinalSuffix(day)} ${monthYear}`
}

/** Needs summary date range, e.g. "22nd Jan 2025 to 31st Jan 2025". */
export function formatNeedsSummaryDateRange(start: string, end: string) {
  if (!start && !end) return "--"
  if (start && end) return `${formatOrdinalDate(start)} to ${formatOrdinalDate(end)}`
  return formatOrdinalDate(start || end)
}

/** Display date for cause detail surfaces, e.g. "10th Aug 2026". */
export function formatCauseDisplayDate(value?: string | null, fallback = "—"): string {
  if (!value?.trim()) return fallback
  return formatOrdinalDate(value) || fallback
}

export function formatSummaryDateTime(start: string, _end: string, timeStart: string, timeEnd: string) {
  const startDate = parseDate(start)
  if (!startDate || !timeStart || !timeEnd) return "—"

  const dateLabel = startDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

  return `${dateLabel}, ${formatTime12h(timeStart)} to ${formatTime12h(timeEnd)}`
}
