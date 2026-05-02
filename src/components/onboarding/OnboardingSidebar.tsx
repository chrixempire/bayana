import { useNavigate } from "react-router-dom"
import { BayanaLogo } from "../brand/BayanaLogo"
import { AUTH_CREATE_ACCOUNT_PATH } from "../../lib/auth-paths"
import { cn } from "../../lib/utils"

type StepState = "default" | "active" | "completed"

type StepItem = {
  title: string
  description: string
  state: StepState
}

const ONBOARDING_STEPS = [
  { title: "Basic information", description: "Provide basic information about your NGO" },
  { title: "Business owner", description: "Provide your business owner details" },
  { title: "Business verification", description: "Provide your business verification document" },
  { title: "NGO profile setup", description: "Provide more information about your NGO" },
  { title: "Review information", description: "Review the information you provided" },
]

function StepCheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M2.5 6 5 8.5l4.5-5"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function LogOutDoorIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M7 2h2.5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5H7M2.5 6H7M7 6l-1.25 1.25M7 6 5.75 4.75"
        stroke="currentColor"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function buildStepItems(activeStep: number): StepItem[] {
  return ONBOARDING_STEPS.map((step, index) => ({
    ...step,
    state: index < activeStep ? "completed" : index === activeStep ? "active" : "default",
  }))
}

/**
 * Figma: the orange marker is a **left border on the active step row**, not a separate floating rail.
 * Inactive rows use a transparent left border so layout does not shift when the active step changes.
 */
function StepRow({ index, title, description, state }: StepItem & { index: number }) {
  const isActive = state === "active"
  const isCompleted = state === "completed"

  return (
    <div
      className={cn(
        "-mx-14 flex items-start gap-4 border-l-2 border-solid px-14 py-2 transition-[border-color] duration-200 ease-out",
        isActive ? "border-[#ff7415]" : "border-transparent",
      )}
    >
      <div
        className={cn(
          "flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold leading-[18px]",
          isActive && "bg-[#ff7415] text-white",
          isCompleted && "bg-[#36b55c] text-white",
          !isActive &&
            !isCompleted &&
            "bg-white text-[#2c3237] shadow-[0_0_0_1px_rgba(44,50,55,0.08),0_1px_1px_-0.5px_rgba(44,50,55,0.04),0_2px_2px_-1px_rgba(44,50,55,0.04)]",
        )}
      >
        {isCompleted ? <StepCheckIcon className="size-3 text-white" /> : <span>{index + 1}</span>}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <p className="text-sm font-medium leading-[22px] text-[#2c3237]">{title}</p>
        <p className="text-xs leading-5 text-[#656f78]">{description}</p>
      </div>
    </div>
  )
}

export function OnboardingSidebar({ activeStep }: { activeStep: number }) {
  const navigate = useNavigate()
  const steps = buildStepItems(activeStep)

  return (
    <aside className="sticky top-0 hidden h-dvh flex-col overflow-hidden bg-[#f9fafa] pt-14 min-[900px]:flex">
      <div className="px-14">
        <div className="inline-flex items-center gap-2.5">
          <BayanaLogo className="h-9 w-auto" />
          <span className="font-display text-[18px] font-semibold leading-none tracking-[-0.2px] text-[#24104a]">
            Bayana
          </span>
        </div>
      </div>

      <nav className="mt-10 min-h-0 flex-1 overflow-y-auto px-14 pb-6" aria-label="Onboarding steps">
        <div className="flex flex-col gap-2 pr-1">
          {steps.map((step, index) => (
            <StepRow key={step.title} index={index} {...step} />
          ))}
        </div>
      </nav>

      <footer className="mt-auto flex items-center justify-between gap-4 px-14 pb-14 pt-8">
        <button
          type="button"
          className="inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-[10px] border border-[#e1e5ea] bg-white px-3 text-sm font-semibold text-[#2c3237] shadow-[0_2px_2px_-1px_rgba(44,50,55,0.04),0_1px_1px_-0.5px_rgba(44,50,55,0.04),0_0_0_1px_rgba(44,50,55,0.12)] transition-colors hover:bg-[#fbfbfb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3695e6]/40"
          onClick={() => navigate(AUTH_CREATE_ACCOUNT_PATH)}
        >
          <LogOutDoorIcon className="size-3 text-[#2c3237]" />
          Log out
        </button>
        <a
          href="#terms"
          className="shrink-0 text-sm font-medium text-[#656f78] underline-offset-2 hover:text-[#2c3237] hover:underline"
          onClick={(e) => e.preventDefault()}
        >
          Terms of Use
        </a>
      </footer>
    </aside>
  )
}

export function OnboardingProgressStepper({ activeStep }: { activeStep: number }) {
  const steps = buildStepItems(activeStep)

  return (
    <nav aria-label="Onboarding progress" className="w-full">
      <ol className="relative grid grid-cols-5 gap-2">
        <div aria-hidden className="absolute left-3 right-3 top-3 h-px bg-[#e4e8ee]" />
        {steps.map((step, index) => {
          const isActive = step.state === "active"
          const isCompleted = step.state === "completed"

          return (
            <li key={step.title} className="relative flex min-w-0 flex-col items-center gap-2 px-1 text-center">
              <div
                className={cn(
                  "relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold leading-none transition-colors",
                  isActive && "border-[#ff7415] bg-[#ff7415] text-white",
                  isCompleted && "border-[#36b55c] bg-[#36b55c] text-white",
                  !isActive &&
                    !isCompleted &&
                    "border-[#dfe4ea] bg-white text-[#2c3237] shadow-[0_0_0_1px_rgba(44,50,55,0.05),0_1px_1px_-0.5px_rgba(44,50,55,0.04)]",
                )}
              >
                {isCompleted ? <StepCheckIcon className="size-3 text-white" /> : <span>{index + 1}</span>}
              </div>

              <div className="flex min-w-0 flex-col gap-1">
                <p className="text-[11px] font-medium leading-4 text-[#2c3237]">{step.title}</p>
              </div>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
