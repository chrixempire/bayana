import { getAuthStorageItem, removeAuthStorageItem, setAuthStorageItem } from "./auth-storage"

/** Allow post-login redirects only to in-app relative paths. */
export function resolveSafeNextPath(next: string | null | undefined): string | null {
  if (!next) return null
  const trimmed = next.trim()
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return null
  return trimmed
}

const AUTH_NEXT_KEY = "bayana-auth-next"

export function rememberAuthNextPath(path: string | null | undefined) {
  const safe = resolveSafeNextPath(path)
  if (safe) setAuthStorageItem(AUTH_NEXT_KEY, safe)
}

export function consumeAuthNextPath(): string | null {
  const raw = getAuthStorageItem(AUTH_NEXT_KEY)
  removeAuthStorageItem(AUTH_NEXT_KEY)
  return resolveSafeNextPath(raw)
}
