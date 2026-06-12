import type { CreateEventStepId } from "../pages/dashboard/create-event-types"

export type CreateEventType = "cause" | "needs"

export const CREATE_EVENT_PATH = "/events/create" as const

export function createEventPath(
  type: CreateEventType = "cause",
  step: CreateEventStepId = "basics",
) {
  const params = new URLSearchParams({ type, step })
  return `${CREATE_EVENT_PATH}?${params.toString()}`
}

export function parseCreateEventType(value: string | null): CreateEventType {
  return value === "needs" ? "needs" : "cause"
}

export function parseCreateEventStep(value: string | null): CreateEventStepId {
  if (value === "about" || value === "settings" || value === "basics") return value
  return "basics"
}
