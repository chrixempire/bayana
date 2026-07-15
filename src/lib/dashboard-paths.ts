/** App shell routes (post-auth dashboard). */
export const GETTING_STARTED_PATH = "/get-started" as const

/** Legacy path — redirects to {@link GETTING_STARTED_PATH}. */
export const GETTING_STARTED_LEGACY_PATH = "/getting-started" as const

export type DashboardTabId =
  | "getting-started"
  | "dashboard"
  | "analytics"
  | "events"
  | "volunteers"
  | "messages"
  | "verification"
  | "settings"

export const DASHBOARD_TAB_PATHS: Record<DashboardTabId, string> = {
  "getting-started": GETTING_STARTED_PATH,
  dashboard: "/dashboard",
  analytics: "/analytics",
  events: "/events",
  volunteers: "/volunteers",
  messages: "/messages",
  verification: "/verification",
  settings: "/settings",
}
