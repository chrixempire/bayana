import { cn } from "../../lib/utils"
import type { CreateEventStepConfig } from "../../pages/dashboard/create-event-types"

type StepState = "completed" | "active" | "upcoming"

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

function getStepState(stepIndex: number, activeIndex: number): StepState {
  if (stepIndex < activeIndex) return "completed"
  if (stepIndex === activeIndex) return "active"
  return "upcoming"
}

export function CreateEventStepSidebar({
  steps,
  activeStepIndex,
}: {
  steps: CreateEventStepConfig[]
  activeStepIndex: number
}) {
  return (
    <aside className="w-full shrink-0 lg:w-[222px]">
      <p className="type-create-event-caption mb-3">Steps</p>
      <nav className="flex flex-col gap-1" aria-label="Create event steps">
        {steps.map((step, index) => {
          const state = getStepState(index, activeStepIndex)

          return (
            <div
              key={step.id}
              className={cn(
                "flex h-8 w-[222px] max-w-full items-center gap-3 rounded-lg px-3 transition-colors",
                state === "active" && "bg-bg-nav-tab-active",
              )}
            >
              <div
                className={cn(
                  "type-create-event-step-number flex size-6 shrink-0 items-center justify-center rounded-full",
                  state === "active" && "bg-bg-accent text-text-on-solid-bg",
                  state === "completed" && "bg-[#36b55c] text-white",
                  state === "upcoming" && "bg-bg-default-100 text-text-table-header",
                )}
              >
                {state === "completed" ? (
                  <StepCheckIcon className="size-3" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span
                className={cn(
                  "type-create-event-step-label",
                  state === "active" ? "text-text-nav-tab-active" : "text-text-table-header",
                )}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
