import { useCallback, useEffect, useState, type ReactNode } from "react"
import { getAuthUser, hasAuthSession } from "./session"
import { loadAuthUserFromMe } from "./refresh-auth-user"
import { AuthUserContext } from "./auth-user-context"

/**
 * Provides the authenticated user to the app shell. Reads the cached
 * `bayana-auth-user` synchronously for an instant first paint, then fetches
 * `/me` so headers and dashboard pages reflect the live profile.
 */
export function AuthUserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(() => getAuthUser())
  const [isLoading, setIsLoading] = useState(() => hasAuthSession())

  const refresh = useCallback(async () => {
    if (!hasAuthSession()) return
    try {
      const fresh = await loadAuthUserFromMe()
      setUser(fresh)
    } catch {
      // Keep the cached user on failure — a transient /me error shouldn't blank the header.
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!hasAuthSession()) return
    let cancelled = false

    void loadAuthUserFromMe()
      .then((fresh) => {
        // Keep the cached user on failure — a transient /me error shouldn't blank the header.
        if (!cancelled) setUser(fresh)
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <AuthUserContext.Provider value={{ user, isLoading, refresh }}>
      {children}
    </AuthUserContext.Provider>
  )
}
