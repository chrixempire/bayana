import { formatTime12h } from "./create-event-format"

export type TimePeriod = "AM" | "PM"

export type ClockTimeParts = {
  hour12: number
  minute: number
  period: TimePeriod
}

export const TIME_PICKER_STEP_MINUTES = 15

const DEFAULT_TIME: ClockTimeParts = { hour12: 12, minute: 0, period: "PM" }

/** Parse 24h `HH:mm` into clock parts. */
export function parseTime24(value: string): ClockTimeParts | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim())
  if (!match) return null

  const hour24 = Number(match[1])
  const minute = Number(match[2])
  if (hour24 < 0 || hour24 > 23 || minute < 0 || minute > 59) return null

  return {
    hour12: hour24 % 12 || 12,
    minute,
    period: hour24 >= 12 ? "PM" : "AM",
  }
}

export function parseTime24OrDefault(value: string): ClockTimeParts {
  return parseTime24(value) ?? DEFAULT_TIME
}

/** Convert clock parts to 24h `HH:mm` for the API. */
export function toTime24({ hour12, minute, period }: ClockTimeParts): string {
  let hour24 = hour12 % 12
  if (period === "PM") hour24 += 12
  return `${String(hour24).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
}

export function formatClockDisplay({ hour12, minute, period }: ClockTimeParts) {
  return `${hour12}:${String(minute).padStart(2, "0")} ${period}`
}

export function clampHour12(value: number) {
  if (Number.isNaN(value)) return 12
  return Math.min(12, Math.max(1, Math.round(value)))
}

export function clampMinute(value: number) {
  if (Number.isNaN(value)) return 0
  return Math.min(59, Math.max(0, Math.round(value)))
}

/** Degrees clockwise from 12 o'clock (0 = 12, 90 = 3, etc.). */
export function angleFromPointer(clientX: number, clientY: number, rect: DOMRect) {
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2
  const radians = Math.atan2(clientY - cy, clientX - cx)
  return ((radians * 180) / Math.PI + 90 + 360) % 360
}

export function hour12FromAngle(angleDeg: number) {
  const hour = Math.round(angleDeg / 30) % 12
  return hour === 0 ? 12 : hour
}

export function minuteFromAngle(angleDeg: number) {
  return Math.round(angleDeg / 6) % 60
}

export function handAngleFromHour12(hour12: number) {
  return (hour12 % 12) * 30
}

export function handAngleFromMinute(minute: number) {
  return minute * 6
}

export function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angleDeg: number,
) {
  const radians = ((angleDeg - 90) * Math.PI) / 180
  return {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians),
  }
}

/** All selectable times in 24h `HH:mm` (15-minute steps). */
export function generateTimeOptions(stepMinutes = TIME_PICKER_STEP_MINUTES): string[] {
  const options: string[] = []
  for (let totalMinutes = 0; totalMinutes < 24 * 60; totalMinutes += stepMinutes) {
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    options.push(`${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`)
  }
  return options
}

export const TIME_PICKER_OPTIONS = generateTimeOptions()

export function normalizeTimeQuery(query: string) {
  return query.trim().toLowerCase().replace(/\s+/g, "")
}

export function matchesTimeQuery(option: string, query: string) {
  const normalized = normalizeTimeQuery(query)
  if (!normalized) return true

  const label = formatTime12h(option).toLowerCase().replace(/\s+/g, "")
  const compact24 = option.replace(":", "")

  return (
    option.includes(normalized) ||
    label.includes(normalized) ||
    compact24.includes(normalized.replace(":", ""))
  )
}

export function filterTimeOptions(options: readonly string[], query: string) {
  return options.filter((option) => matchesTimeQuery(option, query))
}
