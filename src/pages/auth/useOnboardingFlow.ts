import { useEffect, useState } from "react"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { toast } from "../../hooks/use-toast"
import { resendVerificationNotification } from "../../lib/api/auth"
import { mapOnboardingApiFieldErrors, submitOrganisationOnboarding } from "../../lib/api/onboarding"
import { ApiError } from "../../lib/api/types"
import {
  checkEmailVerification,
  getEmailVerificationStatus,
  invalidateEmailVerificationCache,
  markEmailAsVerified,
} from "../../lib/auth/email-verification-cache"
import { getAuthToken, getAuthUser } from "../../lib/auth/session"
import { AUTH_CREATE_ACCOUNT_PATH, AUTH_HOME_PATH, AUTH_ONBOARDING_PATH } from "../../lib/auth-paths"
import { getStepValidationErrors, getSubmitValidationErrors, type OnboardingStepErrors } from "./onboarding-validation"
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

function createInitialOnboardingData(): OnboardingData {
  const sessionEmail = getAuthUser()?.email?.trim()

  return {
    ...defaultData,
    createAccount: {
      email: sessionEmail || defaultData.createAccount.email,
    },
  }
}

export function useOnboardingFlow(currentStep: OnboardingFlowStep) {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()

  const [data, setData] = useState<OnboardingData>(createInitialOnboardingData)
  const [errors, setErrors] = useState<OnboardingStepErrors>({})
  const [visibleStep, setVisibleStep] = useState<OnboardingFlowStep>(currentStep)
  const [contentVisible, setContentVisible] = useState(true)
  const [isResendingVerification, setIsResendingVerification] = useState(false)
  const [isCheckingVerification, setIsCheckingVerification] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const returnToReview = (location.state as { returnToReview?: boolean } | null)?.returnToReview === true
  const fromRegistration = (location.state as { fromRegistration?: boolean } | null)?.fromRegistration === true

  useEffect(() => {
    if (getAuthToken()) return
    navigate(AUTH_CREATE_ACCOUNT_PATH, { replace: true })
  }, [navigate])

  useEffect(() => {
    let cancelled = false

    void (async () => {
      const verified = await getEmailVerificationStatus()
      if (cancelled) return

      if (currentStep === "check-email" && verified && !fromRegistration) {
        navigate(`${AUTH_ONBOARDING_PATH}/basic-information`, { replace: true })
        return
      }

      if (currentStep !== "check-email" && !verified) {
        navigate(`${AUTH_ONBOARDING_PATH}/check-email`, { replace: true })
      }
    })()

    return () => {
      cancelled = true
    }
  }, [currentStep, fromRegistration, navigate])

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
    const emailFromSession = getAuthUser()?.email?.trim()
    const nextEmail = emailFromNavigation || emailFromSession

    if (!nextEmail || data.createAccount.email === nextEmail) return

    const frameId = requestAnimationFrame(() => {
      setData((prev) => ({
        ...prev,
        createAccount: {
          ...prev.createAccount,
          email: nextEmail,
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
  const goToStep = (step: OnboardingFlowStep) =>
    navigate(`${AUTH_ONBOARDING_PATH}/${step}`, { state: { returnToReview: true } })
  const closePlanModal = () => navigate(`${AUTH_ONBOARDING_PATH}/review`)
  const openPlanModal = () => navigate(`${AUTH_ONBOARDING_PATH}/review?plan=open`)

  const submitOnboarding = async () => {
    const nextErrors = getSubmitValidationErrors(data)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      toast({
        variant: "destructive",
        title: "There are issues with some fields",
        description: "Please complete all required sections before submitting.",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await submitOrganisationOnboarding(data)
      toast({
        variant: "success",
        title: "Onboarding submitted",
        description: response.message || "Your organisation details have been sent for verification.",
      })
      openPlanModal()
    } catch (error) {
      if (error instanceof ApiError) {
        const apiFieldErrors = mapOnboardingApiFieldErrors(error.fieldErrors)
        if (Object.keys(apiFieldErrors).length > 0) {
          setErrors(apiFieldErrors)
        }

        toast({
          variant: "destructive",
          title: "Unable to submit onboarding",
          description: error.message || "Please review highlighted fields and try again.",
        })
        return
      }

      toast({
        variant: "destructive",
        title: "Unable to submit onboarding",
        description: "Something went wrong. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const validateAndNext = () => {
    if (currentStep === "review") {
      void submitOnboarding()
      return
    }

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

    if (returnToReview) {
      navigate(`${AUTH_ONBOARDING_PATH}/review`, { replace: true })
      return
    }

    goNext()
  }

  const handleContinueAfterVerification = async () => {
    setIsCheckingVerification(true)

    try {
      const status = await checkEmailVerification(true)

      if (status === "verified") {
        markEmailAsVerified()
        toast({
          variant: "success",
          title: "Email verified",
          description: "Continuing with onboarding.",
        })
        navigate(`${AUTH_ONBOARDING_PATH}/basic-information`)
        return
      }

      if (status === "error") {
        toast({
          variant: "destructive",
          title: "Unable to check verification",
          description: "We could not reach the server. Refresh the page or sign in again, then try once more.",
        })
        return
      }

      toast({
        variant: "destructive",
        title: "Email not verified yet",
        description: "Open your inbox and click the confirmation link in the same browser where you signed up.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Unable to check verification",
        description: error instanceof ApiError ? error.message : "Please try again in a moment.",
      })
    } finally {
      setIsCheckingVerification(false)
    }
  }

  const handleResendVerification = async (): Promise<boolean> => {
    setIsResendingVerification(true)

    try {
      const verified = await getEmailVerificationStatus(true)
      if (verified) {
        toast({
          variant: "success",
          title: "Email already verified",
          description: "Continuing with onboarding.",
        })
        navigate(`${AUTH_ONBOARDING_PATH}/basic-information`)
        return false
      }

      const response = await resendVerificationNotification()
      toast({
        variant: "success",
        title: "Confirmation email resent",
        description: response.message || "Check your inbox for a new verification link.",
      })
      return true
    } catch (error) {
      if (error instanceof ApiError && error.status >= 500) {
        invalidateEmailVerificationCache()
        const statusAfterError = await checkEmailVerification(true)
        if (statusAfterError === "verified") {
          markEmailAsVerified()
          toast({
            variant: "success",
            title: "Email already verified",
            description: "Your email is confirmed. Continuing with onboarding.",
          })
          navigate(`${AUTH_ONBOARDING_PATH}/basic-information`)
          return false
        }
      }

      const description =
        error instanceof ApiError
          ? error.status === 401
            ? "Your session expired. Create your account again or sign in, then try resending."
            : error.status >= 500
              ? "The server could not send the email right now. If you already verified, use “I've verified my email”."
              : error.message
          : "Please try again in a moment."

      toast({
        variant: "destructive",
        title: "Unable to resend email",
        description,
      })
      return false
    } finally {
      setIsResendingVerification(false)
    }
  }

  const handleSkipBusinessOwner = () => {
    toast({
      variant: "success",
      title: "Section skipped",
      description: "Owner details skipped — you'll need to complete them before submitting.",
    })
    goNext()
  }

  const handleSkipBusinessVerification = () => {
    toast({
      variant: "success",
      title: "Section skipped",
      description: "Business verification skipped — you'll need to upload documents before submitting.",
    })
    goNext()
  }

  const handleSkipNgoProfile = () => {
    toast({
      variant: "success",
      title: "Section skipped",
      description: "NGO profile skipped — you'll need to complete it before submitting.",
    })
    goNext()
  }

  const handleChoosePlanComplete = () => {
    toast({
      variant: "success",
      title: "Welcome to Bayana",
      description: "Your plan is set.",
    })

    navigate(AUTH_HOME_PATH, { replace: true })
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
    isSubmitting,
    handleContinueAfterVerification,
    isCheckingVerification,
    handleResendVerification,
    isResendingVerification,
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
