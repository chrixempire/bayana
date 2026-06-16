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

export async function checkEmailVerification(): Promise<EmailVerificationCheck> {
  if (isEmailVerifiedInSession()) {
    cachedStatus = "verified"
    return "verified"
  }

  if (cachedStatus && cachedStatus !== "error") return cachedStatus
  if (inFlight) return inFlight

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

export async function getEmailVerificationStatus(): Promise<boolean> {
  const status = await checkEmailVerification()
  return status === "verified"
}
