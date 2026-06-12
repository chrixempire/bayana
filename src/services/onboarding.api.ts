import type { ApiClient } from "../lib/api/client"
import type { ApiDataResponse, ApiMessageResponse } from "../lib/api/types"
import type { OnboardingData, OnboardingFlowStep } from "../pages/auth/types"

export type OnboardingDraftResponse = {
  data: OnboardingData
  currentStep?: OnboardingFlowStep
}

export type SaveOnboardingStepPayload = {
  step: OnboardingFlowStep
  data: OnboardingData
}

export type SubmitOnboardingPayload = {
  data: OnboardingData
  planId?: string
}

export function createOnboardingApi(client: ApiClient) {
  return {
    getDraft() {
      return client.get<ApiDataResponse<OnboardingDraftResponse>>("/onboarding/draft")
    },

    saveStep(payload: SaveOnboardingStepPayload) {
      return client.patch<ApiDataResponse<OnboardingDraftResponse>>("/onboarding/draft", payload)
    },

    submit(payload: SubmitOnboardingPayload) {
      return client.post<ApiMessageResponse>("/onboarding/submit", payload)
    },
  }
}

export type OnboardingApi = ReturnType<typeof createOnboardingApi>
