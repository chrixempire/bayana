import type { ApiCause } from "./api/cause-types"
import {
  readCauseAreaNames,
  readCauseCoverUrl,
  readCauseVolunteersJoined,
  readCauseVolunteersMax,
} from "./api/cause-readers"
import { formatNeedsSummaryDateRange, formatTime12h, normalizeApiDateInput } from "./create-event-format"
import { getCauseUuid } from "./api/causes"
import type { EventTableRow } from "../pages/dashboard/events-types"

function formatDateRange(startDate?: string | null, endDate?: string | null): string | null {
  if (!startDate && !endDate) return null
  if (startDate && endDate && normalizeApiDateInput(startDate) !== normalizeApiDateInput(endDate)) {
    return formatNeedsSummaryDateRange(startDate, endDate)
  }
  return formatNeedsSummaryDateRange(startDate ?? endDate ?? "", endDate ?? startDate ?? "") || null
}

function formatTimeRange(startTime?: string | null, endTime?: string | null): string | null {
  if (!startTime && !endTime) return null
  if (startTime && endTime) {
    return `${formatTime12h(startTime)} - ${formatTime12h(endTime)}`
  }
  return startTime ? formatTime12h(startTime) : endTime ? formatTime12h(endTime) : null
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

  const tags = readCauseAreaNames(cause)
  const volunteeringType = mapVolunteeringType(cause.volunteering_type)
  const maxVolunteers = readCauseVolunteersMax(cause)
  const joinedVolunteers = readCauseVolunteersJoined(cause)

  return {
    id,
    kind: "cause",
    cause: {
      thumbnailUrl: readCauseCoverUrl(cause),
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
      detail:
        volunteeringType === "in-person"
          ? cause.address ?? null
          : volunteeringType === "virtual"
            ? "Virtual"
            : null,
    },
    date: {
      range: formatDateRange(cause.start_date, cause.end_date),
      time: formatTimeRange(cause.start_time, cause.end_time),
      startDate: cause.start_date ? normalizeApiDateInput(cause.start_date) : null,
      endDate: cause.end_date ? normalizeApiDateInput(cause.end_date) : null,
    },
    volunteers: maxVolunteers
      ? {
          current: joinedVolunteers,
          max: maxVolunteers,
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
