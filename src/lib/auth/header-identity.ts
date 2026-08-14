import type { AuthUser } from "../api/types"

/** Display identity shown in the dashboard header, derived from the `/me` profile. */
export type HeaderIdentity = {
  organizationName: string
  organizationInitial: string
  planLabel: string
  userName: string
  userInitial: string
  userRole: string
}

const FALLBACK: HeaderIdentity = {
  organizationName: "Your organisation",
  organizationInitial: "O",
  planLabel: "Free",
  userName: "Your account",
  userInitial: "U",
  userRole: "Member",
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null
  return value as Record<string, unknown>
}

/** First non-empty, trimmed string found under any of `keys` on `record`. */
function readString(record: Record<string, unknown> | null, keys: string[]): string {
  if (!record) return ""
  for (const key of keys) {
    const value = record[key]
    if (typeof value === "string" && value.trim()) return value.trim()
    if (typeof value === "number" && Number.isFinite(value)) return String(value)
  }
  return ""
}

/** First initial of a display string, upper-cased; "" when none available. */
function initialOf(value: string): string {
  const match = value.match(/[\p{L}\p{N}]/u)
  return match ? match[0].toUpperCase() : ""
}

/** Title-case a snake/kebab token like `organisation_admin` → `Organisation Admin`. */
function humanize(value: string): string {
  return value
    .replace(/[_-]+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function deriveOrganizationName(root: Record<string, unknown>, org: Record<string, unknown> | null): string {
  const orgKeys = ["name", "organisation_name", "organization_name", "org_name", "business_name", "company_name", "trading_name"]
  return (
    readString(org, orgKeys) ||
    readString(root, ["organisation_name", "organization_name", "org_name", "business_name", "company_name"])
  )
}

function derivePlanLabel(root: Record<string, unknown>, org: Record<string, unknown> | null): string {
  const planCandidates: unknown[] = [
    root.plan,
    root.plan_name,
    root.subscription_plan,
    org?.plan,
    org?.plan_name,
    org?.subscription_plan,
    asRecord(root.subscription)?.plan,
    asRecord(org?.subscription)?.plan,
  ]

  for (const candidate of planCandidates) {
    if (typeof candidate === "string" && candidate.trim()) return humanize(candidate)
    const planRecord = asRecord(candidate)
    const nested = readString(planRecord, ["name", "label", "title", "tier"])
    if (nested) return humanize(nested)
  }

  return ""
}

function deriveUserName(root: Record<string, unknown>): string {
  const direct = readString(root, ["name", "full_name", "fullName", "display_name", "displayName", "name_on_id"])
  if (direct) return direct

  const first = readString(root, ["first_name", "firstName", "given_name"])
  const last = readString(root, ["last_name", "lastName", "family_name", "surname"])
  const combined = `${first} ${last}`.trim()
  if (combined) return combined

  const email = readString(root, ["email"])
  if (email) return email.split("@")[0]

  return ""
}

function deriveUserRole(root: Record<string, unknown>): string {
  const explicit = readString(root, ["role", "role_name", "user_role", "position", "title", "job_title"])
  if (explicit) return humanize(explicit)

  const roleRecord = asRecord(root.role)
  const nested = readString(roleRecord, ["name", "label", "title"])
  if (nested) return humanize(nested)

  const userType = readString(root, ["user_type", "type", "account_type"])
  if (userType) {
    // Organisation accounts own the org — surface them as the admin they are.
    if (/organi[sz]ation/i.test(userType)) return "Administrator"
    return humanize(userType)
  }

  return ""
}

/**
 * Map a stored `/me` user (or login payload) to the strings shown in the dashboard
 * header. Tolerant of the many shapes the API may return — flat fields, a nested
 * `organisation`/`organization` object, or partial login data.
 */
export function deriveHeaderIdentity(user: AuthUser | null | undefined): HeaderIdentity {
  const root = asRecord(user)
  if (!root) return { ...FALLBACK }

  const org = asRecord(root.organisation) ?? asRecord(root.organization) ?? asRecord(root.org)

  const organizationName = deriveOrganizationName(root, org)
  const userName = deriveUserName(root)
  const planLabel = derivePlanLabel(root, org)
  const userRole = deriveUserRole(root)

  return {
    organizationName: organizationName || FALLBACK.organizationName,
    organizationInitial: initialOf(organizationName) || FALLBACK.organizationInitial,
    planLabel: planLabel || FALLBACK.planLabel,
    userName: userName || FALLBACK.userName,
    userInitial: initialOf(userName) || FALLBACK.userInitial,
    userRole: userRole || FALLBACK.userRole,
  }
}
