import type {
  PersonAvatarTone,
  Volunteer,
  VolunteerStatus,
} from "../../pages/dashboard/event-detail-types"
import { resolveCausePhotoUrl } from "./cause-readers"
import { apiRequest } from "./client"
import type { ApiDataResponse, ApiMessageResponse } from "./types"

/**
 * Participant status values returned/accepted by the API.
 * The organisation participants list can filter by `pending | approved | rejected`,
 * while the PATCH endpoint only accepts `approved | rejected`.
 */
export type ApiParticipantStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "waitlisted"
  | "removed"
  | (string & {})

export type ApiParticipantActionStatus = "approved" | "rejected"

type ApiParticipantUser = {
  uuid?: string | null
  id?: string | number | null
  first_name?: string | null
  last_name?: string | null
  name?: string | null
  full_name?: string | null
  username?: string | null
  handle?: string | null
  email?: string | null
  phone?: string | null
  phone_number?: string | null
  contact_phone?: string | null
  avatar?: string | null
  avatar_url?: string | null
  photo_url?: string | null
  profile_photo?: string | null
  reliability_score?: number | string | null
}

type ApiParticipantSkill = { id?: number; name?: string | null } | string

export type ApiCauseParticipant = {
  uuid?: string
  id?: string | number
  status?: ApiParticipantStatus | null
  reason?: string | null
  motivation?: string | null
  is_new?: boolean | null
  reliability_score?: number | string | null
  applied_at?: string | null
  created_at?: string | null
  joined_at?: string | null
  approved_at?: string | null
  user?: ApiParticipantUser | null
  volunteer?: ApiParticipantUser | null
  skills?: ApiParticipantSkill[] | null
}

export type CauseParticipantQuery = {
  status?: ApiParticipantStatus
  skill_id?: number | string
  per_page?: number
  page?: number
}

/* --------------------------------- Requests --------------------------------- */

export function getCauseParticipants(
  causeUuid: string,
  query: CauseParticipantQuery = {},
) {
  const params = new URLSearchParams()
  if (query.status) params.set("status", query.status)
  if (query.skill_id != null && query.skill_id !== "") params.set("skill_id", String(query.skill_id))
  if (query.per_page) params.set("per_page", String(query.per_page))
  if (query.page) params.set("page", String(query.page))

  const suffix = params.toString() ? `?${params.toString()}` : ""

  return apiRequest<ApiDataResponse<ApiCauseParticipant[] | { data?: ApiCauseParticipant[] }>>(
    `/api/v1/organisation/causes/${causeUuid}/participants${suffix}`,
    { method: "GET" },
  )
}

export function getCauseParticipant(causeUuid: string, participantUuid: string) {
  return apiRequest<ApiDataResponse<ApiCauseParticipant>>(
    `/api/v1/organisation/causes/${causeUuid}/participants/${participantUuid}`,
    { method: "GET" },
  )
}

export function updateCauseParticipantStatus(
  causeUuid: string,
  participantUuid: string,
  status: ApiParticipantActionStatus,
) {
  return apiRequest<ApiDataResponse<ApiCauseParticipant> | ApiMessageResponse>(
    `/api/v1/organisation/causes/${causeUuid}/participants/${participantUuid}`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
      headers: { "Content-Type": "application/json" },
    },
  )
}

/* --------------------------------- Readers --------------------------------- */

export function extractParticipants(
  payload: ApiDataResponse<ApiCauseParticipant[] | { data?: ApiCauseParticipant[] }>,
): ApiCauseParticipant[] {
  const data = payload.data
  if (Array.isArray(data)) return data
  if (data && typeof data === "object" && Array.isArray(data.data)) return data.data
  return []
}

export function getParticipantUuid(participant: ApiCauseParticipant): string | null {
  if (typeof participant.uuid === "string" && participant.uuid.trim()) return participant.uuid
  if (typeof participant.id === "string" && participant.id.trim()) return participant.id
  if (typeof participant.id === "number") return String(participant.id)
  return null
}

const AVATAR_TONES: PersonAvatarTone[] = ["orange", "purple", "blue", "green"]

function toneForKey(key: string): PersonAvatarTone {
  let hash = 0
  for (let index = 0; index < key.length; index += 1) {
    hash = (hash * 31 + key.charCodeAt(index)) >>> 0
  }
  return AVATAR_TONES[hash % AVATAR_TONES.length]
}

/** Maps an API participant status onto the UI's narrower status set. */
export function mapParticipantStatus(status?: ApiParticipantStatus | null): VolunteerStatus {
  switch ((status ?? "").toLowerCase()) {
    case "approved":
    case "accepted":
      return "accepted"
    case "waitlisted":
    case "waitlist":
      return "waitlist"
    default:
      return "pending"
  }
}

function readUser(participant: ApiCauseParticipant): ApiParticipantUser {
  return participant.user ?? participant.volunteer ?? {}
}

function readName(user: ApiParticipantUser): string {
  const composed = [user.first_name, user.last_name].filter(Boolean).join(" ").trim()
  return (
    user.name?.trim() ||
    user.full_name?.trim() ||
    composed ||
    user.username?.trim() ||
    "Volunteer"
  )
}

function readHandle(user: ApiParticipantUser, name: string): string {
  const handle = user.handle?.trim() || user.username?.trim()
  if (handle) return handle.replace(/^@/, "")
  return name.toLowerCase().replace(/\s+/g, "")
}

function readPhone(user: ApiParticipantUser): string {
  return (
    user.phone?.trim() ||
    user.phone_number?.trim() ||
    user.contact_phone?.trim() ||
    "--"
  )
}

function readAvatar(user: ApiParticipantUser): string {
  const raw =
    user.avatar_url?.trim() ||
    user.avatar?.trim() ||
    user.photo_url?.trim() ||
    user.profile_photo?.trim() ||
    ""
  return raw ? resolveCausePhotoUrl(raw) : ""
}

function readSkillNames(participant: ApiCauseParticipant): string[] {
  return (participant.skills ?? [])
    .map((skill) => (typeof skill === "string" ? skill : skill?.name ?? ""))
    .map((name) => name.trim())
    .filter(Boolean)
}

function readReliability(
  participant: ApiCauseParticipant,
  user: ApiParticipantUser,
): number | undefined {
  const raw = participant.reliability_score ?? user.reliability_score
  const value = Number(raw)
  return Number.isFinite(value) ? value : undefined
}

function formatAppliedDate(value?: string | null): string {
  if (!value?.trim()) return "--"
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

/** Maps an API participant record onto the UI `Volunteer` row shape. */
export function mapParticipantToVolunteer(participant: ApiCauseParticipant): Volunteer | null {
  const id = getParticipantUuid(participant)
  if (!id) return null

  const user = readUser(participant)
  const name = readName(user)
  const appliedRaw = participant.applied_at ?? participant.created_at
  const joinedRaw = participant.joined_at ?? participant.approved_at

  return {
    id,
    name,
    handle: readHandle(user, name),
    email: user.email?.trim() || "--",
    phone: readPhone(user),
    avatarTone: toneForKey(id),
    avatarImage: readAvatar(user) || undefined,
    isNew: participant.is_new === true,
    skills: readSkillNames(participant),
    reason: participant.reason?.trim() || participant.motivation?.trim() || null,
    status: mapParticipantStatus(participant.status),
    dateApplied: formatAppliedDate(appliedRaw),
    dateJoined: formatAppliedDate(joinedRaw ?? appliedRaw),
    reliability: readReliability(participant, user),
  }
}

export function mapParticipantsToVolunteers(participants: ApiCauseParticipant[]): Volunteer[] {
  return participants
    .map((participant) => mapParticipantToVolunteer(participant))
    .filter((volunteer): volunteer is Volunteer => volunteer != null)
}
