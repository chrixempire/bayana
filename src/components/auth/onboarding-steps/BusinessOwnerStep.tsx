import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { cn } from "../../../lib/utils"
import type { OnboardingData } from "../../../pages/auth/types"
import { FormField } from "../FormField"
import { OnboardingStepShell } from "../OnboardingStepShell"
import { ChevronDownIcon } from "../icons/ChevronDownIcon"
import { ContinueArrowIcon } from "../icons/ContinueArrowIcon"

const ID_TYPES = ["National ID card", "Driver's license", "International passport"] as const

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
  const dial = data.dialCode ?? "+234"

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
          <p className="text-sm font-normal leading-[22px] text-text-neutral-400">
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
                <span className="mr-0.5 text-sm leading-none" aria-hidden>
                  🇳🇬
                </span>
                <select
                  aria-label="Country calling code"
                  className="h-10 max-w-[5.5rem] cursor-pointer appearance-none border-0 bg-transparent py-2 pl-1 pr-6 text-sm leading-[22px] text-text-default-500 outline-none"
                  value={dial}
                  onChange={(e) => onChange({ ...data, dialCode: e.target.value })}
                >
                  <option value="+234">+234</option>
                </select>
                <ChevronDownIcon className="pointer-events-none absolute right-1 top-1/2 size-4 -translate-y-1/2 text-text-neutral-400" />
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

          <FormField label="Identification type">
            <div className="relative">
              <select
                className="h-10 w-full cursor-pointer appearance-none rounded-xl border border-border-input-default-200 bg-white px-4 py-2 pr-10 text-sm leading-[22px] text-text-default-500 shadow-input-default outline-none transition-colors focus:border-border-input-active focus:ring-2 focus:ring-[rgb(255,122,26,0.12)]"
                value={data.idType}
                onChange={(e) => onChange({ ...data, idType: e.target.value })}
              >
                {ID_TYPES.map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-text-neutral-400" />
            </div>
          </FormField>

          <FormField label="NIN" hint="Dial *346# to get your NIN" error={errors.nin}>
            <Input
              density="compact"
              placeholder="Enter national identification number"
              value={data.nin}
              onChange={(e) => onChange({ ...data, nin: e.target.value })}
              invalid={Boolean(errors.nin)}
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
