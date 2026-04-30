import { Navigate, useNavigate, useParams } from "react-router-dom"
import { BasicInformationStep } from "../../components/auth/onboarding-steps/BasicInformationStep"
import { BusinessOwnerStep } from "../../components/auth/onboarding-steps/BusinessOwnerStep"
import { BusinessVerificationStep } from "../../components/auth/onboarding-steps/BusinessVerificationStep"
import { CheckEmailStep } from "../../components/auth/onboarding-steps/CheckEmailStep"
import { ChoosePlanStep } from "../../components/auth/onboarding-steps/ChoosePlanStep"
import { NgoProfileStep } from "../../components/auth/onboarding-steps/NgoProfileStep"
import { ReviewStep } from "../../components/auth/onboarding-steps/ReviewStep"
import { OnboardingSidebar } from "../../components/onboarding/OnboardingSidebar"
import { cn } from "../../lib/utils"
import { AUTH_ONBOARDING_PATH } from "../../lib/auth-paths"
import { onboardingFlowSteps, type OnboardingFlowStep } from "./types"
import { AUTH_CREATE_ACCOUNT_PATH, useOnboardingFlow } from "./useOnboardingFlow"

export function OnboardingPage() {
  const navigate = useNavigate()
  const { step } = useParams<{ step: string }>()

  if (!step || !onboardingFlowSteps.includes(step as OnboardingFlowStep)) {
    return <Navigate to={`${AUTH_ONBOARDING_PATH}/check-email`} replace />
  }

  const currentStep = step as OnboardingFlowStep
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

  const mainPadding = showSidebar ? "px-16 pt-14 pb-20" : "flex justify-center px-6 py-14"

  return (
    <main className="h-screen overflow-hidden bg-bg-canvas text-text-default-500">
      <section className={`mx-auto h-full max-w-[1440px] ${showSidebar ? "grid grid-cols-[440px_1fr]" : ""}`}>
        {showSidebar ? <OnboardingSidebar activeStep={activeSidebarIndex} /> : null}

        <div className={cn("min-w-0 overflow-y-auto", mainPadding)}>
          <div
            className={cn(
              "onboarding-content w-full max-w-[1000px]",
              contentVisible ? "onboarding-content--visible" : "onboarding-content--hidden",
            )}
          >
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
