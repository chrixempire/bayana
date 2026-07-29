import type { ApiCause } from "./api/cause-types"
import { getCauseUuid } from "./api/causes"
import type { EventTableRow } from "../pages/dashboard/events-types"

function readCategories(cause: ApiCause): string[] {
  const categories = cause.categories ?? cause.category ?? []
  return categories.map((item) => item.name).filter(Boolean)
}

function readCoverUrl(cause: ApiCause): string {
  if (Array.isArray(cause.images) && cause.images.length > 0) {
    const first = cause.images[0]
    if (typeof first === "string") return first
    return first.url ?? first.path ?? ""
  }

  if (Array.isArray(cause.image) && cause.image[0]) return cause.image[0]
  if (typeof cause.image === "string") return cause.image

  return ""
}

function formatDateRange(startDate?: string | null, endDate?: string | null): string | null {
  if (!startDate && !endDate) return null
  if (startDate && endDate && startDate !== endDate) return `${startDate} - ${endDate}`
  return startDate ?? endDate ?? null
}

function formatTimeRange(startTime?: string | null, endTime?: string | null): string | null {
  if (!startTime && !endTime) return null
  if (startTime && endTime) return `${startTime} - ${endTime}`
  return startTime ?? endTime ?? null
}

function mapVolunteeringType(value?: string | null): EventTableRow["volunteerType"]["type"] {
  if (value === "virtual") return "virtual"
  if (value === "in_person" || value === "in-person") return "in-person"
  return null
}

function mapVisibility(value?: string | null, status?: string | null): EventTableRow["visibility"]["type"] {
  if (status === "draft") return "drafts"
  if (value === "private") return "private"
  return "public"
}

function mapLifecycleStatus(status?: string | null): EventTableRow["visibility"]["lifecycleStatus"] {
  if (status === "active") return "active"
  if (status === "completed") return "completed"
  if (status === "upcoming") return "upcoming"
  return status === "draft" ? null : "upcoming"
}

export function mapCauseToTableRow(cause: ApiCause): EventTableRow | null {
  const id = getCauseUuid(cause)
  if (!id || !cause.title) return null

  const tags = readCategories(cause)
  const volunteeringType = mapVolunteeringType(cause.volunteering_type)

  return {
    id,
    kind: "cause",
    cause: {
      thumbnailUrl: readCoverUrl(cause),
      title: cause.title,
      description: cause.description ?? "",
    },
    visibility: {
      type: mapVisibility(cause.visibility, cause.status),
      lifecycleStatus: mapLifecycleStatus(cause.status),
    },
    category: {
      tags,
      extraCount: Math.max(0, tags.length - 1),
    },
    volunteerType: {
      type: volunteeringType,
      detail: volunteeringType === "in-person" ? cause.address ?? null : volunteeringType === "virtual" ? "Virtual" : null,
    },
    date: {
      range: formatDateRange(cause.start_date, cause.end_date),
      time: formatTimeRange(cause.start_time, cause.end_time),
      startDate: cause.start_date ?? null,
      endDate: cause.end_date ?? null,
    },
    volunteers: cause.max_volunteers_capacity
      ? {
          current: 0,
          max: Number(cause.max_volunteers_capacity) || 0,
        }
      : null,
    shareUrl: null,
  }
}

export function mapCausesToTableRows(causes: ApiCause[]): EventTableRow[] {
  return causes.flatMap((cause) => {
    const row = mapCauseToTableRow(cause)
    return row ? [row] : []
  })
}
