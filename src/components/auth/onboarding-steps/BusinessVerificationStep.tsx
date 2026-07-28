import { useMemo, useState } from "react"
import { Button } from "../../ui/button"
import { FormField } from "../FormField"
import { FileUploadDropzone } from "../FileUploadDropzone"
import { OnboardingStepShell } from "../OnboardingStepShell"
import { ContinueArrowIcon } from "../icons/ContinueArrowIcon"
import type { OnboardingData } from "../../../pages/auth/types"
import { authBodyTextClassName, authOnboardingPrimaryButtonClassName, pageTitleClassName } from "../../../lib/auth-form-styles"
import {
  ONBOARDING_FILE_SIZE_ERRORS,
  validateOnboardingFileSize,
} from "../../../pages/auth/onboarding-validation"

type VerificationUploadField = keyof OnboardingData["verification"]

const VERIFICATION_UPLOAD_FIELDS = [
  { field: "cacDocument", label: "CAC document *" },
  { field: "ngoRegistrationCertificate", label: "NGO Registration certificate *" },
  { field: "proofOfAddress", label: "Proof of address *" },
  { field: "scumlDocument", label: "Scuml document *" },
] as const satisfies ReadonlyArray<{ field: VerificationUploadField; label: string }>

export function BusinessVerificationStep({
  data,
  errors,
  onChange,
  onBack,
  onContinue,
  onSkip,
}: {
  data: OnboardingData["verification"]
  errors: Record<string, string>
  onChange: (next: OnboardingData["verification"]) => void
  onBack: () => void
  onContinue: () => void
  onSkip: () => void
}) {
  const [uploadErrors, setUploadErrors] = useState<Partial<Record<VerificationUploadField, string>>>({})

  const setFieldUploadError = (field: VerificationUploadField, message: string) => {
    setUploadErrors((prev) => {
      const file = data[field]
      const fileIsValid = file ? !validateOnboardingFileSize(field, file) : false

      if (message && fileIsValid) {
        return prev
      }

      if (!message) {
        if (!(field in prev)) return prev
        const next = { ...prev }
        delete next[field]
        return next
      }

      return { ...prev, [field]: message }
    })
  }

  const fieldErrors = useMemo(() => {
    const merged: Record<string, string> = { ...errors, ...uploadErrors }

    for (const { field } of VERIFICATION_UPLOAD_FIELDS) {
      const file = data[field]
      if (!file) continue

      const sizeError = validateOnboardingFileSize(field, file)
      if (sizeError) merged[field] = sizeError
    }

    return merged
  }, [data, errors, uploadErrors])

  const hasUploadErrors = VERIFICATION_UPLOAD_FIELDS.some(({ field }) => Boolean(fieldErrors[field]))

  return (
    <OnboardingStepShell
      frameStart={
        <Button variant="neutral" size="sm" className="w-fit" onClick={onBack}>
          Back
        </Button>
      }
      titleBlock={
        <div className="flex flex-col gap-3 tracking-[-0.1px]">
          <h1 className={pageTitleClassName}>Verify your business information</h1>
          <p className={authBodyTextClassName}>
            Provide the necessary documents to verify your basic business information
          </p>
        </div>
      }
    >
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          {VERIFICATION_UPLOAD_FIELDS.map(({ field, label }) => (
            <FormField key={field} label={label} error={fieldErrors[field]}>
              <FileUploadDropzone
                value={data[field]}
                sizeErrorMessage={ONBOARDING_FILE_SIZE_ERRORS[field]}
                onSizeErrorChange={(message) => setFieldUploadError(field, message)}
                onChange={(file) => onChange({ ...data, [field]: file })}
              />
            </FormField>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <Button
            className={authOnboardingPrimaryButtonClassName}
            variant="primary"
            block
            disabled={hasUploadErrors}
            rightIcon={<ContinueArrowIcon className="text-white" />}
            onClick={onContinue}
          >
            Continue
          </Button>
          <Button variant="neutral" block onClick={onSkip}>
            Skip for now & continue later
          </Button>
        </div>
      </div>
    </OnboardingStepShell>
  )
}
