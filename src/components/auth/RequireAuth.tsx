import { Navigate, Outlet, useLocation } from "react-router-dom"
import { AUTH_LOGIN_PATH } from "../../lib/auth-paths"
import { hasAuthSession } from "../../lib/auth/session"

/**
 * Route guard: authenticated users only.
 * Unauthenticated visitors are sent to login with ?next= for return.
 */
export function RequireAuth() {
  const location = useLocation()

  if (!hasAuthSession()) {
    const next = `${location.pathname}${location.search}`
    const search = next && next !== "/" ? `?next=${encodeURIComponent(next)}` : ""
    return <Navigate to={`${AUTH_LOGIN_PATH}${search}`} replace />
  }

  return <Outlet />
}
