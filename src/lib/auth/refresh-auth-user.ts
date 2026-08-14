import type { AuthUser } from "../api/types"
import { extractAuthUser, getAuthUserProfile } from "../api/auth"
import { markEmailAsVerified } from "./email-verification-cache"
import { updateAuthUser } from "./session"

/** Fetch `/me`, cache it as `bayana-auth-user`, and return the parsed user. */
export async function loadAuthUserFromMe(): Promise<AuthUser> {
  const response = await getAuthUserProfile()
  const user = extractAuthUser(response)
  updateAuthUser(user)
  return user
}

/** Refresh cached `bayana-auth-user` from `/me` after email verification. */
export async function refreshAuthUserFromMe() {
  await loadAuthUserFromMe()
  markEmailAsVerified()
}
