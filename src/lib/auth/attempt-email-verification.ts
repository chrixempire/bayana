import { verifyEmail } from "../api/auth"
import { ApiError } from "../api/types"
import { isCookieAuthEnabled } from "./auth-strategy"
import { markEmailAsVerified } from "./email-verification-cache"
import type { EmailVerifyParams } from "./parse-email-verify-link"
import { refreshAuthUserFromMe } from "./refresh-auth-user"
import { hasAuthSession, markEmailVerifiedInSession } from "./session"

export type EmailVerificationAttempt =
  | { status: "success"; message: string }
  | { status: "needs-auth" }
  | { status: "error"; message: string }

export async function attemptEmailVerification(
  params: EmailVerifyParams,
): Promise<EmailVerificationAttempt> {
  const finishSuccess = async (message: string): Promise<EmailVerificationAttempt> => {
    markEmailAsVerified()
    markEmailVerifiedInSession()

    try {
      await refreshAuthUserFromMe()
    } catch {
      // Verification succeeded even if profile refresh failed.
    }

    return { status: "success", message }
  }

  const tryVerify = (auth: boolean) =>
    verifyEmail(params.id, params.hash, params.expires, params.signature, { auth })

  const toError = (error: unknown): EmailVerificationAttempt => ({
    status: "error",
    message:
      error instanceof ApiError
        ? error.message
        : "We could not verify your email. Please try again.",
  })

  if (hasAuthSession()) {
    try {
      const response = await tryVerify(!isCookieAuthEnabled())
      return finishSuccess(response.message || "Your email has been confirmed.")
    } catch (error) {
      if (!(error instanceof ApiError && error.status === 401)) {
        return toError(error)
      }
    }
  }

  try {
    const response = await tryVerify(false)
    return finishSuccess(response.message || "Your email has been confirmed.")
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return { status: "needs-auth" }
    }
    return toError(error)
  }
}
