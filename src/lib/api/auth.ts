import { apiRequest } from "./client"
import { extractAuthToken, extractAuthUser, isEmailVerified } from "./parse-auth-user"
import type { ApiMessageResponse, LoginResponse, RegistrationResponse } from "./types"

export { extractAuthToken, extractAuthUser, isEmailVerified }

export function registerOrganisation(email: string, password: string) {
  return apiRequest<RegistrationResponse>("/api/v1/auth/organisation/registration", {
    method: "POST",
    auth: false,
    body: JSON.stringify({ email, password }),
  })
}

export function login(email: string, password: string) {
  return apiRequest<LoginResponse>("/api/v1/auth/login", {
    method: "POST",
    auth: false,
    body: JSON.stringify({ email, password }),
  })
}

export function logout() {
  return apiRequest<ApiMessageResponse>("/api/v1/auth/logout", {
    method: "POST",
  })
}

export function forgotPassword(email: string) {
  return apiRequest<ApiMessageResponse>("/api/v1/auth/forgot-password", {
    method: "POST",
    auth: false,
    body: JSON.stringify({ email }),
  })
}

export type ResetPasswordPayload = {
  token: string
  email: string
  password: string
  password_confirmation: string
}

export function resetPassword(payload: ResetPasswordPayload) {
  return apiRequest<ApiMessageResponse>("/api/v1/auth/reset-password", {
    method: "POST",
    auth: false,
    body: JSON.stringify(payload),
  })
}

export function resendVerificationNotification() {
  return apiRequest<ApiMessageResponse>("/api/v1/auth/email/verification-notification", {
    method: "POST",
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

/** Exchange a Google OAuth authorization code for a Bayana session (SPA callback flow). */
export function completeGoogleOAuthCallback(searchParams: URLSearchParams) {
  const query = searchParams.toString()

  return apiRequest<LoginResponse>(`/api/v1/auth/google/callback?${query}`, {
    method: "GET",
    auth: false,
  })
}
