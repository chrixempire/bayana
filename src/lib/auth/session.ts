import type { AuthUser } from "../api/types"
import { isCookieAuthEnabled } from "./auth-strategy"
import { getAuthStorageItem, removeAuthStorageItem, setAuthStorageItem } from "./auth-storage"

const TOKEN_KEY = "bayana-auth-token"
const USER_KEY = "bayana-auth-user"
const EMAIL_VERIFIED_KEY = "bayana-email-verified"

export function setAuthSession(token: string, user: AuthUser) {
  if (!isCookieAuthEnabled()) {
    setAuthStorageItem(TOKEN_KEY, token)
  } else {
    removeAuthStorageItem(TOKEN_KEY)
  }

  setAuthStorageItem(USER_KEY, JSON.stringify(user))
  removeAuthStorageItem(EMAIL_VERIFIED_KEY)
}

export function setAuthTokenOnly(token: string) {
  if (isCookieAuthEnabled()) return
  setAuthStorageItem(TOKEN_KEY, token)
}

export function resetEmailVerificationInSession() {
  removeAuthStorageItem(EMAIL_VERIFIED_KEY)
}

export function updateAuthUser(user: AuthUser) {
  setAuthStorageItem(USER_KEY, JSON.stringify(user))
}

export function getAuthToken(): string | null {
  if (isCookieAuthEnabled()) return null
  return getAuthStorageItem(TOKEN_KEY)
}

export function getAuthUser(): AuthUser | null {
  const raw = getAuthStorageItem(USER_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export function hasAuthSession(): boolean {
  if (isCookieAuthEnabled()) return getAuthUser() !== null
  return getAuthToken() !== null
}

export function markEmailVerifiedInSession() {
  setAuthStorageItem(EMAIL_VERIFIED_KEY, "1")
}

export function isEmailVerifiedInSession(): boolean {
  return getAuthStorageItem(EMAIL_VERIFIED_KEY) === "1"
}

export function clearAuthSession() {
  removeAuthStorageItem(TOKEN_KEY)
  removeAuthStorageItem(USER_KEY)
  removeAuthStorageItem(EMAIL_VERIFIED_KEY)
}
