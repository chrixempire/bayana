import type { NavigateFunction } from "react-router-dom"
import { logout } from "../api/auth"
import { AUTH_LOGIN_PATH } from "../auth-paths"
import { invalidateEmailVerificationCache } from "./email-verification-cache"
import { clearAuthSession, getAuthToken } from "./session"

export async function performLogout(navigate: NavigateFunction) {
  try {
    if (getAuthToken()) {
      await logout()
    }
  } catch {
    // Clear the local session even if the server logout fails.
  } finally {
    clearAuthSession()
    invalidateEmailVerificationCache()
    navigate(AUTH_LOGIN_PATH, { replace: true })
  }
}
