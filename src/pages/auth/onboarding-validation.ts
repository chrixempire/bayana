import type { OnboardingData, OnboardingFlowStep } from "./types"

export type OnboardingStepErrors = Record<string, string>

export const ONBOARDING_FILE_MAX_SIZE_BYTES = 2048 * 1024

/** @deprecated Use ONBOARDING_FILE_MAX_SIZE_BYTES */
export const LOGO_MAX_SIZE_BYTES = ONBOARDING_FILE_MAX_SIZE_BYTES

export const ONBOARDING_FILE_SIZE_ERRORS = {
  cacDocument: "The cac doc field must not be greater than 2048 kilobytes.",
  ngoRegistrationCertificate: "The org certificate doc field must not be greater than 2048 kilobytes.",
  proofOfAddress: "The proof of add doc field must not be greater than 2048 kilobytes.",
  scumlDocument: "The scuml doc field must not be greater than 2048 kilobytes.",
  logo: "The logo field must not be greater than 2048 kilobytes.",
} as const

export type OnboardingFileField = keyof typeof ONBOARDING_FILE_SIZE_ERRORS

/** @deprecated Use ONBOARDING_FILE_SIZE_ERRORS.logo */
export const LOGO_MAX_SIZE_ERROR = ONBOARDING_FILE_SIZE_ERRORS.logo

export function validateOnboardingFileSize(field: OnboardingFileField, file: File): string | null {
  if (file.size > ONBOARDING_FILE_MAX_SIZE_BYTES) return ONBOARDING_FILE_SIZE_ERRORS[field]
  return null
}

export function validateLogoFileSize(file: File): string | null {
  return validateOnboardingFileSize("logo", file)
}

type StepValidator = (data: OnboardingData) => OnboardingStepErrors

const validators: Partial<Record<OnboardingFlowStep, StepValidator>> = {
  "basic-information": (data) => {
    const errors: OnboardingStepErrors = {}

    if (!data.basicInformation.businessName.trim()) {
      errors.businessName = "Business name is required"
    }

    if (!data.basicInformation.cacNumber.trim()) {
      errors.cacNumber = "CAC number is required"
    }

    if (!data.basicInformation.address.trim()) {
      errors.address = "Address is required"
    }

    return errors
  },
  "business-owner": (data) => {
    const errors: OnboardingStepErrors = {}
    const idType = data.businessOwner.idType

    if (!data.businessOwner.fullName.trim()) {
      errors.fullName = "Full name is required"
    }

    if (!data.businessOwner.phone.trim()) {
      errors.phone = "Phone number is required"
    }

    const identificationNumber = data.businessOwner.nin.trim()

    if (!identificationNumber) {
      errors.nin = idType === "nin" ? "NIN is required" : "Identification number is required"
    } else if (idType === "nin" && identificationNumber.length !== 11) {
      errors.nin = "NIN must be 11 digits"
    }

    return errors
  },
  "business-verification": (data) => {
    const errors: OnboardingStepErrors = {}

    const documentFields = [
      ["cacDocument", data.verification.cacDocument, "CAC document is required"] as const,
      [
        "ngoRegistrationCertificate",
        data.verification.ngoRegistrationCertificate,
        "NGO registration certificate is required",
      ] as const,
      ["proofOfAddress", data.verification.proofOfAddress, "Proof of address is required"] as const,
      ["scumlDocument", data.verification.scumlDocument, "Scuml document is required"] as const,
    ]

    for (const [field, file, requiredMessage] of documentFields) {
      if (!file) {
        errors[field] = requiredMessage
        continue
      }

      const sizeError = validateOnboardingFileSize(field, file)
      if (sizeError) errors[field] = sizeError
    }

    return errors
  },
  "ngo-profile": (data) => {
    const errors: OnboardingStepErrors = {}

    if (data.ngoProfile.logo) {
      const logoError = validateLogoFileSize(data.ngoProfile.logo)
      if (logoError) errors.logo = logoError
    }

    if (!data.ngoProfile.mission.trim()) {
      errors.mission = "Mission is required"
    }

    if (data.ngoProfile.causes.length === 0) {
      errors.causes = "Select at least one cause area"
    }

    if (!data.ngoProfile.activities.trim()) {
      errors.activities = "Past activities are required"
    }

    return errors
  },
}

const SUBMIT_STEPS: OnboardingFlowStep[] = [
  "basic-information",
  "business-owner",
  "business-verification",
  "ngo-profile",
]

export function getStepValidationErrors(step: OnboardingFlowStep, data: OnboardingData): OnboardingStepErrors {
  return validators[step]?.(data) ?? {}
}

export function getSubmitValidationErrors(data: OnboardingData): OnboardingStepErrors {
  return SUBMIT_STEPS.reduce<OnboardingStepErrors>((errors, step) => {
    return { ...errors, ...getStepValidationErrors(step, data) }
  }, {})
}
