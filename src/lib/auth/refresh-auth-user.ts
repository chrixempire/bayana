import { extractAuthUser, getAuthUserProfile } from "../api/auth"
import { markEmailAsVerified } from "./email-verification-cache"
import { updateAuthUser } from "./session"

/** Refresh cached `bayana-auth-user` from `/me` after email verification. */
export async function refreshAuthUserFromMe() {
  const response = await getAuthUserProfile()
  const user = extractAuthUser(response)
  updateAuthUser(user)
  markEmailAsVerified()
}
