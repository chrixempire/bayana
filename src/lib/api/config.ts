function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "")
}

export function getApiBaseUrl(): string {
  const configured = import.meta.env.VITE_API_BASE_URL?.trim()
  if (configured) return trimTrailingSlash(configured)
  if (import.meta.env.DEV) return "/api"
  return ""
}

export function isApiIntegrationEnabled(): boolean {
  return import.meta.env.VITE_API_INTEGRATION_ENABLED === "true"
}
