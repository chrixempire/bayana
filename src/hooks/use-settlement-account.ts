import { useEffect, useState } from "react"
import {
  getSettlementAccount,
  hasCompleteSettlementAccount,
  type SettlementAccount,
} from "../lib/api/organisation-banking"
import { hasAuthSession } from "../lib/auth/session"

type SettlementAccountState = {
  account: SettlementAccount | null
  hasSettlementAccount: boolean
  loading: boolean
}

/**
 * Loads the organisation's settlement (payout) account so callers can tell
 * whether the "Add bank account" onboarding step is complete. A missing account
 * or a failed request is treated as "not set up" rather than an error.
 */
export function useSettlementAccount(): SettlementAccountState {
  const [account, setAccount] = useState<SettlementAccount | null>(null)
  // Only "loading" when there's a session to load from; unauthenticated = done.
  const [loading, setLoading] = useState(() => hasAuthSession())

  useEffect(() => {
    if (!hasAuthSession()) return

    let cancelled = false

    void (async () => {
      try {
        const response = await getSettlementAccount()
        if (!cancelled) setAccount(response.data ?? null)
      } catch {
        if (!cancelled) setAccount(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  return {
    account,
    hasSettlementAccount: hasCompleteSettlementAccount(account),
    loading,
  }
}
