import { Navigate, useParams } from "react-router-dom"
import { AUTH_CREATE_ACCOUNT_PATH, AUTH_ONBOARDING_PATH } from "../../lib/auth-paths"
import { onboardingFlowSteps, type OnboardingFlowStep } from "./types"

/** Maps old `/onboarding/:step` URLs to `/auth/...`. */
export function LegacyOnboardingRedirect() {
  const { step } = useParams<{ step: string }>()
  if (step === "create-account") {
    return <Navigate to={AUTH_CREATE_ACCOUNT_PATH} replace />
  }
  if (step && onboardingFlowSteps.includes(step as OnboardingFlowStep)) {
    return <Navigate to={`${AUTH_ONBOARDING_PATH}/${step}`} replace />
  }
  return <Navigate to={AUTH_CREATE_ACCOUNT_PATH} replace />
}
