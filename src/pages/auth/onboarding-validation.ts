import type { OnboardingData, OnboardingFlowStep } from "./types"

export type OnboardingStepErrors = Record<string, string>

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

    if (!data.verification.cacDocument) {
      errors.cacDocument = "CAC document is required"
    }

    if (!data.verification.ngoRegistrationCertificate) {
      errors.ngoRegistrationCertificate = "NGO registration certificate is required"
    }

    if (!data.verification.proofOfAddress) {
      errors.proofOfAddress = "Proof of address is required"
    }

    if (!data.verification.scumlDocument) {
      errors.scumlDocument = "Scuml document is required"
    }

    return errors
  },
  "ngo-profile": (data) => {
    const errors: OnboardingStepErrors = {}

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
