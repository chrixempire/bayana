/** Auth route segments — keep here so UI (e.g. sidebar) never imports from `pages/`. */
export const AUTH_CREATE_ACCOUNT_PATH = "/auth/create-account" as const
export const AUTH_LOGIN_PATH = "/auth/login" as const
/** Accept org invite — optional query: `?name=&inviter=&org=&email=` (or `organisation`). */
export const AUTH_INVITE_PATH = "/auth/invite" as const
export const AUTH_ONBOARDING_PATH = "/auth/onboarding" as const
/** Signed email verification link — mirrors `/api/v1/auth/email/verify/:id/:hash`. */
export const AUTH_EMAIL_VERIFY_PATH = "/auth/email/verify" as const
export const AUTH_FORGOT_PASSWORD_PATH = "/auth/forgot-password" as const
export const AUTH_RESET_PASSWORD_PATH = "/auth/reset-password" as const
/** Frontend route the backend should redirect to after Google OAuth (`?token=`). */
export const AUTH_GOOGLE_CALLBACK_PATH = "/auth/google/callback" as const
/** Post-login shell — redirects to the dashboard getting-started page. */
export const AUTH_HOME_PATH = "/home" as const

export { GETTING_STARTED_PATH } from "./dashboard-paths"
