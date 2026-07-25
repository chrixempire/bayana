import { AUTH_EMAIL_VERIFY_PATH } from "../auth-paths"

export type EmailVerifyParams = {
  id: string
  hash: string
  expires: string
  signature: string
}

const VERIFY_SEGMENT = /\/email\/verify\/([^/]+)\/([^/?#]+)\/?/

function normalizeQueryValue(value: string | null): string {
  return value?.replace(/\.$/, "") ?? ""
}

function extractFromPathAndQuery(
  pathname: string,
  searchParams: URLSearchParams,
): EmailVerifyParams | null {
  const match = pathname.match(VERIFY_SEGMENT)
  if (!match) return null

  const expires = normalizeQueryValue(searchParams.get("expires"))
  const signature = normalizeQueryValue(searchParams.get("signature"))
  if (!expires || !signature) return null

  return { id: match[1], hash: match[2], expires, signature }
}

/** Parse id/hash/expires/signature from an encoded API URL or path fragment. */
export function parseEmailVerifyFromEmbeddedUrl(raw: string): EmailVerifyParams | null {
  const trimmed = raw.trim()
  if (!trimmed) return null

  let decoded = trimmed
  try {
    decoded = decodeURIComponent(trimmed)
  } catch {
    decoded = trimmed
  }

  if (decoded.includes("://")) {
    try {
      const url = new URL(decoded)
      return extractFromPathAndQuery(url.pathname, url.searchParams)
    } catch {
      return null
    }
  }

  const queryIndex = decoded.indexOf("?")
  if (queryIndex >= 0) {
    const pathname = decoded.slice(0, queryIndex)
    const searchParams = new URLSearchParams(decoded.slice(queryIndex + 1))
    const fromPath = extractFromPathAndQuery(pathname, searchParams)
    if (fromPath) return fromPath
  }

  return extractFromPathAndQuery(decoded, new URLSearchParams())
}

export function buildEmailVerifyPath(params: EmailVerifyParams): string {
  const query = new URLSearchParams({
    expires: params.expires,
    signature: params.signature,
  })
  return `${AUTH_EMAIL_VERIFY_PATH}/${params.id}/${params.hash}?${query}`
}

/** True when the splat path is the backend-wrapped link (full API URL in one segment). */
export function isMalformedEmailVerifySplat(splat: string): boolean {
  const trimmed = splat.trim()
  if (!trimmed) return false

  let decoded = trimmed
  try {
    decoded = decodeURIComponent(trimmed)
  } catch {
    decoded = trimmed
  }

  return (
    decoded.includes("://") ||
    trimmed.includes("%3A%2F%2F") ||
    trimmed.includes("/api/v1/auth/email/verify/")
  )
}

/**
 * Resolve verification params from React Router splat (`/auth/email/verify/*`)
 * or legacy `:id/:hash` segments plus query string.
 */
export function resolveEmailVerifyParams(input: {
  splat?: string
  id?: string
  hash?: string
  searchParams: URLSearchParams
}): EmailVerifyParams | null {
  const { splat, id, hash, searchParams } = input

  if (id && hash) {
    const expires = normalizeQueryValue(searchParams.get("expires"))
    const signature = normalizeQueryValue(searchParams.get("signature"))
    if (expires && signature) {
      return { id, hash, expires, signature }
    }
  }

  const path = (splat ?? "").replace(/^\/+/, "")
  if (!path) return null

  const segments = path.split("/").filter(Boolean)

  if (segments.length === 2 && !isMalformedEmailVerifySplat(segments[0])) {
    const expires = normalizeQueryValue(searchParams.get("expires"))
    const signature = normalizeQueryValue(searchParams.get("signature"))
    if (expires && signature) {
      return { id: segments[0], hash: segments[1], expires, signature }
    }
  }

  if (segments.length === 1) {
    return parseEmailVerifyFromEmbeddedUrl(segments[0])
  }

  return parseEmailVerifyFromEmbeddedUrl(path)
}
