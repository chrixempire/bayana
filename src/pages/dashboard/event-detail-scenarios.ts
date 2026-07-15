import eventDetailData from "../../data/event-detail.json"
import type { EventDetail } from "./event-detail-types"

/**
 * Returns the mock event detail. The `eventId` is accepted so callers can
 * deep-link a specific event; until the API is wired up every id resolves to
 * the same sample record (with its id reflected back).
 */
export function getEventDetail(eventId?: string): EventDetail {
  const event = eventDetailData.event as EventDetail
  return eventId ? { ...event, id: eventId } : event
}
