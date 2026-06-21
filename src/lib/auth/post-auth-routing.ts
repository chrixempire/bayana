import { isEmailVerified } from "../api/parse-auth-user"
import type { AuthUser } from "../api/types"
import { AUTH_ONBOARDING_PATH, GETTING_STARTED_PATH } from "../auth-paths"

export function resolvePostAuthPath(user: AuthUser): string {
  if (!isEmailVerified(user)) {
    return `${AUTH_ONBOARDING_PATH}/check-email`
  }

  return GETTING_STARTED_PATH
}
