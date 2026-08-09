import { createAuthApi } from "../../services/auth.api"
import { createOnboardingApi } from "../../services/onboarding.api"
import { createOrgApi } from "../../services/org.api"
import { handleUnauthorizedResponse } from "../auth/handle-unauthorized"
import { getAuthToken } from "./auth-token"
import { createApiClient } from "./client"
import { getApiBaseUrl } from "./config"

export const apiClient = createApiClient({
  baseURL: getApiBaseUrl(),
  getAuthToken,
  onAuthFailure: () => {
    handleUnauthorizedResponse()
  },
})

export const authApi = createAuthApi(apiClient)
export const onboardingApi = createOnboardingApi(apiClient)
export const orgApi = createOrgApi(apiClient)
