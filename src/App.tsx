import { Navigate, Route, Routes } from "react-router-dom"
import { CreateAccountPage } from "./pages/auth/CreateAccountPage"
import { LegacyOnboardingRedirect } from "./pages/auth/LegacyOnboardingRedirect"
import { InvitedMemberPage } from "./pages/auth/InvitedMemberPage"
import { LoginPage } from "./pages/auth/LoginPage"
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage"
import { ResetPasswordPage } from "./pages/auth/ResetPasswordPage"
import { GoogleCallbackPage } from "./pages/auth/GoogleCallbackPage"
import { EmailVerifyPage } from "./pages/auth/EmailVerifyPage"
import { OnboardingPage } from "./pages/auth/OnboardingPage"
import { HomePage } from "./pages/HomePage"
import { GettingStartedPage } from "./pages/dashboard/GettingStartedPage"
import { EventsPage } from "./pages/dashboard/EventsPage"
import { EventDetailPage } from "./pages/dashboard/EventDetailPage"
import { CreateEventPage } from "./pages/dashboard/CreateEventPage"

import {
  AUTH_CREATE_ACCOUNT_PATH,
  AUTH_EMAIL_VERIFY_PATH,
  AUTH_FORGOT_PASSWORD_PATH,
  AUTH_GOOGLE_CALLBACK_PATH,
  AUTH_INVITE_PATH,
  AUTH_HOME_PATH,
  AUTH_LOGIN_PATH,
  AUTH_ONBOARDING_PATH,
  AUTH_RESET_PASSWORD_PATH,
  GETTING_STARTED_PATH,
} from "./lib/auth-paths"
import { DASHBOARD_TAB_PATHS, GETTING_STARTED_LEGACY_PATH } from "./lib/dashboard-paths"
import { EVENT_DETAIL_PATH } from "./lib/event-detail-paths"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={AUTH_CREATE_ACCOUNT_PATH} replace />} />
      <Route path="/auth" element={<Navigate to={AUTH_CREATE_ACCOUNT_PATH} replace />} />
      <Route path={AUTH_LOGIN_PATH} element={<LoginPage />} />
      <Route path={AUTH_FORGOT_PASSWORD_PATH} element={<ForgotPasswordPage />} />
      <Route path={AUTH_RESET_PASSWORD_PATH} element={<ResetPasswordPage />} />
      <Route path={AUTH_GOOGLE_CALLBACK_PATH} element={<GoogleCallbackPage />} />
      <Route path={AUTH_INVITE_PATH} element={<InvitedMemberPage />} />
      <Route path="/auth/create-account" element={<CreateAccountPage />} />
      <Route path={`${AUTH_EMAIL_VERIFY_PATH}/:id/:hash`} element={<EmailVerifyPage />} />
      <Route path={AUTH_HOME_PATH} element={<Navigate to={GETTING_STARTED_PATH} replace />} />
      <Route path={GETTING_STARTED_PATH} element={<GettingStartedPage />} />
      <Route path={DASHBOARD_TAB_PATHS.events} element={<EventsPage />} />
      <Route path="/events/create" element={<CreateEventPage />} />
      <Route path={EVENT_DETAIL_PATH} element={<EventDetailPage />} />
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
