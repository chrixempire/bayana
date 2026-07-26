/** When true, auth uses HttpOnly cookies from the API instead of a stored Bearer token. */
export function isCookieAuthEnabled(): boolean {
  return import.meta.env.VITE_AUTH_COOKIE === "true"
}

export function getApiFetchCredentials(): RequestCredentials {
  return isCookieAuthEnabled() ? "include" : "same-origin"
}
