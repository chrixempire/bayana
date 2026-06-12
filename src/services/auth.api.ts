import type { ApiClient } from "../lib/api/client"
import type { ApiDataResponse, ApiMessageResponse } from "../lib/api/types"

export type RequestLoginLinkPayload = {
  email: string
}

export type CreateAccountPayload = {
  email: string
}

export type AuthSession = {
  id: string
  email: string
  organizationId?: string
}

export function createAuthApi(client: ApiClient) {
  return {
    requestLoginLink(payload: RequestLoginLinkPayload) {
      return client.post<ApiMessageResponse>("/auth/login-link", payload)
    },

    createAccount(payload: CreateAccountPayload) {
      return client.post<ApiMessageResponse>("/auth/accounts", payload)
    },

    getSession() {
      return client.get<ApiDataResponse<AuthSession>>("/auth/session")
    },

    logout() {
      return client.post<ApiMessageResponse>("/auth/logout")
    },
  }
}

export type AuthApi = ReturnType<typeof createAuthApi>
