import { BayanaLogo } from "../../components/brand/BayanaLogo"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import { BasicInformationStep } from "../../components/auth/onboarding-steps/BasicInformationStep"
import { BusinessOwnerStep } from "../../components/auth/onboarding-steps/BusinessOwnerStep"
import { BusinessVerificationStep } from "../../components/auth/onboarding-steps/BusinessVerificationStep"
import { CheckEmailStep } from "../../components/auth/onboarding-steps/CheckEmailStep"
import { ChoosePlanStep } from "../../components/auth/onboarding-steps/ChoosePlanStep"
import { NgoProfileStep } from "../../components/auth/onboarding-steps/NgoProfileStep"
import { ReviewStep } from "../../components/auth/onboarding-steps/ReviewStep"
import { OnboardingProgressStepper, OnboardingSidebar } from "../../components/onboarding/OnboardingSidebar"
import { cn } from "../../lib/utils"
import { AUTH_ONBOARDING_PATH } from "../../lib/auth-paths"
import { onboardingFlowSteps, type OnboardingFlowStep } from "./types"
import { AUTH_CREATE_ACCOUNT_PATH, useOnboardingFlow } from "./useOnboardingFlow"

export function OnboardingPage() {
  const navigate = useNavigate()
  const { step } = useParams<{ step: string }>()

  const stepValid = Boolean(step && onboardingFlowSteps.includes(step as OnboardingFlowStep))
  const currentStep: OnboardingFlowStep = stepValid ? (step as OnboardingFlowStep) : "check-email"

  const {
    data,
    errors,
    visibleStep,
    contentVisible,
    updateData,
    goBack,
    goToStep,
    validateAndNext,
    handleCheckEmailNext,
    handleSkipBusinessOwner,
    handleSkipBusinessVerification,
    handleSkipNgoProfile,
    handleChoosePlanComplete,
    closePlanModal,
    isPlanModalOpen,
    activeSidebarIndex,
    showSidebar,
  } = useOnboardingFlow(currentStep)

  if (!stepValid) {
    return <Navigate to={`${AUTH_ONBOARDING_PATH}/check-email`} replace />
  }

  const mainColumnClass = showSidebar
    ? "flex min-h-0 flex-col px-4 py-6 sm:px-12 sm:py-8 min-[900px]:px-16 min-[900px]:py-14"
    : "flex min-h-0 flex-col items-center justify-center px-4 py-8 sm:px-6 sm:py-10"

  return (
    <main className="h-dvh overflow-hidden bg-bg-canvas text-text-default-500">
      <section
        className={cn(
          "mx-auto grid h-full max-w-[1440px] overflow-hidden",
          showSidebar ? "min-[900px]:grid-cols-[440px_minmax(0,1fr)]" : "grid-cols-1",
        )}
      >
        {showSidebar ? <OnboardingSidebar activeStep={activeSidebarIndex} /> : null}

        <div className={cn("min-w-0 h-full overflow-y-auto", mainColumnClass)}>
          <div
            className={cn(
              "onboarding-content w-full max-w-[1120px]",
              contentVisible ? "onboarding-content--visible" : "onboarding-content--hidden",
            )}
          >
            {showSidebar ? (
              <div className="mb-8 flex flex-col items-start gap-5 min-[900px]:hidden">
                <div className="inline-flex items-center gap-2.5">
                  <BayanaLogo className="h-10 w-auto" />
                  <span className="font-display text-[18px] font-semibold leading-none tracking-[-0.2px] text-[#24104a]">
                    Bayana
                  </span>
                </div>
                <OnboardingProgressStepper activeStep={activeSidebarIndex} />
              </div>
            ) : null}

            {visibleStep === "check-email" ? (
              <CheckEmailStep
                email={data.createAccount.email}
                onNext={handleCheckEmailNext}
                onBackToSignup={() => navigate(AUTH_CREATE_ACCOUNT_PATH)}
              />
            ) : null}

            {visibleStep === "basic-information" ? (
              <BasicInformationStep
                data={data.basicInformation}
                errors={errors}
                onChange={(next) => updateData("basicInformation", next)}
                onContinue={validateAndNext}
              />
            ) : null}

            {visibleStep === "business-owner" ? (
              <BusinessOwnerStep
                data={data.businessOwner}
                errors={errors}
                onChange={(next) => updateData("businessOwner", next)}
                onBack={goBack}
                onContinue={validateAndNext}
                onSkip={handleSkipBusinessOwner}
              />
            ) : null}

            {visibleStep === "business-verification" ? (
              <BusinessVerificationStep
                data={data.verification}
                errors={errors}
                onChange={(verification) => updateData("verification", verification)}
                onBack={goBack}
                onContinue={validateAndNext}
                onSkip={handleSkipBusinessVerification}
              />
            ) : null}

            {visibleStep === "ngo-profile" ? (
              <NgoProfileStep
                data={data.ngoProfile}
                basicInformation={data.basicInformation}
                businessOwner={data.businessOwner}
                errors={errors}
                onChange={(next) => updateData("ngoProfile", next)}
                onBack={goBack}
                onContinue={validateAndNext}
                onSkip={handleSkipNgoProfile}
              />
            ) : null}

            {visibleStep === "review" ? (
              <ReviewStep onBack={goBack} onSubmit={validateAndNext} onEditSection={goToStep} />
            ) : null}
          </div>
        </div>
      </section>

      {isPlanModalOpen ? <ChoosePlanStep onComplete={handleChoosePlanComplete} onClose={closePlanModal} /> : null}
    </main>
  )
}
