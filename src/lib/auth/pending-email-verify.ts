import { getAuthStorageItem, removeAuthStorageItem, setAuthStorageItem } from "./auth-storage"
import type { EmailVerifyParams } from "./parse-email-verify-link"

const PENDING_KEY = "bayana-pending-email-verify"

export function setPendingEmailVerify(params: EmailVerifyParams) {
  setAuthStorageItem(PENDING_KEY, JSON.stringify(params))
}

export function getPendingEmailVerify(): EmailVerifyParams | null {
  const raw = getAuthStorageItem(PENDING_KEY)
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as EmailVerifyParams
    if (!parsed.id || !parsed.hash || !parsed.expires || !parsed.signature) return null
    return parsed
  } catch {
    return null
  }
}

export function clearPendingEmailVerify() {
  removeAuthStorageItem(PENDING_KEY)
}

export function consumePendingEmailVerify(): EmailVerifyParams | null {
  const pending = getPendingEmailVerify()
  if (pending) clearPendingEmailVerify()
  return pending
}
