export type VerificationStatus =
  | "requires-action"
  | "incomplete"
  | "in-review"
  | "verified"
  | "rejected"

export type VerificationRow = {
  id: string
  title: string
  subtitle: string
  status: VerificationStatus
  lastUpdated: string
  lastUpdatedIso: string
}

export const VERIFICATION_ROWS: VerificationRow[] = [
  {
    id: "ver-1",
    title: "Account Onboarding",
    subtitle: "Complete your onboarding information",
    status: "requires-action",
    lastUpdated: "12 Mar 2026 11:47 PM",
    lastUpdatedIso: "2026-03-12",
  },
  {
    id: "ver-2",
    title: "Account Onboarding",
    subtitle: "Complete your onboarding information",
    status: "incomplete",
    lastUpdated: "12 Mar 2026 11:47 PM",
    lastUpdatedIso: "2026-03-12",
  },
  {
    id: "ver-3",
    title: "Compliance",
    subtitle: "Provide your compliance information",
    status: "in-review",
    lastUpdated: "12 Mar 2026 11:47 PM",
    lastUpdatedIso: "2026-03-12",
  },
  {
    id: "ver-4",
    title: "Compliance",
    subtitle: "Provide your compliance information",
    status: "verified",
    lastUpdated: "12 Mar 2026 11:47 PM",
    lastUpdatedIso: "2026-03-12",
  },
  {
    id: "ver-5",
    title: "Compliance",
    subtitle: "Provide your compliance information",
    status: "rejected",
    lastUpdated: "12 Mar 2026 11:47 PM",
    lastUpdatedIso: "2026-03-12",
  },
]

export const VERIFICATION_TOTALS = { total: 4, ongoing: 3, verified: 1 }

export const VERIFICATION_STATUS_LABELS: Record<VerificationStatus, string> = {
  "requires-action": "Requires action",
  incomplete: "Incomplete",
  "in-review": "In review",
  verified: "Verified",
  rejected: "Rejected",
}
