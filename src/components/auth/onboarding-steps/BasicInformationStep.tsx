import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { cn } from "../../../lib/utils"
import { authBodyTextClassName, authPrimaryButtonClassName } from "../../../lib/auth-form-styles"
import type { OnboardingData } from "../../../pages/auth/types"
import { FormField } from "../FormField"
import { OnboardingStepShell } from "../OnboardingStepShell"
import { GoogleGIcon } from "../icons/GoogleGIcon"
import { ContinueArrowIcon } from "../icons/ContinueArrowIcon"

export function BasicInformationStep({
  data,
  errors,
  onChange,
  onContinue,
}: {
  data: OnboardingData["basicInformation"]
  errors: Record<string, string>
  onChange: (next: OnboardingData["basicInformation"]) => void
  onContinue: () => void
}) {
  return (
    <OnboardingStepShell
      titleBlock={
        <header className="flex flex-col gap-3 tracking-[-0.1px]">
          <h1 className="font-display text-[24px] font-semibold leading-8 tracking-[-0.1px] text-text-default-500">
            Let&apos;s get to know your business
          </h1>
          <p className={authBodyTextClassName}>
            Provide the basic information of your Non-governmental organization
          </p>
        </header>
      }
    >
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <FormField label="Business name" error={errors.businessName}>
            <Input
              density="compact"
              placeholder="e.g acme incorporation"
              value={data.businessName}
              onChange={(e) => onChange({ ...data, businessName: e.target.value })}
              invalid={Boolean(errors.businessName)}
            />
          </FormField>

          <FormField label="CAC number" error={errors.cacNumber}>
            <Input
              density="compact"
              placeholder="Enter CAC number"
              value={data.cacNumber}
              onChange={(e) => onChange({ ...data, cacNumber: e.target.value })}
              invalid={Boolean(errors.cacNumber)}
            />
          </FormField>

          <FormField label="Business address" error={errors.address}>
            <Input
              density="compact"
              placeholder="Enter address"
              value={data.address}
              onChange={(e) => onChange({ ...data, address: e.target.value })}
              invalid={Boolean(errors.address)}
              rightIcon={<GoogleGIcon />}
            />
          </FormField>

          <FormField label="Website" optional>
            <div
              className={cn(
                "flex w-full items-stretch overflow-hidden rounded-xl border border-border-input-default-200 bg-input-surface shadow-input-default transition-colors focus-within:border-border-input-active focus-within:ring-2 focus-within:ring-[rgb(255,122,26,0.12)]",
              )}
            >
              <span className="flex h-10 shrink-0 items-center border-r border-border-default-100 bg-input-surface px-3 text-sm leading-[22px] tracking-[-0.1px] text-text-neutral-400">
                https://
              </span>
              <input
                className="h-10 min-h-10 w-full min-w-0 border-0 bg-transparent px-4 text-sm leading-[22px] tracking-[-0.1px] text-text-default-500 outline-none placeholder:text-input-placeholder"
                placeholder="www.google.com"
                value={data.website}
                onChange={(e) => onChange({ ...data, website: e.target.value })}
              />
            </div>
          </FormField>
        </div>

        <Button
          className={cn("rounded-xl", authPrimaryButtonClassName)}
          variant="primary"
          block
          rightIcon={<ContinueArrowIcon className="size-4 text-white" />}
          onClick={onContinue}
        >
          Continue
        </Button>
      </div>
    </OnboardingStepShell>
  )
}
