import type { ApiError } from "./types"

function firstString(value: unknown): string | undefined {
  if (typeof value === "string") {
    const trimmed = value.trim()
    return trimmed || undefined
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const next = firstString(item)
      if (next) return next
    }
  }

  return undefined
}

function extractObjectMessage(value: Record<string, unknown>, depth: number): string | undefined {
  if (depth > 4) return undefined

  const payload = value.data ?? value._data
  if (typeof payload === "object" && payload !== null && !Array.isArray(payload)) {
    const fromPayload = extractObjectMessage(payload as Record<string, unknown>, depth + 1)
    if (fromPayload) return fromPayload
    const flatPayload = firstString((payload as Record<string, unknown>).message)
    if (flatPayload) return flatPayload
  }

  const directMessage = firstString(value.message)
  if (directMessage) return directMessage

  const directStatusMessage = firstString(value.statusMessage)
  if (directStatusMessage) return directStatusMessage

  const detailsMessage = firstString(value.details)
  if (detailsMessage) return detailsMessage

  for (const candidate of [value.response, value.cause]) {
    const next = extractApiErrorMessage(candidate, "", depth + 1)
    if (next) return next
  }

  const fallbackError = firstString(value.error)
  if (fallbackError && fallbackError !== "Error") return fallbackError

  return undefined
}

export function extractApiErrorMessage(
  error: unknown,
  fallback = "An unexpected error occurred",
  depth = 0,
): string {
  if (depth > 4) return fallback

  const direct = firstString(error)
  if (direct) return direct

  if (typeof error === "object" && error !== null) {
    const objectMessage = extractObjectMessage(error as Record<string, unknown>, depth)
    if (objectMessage) return objectMessage
  }

  return fallback
}

export function normalizeApiError(error: unknown): ApiError {
  if (typeof error === "object" && error !== null) {
    const candidate = error as {
      code?: unknown
      message?: unknown
      status?: unknown
      details?: unknown
    }

    return {
      code: typeof candidate.code === "string" ? candidate.code : "UNKNOWN_ERROR",
      message: extractApiErrorMessage(error),
      status: typeof candidate.status === "number" ? candidate.status : 500,
      details: candidate.details,
    }
  }

  return {
    code: "UNKNOWN_ERROR",
    message: "An unexpected error occurred",
    status: 500,
  }
}
