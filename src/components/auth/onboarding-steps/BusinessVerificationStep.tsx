import { Button } from "../../ui/button"
import { FormField } from "../FormField"
import { FileUploadDropzone } from "../FileUploadDropzone"
import { OnboardingStepShell } from "../OnboardingStepShell"
import { ContinueArrowIcon } from "../icons/ContinueArrowIcon"
import type { OnboardingData } from "../../../pages/auth/types"

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
  return (
    <OnboardingStepShell
      frameStart={
        <Button variant="neutral" size="sm" className="w-fit" onClick={onBack}>
          Back
        </Button>
      }
      titleBlock={
        <div className="flex flex-col gap-3 tracking-[-0.1px]">
          <h1 className="font-display text-2xl font-semibold leading-8 text-[#2c3237]">Verify your business information</h1>
          <p className="text-sm font-normal leading-[22px] text-[#656f78]">
            Provide the necessary documents to verify your basic business information
          </p>
        </div>
      }
    >
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <FormField label="CAC document *" error={errors.cacDocument}>
            <FileUploadDropzone
              value={data.cacDocument}
              onChange={(fileName) => onChange({ ...data, cacDocument: fileName })}
            />
          </FormField>

          <FormField label="NGO Registration certificate *" error={errors.ngoRegistrationCertificate}>
            <FileUploadDropzone
              value={data.ngoRegistrationCertificate}
              onChange={(fileName) => onChange({ ...data, ngoRegistrationCertificate: fileName })}
            />
          </FormField>

          <FormField label="Proof of address *" error={errors.proofOfAddress}>
            <FileUploadDropzone
              value={data.proofOfAddress}
              onChange={(fileName) => onChange({ ...data, proofOfAddress: fileName })}
            />
          </FormField>

          <FormField label="Scuml document *" error={errors.scumlDocument}>
            <FileUploadDropzone
              value={data.scumlDocument}
              onChange={(fileName) => onChange({ ...data, scumlDocument: fileName })}
            />
          </FormField>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            className="h-10 min-h-10 gap-2 rounded-xl px-3.5 shadow-[inset_0_-2px_1px_0_rgb(25,89,140,0.5)]"
            variant="primary"
            block
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
