import type { ApiCause } from "./api/cause-types"
import { getCauseUuid } from "./api/causes"
import {
  parseCauseRequirements,
  readCauseAreaNames,
  readCauseCoverUrls,
  readCauseSkillNames,
  readCauseSkillRequired,
  readCauseVolunteersJoined,
  readCauseVolunteersMax,
} from "./api/cause-readers"
import {
  formatCauseDisplayDate,
  formatNeedsSummaryDateRange,
  formatSummaryDateTime,
  formatTime12h,
  normalizeApiDateInput,
} from "./create-event-format"
import type {
  DonationsData,
  EventDetail,
  EventDetailMetaRow,
  EventDetailStatus,
  EventSession,
  ReviewsData,
  SkillCapacity,
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

function parseDate(value?: string | null): Date | null {
  if (!value) return null
  const normalized = normalizeApiDateInput(value)
  const date = new Date(`${normalized}T12:00:00`)
  return Number.isNaN(date.getTime()) ? null : date
}

function mapStatus(value?: string | null): EventDetailStatus {
  if (value === "active") return "active"
  if (value === "completed") return "completed"
  if (value === "draft") return "draft"
  if (value === "upcoming") return "upcoming"
  if (value === "fully-fulfilled" || value === "fully_fulfilled") return "fully-fulfilled"
  return "active"
}

function mapVolunteeringTypeLabel(value?: string | null): string {
  if (value === "virtual") return "Virtual"
  if (value === "in_person" || value === "in-person") return "In person"
  return "—"
}

function isVirtualCause(cause: ApiCause): boolean {
  return cause.volunteering_type === "virtual"
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

function formatVolunteersMeta(max: number, joined: number): string {
  if (max > 0) return `${max} volunteers (${joined} joined)`
  return joined > 0 ? `${joined} volunteers joined` : "Open capacity"
}

function formatNaira(amount: number | string | null | undefined): string {
  const value = Number(amount)
  if (!Number.isFinite(value)) return "₦0"
  return `₦${value.toLocaleString("en-NG", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
}

function buildSkillCapacity(cause: ApiCause): SkillCapacity[] {
  return (cause.skills ?? []).map((skill) => ({
    skill: skill.name ?? `Skill ${skill.id ?? skill.skill_id ?? ""}`,
    filled: 0,
    total: readCauseSkillRequired(skill),
  }))
}

function buildSessions(cause: ApiCause, status: EventDetailStatus): EventSession[] {
  const startDate = parseDate(cause.start_date)
  const endDate = parseDate(cause.end_date ?? cause.start_date)
  if (!startDate || !endDate) return []

  const timeLabel =
    cause.start_time && cause.end_time
      ? `${formatTime12h(cause.start_time)} - ${formatTime12h(cause.end_time)}`
      : "—"

  const location = isVirtualCause(cause)
    ? "Virtual"
    : [cause.address, cause.country].filter(Boolean).join(", ") || "—"

  const sessions: EventSession[] = []
  const cursor = new Date(startDate)

  while (cursor.getTime() <= endDate.getTime()) {
    const index = sessions.length
    sessions.push({
      id: `${normalizeApiDateInput(cause.start_date ?? "")}-${index}`,
      month: cursor.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
      day: String(cursor.getDate()),
      time: timeLabel,
      title:
        index === 0
          ? cause.title ?? "Session"
          : `Day ${index + 1} - ${cause.title ?? "Session"}`,
      location,
      happening: status === "active" && index === 0,
      meetLink: isVirtualCause(cause) ? cause.google_meet_link ?? undefined : undefined,
      attendees: null,
    })
    cursor.setDate(cursor.getDate() + 1)
  }

  return sessions
}

function buildMeta(cause: ApiCause, maxVolunteers: number, joinedVolunteers: number): EventDetailMetaRow[] {
  const dateValue =
    cause.start_date && cause.start_time && cause.end_time
      ? formatSummaryDateTime(
          cause.start_date,
          cause.end_date ?? cause.start_date,
          cause.start_time,
          cause.end_time,
        )
      : cause.start_date && cause.end_date
        ? formatNeedsSummaryDateRange(cause.start_date, cause.end_date)
        : cause.start_date
          ? formatCauseDisplayDate(cause.start_date)
          : "—"

  return [
    {
      id: "date",
      icon: "calendar",
      label: "Date",
      value: dateValue,
    },
    {
      id: "volunteers",
      icon: "volunteers",
      label: "Volunteers (joined)",
      value: formatVolunteersMeta(maxVolunteers, joinedVolunteers),
    },
    {
      id: "visibility",
      icon: "visibility",
      label: "Visibility",
      value: cause.visibility === "private" ? "Private" : "Public",
    },
    {
      id: "type",
      icon: "type",
      label: "Volunteering type",
      value: mapVolunteeringTypeLabel(cause.volunteering_type),
    },
    {
      id: "updated",
      icon: "updated",
      label: "Last updated",
      value: formatUpdatedAt(cause.updated_at),
      avatarInitial: "O",
    },
  ]
}

function buildCertificate(cause: ApiCause) {
  const eventName = cause.title ?? "this cause"
  const dateLabel = formatCauseDisplayDate(cause.start_date, "the event date")

  return {
    kindLabel: "CAUSE",
    heading: "Certificate of Participation",
    presentedTo: "THIS CERTIFICATE IS PRESENTED TO",
    recipientName: "Volunteer's name",
    body: `For successfully volunteering to ${eventName} on ${dateLabel}`,
    signatureName: "Name",
    signatureRole: "Position, Company",
  }
}

function buildDonations(cause: ApiCause): DonationsData {
  const goalValue = Number(cause.donation_goal_amount) || 0
  const raisedValue = Number(cause.donation_received_amount) || 0

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

export function mapCauseToEventDetail(cause: ApiCause): EventDetail | null {
  const id = getCauseUuid(cause)
  if (!id || !cause.title) return null

  const status = mapStatus(cause.status)
  const maxVolunteers = readCauseVolunteersMax(cause)
  const joinedVolunteers = readCauseVolunteersJoined(cause)
  const sessions = buildSessions(cause, status)
  const skillCapacity = buildSkillCapacity(cause)
  const spotsLeft = maxVolunteers > 0 ? Math.max(0, maxVolunteers - joinedVolunteers) : 0

  const volunteers: VolunteersData = {
    totals: {
      volunteers: { current: joinedVolunteers, max: maxVolunteers },
      spotsLeft,
      pending: 0,
      waitlists: 0,
    },
    capacity: skillCapacity,
    rows: [],
  }

  return {
    id,
    kind: "cause",
    status,
    statusLabel: STATUS_LABELS[status],
    breadcrumb: ["Events", "Causes", cause.title],
    title: cause.title,
    coverImages: readCauseCoverUrls(cause),
    accessCode: cause.access_code ?? null,
    meta: buildMeta(cause, maxVolunteers, joinedVolunteers),
    about: {
      label: "About this cause",
      description: cause.description?.trim() || "—",
      categories: readCauseAreaNames(cause),
      requirements: parseCauseRequirements(cause.requirements),
      skills: readCauseSkillNames(cause),
    },
    certificate: buildCertificate(cause),
    stats: {
      volunteers: { current: joinedVolunteers, max: maxVolunteers },
      donations: {
        current: formatNaira(cause.donation_received_amount),
        max: formatNaira(cause.donation_goal_amount),
      },
      sessions: { current: 0, max: sessions.length },
      attendance: joinedVolunteers > 0 && sessions.length > 0 ? "0%" : "0%",
    },
    sessionsTotal: sessions.length,
    sessions,
    volunteers,
    donations: buildDonations(cause),
    reviews: EMPTY_REVIEWS,
    updates: EMPTY_UPDATES,
  }
}
