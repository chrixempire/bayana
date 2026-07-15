import type { CreateEventStepId } from "../pages/dashboard/create-event-types"

export type CreateEventType = "cause" | "needs"

export const CREATE_EVENT_PATH = "/events/create" as const

export function createEventPath(type: CreateEventType = "cause", step?: CreateEventStepId) {
  const resolvedStep = step ?? (type === "needs" ? "needs-basics" : "basics")
  const params = new URLSearchParams({ type, step: resolvedStep })
  return `${CREATE_EVENT_PATH}?${params.toString()}`
}

export function parseCreateEventType(value: string | null): CreateEventType {
  return value === "needs" ? "needs" : "cause"
}

const CREATE_EVENT_STEP_IDS: CreateEventStepId[] = [
  "basics",
  "about",
  "settings",
  "needs-basics",
  "needs-config",
]

export function parseCreateEventStep(value: string | null): CreateEventStepId {
  if (value && CREATE_EVENT_STEP_IDS.includes(value as CreateEventStepId)) {
    return value as CreateEventStepId
  }
  return "basics"
}
