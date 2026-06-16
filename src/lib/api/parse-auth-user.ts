import type { AuthUser } from "../api/types"
import { ApiError } from "../api/types"

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null
  return value as Record<string, unknown>
}

function isAuthUserShape(record: Record<string, unknown>): record is AuthUser {
  return typeof record.email === "string" && Boolean(record.uuid || record.user_type)
}

export function extractAuthUser(payload: unknown): AuthUser {
  const root = asRecord(payload)
  if (!root) throw new ApiError("Invalid profile response", 500)

  const candidates: unknown[] = []
  const data = asRecord(root.data)

  if (data) {
    candidates.push(data.user, data.profile, data)
  }

  candidates.push(root.user, root.profile, root)

  for (const candidate of candidates) {
    const record = asRecord(candidate)
    if (record && isAuthUserShape(record)) return record
  }

  throw new ApiError("Unexpected profile response shape", 500)
}

export function isEmailVerified(user: AuthUser): boolean {
  const record = user as AuthUser & Record<string, unknown>

  if (record.email_verified_at) return true
  if (record.verified_at) return true
  if (record.email_verified === true) return true
  if (record.is_email_verified === true) return true
  if (record.is_verified === true) return true
  if (record.verification_status === "verified") return true

  return false
}
