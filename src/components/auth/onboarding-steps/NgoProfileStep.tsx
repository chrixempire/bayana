import { useMemo, useRef, useState } from "react"
import { Button } from "../../ui/button"
import { Textarea } from "../../ui/textarea"
import { cn } from "../../../lib/utils"
import type { OnboardingData } from "../../../pages/auth/types"
import { FormField } from "../FormField"
import { OnboardingStepShell } from "../OnboardingStepShell"
import { ContinueArrowIcon } from "../icons/ContinueArrowIcon"

const CAUSE_AREAS = [
  "Arts, Culture & Technology",
  "Animal Welfare",
  "Children's Welfare",
  "Education",
  "Environmental",
  "Events",
  "Faith-based",
  "Fitness",
  "Food & Hunger",
  "Health & Wellness",
  "Sports",
  "Travel",
  "Youth Development",
] as const

export function NgoProfileStep({
  data,
  basicInformation,
  businessOwner,
  errors,
  onChange,
  onBack,
  onContinue,
  onSkip,
}: {
  data: OnboardingData["ngoProfile"]
  basicInformation: OnboardingData["basicInformation"]
  businessOwner: OnboardingData["businessOwner"]
  errors: Record<string, string>
  onChange: (next: OnboardingData["ngoProfile"]) => void
  onBack: () => void
  onContinue: () => void
  onSkip: () => void
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string>("")
  const selectedCauses = useMemo(() => new Set(data.causes), [data.causes])

  const handleLogoChange = (file?: File) => {
    if (!file) return
    if (logoPreviewUrl) URL.revokeObjectURL(logoPreviewUrl)
    const nextUrl = URL.createObjectURL(file)
    setLogoPreviewUrl(nextUrl)
    onChange({ ...data, logoName: file.name })
  }

  const toggleCause = (cause: string) => {
    if (selectedCauses.has(cause)) {
      onChange({ ...data, causes: data.causes.filter((item) => item !== cause) })
      return
    }
    onChange({ ...data, causes: [...data.causes, cause] })
  }

  return (
    <OnboardingStepShell
      combineTitleAndContent
      frameStart={
        <Button variant="neutral" size="sm" className="w-fit" onClick={onBack}>
          Back
        </Button>
      }
      titleBlock={
        <div className="flex flex-col gap-3 tracking-[-0.1px]">
          <h1 className="font-display text-2xl font-semibold leading-8 text-text-default-500">Setup your NGO profile</h1>
          <p className="text-sm font-normal leading-[22px] text-text-neutral-400">
            Provide more information about your Non-governmental organisation for volunteers to see
          </p>
        </div>
      }
      callout={
        <NgoPhonePreview
          businessName={basicInformation.businessName}
          businessAddress={basicInformation.address}
          dialCode={businessOwner.dialCode}
          phone={businessOwner.phone}
          logoPreviewUrl={logoPreviewUrl}
          hasUploadedLogo={Boolean(data.logoName)}
          mission={data.mission}
          causes={data.causes}
          pastActivities={data.activities}
        />
      }
    >
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.gif"
            className="hidden"
            onChange={(e) => handleLogoChange(e.target.files?.[0])}
          />
          <FormField label="Business logo" optional>
            <div className="flex items-center gap-2">
              <div className="inline-flex size-12 items-center justify-center rounded-lg bg-[#f3f5f7]">
                {logoPreviewUrl ? (
                  <img src={logoPreviewUrl} alt="Selected NGO logo" className="size-10 rounded-md object-cover" />
                ) : (
                  <span className="text-lg">🪴</span>
                )}
              </div>
              <Button
                type="button"
                variant="neutral"
                size="sm"
                className="h-8 px-3"
                onClick={() => fileInputRef.current?.click()}
              >
                {data.logoName ? "Change logo" : "Upload logo"}
              </Button>
            </div>
            <p className="text-[11px] leading-4 text-[#8b96a1]">JPG, PNG & GIF file up to 5MB at least 400px by 400px</p>
          </FormField>
          <FormField label="Mission" error={errors.mission}>
            <Textarea
              placeholder="Enter NGO mission"
              value={data.mission}
              onChange={(e) => onChange({ ...data, mission: e.target.value })}
            />
          </FormField>
          <FormField label="Cause areas">
            <div className="flex flex-wrap gap-2">
              {CAUSE_AREAS.map((cause) => {
                const active = selectedCauses.has(cause)
                return (
                  <button
                    key={cause}
                    type="button"
                    onClick={() => toggleCause(cause)}
                    className={cn(
                      "inline-flex h-8 max-w-full items-center gap-2 rounded-full border pl-1.5 pr-3.5 text-sm font-normal leading-5 tracking-[-0.1px] transition-colors",
                      active
                        ? "border-[#f3853d] bg-[#f3853d] text-white shadow-none"
                        : "border-[#dfe3e8] bg-white text-[#2c3237] hover:border-[#cfd6de] hover:bg-[#fafbfc]",
                    )}
                  >
                    {active ? (
                      <span className="inline-flex size-5 shrink-0 items-center justify-center text-white" aria-hidden>
                        <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                          <path
                            d="M1 4.5L4 7.5L10 1"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    ) : (
                      <span
                        className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-[#4b5563]"
                        aria-hidden
                      >
                        <svg className="block size-[9px] shrink-0" viewBox="0 0 12 12" fill="none" aria-hidden>
                          <path d="M6 3v6M3 6h6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </span>
                    )}
                    <span className="min-w-0 truncate">{cause}</span>
                  </button>
                )
              })}
            </div>
          </FormField>
          <FormField label="Past activities" error={errors.activities}>
            <Textarea
              placeholder="Enter past activities done by your NGO"
              value={data.activities}
              onChange={(e) => onChange({ ...data, activities: e.target.value })}
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

function NgoPhonePreview({
  businessName,
  businessAddress,
  dialCode,
  phone,
  logoPreviewUrl,
  hasUploadedLogo,
  mission,
  causes,
  pastActivities,
}: {
  businessName: string
  businessAddress: string
  dialCode: string
  phone: string
  logoPreviewUrl: string
  hasUploadedLogo: boolean
  mission: string
  causes: string[]
  pastActivities: string
}) {
  const hasBusinessName = businessName.trim().length > 0
  const hasBusinessAddress = businessAddress.trim().length > 0
  const hasPhone = phone.trim().length > 0
  const isEmptyState =
    !logoPreviewUrl &&
    !hasUploadedLogo &&
    !hasBusinessName &&
    !hasBusinessAddress &&
    !hasPhone &&
    !mission.trim() &&
    causes.length === 0 &&
    !pastActivities.trim()

  const previewName = businessName.trim() || "Teemplot"
  const previewPhone = hasPhone ? `${dialCode || "+234"} ${phone.trim()}` : ""

  return (
    <aside className="w-full max-w-[368px] overflow-hidden rounded-2xl border border-[#d8dde3] bg-white lg:sticky lg:top-8 lg:justify-self-end">
      <div className="flex h-[86px] items-end justify-center bg-[#f4f6f8] pb-4">
        <div className="h-5 w-20 rounded-full bg-[#cfd5dc]" />
      </div>

      <div className="space-y-2 border-b border-[#eceff3] p-4">
        <div className="flex items-center gap-3">
          <div className="inline-flex size-11 items-center justify-center rounded-full border border-[#e3e8ee] bg-white">
            {logoPreviewUrl ? (
              <img src={logoPreviewUrl} alt="NGO logo preview" className="size-9 rounded-full object-cover" />
            ) : hasUploadedLogo ? (
              <span className="text-lg">🪴</span>
            ) : (
              <span className="inline-flex size-3.5 rounded-full bg-[#d8dee5]" />
            )}
          </div>
        </div>
        <p className="text-3.5 font-semibold leading-6 text-[#2c3237]">{previewName}</p>
        {hasBusinessAddress ? (
          <p className="text-xs leading-5 text-[#66717b]">📍 {businessAddress}</p>
        ) : (
          <div className="flex items-center gap-2 pt-0.5">
            <span className="text-xs leading-5 text-[#66717b]">📍</span>
            <span className="h-3 w-[68%] rounded-full bg-[#edf1f5]" />
          </div>
        )}
        {hasPhone ? (
          <p className="text-xs leading-5 text-[#66717b]">📞 {previewPhone}</p>
        ) : (
          <div className="flex items-center gap-2 pt-0.5">
            <span className="text-xs leading-5 text-[#66717b]">📞</span>
            <span className="h-3 w-[44%] rounded-full bg-[#edf1f5]" />
          </div>
        )}
      </div>

      <div className="space-y-2 border-b border-[#eceff3] p-4">
        <p className="text-xl font-medium leading-5 text-[#2c3237]">Mission</p>
        {isEmptyState ? (
          <div className="space-y-2 pt-1">
            <div className="h-3 rounded-full bg-[#d8dee5]" />
            <div className="h-3 rounded-full bg-[#d8dee5]" />
            <div className="h-3 rounded-full bg-[#d8dee5]" />
            <div className="h-3 rounded-full bg-[#d8dee5]" />
            <div className="h-3 w-1/2 rounded-full bg-[#d8dee5]" />
          </div>
        ) : (
          <p className="text-xs leading-6 text-[#66717b]">
            {mission.trim() ||
              "We are committed to helping people access job opportunities by providing guidance, support, and training that strengthens communities and transforms lives."}
          </p>
        )}
      </div>

      <div className="space-y-2 border-b border-[#eceff3] p-4">
        <p className={cn("text-xl font-medium leading-5", isEmptyState ? "text-[#737d86]" : "text-[#2c3237]")}>Cause areas</p>
        {isEmptyState ? (
          <div className="grid grid-cols-4 gap-2 pt-1">
            <span className="col-span-1 h-6 rounded-md bg-bg-default-100" />
            <span className="col-span-2 h-6 rounded-md bg-bg-default-100" />
            <span className="col-span-2 h-6 rounded-md bg-bg-default-100" />
            <span className="col-span-1 h-6 rounded-md bg-bg-default-100" />
            <span className="col-span-1 h-6 rounded-md bg-bg-default-100" />
            <span className="col-span-1 h-6 rounded-md bg-bg-default-100" />
            <span className="col-span-2 h-6 rounded-md bg-bg-default-100" />
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {causes.length > 0
              ? causes.map((cause) => (
                  <span
                    key={cause}
                    className="inline-block max-w-full truncate rounded-lg bg-[#f2f3f5] px-2.5 py-1 text-[11px] font-medium leading-4 tracking-[-0.02em] text-[#5c6670]"
                  >
                    {cause}
                  </span>
                ))
              : ["Tag", "Tag", "Tag", "Tag"].map((tag, idx) => (
                  <span
                    key={`${tag}-${idx}`}
                    className="inline-block rounded-lg bg-[#f2f3f5] px-2.5 py-1 text-[11px] font-medium leading-4 text-[#5c6670]"
                  >
                    {tag}
                  </span>
                ))}
          </div>
        )}
      </div>

      <div className="space-y-2 p-4">
        <p className="text-xl font-medium leading-5 text-[#c3cad3]">Past activities</p>
        {isEmptyState ? <div className="h-3 w-3/5 rounded-full bg-[#edf1f5]" /> : <p className="text-xs leading-6 text-[#8a949e]">{pastActivities.trim() || " "}</p>}
      </div>
    </aside>
  )
}
