import type { EventDetailTabId } from "../pages/dashboard/event-detail-types"

/** Route pattern for a single event's detail page. */
export const EVENT_DETAIL_PATH = "/events/:eventId" as const

/** Build the detail-page URL for a given event, optionally deep-linking a tab / kind. */
export function eventDetailPath(
  eventId: string,
  tab?: EventDetailTabId,
  opts?: { kind?: "needs" | "cause" },
) {
  const params = new URLSearchParams()
  if (tab && tab !== "home") params.set("tab", tab)
  if (opts?.kind === "needs") params.set("kind", "needs")
  const query = params.toString()
  return query ? `/events/${eventId}?${query}` : `/events/${eventId}`
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
