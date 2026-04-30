/** Auth route segments — keep here so UI (e.g. sidebar) never imports from `pages/`. */
export const AUTH_CREATE_ACCOUNT_PATH = "/auth/create-account" as const
export const AUTH_LOGIN_PATH = "/auth/login" as const
/** Accept org invite — optional query: `?org=…&email=…` (or `organisation`). */
export const AUTH_INVITE_PATH = "/auth/invite" as const
export const AUTH_ONBOARDING_PATH = "/auth/onboarding" as const
/** Post-login shell until a real dashboard route exists. */
export const AUTH_HOME_PATH = "/home" as const
