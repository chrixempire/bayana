import type { AuthUser } from "../api/types"

const TOKEN_KEY = "bayana-auth-token"
const USER_KEY = "bayana-auth-user"
const EMAIL_VERIFIED_KEY = "bayana-email-verified"

export function setAuthSession(token: string, user: AuthUser) {
  sessionStorage.setItem(TOKEN_KEY, token)
  sessionStorage.setItem(USER_KEY, JSON.stringify(user))
  sessionStorage.removeItem(EMAIL_VERIFIED_KEY)
}

export function setAuthTokenOnly(token: string) {
  sessionStorage.setItem(TOKEN_KEY, token)
}

export function resetEmailVerificationInSession() {
  sessionStorage.removeItem(EMAIL_VERIFIED_KEY)
}

export function updateAuthUser(user: AuthUser) {
  sessionStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function getAuthToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY)
}

export function getAuthUser(): AuthUser | null {
  const raw = sessionStorage.getItem(USER_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export function markEmailVerifiedInSession() {
  sessionStorage.setItem(EMAIL_VERIFIED_KEY, "1")
}

export function isEmailVerifiedInSession(): boolean {
  return sessionStorage.getItem(EMAIL_VERIFIED_KEY) === "1"
}

export function clearAuthSession() {
  sessionStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(USER_KEY)
  sessionStorage.removeItem(EMAIL_VERIFIED_KEY)
}
