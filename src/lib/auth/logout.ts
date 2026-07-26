import type { NavigateFunction } from "react-router-dom"
import { toast } from "../../hooks/use-toast"
import { logout } from "../api/auth"
import { AUTH_LOGIN_PATH } from "../auth-paths"
import { invalidateEmailVerificationCache } from "./email-verification-cache"
import { clearAuthSession, hasAuthSession } from "./session"

export async function performLogout(navigate: NavigateFunction) {
  try {
    if (hasAuthSession()) {
      await logout()
    }
  } catch {
    // Clear the local session even if the server logout fails.
  } finally {
    clearAuthSession()
    invalidateEmailVerificationCache()
    toast({
      variant: "success",
      title: "Signed out",
      description: "You have been logged out successfully.",
    })
    navigate(AUTH_LOGIN_PATH, { replace: true })
  }
}
