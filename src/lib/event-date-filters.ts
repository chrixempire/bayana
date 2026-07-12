export type ResolvedDateRange = { from: Date | null; to: Date | null }

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function startOfDay(date: Date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function endOfDay(date: Date) {
  const d = new Date(date)
  d.setHours(23, 59, 59, 999)
  return d
}

/** Resolve a preset label to a concrete range, or null for "any" / custom. */
export function resolveDatePreset(preset: string): ResolvedDateRange | null {
  if (!preset || preset.startsWith("Any")) return null

  const now = new Date()

  if (preset === "Today") {
    return { from: startOfDay(now), to: endOfDay(now) }
  }

  if (preset === "This week") {
    const day = now.getDay() // 0 = Sun
    const diffToMonday = (day + 6) % 7
    const monday = startOfDay(now)
    monday.setDate(now.getDate() - diffToMonday)
    const sunday = endOfDay(new Date(monday))
    sunday.setDate(monday.getDate() + 6)
    return { from: monday, to: sunday }
  }

  if (preset === "This month") {
    const from = startOfDay(new Date(now.getFullYear(), now.getMonth(), 1))
    const to = endOfDay(new Date(now.getFullYear(), now.getMonth() + 1, 0))
    return { from, to }
  }

  return null
}

/** True when an ISO date (YYYY-MM-DD) falls inside the range (null range = pass). */
export function isDateInRange(iso: string | null | undefined, range: ResolvedDateRange | null) {
  if (!range || (!range.from && !range.to)) return true
  if (!iso) return false
  const date = new Date(`${iso}T12:00:00`)
  if (range.from && date < startOfDay(range.from)) return false
  if (range.to && date > endOfDay(range.to)) return false
  return true
}

/** "6 Dec - 12 Dec 2025" / "6 Dec 2025" for a picked range. */
export function formatDateRange(from: Date, to?: Date | null): string {
  const day = (d: Date) => `${d.getDate()} ${MONTHS[d.getMonth()]}`
  if (!to || from.toDateString() === to.toDateString()) {
    return `${day(from)} ${from.getFullYear()}`
  }
  if (from.getFullYear() === to.getFullYear()) {
    return `${day(from)} - ${day(to)} ${to.getFullYear()}`
  }
  return `${day(from)} ${from.getFullYear()} - ${day(to)} ${to.getFullYear()}`
}
