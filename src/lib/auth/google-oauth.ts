import { getAppUrl, getOAuthApiBaseUrl } from "../api/config"
import { AUTH_GOOGLE_CALLBACK_PATH } from "../auth-paths"

export type GoogleAuthUserType = "organisation" | "volunteer"

export function getGoogleOAuthFrontendCallbackUrl(): string {
  const appUrl = getAppUrl()
  if (!appUrl) {
    throw new Error("Frontend URL is not configured. Set VITE_APP_URL.")
  }

  return `${appUrl}${AUTH_GOOGLE_CALLBACK_PATH}`
}

export function getGoogleOAuthRedirectUrl(userType: GoogleAuthUserType = "organisation"): string {
  const baseUrl = getOAuthApiBaseUrl()
  if (!baseUrl) {
    throw new Error("OAuth API base URL is not configured.")
  }

  const url = new URL(`${baseUrl}/api/v1/auth/google/redirect/${userType}`)

  try {
    url.searchParams.set("redirect_uri", getGoogleOAuthFrontendCallbackUrl())
  } catch {
    // If VITE_APP_URL is unset, still start OAuth — backend may use its own FRONTEND_URL.
  }

  return url.toString()
}

export function redirectToGoogleAuth(userType: GoogleAuthUserType = "organisation") {
  window.location.assign(getGoogleOAuthRedirectUrl(userType))
}
