import { Navigate, Route, Routes } from "react-router-dom"
import { CreateAccountPage } from "./pages/auth/CreateAccountPage"
import { LegacyOnboardingRedirect } from "./pages/auth/LegacyOnboardingRedirect"
import { InvitedMemberPage } from "./pages/auth/InvitedMemberPage"
import { LoginPage } from "./pages/auth/LoginPage"
import { OnboardingPage } from "./pages/auth/OnboardingPage"
import { HomePage } from "./pages/HomePage"
import { GettingStartedPage } from "./pages/dashboard/GettingStartedPage"

import {
  AUTH_CREATE_ACCOUNT_PATH,
  AUTH_INVITE_PATH,
  AUTH_HOME_PATH,
  AUTH_LOGIN_PATH,
  AUTH_ONBOARDING_PATH,
  GETTING_STARTED_PATH,
} from "./lib/auth-paths"
import { GETTING_STARTED_LEGACY_PATH } from "./lib/dashboard-paths"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={AUTH_CREATE_ACCOUNT_PATH} replace />} />
      <Route path="/auth" element={<Navigate to={AUTH_CREATE_ACCOUNT_PATH} replace />} />
      <Route path={AUTH_LOGIN_PATH} element={<LoginPage />} />
      <Route path={AUTH_INVITE_PATH} element={<InvitedMemberPage />} />
      <Route path="/auth/create-account" element={<CreateAccountPage />} />
      <Route path={AUTH_HOME_PATH} element={<Navigate to={GETTING_STARTED_PATH} replace />} />
      <Route path={GETTING_STARTED_PATH} element={<GettingStartedPage />} />
      <Route path={GETTING_STARTED_LEGACY_PATH} element={<Navigate to={GETTING_STARTED_PATH} replace />} />
      <Route path="/home/legacy" element={<HomePage />} />
      <Route path="/auth/onboarding/choose-plan" element={<Navigate to={`${AUTH_ONBOARDING_PATH}/review?plan=open`} replace />} />
      <Route path="/auth/onboarding/:step" element={<OnboardingPage />} />
      <Route path="/auth/onboarding" element={<Navigate to={`${AUTH_ONBOARDING_PATH}/check-email`} replace />} />
      <Route path="/onboarding/:step" element={<LegacyOnboardingRedirect />} />
    </Routes>
  )
}

export default App
