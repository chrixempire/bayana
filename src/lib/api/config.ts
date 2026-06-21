function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "")
}

export function getApiBaseUrl(): string {
  const configured = import.meta.env.VITE_API_BASE_URL?.trim()
  if (configured) return trimTrailingSlash(configured)
  if (import.meta.env.DEV) return "/api"
  return ""
}

/** Upstream API origin for full-page redirects (e.g. Google OAuth). */
export function getOAuthApiBaseUrl(): string {
  const configured = import.meta.env.VITE_API_BASE_URL?.trim()
  if (configured) return trimTrailingSlash(configured)

  const proxyTarget = import.meta.env.VITE_API_PROXY_TARGET?.trim()
  if (proxyTarget) return trimTrailingSlash(proxyTarget)

  return ""
}

export function getAppUrl(): string {
  const configured = import.meta.env.VITE_APP_URL?.trim()
  if (configured) return trimTrailingSlash(configured)
  if (typeof window !== "undefined") return window.location.origin
  return ""
}

export function isApiIntegrationEnabled(): boolean {
  return import.meta.env.VITE_API_INTEGRATION_ENABLED === "true"
}
