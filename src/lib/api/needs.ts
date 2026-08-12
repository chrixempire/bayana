import type { CreateEventFormState } from "../../pages/dashboard/create-event-types"
import { normalizeApiDateInput } from "../create-event-format"
import { apiRequest } from "./client"
import type { ApiNeed, NeedFormLookups } from "./need-types"
import type { ApiDataResponse, ApiMessageResponse } from "./types"

function appendFlag(formData: FormData, key: string, enabled: boolean) {
  formData.append(key, enabled ? "1" : "0")
}

function appendApiFlag(formData: FormData, key: string, value: unknown) {
  const enabled =
    value === true || value === 1 || value === "1" || value === "true"
  formData.append(key, enabled ? "1" : "0")
}

export class NeedFormBuildError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "NeedFormBuildError"
  }
}

function resolveCategoryId(name: string, lookups: NeedFormLookups): number | null {
  const exact = lookups.categoryIdByName[name]
  if (exact != null) return exact

  const normalized = name.trim().toLowerCase()
  const entry = Object.entries(lookups.categoryIdByName).find(
    ([label]) => label.trim().toLowerCase() === normalized,
  )
  return entry ? entry[1] : null
}

function mapNeedType(form: CreateEventFormState): "financial" | "material" {
  // Postman samples use `material` for in-kind (optionally with a cash target).
  if (form.inKindDonations) return "material"
  return "financial"
}

/**
 * Builds multipart form-data for POST /api/v1/organisation/needs
 * (Postman: Organisations → Needs → Create a Need).
 */
export function buildNeedFormData(
  form: CreateEventFormState,
  { lookups }: { lookups: NeedFormLookups },
): FormData {
  const formData = new FormData()

  formData.append("title", form.title.trim())
  formData.append("description", form.description.trim())
  formData.append("need_type", mapNeedType(form))

  if (form.financialDonations) {
    formData.append("target_amount", String(form.donationAmount))
    formData.append("currency", "NGN")
  } else {
    formData.append("target_amount", "0")
    formData.append("currency", "NGN")
  }

  // Backend `needs` table has no `in_kind` column — use need_type (+ items) instead.

  formData.append("start_date", form.dateStart)
  formData.append("end_date", form.dateEnd)

  const unresolvedCategories: string[] = []
  let categoryIndex = 0
  form.categories.forEach((category) => {
    const categoryId = resolveCategoryId(category, lookups)
    if (categoryId == null) {
      unresolvedCategories.push(category)
      return
    }
    formData.append(`category[${categoryIndex}]`, String(categoryId))
    categoryIndex += 1
  })

  if (form.categories.length === 0 || unresolvedCategories.length > 0) {
    throw new NeedFormBuildError(
      unresolvedCategories.length > 0
        ? `Could not map categor${unresolvedCategories.length === 1 ? "y" : "ies"}: ${unresolvedCategories.join(", ")}. Pick categories from the list.`
        : "Select at least one category.",
    )
  }

  if (form.inKindDonations) {
    if (form.inKindItems.length === 0) {
      throw new NeedFormBuildError("Add at least one in-kind item.")
    }

    form.inKindItems.forEach((item, index) => {
      formData.append(`item[${index}][name]`, item.name.trim())
      formData.append(`item[${index}][description]`, item.description.trim())
      formData.append(`item[${index}][quantity]`, String(item.quantity))
      if (item.file) {
        formData.append(`item[${index}][image]`, item.file, item.file.name)
      }
    })

    const deliveryAddress = form.deliveryByDelivery
      ? form.deliveryAddress.trim()
      : form.pickupAddress.trim()
    if (deliveryAddress) {
      formData.append("delivery_address", deliveryAddress)
    }

    const instructions = [
      form.deliveryByDelivery && form.deliveryInstructions.trim()
        ? `Delivery: ${form.deliveryInstructions.trim()}`
        : null,
      form.deliveryByPickup && form.pickupInstructions.trim()
        ? `Pickup (${form.pickupAddress.trim() || "address TBD"}): ${form.pickupInstructions.trim()}`
        : form.deliveryByPickup && form.pickupAddress.trim() && !form.deliveryByDelivery
          ? `Pickup at ${form.pickupAddress.trim()}`
          : null,
    ]
      .filter(Boolean)
      .join("\n")

    if (instructions) {
      formData.append("delivery_instructions", instructions)
    }
  }

  formData.append("visibility", form.visibility)
  if (form.visibility === "private" && form.eventPasscode.trim()) {
    formData.append("access_code", form.eventPasscode.trim())
  }

  // Needs create UI has no reminder controls yet — match Postman default off.
  appendFlag(formData, "enable_event_reminders", false)
  formData.append("reminder_time_before", "30")

  appendFlag(formData, "org_collaboration", form.ngoCollaboration)
  if (form.ngoCollaboration) {
    const collaboratorId = form.ngoCollaboratorId.trim()
    if (!collaboratorId) {
      throw new NeedFormBuildError(
        "Select a collaborating organisation. The API requires an organisation UUID.",
      )
    }
    // Postman Create a Need uses `collaborator` (not collaborator[0]).
    formData.append("collaborator", collaboratorId)
  }

  const orderedImages = [...form.images].sort((left, right) => {
    if (left.isCover && !right.isCover) return -1
    if (!left.isCover && right.isCover) return 1
    return 0
  })

  const imageFiles = orderedImages.filter((image) => image.file)
  if (imageFiles.length === 0) {
    throw new NeedFormBuildError("Add at least one image for this need.")
  }

  imageFiles.forEach((image, index) => {
    if (image.file) {
      formData.append(`image[${index}]`, image.file, image.name)
    }
  })

  return formData
}

/**
 * Rebuilds need form-data for PUT from the loaded API need + editable patch fields.
 * Postman updates send the full create-style payload again.
 */
export function buildNeedUpdateFormData(
  need: ApiNeed,
  patch: {
    title: string
    description: string
  },
): FormData {
  const formData = new FormData()
  const startDate = need.start_date ? normalizeApiDateInput(need.start_date) : ""
  const endDate = need.end_date ? normalizeApiDateInput(need.end_date) : startDate
  const items = need.items ?? need.need_items ?? []
  const needType =
    need.need_type === "financial" || need.need_type === "material"
      ? need.need_type
      : items.length > 0
        ? "material"
        : "financial"

  formData.append("title", patch.title.trim())
  formData.append("description", patch.description.trim())
  formData.append("need_type", needType)
  formData.append("target_amount", String(Number(need.target_amount) || 0))
  formData.append("currency", need.currency?.trim() || "NGN")
  formData.append("start_date", startDate)
  formData.append("end_date", endDate)

  const areas = need.cause_areas ?? need.categories ?? need.category ?? []
  areas.forEach((area, index) => {
    if (area.id != null) formData.append(`category[${index}]`, String(area.id))
  })

  items.forEach((item, index) => {
    if (item.id != null) formData.append(`item[${index}][id]`, String(item.id))
    formData.append(`item[${index}][name]`, item.name?.trim() || "")
    formData.append(`item[${index}][description]`, item.description?.trim() || "")
    formData.append(`item[${index}][quantity]`, String(Number(item.quantity) || 0))
  })

  if (need.delivery_address?.trim()) {
    formData.append("delivery_address", need.delivery_address.trim())
  }
  if (need.delivery_instructions?.trim()) {
    formData.append("delivery_instructions", need.delivery_instructions.trim())
  }

  formData.append("visibility", need.visibility === "private" ? "private" : "public")
  if (need.visibility === "private" && need.access_code?.trim()) {
    formData.append("access_code", need.access_code.trim())
  }

  appendApiFlag(formData, "enable_event_reminders", need.enable_event_reminders)
  if (
    need.enable_event_reminders === true ||
    need.enable_event_reminders === 1 ||
    need.enable_event_reminders === "1"
  ) {
    formData.append("reminder_time_before", String(need.reminder_time_before ?? "30"))
  } else {
    formData.append("reminder_time_before", "30")
  }

  appendApiFlag(formData, "org_collaboration", need.org_collaboration)

  return formData
}

export function createOrganisationNeed(formData: FormData) {
  return apiRequest<ApiDataResponse<ApiNeed>>("/api/v1/organisation/needs", {
    method: "POST",
    body: formData,
  })
}

export function getOrganisationNeeds() {
  return apiRequest<ApiDataResponse<ApiNeed[] | { data?: ApiNeed[] }>>("/api/v1/organisation/needs", {
    method: "GET",
  })
}

export function getOrganisationNeed(needUuid: string) {
  return apiRequest<ApiDataResponse<ApiNeed>>(`/api/v1/organisation/needs/${needUuid}`, {
    method: "GET",
  })
}

export function updateOrganisationNeed(needUuid: string, formData: FormData) {
  return apiRequest<ApiDataResponse<ApiNeed>>(`/api/v1/organisation/needs/${needUuid}`, {
    method: "PUT",
    body: formData,
  })
}

export function deleteOrganisationNeed(needUuid: string) {
  return apiRequest<ApiMessageResponse>(`/api/v1/organisation/needs/${needUuid}`, {
    method: "DELETE",
  })
}

export function extractNeedsFromResponse(
  payload: ApiDataResponse<ApiNeed[] | { data?: ApiNeed[] }>,
): ApiNeed[] {
  const data = payload.data

  if (Array.isArray(data)) return data
  if (data && typeof data === "object" && Array.isArray(data.data)) return data.data

  return []
}

export function getNeedUuid(need: ApiNeed): string | null {
  if (typeof need.uuid === "string" && need.uuid.trim()) return need.uuid
  if (typeof need.id === "string" && need.id.trim()) return need.id
  if (typeof need.id === "number") return String(need.id)
  return null
}
