import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ContinueArrowIcon } from "../../components/auth/icons/ContinueArrowIcon"
import { EyeIcon } from "../../components/auth/icons/EyeIcon"
import { EyeOffIcon } from "../../components/auth/icons/EyeOffIcon"
import { GoogleGIcon } from "../../components/auth/icons/GoogleGIcon"
import { SpinnerIcon } from "../../components/auth/icons/SpinnerIcon"
import { BayanaLogo } from "../../components/brand/BayanaLogo"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { toast } from "../../hooks/use-toast"
import { registerOrganisation } from "../../lib/api/auth"
import { ApiError } from "../../lib/api/types"
import { redirectToGoogleAuth } from "../../lib/auth/google-oauth"
import { invalidateEmailVerificationCache } from "../../lib/auth/email-verification-cache"
import { setAuthSession } from "../../lib/auth/session"
import { AUTH_LOGIN_PATH, AUTH_ONBOARDING_PATH } from "../../lib/auth-paths"
import {
  mapRegistrationApiErrors,
  validateCreateAccount,
  type CreateAccountFieldErrors,
} from "./create-account-validation"

export function CreateAccountPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirmation, setPasswordConfirmation] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<CreateAccountFieldErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const clearFieldError = (field: keyof CreateAccountFieldErrors) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  const onContinue = async () => {
    const nextErrors = validateCreateAccount(email, password, passwordConfirmation)
    setFieldErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      toast({
        variant: "destructive",
        title: "There are issues with some fields",
        description: "Please review highlighted fields and try again.",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await registerOrganisation(email.trim(), password)
      setAuthSession(response.data.token, response.data.user)
      invalidateEmailVerificationCache()

      toast({
        variant: "success",
        title: "Confirmation email has been sent successfully!",
      })

      navigate(`${AUTH_ONBOARDING_PATH}/check-email`, {
        state: { email: response.data.user.email, fromRegistration: true },
      })
    } catch (error) {
      if (error instanceof ApiError) {
        const apiFieldErrors = mapRegistrationApiErrors(error.fieldErrors)
        if (Object.keys(apiFieldErrors).length > 0) {
          setFieldErrors((prev) => ({ ...prev, ...apiFieldErrors }))
        }

        toast({
          variant: "destructive",
          title: "Unable to create account",
          description: error.message || "Please review highlighted fields and try again.",
        })
        return
      }

      toast({
        variant: "destructive",
        title: "Unable to create account",
        description: "Something went wrong. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-bg-canvas text-text-default-500">
      <div className="mx-auto flex min-h-screen max-w-[1440px] justify-center px-6 py-14">
        <div className="mx-auto flex w-full max-w-[396px] flex-col items-center gap-8 pt-[88px]">
          <BayanaLogo className="h-12 w-auto" />

          <div className="flex w-full flex-col gap-8">
            <div className="flex flex-col gap-3 text-center">
              <h6 className="font-display text-[24px] font-semibold leading-8 tracking-[-0.1px] text-text-default-500">
                Get started with Bayana
              </h6>
              <p className="text-sm font-normal leading-[22px] tracking-[-0.1px] text-text-neutral-400">
                Already have an account?{" "}
                <Link to={AUTH_LOGIN_PATH} className="font-medium tracking-normal text-[#278cff] underline underline-offset-2">
                  Sign in
                </Link>
              </p>
            </div>

            <form
              className="flex w-full flex-col gap-6"
              onSubmit={(event) => {
                event.preventDefault()
                void onContinue()
              }}
            >
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="create-account-email"
                    className="block text-sm font-medium leading-[22px] tracking-normal text-text-default-500"
                  >
                    Email address
                  </label>
                  <Input
                    id="create-account-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="name@work-email.com"
                    value={email}
                    invalid={Boolean(fieldErrors.email)}
                    disabled={isSubmitting}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      clearFieldError("email")
                    }}
                  />
                  {fieldErrors.email ? <p className="text-xs text-text-negative">{fieldErrors.email}</p> : null}
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="create-account-password"
                    className="block text-sm font-medium leading-[22px] tracking-normal text-text-default-500"
                  >
                    Password
                  </label>
                  <Input
                    id="create-account-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="new-password"
                    placeholder="Create a password"
                    value={password}
                    invalid={Boolean(fieldErrors.password)}
                    disabled={isSubmitting}
                    rightIcon={
                      <button
                        type="button"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="cursor-pointer text-text-neutral-400"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    }
                    onChange={(e) => {
                      setPassword(e.target.value)
                      clearFieldError("password")
                    }}
                  />
                  {fieldErrors.password ? <p className="text-xs text-text-negative">{fieldErrors.password}</p> : null}
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="create-account-password-confirmation"
                    className="block text-sm font-medium leading-[22px] tracking-normal text-text-default-500"
                  >
                    Confirm password
                  </label>
                  <Input
                    id="create-account-password-confirmation"
                    type={showPasswordConfirmation ? "text" : "password"}
                    name="password_confirmation"
                    autoComplete="new-password"
                    placeholder="Re-enter your password"
                    value={passwordConfirmation}
                    invalid={Boolean(fieldErrors.passwordConfirmation)}
                    disabled={isSubmitting}
                    rightIcon={
                      <button
                        type="button"
                        aria-label={showPasswordConfirmation ? "Hide password" : "Show password"}
                        className="cursor-pointer text-text-neutral-400"
                        onClick={() => setShowPasswordConfirmation((prev) => !prev)}
                      >
                        {showPasswordConfirmation ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    }
                    onChange={(e) => {
                      setPasswordConfirmation(e.target.value)
                      clearFieldError("passwordConfirmation")
                    }}
                  />
                  {fieldErrors.passwordConfirmation ? (
                    <p className="text-xs text-text-negative">{fieldErrors.passwordConfirmation}</p>
                  ) : null}
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                block
                disabled={isSubmitting}
                className="h-11 rounded-[14px] text-base font-semibold"
                rightIcon={
                  isSubmitting ? (
                    <SpinnerIcon className="size-4 text-white" />
                  ) : (
                    <ContinueArrowIcon className="size-4 text-white" />
                  )
                }
              >
                {isSubmitting ? "Creating account..." : "Continue with Email"}
              </Button>

              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-border-default-100" />
                <span className="text-sm leading-[22px] text-text-neutral-400">or</span>
                <div className="h-px flex-1 bg-border-default-100" />
              </div>

              <Button
                type="button"
                variant="neutral"
                block
                disabled={isSubmitting}
                className="h-11 text-sm font-semibold leading-[22px]"
                leftIcon={<GoogleGIcon className="size-4" />}
                onClick={() => {
                  try {
                    redirectToGoogleAuth("organisation")
                  } catch {
                    toast({
                      variant: "destructive",
                      title: "Google sign-up unavailable",
                      description: "API base URL is not configured for OAuth redirects.",
                    })
                  }
                }}
              >
                Continue with Google
              </Button>
            </form>
          </div>

          <p className="max-w-[260px] text-center text-[12px] leading-[20px] text-text-neutral-400">
            By signing up, you agree to Bayana&apos;s{" "}
            <button type="button" className="font-medium text-[#278cff] underline underline-offset-2">
              Privacy Policy
            </button>{" "}
            and{" "}
            <button type="button" className="font-medium text-[#278cff] underline underline-offset-2">
              Terms of Use
            </button>
          </p>
        </div>
      </div>
    </main>
  )
}
