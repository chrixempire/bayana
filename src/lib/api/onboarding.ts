import type { OnboardingData } from "../../pages/auth/types"
import { apiRequest } from "./client"
import type { ApiMessageResponse } from "./types"

function normalizeWebsite(website: string): string {
  const trimmed = website.trim()
  if (!trimmed) return ""
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed
  return `https://${trimmed}`
}

function mapIdType(idType: string): string {
  return idType.trim()
}

function formatContactPhone(dialCode: string, phone: string): string {
  const normalizedDial = dialCode.replace(/\s/g, "")
  const normalizedPhone = phone.replace(/\s/g, "")
  if (normalizedPhone.startsWith("+")) return normalizedPhone
  if (normalizedDial && normalizedPhone.startsWith("0")) {
    return `${normalizedDial}${normalizedPhone.slice(1)}`
  }
  return `${normalizedDial}${normalizedPhone}`
}

export function buildOrganisationOnboardingFormData(data: OnboardingData): FormData {
  const formData = new FormData()

  formData.append("name", data.basicInformation.businessName.trim())
  formData.append("registration_number", data.basicInformation.cacNumber.trim())
  formData.append("address_line1", data.basicInformation.address.trim())

  const website = normalizeWebsite(data.basicInformation.website)
  if (website) formData.append("website", website)

  formData.append("name_on_id", data.businessOwner.fullName.trim())
  formData.append("contact_phone", formatContactPhone(data.businessOwner.dialCode, data.businessOwner.phone))
  formData.append("id_type", mapIdType(data.businessOwner.idType))
  formData.append("id_number", data.businessOwner.nin.trim())
  formData.append("description", data.ngoProfile.mission.trim())
  formData.append("previous_activities", data.ngoProfile.activities.trim())

  for (const cause of data.ngoProfile.causes) {
    formData.append("cause_areas[]", String(cause.id))
  }

  if (data.verification.cacDocument) formData.append("cac_doc", data.verification.cacDocument)
  if (data.verification.ngoRegistrationCertificate) {
    formData.append("org_certificate_doc", data.verification.ngoRegistrationCertificate)
  }
  if (data.verification.proofOfAddress) formData.append("proof_of_add_doc", data.verification.proofOfAddress)
  if (data.verification.scumlDocument) formData.append("scuml_doc", data.verification.scumlDocument)
  if (data.ngoProfile.logo) formData.append("logo", data.ngoProfile.logo)

  return formData
}

export function submitOrganisationOnboarding(data: OnboardingData) {
  return apiRequest<ApiMessageResponse>("/organisation/onboard/organisation", {
    method: "POST",
    body: buildOrganisationOnboardingFormData(data),
  })
}

const API_FIELD_TO_UI: Record<string, string> = {
  name: "businessName",
  registration_number: "cacNumber",
  address_line1: "address",
  website: "website",
  name_on_id: "fullName",
  contact_phone: "phone",
  id_type: "idType",
  id_number: "nin",
  description: "mission",
  previous_activities: "activities",
  cause_areas: "causes",
  cac_doc: "cacDocument",
  org_certificate_doc: "ngoRegistrationCertificate",
  proof_of_add_doc: "proofOfAddress",
  scuml_doc: "scumlDocument",
  logo: "logo",
}

export function mapOnboardingApiFieldErrors(fieldErrors: Record<string, string[]>): Record<string, string> {
  const mapped: Record<string, string> = {}

  for (const [field, messages] of Object.entries(fieldErrors)) {
    const normalizedField = field.replace(/\.\d+$/, "").replace(/\[\d+\]$/, "").replace(/\[\]$/, "")
    const uiField = API_FIELD_TO_UI[normalizedField] ?? normalizedField
    if (messages[0]) mapped[uiField] = messages[0]
  }

  return mapped
}
