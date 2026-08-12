import type { ApiNeed } from "./api/need-types"
import { formatNeedsSummaryDateRange, normalizeApiDateInput } from "./create-event-format"
import { getNeedUuid } from "./api/needs"
import type { EventTableRow } from "../pages/dashboard/events-types"

function readNeedAreaNames(need: ApiNeed): string[] {
  const areas = need.cause_areas ?? need.categories ?? need.category ?? []
  return areas
    .map((area) => area.name?.trim())
    .filter((name): name is string => Boolean(name))
}

function readNeedCoverUrl(need: ApiNeed): string {
  const fromImages = need.need_images ?? []
  for (const image of fromImages) {
    const url = image.photo_url ?? image.url
    if (url) return url
  }

  if (Array.isArray(need.images)) {
    for (const image of need.images) {
      if (typeof image === "string" && image.trim()) return image
      if (image && typeof image === "object") {
        const url = image.photo_url ?? image.url ?? image.path
        if (url) return url
      }
    }
  }

  if (typeof need.image === "string" && need.image.trim()) return need.image
  if (Array.isArray(need.image)) {
    const first = need.image.find((url) => typeof url === "string" && url.trim())
    if (first) return first
  }

  return ""
}

function formatDateRange(startDate?: string | null, endDate?: string | null): string | null {
  if (!startDate && !endDate) return null
  return (
    formatNeedsSummaryDateRange(startDate ?? endDate ?? "", endDate ?? startDate ?? "") || null
  )
}

function mapVisibility(
  value?: string | null,
  status?: string | null,
): EventTableRow["visibility"]["type"] {
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

function needTypeDetail(need: ApiNeed): string | null {
  const type = need.need_type?.trim()
  if (!type) return null
  if (type === "material") return "In-kind"
  if (type === "financial") return "Financial"
  return type
}

export function mapNeedToTableRow(need: ApiNeed): EventTableRow | null {
  const id = getNeedUuid(need)
  if (!id || !need.title) return null

  const tags = readNeedAreaNames(need)

  return {
    id,
    kind: "needs",
    eventType: "needs",
    cause: {
      thumbnailUrl: readNeedCoverUrl(need),
      title: need.title,
      description: need.description ?? "",
    },
    visibility: {
      type: mapVisibility(need.visibility, need.status),
      lifecycleStatus: mapLifecycleStatus(need.status),
    },
    category: {
      tags,
      extraCount: Math.max(0, tags.length - 1),
    },
    volunteerType: {
      type: null,
      detail: needTypeDetail(need),
    },
    date: {
      range: formatDateRange(need.start_date, need.end_date),
      time: null,
      startDate: need.start_date ? normalizeApiDateInput(need.start_date) : null,
      endDate: need.end_date ? normalizeApiDateInput(need.end_date) : null,
    },
    volunteers: null,
    shareUrl: null,
  }
}

export function mapNeedsToTableRows(needs: ApiNeed[]): EventTableRow[] {
  return needs.flatMap((need) => {
    const row = mapNeedToTableRow(need)
    return row ? [row] : []
  })
}
