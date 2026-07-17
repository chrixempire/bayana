import { useMemo, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { CreateEventFormActions } from "../../components/create-event/CreateEventFormActions"
import { CreateEventFormColumn } from "../../components/create-event/CreateEventFormColumn"
import { CreateEventHeader } from "../../components/create-event/CreateEventHeader"
import { CreateEventSummary } from "../../components/create-event/CreateEventSummary"
import { CreateEventStepSidebar } from "../../components/create-event/CreateEventStepSidebar"
import { CreateEventStepAbout } from "../../components/create-event/steps/CreateEventStepAbout"
import { CreateEventStepBasics } from "../../components/create-event/steps/CreateEventStepBasics"
import { CreateEventNeedsStepBasics } from "../../components/create-event/steps/CreateEventNeedsStepBasics"
import { CreateEventNeedsStepConfig } from "../../components/create-event/steps/CreateEventNeedsStepConfig"
import { CreateEventUpgradeModal } from "../../components/create-event/CreateEventUpgradeModal"
import { CreateEventStepSettings } from "../../components/create-event/steps/CreateEventStepSettings"
import { DashboardLayout } from "../../components/dashboard/DashboardLayout"
import {
  CREATE_EVENT_CONTENT_LEFT_PX,
  CREATE_EVENT_CONTENT_TOP_PX,
  DASHBOARD_PAGE_GUTTER_PX,
} from "../../lib/dashboard-layout"
import { toast } from "../../hooks/use-toast"
import { DASHBOARD_TAB_PATHS } from "../../lib/dashboard-paths"
import {
  createEventPath,
  parseCreateEventStep,
  parseCreateEventType,
} from "../../lib/create-event-paths"
import { isCreateEventStepValid } from "../../lib/create-event-validation"
import {
  createInitialFormState,
  getCreateEventSteps,
  type CreateEventFormState,
} from "./create-event-types"

export function CreateEventPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const eventType = parseCreateEventType(searchParams.get("type"))
  const steps = useMemo(() => getCreateEventSteps(eventType), [eventType])

  const [form, setForm] = useState<CreateEventFormState>(createInitialFormState)
  const [isPremium, setIsPremium] = useState(false)
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false)

  const stepId = parseCreateEventStep(searchParams.get("step"))
  const activeStepIndex = Math.max(
    0,
    steps.findIndex((step) => step.id === stepId),
  )
  const activeStep = steps[activeStepIndex]

  const goToStep = (index: number) => {
    const nextStep = steps[Math.max(0, Math.min(index, steps.length - 1))]
    navigate(createEventPath(eventType, nextStep.id), { replace: true })
  }
  const isLastStep = activeStepIndex === steps.length - 1
  const lastStepId = steps[steps.length - 1].id
  const canContinue = isCreateEventStepValid(activeStep.id, form, isPremium)
  const canCreate = isCreateEventStepValid(lastStepId, form, isPremium)

  const patchForm = (patch: Partial<CreateEventFormState>) => {
    setForm((prev) => ({ ...prev, ...patch }))
  }

  const handleTypeChange = () => {
    setForm(createInitialFormState())
  }

  const handleBack = () => {
    if (activeStepIndex <= 0) return
    goToStep(activeStepIndex - 1)
  }

  const handleContinue = () => {
    if (!canContinue) return
    goToStep(activeStepIndex + 1)
  }

  const handleSaveDraft = () => {
    toast({
      variant: "success",
      title: "Draft saved",
      description: "You can continue editing this event later.",
    })
    navigate(DASHBOARD_TAB_PATHS.events)
  }

  const handleCreate = () => {
    if (!canCreate) return
    toast({
      variant: "success",
      title: "Event has been created successfully!",
    })
    navigate(DASHBOARD_TAB_PATHS.events)
  }

  return (
    <DashboardLayout
      activeTab="events"
      showNavTabs={false}
      mainClassName="bg-bg-canvas"
      subHeader={
        <CreateEventHeader
          eventType={eventType}
          onTypeChange={(type) => {
            handleTypeChange()
            navigate(createEventPath(type), { replace: true })
          }}
        />
      }
    >
      <div
        className="w-full pb-6 sm:pb-8"
        style={{
          paddingLeft: CREATE_EVENT_CONTENT_LEFT_PX,
          paddingRight: DASHBOARD_PAGE_GUTTER_PX,
          paddingTop: CREATE_EVENT_CONTENT_TOP_PX,
        }}
      >
        <div className="flex flex-col gap-10 xl:flex-row xl:items-start">
          <CreateEventStepSidebar steps={steps} activeStepIndex={activeStepIndex} />

          <div className="flex min-w-0 flex-1 flex-col gap-10 xl:flex-row xl:items-start">
            <CreateEventFormColumn>
              {activeStep.id === "basics" ? (
                <CreateEventStepBasics eventType={eventType} form={form} onChange={patchForm} />
              ) : null}
              {activeStep.id === "about" ? (
                <CreateEventStepAbout
                  eventType={eventType}
                  form={form}
                  onChange={patchForm}
                  onBack={handleBack}
                />
              ) : null}
              {activeStep.id === "settings" ? (
                <CreateEventStepSettings
                  eventType={eventType}
                  form={form}
                  onChange={patchForm}
                  onBack={handleBack}
                  isPremium={isPremium}
                  onRequestUpgrade={() => setUpgradeModalOpen(true)}
                />
              ) : null}
              {activeStep.id === "needs-basics" ? (
                <CreateEventNeedsStepBasics form={form} onChange={patchForm} />
              ) : null}
              {activeStep.id === "needs-config" ? (
                <CreateEventNeedsStepConfig
                  form={form}
                  onChange={patchForm}
                  onBack={handleBack}
                  isPremium={isPremium}
                  onRequestUpgrade={() => setUpgradeModalOpen(true)}
                />
              ) : null}

              {!isLastStep ? (
                <CreateEventFormActions
                  canContinue={canContinue}
                  onContinue={handleContinue}
                  onSaveDraft={handleSaveDraft}
                  showSaveDraft={eventType !== "needs"}
                />
              ) : null}
            </CreateEventFormColumn>

            {isLastStep ? (
              <CreateEventSummary
                form={form}
                canCreate={canCreate}
                isPremium={isPremium}
                eventType={eventType}
                onCreate={handleCreate}
              />
            ) : null}
          </div>
        </div>
      </div>
      <CreateEventUpgradeModal
        open={upgradeModalOpen}
        isPremium={isPremium}
        onClose={() => setUpgradeModalOpen(false)}
        onUpgraded={() => {
          setIsPremium(true)
          setUpgradeModalOpen(false)
          toast({
            variant: "success",
            title: "Upgraded to Premium",
            description: "Premium features are now available on this form.",
          })
        }}
      />
    </DashboardLayout>
  )
}
