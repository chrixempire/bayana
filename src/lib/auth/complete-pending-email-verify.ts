import { attemptEmailVerification } from "./attempt-email-verification"
import { consumePendingEmailVerify } from "./pending-email-verify"

export type PendingEmailVerifyResult =
  | { status: "none" }
  | { status: "success"; message: string }
  | { status: "error"; message: string }

export async function completePendingEmailVerify(): Promise<PendingEmailVerifyResult> {
  const pending = consumePendingEmailVerify()
  if (!pending) return { status: "none" }

  const result = await attemptEmailVerification(pending)
  if (result.status === "success") {
    return { status: "success", message: result.message }
  }
  if (result.status === "needs-auth") {
    return { status: "none" }
  }
  return { status: "error", message: result.message }
}
