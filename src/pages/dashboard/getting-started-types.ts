import type { ReactNode } from "react"

/** Right-side UI for a setup task row. */
export type SetupTaskAction =
  | { kind: "locked"; label: string }
  | { kind: "active"; label: string; href: string }
  | { kind: "under_review"; label: string }
  | { kind: "completed"; label: "Verified" | "Done" }

export type SetupTaskId = "onboarding" | "bank" | "invite" | "event"

export type SetupTask = {
  id: SetupTaskId
  title: string
  description: string
  action: SetupTaskAction
  progress?: { current: number; total: number }
  icon?: ReactNode
}

/**
 * Demo scenarios — append `?scenario=<name>` on `/get-started` to preview each state.
 * Production should replace this with org setup status from the API.
 */
export type GettingStartedScenario =
  | "initial"
  | "under-review"
  | "verified"
  | "bank-done"
  | "invite-done"
  | "complete"

export const GETTING_STARTED_SCENARIOS: GettingStartedScenario[] = [
  "initial",
  "under-review",
  "verified",
  "bank-done",
  "invite-done",
  "complete",
]
