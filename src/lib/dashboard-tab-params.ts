import type { AnalyticsTab } from "../pages/dashboard/analytics-data"
import type { EventsTabId } from "../pages/dashboard/events-types"

const EVENTS_TABS: EventsTabId[] = ["causes", "needs", "collaborations"]
const ANALYTICS_TABS: AnalyticsTab[] = ["overview", "donations", "volunteers"]
const VOLUNTEER_TABS = ["volunteers", "reviews"] as const

export type VolunteerSubTab = (typeof VOLUNTEER_TABS)[number]

export function parseEventsTab(value: string | null, fallback: EventsTabId = "causes"): EventsTabId {
  return EVENTS_TABS.includes(value as EventsTabId) ? (value as EventsTabId) : fallback
}

export function parseVolunteerSubTab(value: string | null): VolunteerSubTab {
  return value === "reviews" ? "reviews" : "volunteers"
}

export function parseAnalyticsTab(value: string | null): AnalyticsTab {
  return ANALYTICS_TABS.includes(value as AnalyticsTab) ? (value as AnalyticsTab) : "overview"
}

/** Sync the `tab` query param; omit it when the tab matches the page default. */
export function withTabSearchParam(
  prev: URLSearchParams,
  tab: string,
  defaultTab: string,
): URLSearchParams {
  const next = new URLSearchParams(prev)
  if (tab === defaultTab) next.delete("tab")
  else next.set("tab", tab)
  return next
}
