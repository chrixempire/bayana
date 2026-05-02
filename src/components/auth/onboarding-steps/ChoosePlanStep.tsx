import { useEffect, useMemo, useState, type ReactNode } from "react"
import { useSearchParams } from "react-router-dom"
import { BayanaLogo } from "../../brand/BayanaLogo"
import { Button } from "../../ui/button"
import { cn } from "../../../lib/utils"

type BillingCycle = "monthly" | "quarterly" | "yearly"

type PlanFeature = {
  label: string
  soon?: boolean
  muted?: boolean
}

const BILLING_TABS: { id: BillingCycle; label: string; badge?: string }[] = [
  { id: "monthly", label: "Monthly" },
  { id: "quarterly", label: "Quarterly", badge: "Save 20%" },
  { id: "yearly", label: "Yearly", badge: "Save 20%" },
]

const FREE_FEATURES: Record<BillingCycle, PlanFeature[]> = {
  monthly: [
    { label: "10 volunteers per cause" },
    { label: "Up to ₦500,000 donations per month" },
    { label: "7 days duration for causes & needs" },
    { label: "2% platform fees on donations" },
    { label: "Up to 3 active causes/campaign at a time" },
  ],
  quarterly: [
    { label: "10 volunteers per cause" },
    { label: "Up to ₦1,500,000 donations per quarter" },
    { label: "7 days duration for causes & needs" },
    { label: "2% platform fees on donations" },
    { label: "Up to 3 active causes/campaign at a time" },
  ],
  yearly: [
    { label: "10 volunteers per cause" },
    { label: "Up to ₦6,000,000 donations per year" },
    { label: "7 days duration for causes & needs" },
    { label: "2% platform fees on donations" },
    { label: "Up to 3 active causes/campaign at a time" },
  ],
}

const PREMIUM_FEATURES: Record<BillingCycle, PlanFeature[]> = {
  monthly: [
    { label: "Unlimited volunteers per cause" },
    { label: "Unlimited donations" },
    { label: "90 days duration for causes & needs" },
    { label: "0.5% platform fees on donations" },
    { label: "Up to 10 active causes/needs at a time" },
    { label: "NGO collaborators", soon: true },
    { label: "Featured NGO spotlight" },
    { label: "Premium verified NGO badge" },
    { label: "Advanced analytics dashboard" },
    { label: "Auto-generated impact report" },
    { label: "...and more", muted: true },
  ],
  quarterly: [
    { label: "Unlimited volunteers per cause" },
    { label: "Unlimited donations" },
    { label: "90 days duration for causes & needs" },
    { label: "0.5% platform fees on donations" },
    { label: "Up to 10 active causes/needs at a time" },
    { label: "NGO collaborators", soon: true },
    { label: "Featured NGO spotlight" },
    { label: "Premium verified NGO badge" },
    { label: "Advanced analytics dashboard" },
    { label: "Auto-generated impact report" },
    { label: "...and more", muted: true },
  ],
  yearly: [
    { label: "Unlimited volunteers per cause" },
    { label: "Unlimited donations" },
    { label: "90 days duration for causes & needs" },
    { label: "0.5% platform fees on donations" },
    { label: "Up to 10 active causes/needs at a time" },
    { label: "NGO collaborators", soon: true },
    { label: "Featured NGO spotlight" },
    { label: "Premium verified NGO badge" },
    { label: "Advanced analytics dashboard" },
    { label: "Auto-generated impact report" },
    { label: "...and more", muted: true },
  ],
}

const PLAN_PRICES: Record<BillingCycle, { premium: string; cadence: string }> = {
  monthly: { premium: "₦20,000", cadence: "per month" },
  quarterly: { premium: "₦55,000", cadence: "per quarter" },
  yearly: { premium: "₦200,000", cadence: "per yearly" },
}

const PLAN_COMPARE_AT: Partial<Record<BillingCycle, string>> = {
  quarterly: "₦68,750",
  yearly: "₦240,000",
}

function FlippingPrice({
  flipKey,
  animate,
  children,
}: {
  flipKey: BillingCycle
  animate: boolean
  children: ReactNode
}) {
  return (
    <div className="plan-price-flip min-h-[36px] min-w-0">
      <div key={flipKey} className={cn("w-fit max-w-full", animate && "plan-price-flip-inner")}>
        {children}
      </div>
    </div>
  )
}

export function ChoosePlanStep({
  onComplete,
  onClose,
}: {
  onComplete: () => void
  onClose: () => void
}) {
  const [searchParams, setSearchParams] = useSearchParams()
  const cycleParam = searchParams.get("billing")
  const cycle: BillingCycle =
    cycleParam === "quarterly" || cycleParam === "yearly" || cycleParam === "monthly"
      ? cycleParam
      : "monthly"
  const [priceMotionEnabled, setPriceMotionEnabled] = useState(false)
  const activeTabIndex = BILLING_TABS.findIndex((tab) => tab.id === cycle)

  useEffect(() => {
    if (cycleParam) return

    const nextParams = new URLSearchParams(searchParams)
    nextParams.set("billing", "monthly")
    setSearchParams(nextParams, { replace: true })
  }, [cycleParam, searchParams, setSearchParams])

  const selectCycle = (next: BillingCycle) => {
    setPriceMotionEnabled(true)
    const nextParams = new URLSearchParams(searchParams)
    nextParams.set("billing", next)
    setSearchParams(nextParams, { replace: true })
  }

  const premiumPlan = useMemo(() => PLAN_PRICES[cycle], [cycle])
  const compareAtPrice = PLAN_COMPARE_AT[cycle]
  const freeFeatures = useMemo(() => FREE_FEATURES[cycle], [cycle])
  const premiumFeatures = useMemo(() => PREMIUM_FEATURES[cycle], [cycle])

  return (
    <div className="fixed inset-0 z-50 bg-bg-overlay p-4 sm:p-6" onClick={onClose}>
      <div className="flex h-full items-center justify-center">
        <div
          className="relative grid h-full max-h-[calc(100dvh-2rem)] w-full max-w-[1120px] overflow-hidden rounded-[20px] bg-bg-dropdown-modal shadow-[0_24px_60px_rgb(16,24,40,0.22)] lg:grid-cols-[30%_minmax(0,1fr)]"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            aria-label="Close plan modal"
            onClick={onClose}
            className="absolute right-4 top-4 z-20 inline-flex size-8 items-center justify-center rounded-full bg-white/92 text-text-neutral-400 shadow-[0_1px_2px_rgb(16,24,40,0.16)] transition-colors hover:text-text-default-500"
          >
            <CloseIcon className="size-4" />
          </button>

          <aside className="relative hidden min-h-0 overflow-hidden bg-bg-nav px-7 pb-8 pt-7 text-white lg:block">
            <div className="relative z-10 flex h-full flex-col">
              <BayanaLogo className="h-10 w-auto" alt="Bayana" />
              <div className="mt-[92px] max-w-[196px]">
                <h2 className="font-display text-[24px] font-semibold leading-8 tracking-[-0.3px]">Choose your plan</h2>
                <p className="mt-4 text-sm leading-6 text-[rgb(245,245,250,0.86)]">Choose a plan that works for you</p>
              </div>
            </div>
            <DecorativeTrail />
          </aside>

          <section className="flex min-h-0 min-w-0 flex-col overflow-y-auto p-4 sm:p-5">
            <div className="relative rounded-[32px] bg-[#f9fafa] p-1">
              <div
                className="absolute bottom-1 left-1 top-1 w-[calc((100%-8px)/3)] rounded-[40px] bg-white shadow-[0px_8px_8px_-4px_rgba(44,50,55,0.04),0px_4px_4px_-2px_rgba(44,50,55,0.04),0px_2px_2px_-1px_rgba(44,50,55,0.04),0px_1px_1px_-0.5px_rgba(44,50,55,0.04),0px_0px_0px_1px_rgba(44,50,55,0.08)] transition-transform duration-300 ease-out"
                style={{ transform: `translateX(${activeTabIndex * 100}%)` }}
              />
              <div className="relative grid grid-cols-3">
                {BILLING_TABS.map((tab) => (
                  <button
                  key={tab.id}
                  type="button"
                  onClick={() => selectCycle(tab.id)}
                  className={cn(
                    "relative z-10 flex h-9 cursor-pointer items-center justify-center gap-2 rounded-[40px] px-3 text-sm font-medium leading-[22px] transition-colors duration-200",
                    cycle === tab.id ? "text-[#2c3237]" : "text-[#656f78]",
                  )}
                >
                    <span>{tab.label}</span>
                    {tab.badge ? (
                      <span className="inline-flex h-[18px] items-center rounded bg-[#fff1e8] px-1 py-0.5 text-[10px] font-medium leading-[18px] tracking-[0.1px] text-[#ff7415]">
                        {tab.badge}
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 grid min-h-0 flex-1 gap-0 rounded-[24px] border border-[#edf0f2] bg-[#f9fafa] lg:grid-cols-[1fr_1fr]">
              <article className="min-h-0 min-w-0 overflow-y-auto border-b border-[#edf0f2] p-6 lg:border-b-0 lg:border-r">
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1">
                      <RocketIcon className="size-4 shrink-0 text-icon-neutral" />
                      <p className="text-base font-medium leading-6 tracking-[-0.1px] text-[#2c3237]">Free</p>
                    </div>
                    <p className="text-sm font-normal leading-[22px] tracking-[-0.1px] text-[#656f78]">
                      Enjoy our basic features
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="font-display text-[32px] font-semibold leading-9 tracking-[-0.2px] text-[#2c3237]">₦0</p>
                    <p
                      key={priceMotionEnabled ? cycle : "static"}
                      className={cn(
                        "text-sm font-normal leading-[22px] tracking-[-0.1px] text-[#656f78]",
                        priceMotionEnabled && "plan-cadence-shift",
                      )}
                    >
                      {premiumPlan.cadence}
                    </p>
                  </div>
                  <Button
                    variant="neutral"
                    block
                    className="h-10 rounded-xl border-border-input-default-200 text-sm font-semibold leading-[22px] text-[#2c3237]"
                  >
                    Choose
                  </Button>
                  <ul className="flex flex-col gap-2">
                    {freeFeatures.map((feature) => (
                      <FeatureItem key={feature.label} icon="neutral" label={feature.label} />
                    ))}
                  </ul>
                </div>
              </article>

              <article className="min-h-0 min-w-0 overflow-y-auto rounded-[24px] bg-white p-6 shadow-[0px_16px_16px_-8px_rgba(44,50,55,0.04),0px_8px_8px_-4px_rgba(44,50,55,0.04),0px_4px_4px_-2px_rgba(44,50,55,0.04),0px_2px_2px_-1px_rgba(44,50,55,0.04),0px_1px_1px_-0.5px_rgba(44,50,55,0.04),0px_0px_0px_1px_rgba(44,50,55,0.08)]">
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1">
                      <PremiumMarkIcon className="size-4 shrink-0" />
                      <p className="text-base font-medium leading-6 tracking-[-0.1px] text-[#2c3237]">Premium</p>
                    </div>
                    <p className="text-sm font-normal leading-[22px] tracking-[-0.1px] text-[#656f78]">
                      Enjoy our full features
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <FlippingPrice flipKey={cycle} animate={priceMotionEnabled}>
                      <div className="flex flex-wrap items-baseline gap-2">
                        <p className="font-display text-[32px] font-semibold leading-9 tracking-[-0.2px] text-[#2c3237]">
                          {premiumPlan.premium}
                        </p>
                        {compareAtPrice ? (
                          <p className="text-base font-medium leading-6 tracking-[-0.1px] text-[#656f78] line-through decoration-solid [text-decoration-skip-ink:none]">
                            {compareAtPrice}
                          </p>
                        ) : null}
                      </div>
                    </FlippingPrice>
                    <p
                      key={priceMotionEnabled ? cycle : "static"}
                      className={cn(
                        "text-sm font-normal leading-[22px] tracking-[-0.1px] text-[#656f78]",
                        priceMotionEnabled && "plan-cadence-shift",
                      )}
                    >
                      {premiumPlan.cadence}
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    block
                    className="h-10 rounded-xl text-sm font-semibold leading-[22px]"
                    onClick={onComplete}
                  >
                    Subscribe
                  </Button>
                  <ul className="flex flex-col gap-2">
                    {premiumFeatures.map((feature) => (
                      <FeatureItem
                        key={feature.label}
                        icon="accent"
                        label={feature.label}
                        soon={feature.soon}
                        muted={feature.muted}
                      />
                    ))}
                  </ul>
                </div>
              </article>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function FeatureItem({
  icon,
  label,
  soon = false,
  muted = false,
}: {
  icon: "neutral" | "accent"
  label: string
  soon?: boolean
  muted?: boolean
}) {
  if (muted) {
    return (
      <li>
        <p className="text-sm font-medium leading-[22px] tracking-[-0.1px] text-[#a0acb6] underline decoration-solid [text-decoration-skip-ink:none]">
          {label}
        </p>
      </li>
    )
  }

  return (
    <li className="flex items-center gap-1.5 text-sm font-medium leading-[22px] tracking-[-0.1px] text-[#656f78]">
      <span className="shrink-0">
        {icon === "accent" ? <AccentCheckIcon className="size-4" /> : <MutedCheckIcon className="size-4" />}
      </span>
      <span className="flex min-w-0 flex-wrap items-center gap-2">
        <span>{label}</span>
        {soon ? (
          <span className="inline-flex h-[18px] items-center rounded bg-[#656f78] px-1 py-0.5 text-[10px] font-medium leading-[18px] tracking-[0.1px] text-white">
            Soon
          </span>
        ) : null}
      </span>
    </li>
  )
}

function DecorativeTrail() {
  const dots = [
    [20, 440, 16],
    [58, 437, 15],
    [96, 441, 15],
    [134, 452, 15],
    [171, 468, 15],
    [14, 472, 12],
    [49, 474, 12],
    [85, 477, 12],
    [121, 486, 12],
    [157, 501, 12],
    [192, 518, 12],
    [18, 500, 10],
    [47, 500, 10],
    [75, 500, 10],
    [141, 530, 10],
    [171, 549, 10],
    [202, 575, 10],
    [130, 558, 13],
    [163, 584, 13],
    [197, 612, 13],
    [229, 648, 14],
  ] as const

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map(([left, top, size], index) => (
        <span
          key={`${left}-${top}-${index}`}
          className="absolute rounded-full bg-bg-on-on-nav/85"
          style={{ left, top, width: size, height: size }}
        />
      ))}
    </div>
  )
}

function RocketIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
      <path
        d="M9.8 2.1c1.7-.4 3.1.9 2.7 2.6l-.5 2.3 1.2 1.2a.7.7 0 0 1-.2 1.1l-1.2.6-.5 1.2a.7.7 0 0 1-1.1.2l-1.2-1.2-2.3.5c-1.7.4-3-.9-2.6-2.6L4.7 6l5.1-3.9Z"
        fill="currentColor"
        opacity="0.92"
      />
      <circle cx="10.1" cy="5.3" r="1" fill="white" />
      <path d="M3 13l2.5-1 .5.5L5 15l-2 .5.5-2.5Z" fill="currentColor" opacity="0.82" />
    </svg>
  )
}

function PremiumMarkIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
      <circle cx="8" cy="8" r="4.7" fill="#FF6A55" />
      <circle cx="8" cy="8" r="3.1" fill="#2EA1FE" />
      <circle cx="8" cy="8" r="1.8" fill="white" />
    </svg>
  )
}

function AccentCheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
      <circle cx="8" cy="8" r="6" fill="#FF6A55" />
      <path d="m5.1 8.1 1.8 1.8 4-4.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MutedCheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
      <circle cx="8" cy="8" r="6" fill="#A2ADB9" />
      <path d="m5.1 8.1 1.8 1.8 4-4.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
      <path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}
