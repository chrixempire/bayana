import { extractAuthUser, getAuthUserProfile, isEmailVerified } from "../api/auth"
import { isEmailVerifiedInSession, markEmailVerifiedInSession, updateAuthUser } from "./session"

export type EmailVerificationCheck = "verified" | "unverified" | "error"

let cachedStatus: EmailVerificationCheck | null = null
let inFlight: Promise<EmailVerificationCheck> | null = null

export function invalidateEmailVerificationCache() {
  cachedStatus = null
  inFlight = null
}

export function markEmailAsVerified() {
  cachedStatus = "verified"
  markEmailVerifiedInSession()
  inFlight = null
}

export async function checkEmailVerification(force = false): Promise<EmailVerificationCheck> {
  if (!force && isEmailVerifiedInSession()) {
    cachedStatus = "verified"
    return "verified"
  }

  if (!force && cachedStatus && cachedStatus !== "error") return cachedStatus
  if (!force && inFlight) return inFlight

  if (force) {
    cachedStatus = null
    inFlight = null
  }

  inFlight = getAuthUserProfile()
    .then((response) => {
      const user = extractAuthUser(response)
      updateAuthUser(user)
      const verified = isEmailVerified(user)
      cachedStatus = verified ? "verified" : "unverified"
      if (verified) markEmailVerifiedInSession()
      return cachedStatus
    })
    .catch(() => {
      cachedStatus = "error"
      return "error" as const
    })
    .finally(() => {
      inFlight = null
    })

  return inFlight
}

export async function getEmailVerificationStatus(force = false): Promise<boolean> {
  const status = await checkEmailVerification(force)
  return status === "verified"
}
