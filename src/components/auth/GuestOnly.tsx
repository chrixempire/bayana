import { Navigate, Outlet } from "react-router-dom"
import { GETTING_STARTED_PATH } from "../../lib/auth-paths"
import { resolvePostAuthPath } from "../../lib/auth/post-auth-routing"
import { getAuthUser, hasAuthSession } from "../../lib/auth/session"

/**
 * Route guard: guests only (login / create-account).
 * Signed-in users are sent to their post-auth landing path.
 */
export function GuestOnly() {
  if (hasAuthSession()) {
    const user = getAuthUser()
    return (
      <Navigate
        to={user ? resolvePostAuthPath(user) : GETTING_STARTED_PATH}
        replace
      />
    )
  }

  return <Outlet />
}
