import type { EventDetailTabId } from "../pages/dashboard/event-detail-types"

/** Route pattern for a single event's detail page. */
export const EVENT_DETAIL_PATH = "/events/:eventId" as const

/** Build the detail-page URL for a given event, optionally deep-linking a tab. */
export function eventDetailPath(eventId: string, tab?: EventDetailTabId) {
  const base = `/events/${eventId}`
  return tab && tab !== "home" ? `${base}?tab=${tab}` : base
}

export function parseEventDetailTab(value: string | null): EventDetailTabId {
  if (
    value === "updates" ||
    value === "volunteers" ||
    value === "donations" ||
    value === "reviews" ||
    value === "in-kind"
  ) {
    return value
  }
  return "home"
}
