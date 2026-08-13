import type { CreateEventFormState } from "../../pages/dashboard/create-event-types"
import { normalizeApiDateInput } from "../create-event-format"
import { apiRequest } from "./client"
import type { ApiCause, CauseFormLookups, CausePublishStatus } from "./cause-types"
import {
  mapCertificateForApi,
  mapReliabilityScoreForApi,
  mapReminderTimeBeforeForApi,
} from "./cause-form-map"
import type { ApiDataResponse, ApiMessageResponse } from "./types"

function appendFlag(formData: FormData, key: string, enabled: boolean) {
  formData.append(key, enabled ? "1" : "0")
}

export class CauseFormBuildError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "CauseFormBuildError"
  }
}

function parseReminderMinutes(value: string): string {
  return mapReminderTimeBeforeForApi(value)
}

function resolveCategoryId(name: string, lookups: CauseFormLookups): number | null {
  const exact = lookups.categoryIdByName[name]
  if (exact != null) return exact

  const normalized = name.trim().toLowerCase()
  const entry = Object.entries(lookups.categoryIdByName).find(
    ([label]) => label.trim().toLowerCase() === normalized,
  )
  return entry ? entry[1] : null
}

function resolveSkillId(name: string, lookups: CauseFormLookups): number | null {
  const exact = lookups.skillIdByName[name]
  if (exact != null) return exact

  const normalized = name.trim().toLowerCase()
  const entry = Object.entries(lookups.skillIdByName).find(
    ([label]) => label.trim().toLowerCase() === normalized,
  )
  return entry ? entry[1] : null
}

export function buildCauseFormData(
  form: CreateEventFormState,
  {
    status,
    lookups,
  }: {
    status: CausePublishStatus
    lookups: CauseFormLookups
  },
): FormData {
  const formData = new FormData()

  formData.append("title", form.title.trim())
  formData.append("description", form.description.trim())
  formData.append("requirements", form.requirements.trim())
  formData.append(
    "volunteering_type",
    form.volunteeringType === "virtual" ? "virtual" : "in_person",
  )

  if (form.volunteeringType === "virtual") {
    formData.append("google_meet_link", form.googleMeetLink.trim())
  }

  if (form.volunteeringType === "in-person") {
    formData.append("address", form.location.trim())
  }

  if (form.hasCapacityLimit) {
    formData.append("max_volunteers_capacity", String(form.capacity))
  } else {
    formData.append("max_volunteers_capacity", "0")
  }

  const unresolvedCategories: string[] = []
  form.categories.forEach((category, index) => {
    const categoryId = resolveCategoryId(category, lookups)
    if (categoryId == null) {
      unresolvedCategories.push(category)
      return
    }
    formData.append(`category[${index}]`, String(categoryId))
  })

  if (form.categories.length === 0 || unresolvedCategories.length > 0) {
    throw new CauseFormBuildError(
      unresolvedCategories.length > 0
        ? `Could not map categor${unresolvedCategories.length === 1 ? "y" : "ies"}: ${unresolvedCategories.join(", ")}. Pick categories from the list.`
        : "Select at least one category.",
    )
  }

  const useSkillBreakdown = form.hasCapacityLimit && form.breakdownCapacity
  appendFlag(formData, "enable_skill_breakdown", useSkillBreakdown)

  const unresolvedSkills: string[] = []
  form.skills.forEach((skillName, index) => {
    const skillId = resolveSkillId(skillName, lookups)
    if (skillId == null) {
      unresolvedSkills.push(skillName)
      return
    }

    formData.append(`skills[${index}][skill_id]`, String(skillId))
    const individualsRequired = useSkillBreakdown
      ? form.skillCapacities[skillName] ?? 0
      : Math.max(1, Math.floor(form.capacity / Math.max(form.skills.length, 1)))
    formData.append(`skills[${index}][individuals_required]`, String(individualsRequired))
  })

  if (form.skills.length === 0 || unresolvedSkills.length > 0) {
    throw new CauseFormBuildError(
      unresolvedSkills.length > 0
        ? `Could not map skill${unresolvedSkills.length === 1 ? "" : "s"}: ${unresolvedSkills.join(", ")}. Pick skills from the list.`
        : "Add at least one skill.",
    )
  }

  appendFlag(formData, "accept_donations", form.receiveDonations)
  if (form.receiveDonations) {
    formData.append("donation_goal_amount", String(form.donationAmount))
  }
  formData.append("start_date", form.dateStart)
  formData.append("end_date", form.dateEnd)
  formData.append("start_time", form.timeStart)
  formData.append("end_time", form.timeEnd)
  appendFlag(formData, "enable_event_reminders", form.eventReminder)

  if (form.eventReminder) {
    formData.append("reminder_time_before", parseReminderMinutes(form.notifyBefore))
  }

  formData.append("visibility", form.visibility)
  if (form.visibility === "private" && form.eventPasscode.trim()) {
    formData.append("access_code", form.eventPasscode.trim())
  }

  formData.append("certificate", mapCertificateForApi(form.certificateAccess))
  formData.append(
    "reliability_score",
    mapReliabilityScoreForApi(form.certificateAccess, form.reliabilityScore),
  )

  appendFlag(formData, "org_collaboration", form.ngoCollaboration)
  if (form.ngoCollaboration) {
    const collaboratorId = form.ngoCollaboratorId.trim()
    if (!collaboratorId) {
      throw new CauseFormBuildError(
        "Select a collaborating organisation. The API requires an organisation UUID.",
      )
    }
    formData.append("collaborator[0]", collaboratorId)
  }

  formData.append("status", status)

  const orderedImages = [...form.images].sort((left, right) => {
    if (left.isCover && !right.isCover) return -1
    if (!left.isCover && right.isCover) return 1
    return 0
  })

  orderedImages.forEach((image, index) => {
    if (image.file) {
      formData.append(`image[${index}]`, image.file, image.name)
    }
  })

  return formData
}

function appendApiFlag(formData: FormData, key: string, value: unknown) {
  const enabled =
    value === true || value === 1 || value === "1" || value === "true"
  formData.append(key, enabled ? "1" : "0")
}

function normalizeTimeForApi(value?: string | null): string {
  if (!value) return ""
  // API may return `08:30:00`; create/update examples use `HH:mm`.
  return value.slice(0, 5)
}

/**
 * Rebuilds cause form-data for PUT from the loaded API cause + editable patch fields.
 * Postman updates send the full create payload again.
 */
export function buildCauseUpdateFormData(
  cause: ApiCause,
  patch: {
    title: string
    description: string
    requirements: string[]
  },
): FormData {
  const formData = new FormData()
  const startDate = cause.start_date ? normalizeApiDateInput(cause.start_date) : ""
  const endDate = cause.end_date ? normalizeApiDateInput(cause.end_date) : startDate

  formData.append("title", patch.title.trim())
  formData.append("description", patch.description.trim())
  formData.append("requirements", patch.requirements.join("\n"))
  formData.append(
    "volunteering_type",
    cause.volunteering_type === "virtual" ? "virtual" : "in_person",
  )

  if (cause.volunteering_type === "virtual") {
    formData.append("google_meet_link", cause.google_meet_link ?? "")
  } else if (cause.address?.trim()) {
    formData.append("address", cause.address.trim())
  }

  formData.append("max_volunteers_capacity", String(Number(cause.max_volunteers_capacity) || 0))

  const areas = cause.cause_areas ?? cause.categories ?? cause.category ?? []
  areas.forEach((area, index) => {
    if (area.id != null) formData.append(`category[${index}]`, String(area.id))
  })

  appendApiFlag(formData, "enable_skill_breakdown", cause.enable_skill_breakdown)

  ;(cause.skills ?? []).forEach((skill, index) => {
    const skillId = skill.id ?? skill.skill_id ?? skill.pivot?.skill_id
    if (skillId == null) return
    const required = Number(skill.pivot?.individuals_required ?? skill.individuals_required) || 1
    formData.append(`skills[${index}][skill_id]`, String(skillId))
    formData.append(`skills[${index}][individuals_required]`, String(required))
  })

  appendApiFlag(formData, "accept_donations", cause.accept_donations)
  formData.append("start_date", startDate)
  formData.append("end_date", endDate)
  formData.append("start_time", normalizeTimeForApi(cause.start_time))
  formData.append("end_time", normalizeTimeForApi(cause.end_time))
  appendApiFlag(formData, "enable_event_reminders", cause.enable_event_reminders)

  if (
    cause.enable_event_reminders === true ||
    cause.enable_event_reminders === 1 ||
    cause.enable_event_reminders === "1"
  ) {
    formData.append("reminder_time_before", String(cause.reminder_time_before ?? "30"))
  }

  formData.append("visibility", cause.visibility === "private" ? "private" : "public")
  if (cause.visibility === "private" && cause.access_code?.trim()) {
    formData.append("access_code", cause.access_code.trim())
  }

  // Backend currently only accepts automated certificates.
  formData.append("certificate", "automated")
  formData.append(
    "reliability_score",
    String(Math.max(1, Number(cause.reliability_score) || 1)),
  )
  appendApiFlag(formData, "org_collaboration", cause.org_collaboration)
  formData.append("status", cause.status === "draft" ? "draft" : "active")

  return formData
}

export function createOrganisationCause(formData: FormData) {
  return apiRequest<ApiDataResponse<ApiCause>>("/api/v1/organisation/causes", {
    method: "POST",
    body: formData,
  })
}

export function getOrganisationCauses() {
  return apiRequest<ApiDataResponse<ApiCause[] | { data?: ApiCause[] }>>("/api/v1/organisation/causes", {
    method: "GET",
  })
}

/** Public browse feed of every cause (not scoped to the current organisation). */
export function browseCauses(query: { per_page?: number; page?: number; search?: string } = {}) {
  const params = new URLSearchParams()
  if (query.search?.trim()) params.set("search", query.search.trim())
  if (query.per_page) params.set("per_page", String(query.per_page))
  if (query.page) params.set("page", String(query.page))

  const suffix = params.toString() ? `?${params.toString()}` : ""

  return apiRequest<ApiDataResponse<ApiCause[] | { data?: ApiCause[] }>>(
    `/api/v1/organisation/causes/browse${suffix}`,
    { method: "GET" },
  )
}

export function getOrganisationCause(causeUuid: string) {
  return apiRequest<ApiDataResponse<ApiCause>>(`/api/v1/organisation/causes/${causeUuid}`, {
    method: "GET",
  })
}

export function updateOrganisationCause(causeUuid: string, formData: FormData) {
  return apiRequest<ApiDataResponse<ApiCause>>(`/api/v1/organisation/causes/${causeUuid}`, {
    method: "PUT",
    body: formData,
  })
}

export function deleteOrganisationCause(causeUuid: string) {
  return apiRequest<ApiMessageResponse>(`/api/v1/organisation/causes/${causeUuid}`, {
    method: "DELETE",
  })
}

export function extractCausesFromResponse(payload: ApiDataResponse<ApiCause[] | { data?: ApiCause[] }>): ApiCause[] {
  const data = payload.data

  if (Array.isArray(data)) return data
  if (data && typeof data === "object" && Array.isArray(data.data)) return data.data

  return []
}

export function getCauseUuid(cause: ApiCause): string | null {
  if (typeof cause.uuid === "string" && cause.uuid.trim()) return cause.uuid
  if (typeof cause.id === "string" && cause.id.trim()) return cause.id
  if (typeof cause.id === "number") return String(cause.id)
  return null
}
