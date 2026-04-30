import { useEffect, useState } from "react"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { toast } from "../../hooks/use-toast"
import { AUTH_CREATE_ACCOUNT_PATH, AUTH_ONBOARDING_PATH } from "../../lib/auth-paths"
import { getStepValidationErrors, type OnboardingStepErrors } from "./onboarding-validation"
import { defaultData, onboardingFlowSteps, routeToSidebarIndex, type OnboardingData, type OnboardingFlowStep } from "./types"

const ONBOARDING_CONTENT_FADE_MS = 220

const STEPS_WITH_SIDEBAR: OnboardingFlowStep[] = [
  "basic-information",
  "business-owner",
  "business-verification",
  "ngo-profile",
  "review",
]

function nextStep(step: OnboardingFlowStep): OnboardingFlowStep {
  const index = onboardingFlowSteps.indexOf(step)
  return onboardingFlowSteps[Math.min(index + 1, onboardingFlowSteps.length - 1)]
}

function previousStep(step: OnboardingFlowStep): OnboardingFlowStep {
  const index = onboardingFlowSteps.indexOf(step)
  return onboardingFlowSteps[Math.max(index - 1, 0)]
}

export function useOnboardingFlow(currentStep: OnboardingFlowStep) {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()

  const [data, setData] = useState<OnboardingData>(defaultData)
  const [errors, setErrors] = useState<OnboardingStepErrors>({})
  const [visibleStep, setVisibleStep] = useState<OnboardingFlowStep>(currentStep)
  const [contentVisible, setContentVisible] = useState(true)

  useEffect(() => {
    if (currentStep === visibleStep) {
      const frameId = requestAnimationFrame(() => {
        setContentVisible(true)
      })
      return () => cancelAnimationFrame(frameId)
    }

    const outFrameId = requestAnimationFrame(() => {
      setContentVisible(false)
    })

    const timeoutId = window.setTimeout(() => {
      setVisibleStep(currentStep)
      setContentVisible(true)
    }, ONBOARDING_CONTENT_FADE_MS)

    return () => {
      cancelAnimationFrame(outFrameId)
      window.clearTimeout(timeoutId)
    }
  }, [currentStep, visibleStep])

  useEffect(() => {
    const emailFromNavigation = (location.state as { email?: string } | null)?.email?.trim()
    if (!emailFromNavigation || data.createAccount.email === emailFromNavigation) return

    const frameId = requestAnimationFrame(() => {
      setData((prev) => ({
        ...prev,
        createAccount: {
          ...prev.createAccount,
          email: emailFromNavigation,
        },
      }))
    })
    return () => cancelAnimationFrame(frameId)
  }, [data.createAccount.email, location.state])

  const updateData = <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) => {
    const previousSection = data[key]
    const next = { ...data, [key]: value }
    setData(next)

    if (typeof previousSection !== "object" || previousSection === null || typeof value !== "object" || value === null) {
      return
    }

    const previousRecord = previousSection as Record<string, unknown>
    const nextRecord = value as Record<string, unknown>
    const changedFields = Object.keys(nextRecord).filter((field) => previousRecord[field] !== nextRecord[field])

    if (changedFields.length === 0) return

    const liveValidationErrors = getStepValidationErrors(currentStep, next)
    setErrors((prev) => {
      const updated = { ...prev }
      for (const field of changedFields) {
        const nextError = liveValidationErrors[field]
        if (nextError) updated[field] = nextError
        else delete updated[field]
      }
      return updated
    })
  }

  const goNext = () => navigate(`${AUTH_ONBOARDING_PATH}/${nextStep(currentStep)}`)
  const goBack = () => navigate(`${AUTH_ONBOARDING_PATH}/${previousStep(currentStep)}`)
  const goToStep = (step: OnboardingFlowStep) => navigate(`${AUTH_ONBOARDING_PATH}/${step}`)
  const closePlanModal = () => navigate(`${AUTH_ONBOARDING_PATH}/review`)
  const openPlanModal = () => navigate(`${AUTH_ONBOARDING_PATH}/review?plan=open`)

  const validateAndNext = () => {
    const nextErrors = getStepValidationErrors(currentStep, data)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      toast({
        variant: "destructive",
        title: "There are issues with some fields",
        description: "Please review highlighted fields and try again.",
      })
      return
    }

    if (currentStep === "basic-information") {
      console.log("basic-information", data.basicInformation)
      toast({
        variant: "success",
        title: "Your data is saved",
        description: "Continue when you're ready — everything is stored securely.",
      })
    } else if (currentStep === "business-owner") {
      console.log("business-owner", data.businessOwner)
      toast({
        variant: "success",
        title: "Your data is saved",
        description: "Continue when you're ready — everything is stored securely.",
      })
    } else if (currentStep === "business-verification") {
      console.log("business-verification", data.verification)
      toast({
        variant: "success",
        title: "Your data is saved",
        description: "Continue when you're ready — everything is stored securely.",
      })
    } else if (currentStep === "ngo-profile") {
      console.log("ngo-profile", data.ngoProfile)
      toast({
        variant: "success",
        title: "Your data is saved",
        description: "Continue when you're ready — everything is stored securely.",
      })
    } else if (currentStep === "review") {
      console.log("review", data)
      openPlanModal()
      return
    }

    goNext()
  }

  const handleCheckEmailNext = () => {
    toast({
      variant: "success",
      title: "Your data is saved",
      description: "Moving on to the next step.",
    })
    goNext()
  }

  const handleSkipBusinessOwner = () => {
    toast({
      variant: "success",
      title: "Your data is saved",
      description: "Owner details skipped — you can add them later from settings.",
    })
    goNext()
  }

  const handleSkipBusinessVerification = () => {
    toast({
      variant: "success",
      title: "Your data is saved",
      description: "Business verification skipped — you can upload these files later from settings.",
    })
    goNext()
  }

  const handleSkipNgoProfile = () => {
    toast({
      variant: "success",
      title: "Your data is saved",
      description: "NGO profile details skipped — you can complete this later from settings.",
    })
    goNext()
  }

  const handleChoosePlanComplete = () => {
    closePlanModal()
    toast({
      variant: "success",
      title: "Your data is saved",
      description: "Welcome to Bayana — your plan is set.",
    })
  }

  return {
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
    isPlanModalOpen: currentStep === "review" && searchParams.get("plan") === "open",
    activeSidebarIndex: routeToSidebarIndex[currentStep] ?? 0,
    showSidebar: STEPS_WITH_SIDEBAR.includes(currentStep) || STEPS_WITH_SIDEBAR.includes(visibleStep),
  }
}

export { AUTH_CREATE_ACCOUNT_PATH }
