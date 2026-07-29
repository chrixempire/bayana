import type { CreateEventFormState } from "../../pages/dashboard/create-event-types"
import { apiRequest } from "./client"
import type { ApiCause, CauseFormLookups, CausePublishStatus } from "./cause-types"
import type { ApiDataResponse, ApiMessageResponse } from "./types"

function appendFlag(formData: FormData, key: string, enabled: boolean) {
  formData.append(key, enabled ? "1" : "0")
}

function parseReminderMinutes(value: string): string {
  const match = value.match(/\d+/)
  return match?.[0] ?? "30"
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
    formData.append("google_meet_link", "")
  }

  if (form.volunteeringType === "in-person") {
    formData.append("address", form.location.trim())
  }

  if (form.hasCapacityLimit) {
    formData.append("max_volunteers_capacity", String(form.capacity))
  }

  form.categories.forEach((category, index) => {
    const categoryId = resolveCategoryId(category, lookups)
    if (categoryId != null) {
      formData.append(`category[${index}]`, String(categoryId))
    }
  })

  const useSkillBreakdown = form.hasCapacityLimit && form.breakdownCapacity
  appendFlag(formData, "enable_skill_breakdown", useSkillBreakdown)

  form.skills.forEach((skillName, index) => {
    const skillId = resolveSkillId(skillName, lookups)
    if (skillId == null) return

    formData.append(`skills[${index}][skill_id]`, String(skillId))
    const individualsRequired = useSkillBreakdown
      ? form.skillCapacities[skillName] ?? 0
      : Math.max(1, Math.floor(form.capacity / Math.max(form.skills.length, 1)))
    formData.append(`skills[${index}][individuals_required]`, String(individualsRequired))
  })

  appendFlag(formData, "accept_donations", form.receiveDonations)
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

  formData.append("certificate", form.certificateAccess)
  if (form.certificateAccess === "automated") {
    formData.append("reliability_score", String(form.reliabilityScore))
  }

  appendFlag(formData, "org_collaboration", form.ngoCollaboration)
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
