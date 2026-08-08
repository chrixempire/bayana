import type { CertificateAccess } from "../../pages/dashboard/create-event-types"

/** Minutes before event start — must match backend validation (Postman uses 30). */
export const CAUSE_REMINDER_MINUTES_BY_LABEL: Record<string, string> = {
  "30 minutes": "30",
  "1 hour": "60",
  "1 day": "1440",
}

export function mapReminderTimeBeforeForApi(notifyBefore: string): string {
  return CAUSE_REMINDER_MINUTES_BY_LABEL[notifyBefore] ?? "30"
}

/**
 * Cause create API (Postman) only accepts `certificate: automated`.
 * UI options are mapped to automated + an appropriate reliability threshold.
 */
export function mapCertificateForApi(_access: CertificateAccess): "automated" {
  return "automated"
}

export function mapReliabilityScoreForApi(access: CertificateAccess, score: number): string {
  if (access === "all" || access === "manual") {
    // Lowest allowed threshold — backend requires >= 1; Postman sample uses 58.
    return "1"
  }
  return String(Math.max(1, Math.round(score)))
}
