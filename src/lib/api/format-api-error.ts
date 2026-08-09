import { ApiError } from "./types"

/** Prefer API message, then first field errors — useful for validation failures while testing. */
export function formatApiError(error: unknown, fallback: string): string {
  if (error instanceof ApiError) {
    const fieldMessages = Object.values(error.fieldErrors)
      .flat()
      .map((message) => message.trim())
      .filter(Boolean)

    if (error.message?.trim() && fieldMessages.length > 0) {
      const extras = fieldMessages.filter((message) => !error.message.includes(message))
      if (extras.length === 0) return error.message
      return `${error.message} ${extras.slice(0, 3).join(" ")}`.trim()
    }

    if (error.message?.trim()) return error.message
    if (fieldMessages[0]) return fieldMessages[0]
  }

  if (error instanceof Error && error.message.trim()) return error.message
  return fallback
}
