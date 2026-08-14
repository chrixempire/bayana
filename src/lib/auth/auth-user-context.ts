import { createContext, useContext } from "react"
import type { AuthUser } from "../api/types"
import { getAuthUser } from "./session"

export type AuthUserContextValue = {
  /** Current authenticated user — seeded from cache, then refreshed from `/me`. */
  user: AuthUser | null
  /** True while the initial `/me` fetch is in flight (cache may already be present). */
  isLoading: boolean
  /** Re-fetch `/me` (e.g. after a profile update) and update the cached user. */
  refresh: () => Promise<void>
}

export const AuthUserContext = createContext<AuthUserContextValue | null>(null)

/** Access the authenticated user. Returns cached data even outside a fresh fetch. */
export function useAuthUser(): AuthUserContextValue {
  const context = useContext(AuthUserContext)
  if (!context) {
    // Safe fallback for components rendered outside the provider (e.g. tests).
    return { user: getAuthUser(), isLoading: false, refresh: async () => {} }
  }
  return context
}
