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
      errors.nin =
        idType === "National ID card" ? "NIN is required" : "Identification number is required"
    } else if (idType === "National ID card" && identificationNumber.length !== 11) {
      errors.nin = "NIN must be 11 digits"
    }

    return errors
  },
  "business-verification": (data) => {
    const errors: OnboardingStepErrors = {}

    if (!data.verification.cacDocument.trim()) {
      errors.cacDocument = "CAC document is required"
    }

    if (!data.verification.ngoRegistrationCertificate.trim()) {
      errors.ngoRegistrationCertificate = "NGO registration certificate is required"
    }

    if (!data.verification.proofOfAddress.trim()) {
      errors.proofOfAddress = "Proof of address is required"
    }

    if (!data.verification.scumlDocument.trim()) {
      errors.scumlDocument = "Scuml document is required"
    }

    return errors
  },
  "ngo-profile": (data) => {
    const errors: OnboardingStepErrors = {}

    if (!data.ngoProfile.mission.trim()) {
      errors.mission = "Mission is required"
    }

    if (!data.ngoProfile.activities.trim()) {
      errors.activities = "Past activities are required"
    }

    return errors
  },
}

export function getStepValidationErrors(step: OnboardingFlowStep, data: OnboardingData): OnboardingStepErrors {
  return validators[step]?.(data) ?? {}
}
