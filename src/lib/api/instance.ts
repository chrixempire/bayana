import { createAuthApi } from "../../services/auth.api"
import { createOnboardingApi } from "../../services/onboarding.api"
import { createOrgApi } from "../../services/org.api"
import { clearAuthToken, getAuthToken } from "./auth-token"
import { createApiClient } from "./client"
import { getApiBaseUrl } from "./config"

export const apiClient = createApiClient({
  baseURL: getApiBaseUrl(),
  getAuthToken,
  onAuthFailure: () => {
    clearAuthToken()
  },
})

export const authApi = createAuthApi(apiClient)
export const onboardingApi = createOnboardingApi(apiClient)
export const orgApi = createOrgApi(apiClient)
