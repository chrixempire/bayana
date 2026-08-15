import { apiRequest } from "./client"
import type { ApiDataResponse } from "./types"

/** A bank returned by the settlement/bank list (Paystack-backed). */
export type OrganisationBank = {
  id?: number | string
  code?: string
  name?: string
  slug?: string
  currency?: string
  country?: string
}

/** The organisation's settlement (payout) account for receiving donations. */
export type SettlementAccount = {
  id?: string | number
  bank_name?: string | null
  bank_code?: string | null
  account_number?: string | null
  account_name?: string | null
  currency?: string | null
  is_verified?: boolean | number | null
  created_at?: string | null
  updated_at?: string | null
}

/** Bank list for the settlement-account picker — `GET /organisation/banks`. */
export function getOrganisationBanks() {
  return apiRequest<ApiDataResponse<OrganisationBank[] | { data?: OrganisationBank[] }>>(
    "/api/v1/organisation/banks",
    { method: "GET" },
  )
}

/**
 * The organisation's current settlement account.
 *
 * NOTE: the Postman collection ships this request as an empty stub with no URL,
 * so the path below is inferred from the sibling `/organisation/banks` route and
 * should be confirmed against the backend. Returns `null` data when unset.
 */
export function getSettlementAccount() {
  return apiRequest<ApiDataResponse<SettlementAccount | null>>(
    "/api/v1/organisation/settlement-account",
    { method: "GET" },
  )
}

export function extractOrganisationBanks(
  payload: ApiDataResponse<OrganisationBank[] | { data?: OrganisationBank[] }>,
): OrganisationBank[] {
  const data = payload.data
  if (Array.isArray(data)) return data
  if (data && typeof data === "object" && Array.isArray(data.data)) return data.data
  return []
}

/** True when the settlement account is present and has an account number. */
export function hasCompleteSettlementAccount(account: SettlementAccount | null | undefined): boolean {
  return Boolean(account && typeof account.account_number === "string" && account.account_number.trim())
}
