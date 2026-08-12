import type { ApiNeed } from "./api/need-types"
import { getNeedUuid } from "./api/needs"
import {
  formatCauseDisplayDate,
  formatNeedsSummaryDateRange,
  normalizeApiDateInput,
} from "./create-event-format"
import type {
  DonationsData,
  EventDetail,
  EventDetailMetaRow,
  EventDetailStatus,
  NeedsHomeData,
  NeedsInKindData,
  ReviewsData,
  UpdatesData,
  VolunteersData,
} from "../pages/dashboard/event-detail-types"

const STATUS_LABELS: Record<EventDetailStatus, string> = {
  active: "Active",
  upcoming: "Upcoming",
  completed: "Completed",
  "fully-fulfilled": "Fully fulfilled",
  draft: "Draft",
}

const EMPTY_REVIEWS: ReviewsData = {
  averageRating: 0,
  totalReviews: 0,
  rows: [],
}

const EMPTY_UPDATES: UpdatesData = {
  rows: [],
}

const EMPTY_VOLUNTEERS: VolunteersData = {
  totals: {
    volunteers: { current: 0, max: 0 },
    spotsLeft: 0,
    pending: 0,
    waitlists: 0,
  },
  capacity: [],
  rows: [],
}

function mapStatus(value?: string | null): EventDetailStatus {
  if (value === "active") return "active"
  if (value === "completed") return "completed"
  if (value === "draft") return "draft"
  if (value === "upcoming") return "upcoming"
  if (value === "fully-fulfilled" || value === "fully_fulfilled") return "fully-fulfilled"
  return "active"
}

function isTruthyFlag(value: unknown): boolean {
  return value === true || value === 1 || value === "1" || value === "true"
}

function isMaterialNeed(need: ApiNeed): boolean {
  if (need.need_type === "material") return true
  if (need.need_type === "financial") return false
  // Legacy/optional field — DB may not have `in_kind`; prefer need_type + items.
  if (isTruthyFlag(need.in_kind)) return true
  return (need.items ?? need.need_items ?? []).length > 0
}

function formatNaira(amount: number | string | null | undefined): string {
  const value = Number(amount)
  if (!Number.isFinite(value)) return "₦0"
  return `₦${value.toLocaleString("en-NG", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
}

function formatNairaCompact(amount: number | string | null | undefined): string {
  const value = Number(amount)
  if (!Number.isFinite(value)) return "0"
  return value.toLocaleString("en-NG", { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

function formatUpdatedAt(value?: string | null): string {
  if (!value) return "—"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "—"

  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

function readNeedAreaNames(need: ApiNeed): string[] {
  const areas = need.cause_areas ?? need.categories ?? need.category ?? []
  return areas
    .map((area) => area.name?.trim())
    .filter((name): name is string => Boolean(name))
}

function readNeedCoverUrls(need: ApiNeed): string[] {
  const urls: string[] = []

  for (const image of need.need_images ?? []) {
    const url = image.photo_url ?? image.url
    if (url?.trim()) urls.push(url.trim())
  }

  if (Array.isArray(need.images)) {
    for (const image of need.images) {
      if (typeof image === "string" && image.trim()) urls.push(image.trim())
      else if (image && typeof image === "object") {
        const url = image.photo_url ?? image.url ?? image.path
        if (url?.trim()) urls.push(url.trim())
      }
    }
  }

  if (typeof need.image === "string" && need.image.trim()) urls.push(need.image.trim())
  if (Array.isArray(need.image)) {
    for (const url of need.image) {
      if (typeof url === "string" && url.trim()) urls.push(url.trim())
    }
  }

  return Array.from(new Set(urls))
}

function readNeedItems(need: ApiNeed) {
  return need.items ?? need.need_items ?? []
}

function totalItemQuantity(need: ApiNeed): number {
  return readNeedItems(need).reduce((sum, item) => sum + (Number(item.quantity) || 0), 0)
}

function donationTypeLabel(need: ApiNeed): string {
  const inKind = isMaterialNeed(need)
  const hasCash = Number(need.target_amount) > 0 || need.need_type === "financial"
  if (inKind && hasCash) return "In cash, In-kind"
  if (inKind) return "In-kind"
  return "In cash"
}

function readRaisedAmount(need: ApiNeed): number {
  const raw =
    (need as { donation_received_amount?: number | string | null }).donation_received_amount ??
    (need as { amount_raised?: number | string | null }).amount_raised ??
    0
  const value = Number(raw)
  return Number.isFinite(value) ? value : 0
}

function buildMeta(need: ApiNeed): EventDetailMetaRow[] {
  const start = need.start_date ? normalizeApiDateInput(need.start_date) : ""
  const end = need.end_date ? normalizeApiDateInput(need.end_date) : start
  const dateValue =
    start && end && start !== end
      ? formatNeedsSummaryDateRange(start, end)
      : formatCauseDisplayDate(start || end)

  const itemCount = totalItemQuantity(need)
  const rows: EventDetailMetaRow[] = [
    { id: "date", icon: "calendar", label: "Date", value: dateValue || "—" },
    {
      id: "visibility",
      icon: "visibility",
      label: "Visibility",
      value: need.visibility === "private" ? "Private" : "Public",
    },
    {
      id: "donation-type",
      icon: "donation-type",
      label: "Donation type",
      value: donationTypeLabel(need),
    },
    {
      id: "target-amount",
      icon: "target-amount",
      label: "Target amount",
      value: formatNaira(need.target_amount),
    },
  ]

  if (itemCount > 0) {
    rows.push({
      id: "items",
      icon: "items",
      label: "Items",
      value: `${itemCount} item${itemCount === 1 ? "" : "s"}`,
    })
  }

  rows.push({
    id: "updated",
    icon: "updated",
    label: "Last updated",
    value: formatUpdatedAt(need.updated_at),
  })

  return rows
}

function buildNeedsHome(need: ApiNeed): NeedsHomeData {
  const goal = Number(need.target_amount) || 0
  const raised = readRaisedAmount(need)
  const itemGoal = totalItemQuantity(need)
  const inKind = isMaterialNeed(need)

  return {
    donorsCount: 0,
    inCashRaised: formatNaira(raised),
    inCashGoal: formatNairaCompact(goal),
    ...(inKind && itemGoal > 0
      ? {
          inKindRaised: "0",
          inKindGoal: String(itemGoal),
        }
      : {}),
    recentDonations: [],
  }
}

function buildInKind(need: ApiNeed): NeedsInKindData | undefined {
  if (!isMaterialNeed(need)) return undefined

  const totalItems = totalItemQuantity(need)
  return {
    totalItems,
    itemsLeft: totalItems,
    itemsReceived: 0,
    donorsCount: 0,
    rows: [],
  }
}

function buildDonations(need: ApiNeed): DonationsData {
  const goalValue = Number(need.target_amount) || 0
  const raisedValue = readRaisedAmount(need)

  return {
    goal: formatNaira(goalValue),
    raised: formatNaira(raisedValue),
    raisedValue,
    goalValue,
    availableForWithdrawal: formatNaira(raisedValue),
    amountWithdrawn: "₦0",
    rows: [],
  }
}

export function mapNeedToEventDetail(need: ApiNeed): EventDetail | null {
  const id = getNeedUuid(need)
  if (!id || !need.title) return null

  const status = mapStatus(need.status)
  const home = buildNeedsHome(need)
  const inKind = buildInKind(need)

  return {
    id,
    kind: "needs",
    status,
    statusLabel: STATUS_LABELS[status],
    breadcrumb: ["Events", "Needs", need.title],
    title: need.title,
    coverImages: readNeedCoverUrls(need),
    accessCode: need.access_code ?? null,
    meta: buildMeta(need),
    about: {
      label: "About this need",
      description: need.description?.trim() || "—",
      categories: readNeedAreaNames(need),
      requirements: [],
      skills: [],
    },
    certificate: {
      kindLabel: "NEED",
      heading: "Certificate of Appreciation",
      presentedTo: "THIS CERTIFICATE IS PRESENTED TO",
      recipientName: "Donor's name",
      body: `For generously supporting ${need.title} on ${formatCauseDisplayDate(need.start_date, "the need date")}`,
      signatureName: "Name",
      signatureRole: "Position, Company",
    },
    stats: {
      volunteers: { current: 0, max: 0 },
      donations: {
        current: home.inCashRaised,
        max: formatNaira(need.target_amount),
      },
      sessions: { current: 0, max: 0 },
      attendance: "0%",
    },
    sessionsTotal: 0,
    sessions: [],
    volunteers: EMPTY_VOLUNTEERS,
    donations: buildDonations(need),
    reviews: EMPTY_REVIEWS,
    updates: EMPTY_UPDATES,
    needs: home,
    inKind,
  }
}
