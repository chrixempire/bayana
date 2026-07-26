import { Button } from "../../ui/button"
import { SpinnerIcon } from "../icons/SpinnerIcon"
import { OnboardingStepShell } from "../OnboardingStepShell"
import {
  authBodyTextClassName,
  authFieldLabelClassName,
  authOnboardingPrimaryButtonClassName,
  pageTitleClassName,
} from "../../../lib/auth-form-styles"
import type { OnboardingFlowStep } from "../../../pages/auth/types"

const REVIEW_SECTIONS: { label: string; step: OnboardingFlowStep }[] = [
  { label: "Basic information", step: "basic-information" },
  { label: "Business information", step: "business-owner" },
  { label: "Business verification", step: "business-verification" },
  { label: "NGO profile setup", step: "ngo-profile" },
]

export function ReviewStep({
  onBack,
  onSubmit,
  onEditSection,
  isSubmitting = false,
}: {
  onBack: () => void
  onSubmit: () => void
  onEditSection: (step: OnboardingFlowStep) => void
  isSubmitting?: boolean
}) {
  return (
    <OnboardingStepShell
      combineTitleAndContent
      showCallout={false}
      wide
      frameStart={
        <Button variant="neutral" size="sm" className="w-fit" onClick={onBack} disabled={isSubmitting}>
          Back
        </Button>
      }
      titleBlock={
        <div className="flex max-w-[520px] flex-col gap-3 tracking-[-0.1px]">
          <h1 className={pageTitleClassName}>Review and submit</h1>
          <p className={authBodyTextClassName}>
            Kindly review the information you provided before you submit your business information for our onboarding
            verification
          </p>
        </div>
      }
    >
      <div className="flex max-w-[520px] flex-col gap-10 pt-1">
        <div className="divide-y divide-border-default-100 rounded-[18px] border border-border-default-100 bg-white">
          {REVIEW_SECTIONS.map((section) => (
            <div key={section.label} className="flex items-start justify-between px-4 py-[13px]">
              <div className="space-y-1">
                <p className={authFieldLabelClassName}>{section.label}</p>
                <p className="inline-flex items-center gap-1.5 text-xs leading-4 text-text-success">
                  <span className="size-2 rounded-full bg-[#2db94d]" />
                  Completed
                </p>
              </div>
              <button
                type="button"
                aria-label={`Edit ${section.label}`}
                className="mt-0.5 cursor-pointer text-text-neutral-400 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isSubmitting}
                onClick={() => onEditSection(section.step)}
              >
                <PencilIcon />
              </button>
            </div>
          ))}
        </div>

        <p className="max-w-[470px] self-center text-center text-sm leading-7 text-text-neutral-400">
          Ensure that all fields are filled accurately. After submission, Bayana&apos;s onboarding team will verify your
          business information and grant you full access after confirmation
        </p>

        <Button
          className={authOnboardingPrimaryButtonClassName}
          variant="primary"
          block
          disabled={isSubmitting}
          rightIcon={isSubmitting ? <SpinnerIcon className="size-4 text-white" /> : undefined}
          onClick={onSubmit}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </OnboardingStepShell>
  )
}

function PencilIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M11.8 2.2a1.5 1.5 0 1 1 2.1 2.1l-7.8 7.8-2.8.7.7-2.8 7.8-7.8Zm0 0 .7-.7a1.5 1.5 0 0 1 2.1 2.1l-.7.7"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
