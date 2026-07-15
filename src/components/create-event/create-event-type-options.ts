import type { CreateEventType } from "../../lib/create-event-paths"

export type CreateEventTypeOption = {
  id: CreateEventType
  label: string
  description: string
}

export const CREATE_EVENT_TYPE_OPTIONS: CreateEventTypeOption[] = [
  {
    id: "cause",
    label: "Cause",
    description: "Social problems requiring volunteers or awareness",
  },
  {
    id: "needs",
    label: "Needs",
    description: "Material or financial requests",
  },
]
