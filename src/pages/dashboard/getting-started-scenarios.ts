import { AUTH_ONBOARDING_PATH } from "../../lib/auth-paths"
import type { GettingStartedScenario, SetupTask, SetupTaskId } from "./getting-started-types"

const ONBOARDING_HREF = `${AUTH_ONBOARDING_PATH}/basic-information`

type StepState = SetupTask["action"]["kind"] | "in_progress"

/** Linear pipeline: each step unlocks the next when completed (or under review blocks downstream). */
const PIPELINE: SetupTaskId[] = ["onboarding", "bank", "invite", "event"]

type ScenarioConfig = Record<SetupTaskId, StepState> & {
  onboardingProgress?: { current: number; total: number }
}

const SCENARIO_CONFIG: Record<GettingStartedScenario, ScenarioConfig> = {
  initial: {
    onboarding: "in_progress",
    bank: "locked",
    invite: "locked",
    event: "locked",
    onboardingProgress: { current: 1, total: 5 },
  },
  "under-review": {
    onboarding: "under_review",
    bank: "locked",
    invite: "locked",
    event: "locked",
    onboardingProgress: { current: 5, total: 5 },
  },
  verified: {
    onboarding: "completed",
    bank: "active",
    invite: "locked",
    event: "locked",
    onboardingProgress: { current: 5, total: 5 },
  },
  "bank-done": {
    onboarding: "completed",
    bank: "completed",
    invite: "active",
    event: "locked",
    onboardingProgress: { current: 5, total: 5 },
  },
  "invite-done": {
    onboarding: "completed",
    bank: "completed",
    invite: "completed",
    event: "active",
    onboardingProgress: { current: 5, total: 5 },
  },
  complete: {
    onboarding: "completed",
    bank: "completed",
    invite: "completed",
    event: "completed",
    onboardingProgress: { current: 5, total: 5 },
  },
}

const TASK_META: Record<
  SetupTaskId,
  Pick<SetupTask, "title" | "description"> & { lockedLabel: string; activeLabel: string; completedLabel: "Verified" | "Done" }
> = {
  onboarding: {
    title: "Complete your onboarding",
    description: "Provide essential details about your organization",
    lockedLabel: "Resume",
    activeLabel: "Resume",
    completedLabel: "Verified",
  },
  bank: {
    title: "Add your bank account",
    description: "Provide your bank account details to start receiving donations",
    lockedLabel: "Add",
    activeLabel: "Add",
    completedLabel: "Done",
  },
  invite: {
    title: "Invite your team",
    description: "Invite colleagues to manage the organization together",
    lockedLabel: "Invite",
    activeLabel: "Invite",
    completedLabel: "Done",
  },
  event: {
    title: "Create an Event",
    description: "Create at least 1 cause, need or campaign",
    lockedLabel: "Create",
    activeLabel: "Create",
    completedLabel: "Done",
  },
}

const TASK_HREFS: Record<SetupTaskId, string> = {
  onboarding: ONBOARDING_HREF,
  bank: "/get-started?step=bank",
  invite: "/get-started?step=invite",
  event: "/get-started?step=event",
}

function resolveAction(id: SetupTaskId, state: StepState): SetupTask["action"] {
  const meta = TASK_META[id]

  switch (state) {
    case "in_progress":
    case "active":
      return { kind: "active", label: meta.activeLabel, href: TASK_HREFS[id] }
    case "locked":
      return { kind: "locked", label: meta.lockedLabel }
    case "under_review":
      return { kind: "under_review", label: "Under review" }
    case "completed":
      return { kind: "completed", label: meta.completedLabel }
    default:
      return { kind: "locked", label: meta.lockedLabel }
  }
}

export function parseGettingStartedScenario(value: string | null): GettingStartedScenario {
  if (value && value in SCENARIO_CONFIG) {
    return value as GettingStartedScenario
  }
  return "initial"
}

/** Org onboarding banner stays until onboarding is verified (not merely submitted). */
export function shouldShowOnboardingBanner(scenario: GettingStartedScenario): boolean {
  return scenario === "initial" || scenario === "under-review"
}

export function buildSetupTasks(scenario: GettingStartedScenario): SetupTask[] {
  const config = SCENARIO_CONFIG[scenario]

  return PIPELINE.map((id) => {
    const state = config[id]
    const meta = TASK_META[id]
    const task: SetupTask = {
      id,
      title: meta.title,
      description: meta.description,
      action: resolveAction(id, state),
    }

    if (id === "onboarding" && (state === "in_progress" || state === "under_review" || state === "completed")) {
      task.progress = config.onboardingProgress ?? { current: 5, total: 5 }
    }

    return task
  })
}

/**
 * How the real flow works (for API wiring later):
 * 1. User completes 5 onboarding steps → status `under_review` until admin verifies.
 * 2. On `verified`, bank step becomes `active`; others stay `locked`.
 * 3. Each subsequent step unlocks only when the previous is `completed`.
 * 4. When all four are done, org setup is complete (hide orange banner, badge can drop to 0).
 */
export function deriveScenarioFromOrgStatus(status: {
  onboarding: "in_progress" | "under_review" | "verified"
  bank: boolean
  invite: boolean
  event: boolean
}): GettingStartedScenario {
  if (status.onboarding === "in_progress") return "initial"
  if (status.onboarding === "under_review") return "under-review"
  if (!status.bank) return "verified"
  if (!status.invite) return "bank-done"
  if (!status.event) return "invite-done"
  return "complete"
}
