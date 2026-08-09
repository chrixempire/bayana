import { AUTH_LOGIN_PATH } from "../auth-paths"
import { invalidateEmailVerificationCache } from "./email-verification-cache"
import { resolveSafeNextPath } from "./safe-next-path"
import { clearAuthSession, hasAuthSession } from "./session"

let handlingUnauthorized = false

/** Auth routes where a 401 should clear the session but not force a redirect loop. */
function isAuthEntryPath(pathname: string): boolean {
  return (
    pathname === AUTH_LOGIN_PATH ||
    pathname.startsWith("/auth/create-account") ||
    pathname.startsWith("/auth/forgot-password") ||
    pathname.startsWith("/auth/reset-password") ||
    pathname.startsWith("/auth/google/callback") ||
    pathname.startsWith("/auth/invite") ||
    pathname.startsWith("/auth/email/verify")
  )
}

/**
 * Clears the local session and sends the user to login when an authenticated
 * API call returns 401. Safe to call multiple times (deduped).
 */
export function handleUnauthorizedResponse() {
  if (handlingUnauthorized) return
  handlingUnauthorized = true

  const hadSession = hasAuthSession()
  clearAuthSession()
  invalidateEmailVerificationCache()

  if (typeof window === "undefined") {
    handlingUnauthorized = false
    return
  }

  const { pathname, search } = window.location
  if (isAuthEntryPath(pathname)) {
    handlingUnauthorized = false
    return
  }

  // Only hard-redirect when we actually believed the user was signed in.
  if (!hadSession) {
    handlingUnauthorized = false
    return
  }

  const next = resolveSafeNextPath(`${pathname}${search}`)
  const loginUrl = next
    ? `${AUTH_LOGIN_PATH}?next=${encodeURIComponent(next)}`
    : AUTH_LOGIN_PATH

  window.location.replace(loginUrl)
}
