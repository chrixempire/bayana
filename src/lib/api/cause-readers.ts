import type { ApiCause, ApiCauseImage, ApiCauseSkill } from "./cause-types"
import { getApiBaseUrl, getOAuthApiBaseUrl } from "./config"

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "")
}

function encodeStoragePath(path: string): string {
  return path.split("/").map(encodeURIComponent).join("/")
}

function getCauseAssetBaseUrl(): string {
  const oauthBase = getOAuthApiBaseUrl()
  if (oauthBase && oauthBase !== "/api") return trimTrailingSlash(oauthBase)

  const proxyTarget = import.meta.env.VITE_API_PROXY_TARGET?.trim()
  if (proxyTarget) return trimTrailingSlash(proxyTarget)

  return trimTrailingSlash(getApiBaseUrl())
}

function readCauseImages(cause: ApiCause): ApiCauseImage[] {
  if (Array.isArray(cause.cause_images)) {
    return [...cause.cause_images].sort(
      (left, right) => (left.sort_order ?? 0) - (right.sort_order ?? 0),
    )
  }
  return []
}

function readLegacyImageUrls(cause: ApiCause): string[] {
  const urls: string[] = []

  if (Array.isArray(cause.images)) {
    for (const image of cause.images) {
      if (typeof image === "string") urls.push(image)
      else urls.push(image.url ?? image.path ?? "")
    }
  }

  if (urls.length === 0) {
    if (Array.isArray(cause.image)) urls.push(...cause.image)
    else if (typeof cause.image === "string") urls.push(cause.image)
  }

  return urls.filter(Boolean)
}

/** Resolve relative cause photo paths from the API (Laravel `/storage/…`). */
export function resolveCausePhotoUrl(photoUrl: string): string {
  if (!photoUrl.trim()) return ""
  if (/^https?:\/\//i.test(photoUrl)) return photoUrl

  const normalizedPath = photoUrl.replace(/^\/+/, "")
  const storagePath = normalizedPath.startsWith("storage/")
    ? normalizedPath
    : `storage/${normalizedPath}`

  // Dev app uses a `/storage` Vite proxy; production uses the API origin.
  if (typeof window !== "undefined" && getApiBaseUrl() === "/api") {
    return `/${encodeStoragePath(storagePath)}`
  }

  const upstream = getCauseAssetBaseUrl()
  if (!upstream) return photoUrl

  return `${upstream}/${encodeStoragePath(storagePath)}`
}

export function readCauseCoverUrls(cause: ApiCause): string[] {
  const fromCauseImages = readCauseImages(cause)
    .map((image) => resolveCausePhotoUrl(image.photo_url ?? ""))
    .filter(Boolean)

  if (fromCauseImages.length > 0) return fromCauseImages

  return readLegacyImageUrls(cause)
    .map((url) => resolveCausePhotoUrl(url))
    .filter(Boolean)
}

export function readCauseCoverUrl(cause: ApiCause): string {
  return readCauseCoverUrls(cause)[0] ?? ""
}

export function readCauseAreaNames(cause: ApiCause): string[] {
  const areas = cause.cause_areas ?? cause.categories ?? cause.category ?? []
  return areas.map((item) => item.name).filter(Boolean)
}

export function readCauseSkillNames(cause: ApiCause): string[] {
  return (cause.skills ?? [])
    .map((skill) => skill.name ?? "")
    .filter(Boolean)
}

export function readCauseSkillRequired(skill: ApiCauseSkill): number {
  return Number(skill.pivot?.individuals_required ?? skill.individuals_required) || 0
}

export function readCauseVolunteersJoined(cause: ApiCause): number {
  const joined = Number(cause.volunteers_joined)
  return Number.isFinite(joined) && joined >= 0 ? joined : 0
}

export function readCauseVolunteersMax(cause: ApiCause): number {
  const capacity = Number(cause.max_volunteers_capacity)
  if (Number.isFinite(capacity) && capacity > 0) return capacity

  const needed = Number(cause.volunteers_needed)
  if (Number.isFinite(needed) && needed > 0) return needed

  return 0
}

export function parseCauseRequirements(value?: string | null): string[] {
  if (!value?.trim()) return []

  return value
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean)
}
