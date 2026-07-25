import { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "../../ui/button"
import { Textarea } from "../../ui/textarea"
import { getCauseAreas } from "../../../lib/api/public"
import { cn } from "../../../lib/utils"
import { authBodyTextClassName, authOnboardingPrimaryButtonClassName } from "../../../lib/auth-form-styles"
import type { CauseAreaSelection, OnboardingData } from "../../../pages/auth/types"
import { validateLogoFileSize } from "../../../pages/auth/onboarding-validation"
import { FormField } from "../FormField"
import { OnboardingStepShell } from "../OnboardingStepShell"
import { ContinueArrowIcon } from "../icons/ContinueArrowIcon"

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
  const [logoError, setLogoError] = useState("")
  const [causeAreas, setCauseAreas] = useState<CauseAreaSelection[]>([])
  const [isLoadingCauses, setIsLoadingCauses] = useState(true)
  const [causeLoadError, setCauseLoadError] = useState("")

  const selectedCauseIds = useMemo(() => new Set(data.causes.map((cause) => cause.id)), [data.causes])

  useEffect(() => {
    let cancelled = false

    void getCauseAreas()
      .then((response) => {
        if (cancelled) return
        setCauseAreas(response.data.map((cause) => ({ id: cause.id, name: cause.name })))
        setCauseLoadError("")
      })
      .catch(() => {
        if (cancelled) return
        setCauseLoadError("Unable to load cause areas. Please refresh and try again.")
      })
      .finally(() => {
        if (!cancelled) setIsLoadingCauses(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const logoPreviewUrl = useMemo(
    () => (data.logo ? URL.createObjectURL(data.logo) : ""),
    [data.logo],
  )

  useEffect(() => {
    if (!logoPreviewUrl) return
    return () => URL.revokeObjectURL(logoPreviewUrl)
  }, [logoPreviewUrl])

  const handleLogoChange = (file?: File) => {
    if (!file) return

    const sizeError = validateLogoFileSize(file)
    if (sizeError) {
      setLogoError(sizeError)
      if (fileInputRef.current) fileInputRef.current.value = ""
      return
    }

    setLogoError("")
    onChange({ ...data, logo: file })
  }

  const logoFieldError = errors.logo || logoError

  const toggleCause = (cause: CauseAreaSelection) => {
    if (selectedCauseIds.has(cause.id)) {
      onChange({ ...data, causes: data.causes.filter((item) => item.id !== cause.id) })
      return
    }
    onChange({ ...data, causes: [...data.causes, cause] })
  }

  return (
    <OnboardingStepShell
      combineTitleAndContent
      middleScrollOnly
      frameStart={
        <Button variant="neutral" size="sm" className="w-fit" onClick={onBack}>
          Back
        </Button>
      }
      titleBlock={
        <div className="flex flex-col gap-3 tracking-[-0.1px]">
          <h1 className="font-display text-2xl font-semibold leading-8 text-text-default-500">Setup your NGO profile</h1>
          <p className={authBodyTextClassName}>
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
          hasUploadedLogo={Boolean(data.logo)}
          mission={data.mission}
          causes={data.causes.map((cause) => cause.name)}
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
          <FormField label="Business logo" optional error={logoFieldError}>
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
                {data.logo ? "Change logo" : "Upload logo"}
              </Button>
            </div>
            <p className="text-[11px] leading-4 text-[#8b96a1]">
              JPG, PNG & GIF file up to 2048KB at least 400px by 400px
            </p>
          </FormField>
          <FormField label="Mission" error={errors.mission}>
            <Textarea
              placeholder="Enter NGO mission"
              value={data.mission}
              onChange={(e) => onChange({ ...data, mission: e.target.value })}
            />
          </FormField>
          <FormField label="Cause areas" error={errors.causes}>
            {isLoadingCauses ? (
              <p className="text-sm text-text-neutral-400">Loading cause areas...</p>
            ) : causeLoadError ? (
              <p className="text-sm text-text-negative">{causeLoadError}</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {causeAreas.map((cause) => {
                  const active = selectedCauseIds.has(cause.id)
                  return (
                    <button
                      key={cause.id}
                      type="button"
                      onClick={() => toggleCause(cause)}
                      className={cn(
                        "inline-flex h-8 max-w-full cursor-pointer items-center gap-2 rounded-full border pl-1.5 pr-3.5 text-sm font-normal leading-5 tracking-[-0.1px] transition-colors",
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
                      <span className="min-w-0 truncate">{cause.name}</span>
                    </button>
                  )
                })}
              </div>
            )}
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
  const hasMission = mission.trim().length > 0
  const hasCauses = causes.length > 0
  const hasPastActivities = pastActivities.trim().length > 0

  const previewName = businessName.trim()
  const previewPhone = hasPhone ? `${dialCode || "+234"} ${phone.trim()}` : ""

  return (
    <aside className="w-full max-w-[368px] shrink-0 overflow-hidden rounded-2xl border border-[#d8dde3] bg-white min-[1200px]:w-[368px] min-[1200px]:justify-self-end">
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
        {hasBusinessName ? (
          <p className="text-3.5 font-semibold leading-6 text-[#2c3237]">{previewName}</p>
        ) : (
          <div className="h-5 w-[42%] rounded-full bg-[#d8dee5]" />
        )}
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
        {hasMission ? (
          <p className="text-xs leading-6 text-[#66717b]">{mission.trim()}</p>
        ) : (
          <div className="space-y-2 pt-1">
            <div className="h-3 rounded-full bg-[#d8dee5]" />
            <div className="h-3 rounded-full bg-[#d8dee5]" />
            <div className="h-3 rounded-full bg-[#d8dee5]" />
            <div className="h-3 rounded-full bg-[#d8dee5]" />
            <div className="h-3 w-1/2 rounded-full bg-[#d8dee5]" />
          </div>
        )}
      </div>

      <div className="space-y-2 border-b border-[#eceff3] p-4">
        <p className={cn("text-xl font-medium leading-5", hasCauses ? "text-[#2c3237]" : "text-[#737d86]")}>
          Cause areas
        </p>
        {hasCauses ? (
          <div className="flex flex-wrap gap-2">
            {causes.map((cause) => (
              <span
                key={cause}
                className="inline-block max-w-full truncate rounded-lg bg-[#f2f3f5] px-2.5 py-1 text-[11px] font-medium leading-4 tracking-[-0.02em] text-[#5c6670]"
              >
                {cause}
              </span>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2 pt-1">
            <span className="col-span-1 h-6 rounded-md bg-bg-default-100" />
            <span className="col-span-2 h-6 rounded-md bg-bg-default-100" />
            <span className="col-span-2 h-6 rounded-md bg-bg-default-100" />
            <span className="col-span-1 h-6 rounded-md bg-bg-default-100" />
            <span className="col-span-1 h-6 rounded-md bg-bg-default-100" />
            <span className="col-span-1 h-6 rounded-md bg-bg-default-100" />
            <span className="col-span-2 h-6 rounded-md bg-bg-default-100" />
          </div>
        )}
      </div>

      <div className="space-y-2 p-4">
        <p className={cn("text-xl font-medium leading-5", hasPastActivities ? "text-[#2c3237]" : "text-[#c3cad3]")}>
          Past activities
        </p>
        {hasPastActivities ? (
          <p className="text-xs leading-6 text-[#8a949e]">{pastActivities.trim()}</p>
        ) : (
          <div className="h-3 w-3/5 rounded-full bg-[#edf1f5]" />
        )}
      </div>
    </aside>
  )
}
