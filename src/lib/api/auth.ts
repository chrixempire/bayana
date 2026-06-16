import { apiRequest } from "./client"
import { extractAuthUser, isEmailVerified } from "./parse-auth-user"
import type { ApiMessageResponse, RegistrationResponse } from "./types"

export { extractAuthUser, isEmailVerified }

export function registerOrganisation(email: string, password: string) {
  return apiRequest<RegistrationResponse>("/api/v1/auth/organisation/registration", {
    method: "POST",
    auth: false,
    body: JSON.stringify({ email, password }),
  })
}

export function resendVerificationNotification() {
  return apiRequest<ApiMessageResponse>("/api/v1/auth/email/verification-notification", {
    method: "POST",
    body: JSON.stringify({}),
  })
}

export function verifyEmail(id: string, hash: string, expires: string, signature: string) {
  const params = new URLSearchParams({ expires, signature })

  return apiRequest<ApiMessageResponse>(`/api/v1/auth/email/verify/${id}/${hash}?${params}`, {
    method: "GET",
  })
}

export function getAuthUserProfile() {
  return apiRequest<unknown>("/api/v1/auth/me", {
    method: "GET",
  })
}
