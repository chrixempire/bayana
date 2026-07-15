import type { FocusEvent } from "react"

/** Show empty field when zero so typing replaces instead of appending (avoids "03"). */
export function formatCapacityInputValue(value: number): string {
  return value === 0 ? "" : String(value)
}

export function parseCapacityInputValue(raw: string): number {
  const trimmed = raw.trim()
  if (trimmed === "") return 0
  const parsed = Number.parseInt(trimmed, 10)
  if (Number.isNaN(parsed) || parsed < 0) return 0
  return parsed
}

export function selectCapacityInputOnFocus(event: FocusEvent<HTMLInputElement>) {
  event.currentTarget.select()
}
