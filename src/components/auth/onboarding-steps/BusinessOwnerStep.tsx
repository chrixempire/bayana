import { Button } from "../../ui/button"
import { CountryDialCodeDropdown } from "../../ui/country-dial-code-dropdown"
import { FormDropdown } from "../../ui/form-dropdown"
import { Input } from "../../ui/input"
import { ID_TYPE_OPTIONS } from "../../../lib/id-types"
import { cn } from "../../../lib/utils"
import { authBodyTextClassName, authOnboardingPrimaryButtonClassName } from "../../../lib/auth-form-styles"
import type { OnboardingData } from "../../../pages/auth/types"
import { FormField } from "../FormField"
import { OnboardingStepShell } from "../OnboardingStepShell"
import { ContinueArrowIcon } from "../icons/ContinueArrowIcon"

const ID_TYPE_FIELD_META = {
  nin: {
    label: "NIN",
    placeholder: "Enter national identification number",
    hint: "Dial *346# to get your NIN",
    inputMode: "numeric" as const,
  },
  drivers_license: {
    label: "Driver's license number",
    placeholder: "Enter driver's license number",
    hint: "Use the number printed on your license",
    inputMode: "text" as const,
  },
  passport: {
    label: "Passport number",
    placeholder: "Enter passport number",
    hint: "Use the number printed on your passport",
    inputMode: "text" as const,
  },
} as const

export function BusinessOwnerStep({
  data,
  errors,
  onChange,
  onBack,
  onContinue,
  onSkip,
}: {
  data: OnboardingData["businessOwner"]
  errors: Record<string, string>
  onChange: (next: OnboardingData["businessOwner"]) => void
  onBack: () => void
  onContinue: () => void
  onSkip: () => void
}) {
  const phoneInvalid = Boolean(errors.phone)
  const idTypeMeta =
    ID_TYPE_FIELD_META[data.idType as keyof typeof ID_TYPE_FIELD_META] ?? ID_TYPE_FIELD_META.nin

  return (
    <OnboardingStepShell
      frameStart={
        <Button variant="neutral" size="sm" className="w-fit" onClick={onBack}>
          Back
        </Button>
      }
      titleBlock={
        <div className="flex flex-col gap-3 tracking-[-0.1px]">
          <h1 className="font-display text-2xl font-semibold leading-8 text-text-default-500">Verify your business owner</h1>
          <p className={authBodyTextClassName}>
            Provide the information of your ultimate beneficial owner. The person that owns the highest stakes in your
            business
          </p>
        </div>
      }
    >
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <FormField label="Full name" hint="As it appears on the ID card" error={errors.fullName}>
            <Input
              density="compact"
              placeholder="Enter full name"
              value={data.fullName}
              onChange={(e) => onChange({ ...data, fullName: e.target.value })}
              invalid={Boolean(errors.fullName)}
            />
          </FormField>

          <FormField label="Phone number" error={errors.phone}>
            <div
              className={cn(
                "flex w-full overflow-hidden rounded-xl border bg-white shadow-input-default transition-colors focus-within:border-border-input-active focus-within:ring-2 focus-within:ring-[rgb(255,122,26,0.12)]",
                phoneInvalid
                  ? "border-border-input-negative bg-bg-negative-soft"
                  : "border-border-input-default-200",
              )}
            >
              <div className="relative flex h-10 shrink-0 items-center border-r border-border-default-100 bg-white pl-2 pr-1">
                <CountryDialCodeDropdown
                  countryCode={data.countryCode}
                  onValueChange={(country) =>
                    onChange({ ...data, countryCode: country.code, dialCode: country.dialCode })
                  }
                  invalid={phoneInvalid}
                />
              </div>
              <input
                className="h-10 min-h-10 min-w-0 flex-1 border-0 bg-transparent px-4 text-sm leading-[22px] tracking-[-0.1px] text-text-default-500 outline-none placeholder:text-input-placeholder"
                placeholder="901 234 5678"
                inputMode="tel"
                autoComplete="tel-national"
                value={data.phone}
                onChange={(e) => onChange({ ...data, phone: e.target.value })}
              />
            </div>
          </FormField>

          <FormField label="Identification type" error={errors.idType}>
            <FormDropdown
              ariaLabel="Identification type"
              value={data.idType}
              invalid={Boolean(errors.idType)}
              options={ID_TYPE_OPTIONS}
              onValueChange={(idType) => onChange({ ...data, idType })}
            />
          </FormField>

          <FormField label={idTypeMeta.label} hint={idTypeMeta.hint} error={errors.nin}>
            <Input
              density="compact"
              placeholder={idTypeMeta.placeholder}
              inputMode={idTypeMeta.inputMode}
              value={data.nin}
              onChange={(e) => onChange({ ...data, nin: e.target.value })}
              invalid={Boolean(errors.nin)}
            />
          </FormField>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            className={authOnboardingPrimaryButtonClassName}
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
