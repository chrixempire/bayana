import { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { ContinueArrowIcon } from "../../components/auth/icons/ContinueArrowIcon"
import { EyeIcon } from "../../components/auth/icons/EyeIcon"
import { EyeOffIcon } from "../../components/auth/icons/EyeOffIcon"
import { SpinnerIcon } from "../../components/auth/icons/SpinnerIcon"
import { BayanaLogo } from "../../components/brand/BayanaLogo"
import { Button } from "../../components/ui/button"
import { buttonVariants } from "../../components/ui/button-variants"
import { Input } from "../../components/ui/input"
import { toast } from "../../hooks/use-toast"
import { resetPassword } from "../../lib/api/auth"
import { ApiError } from "../../lib/api/types"
import { AUTH_LOGIN_PATH } from "../../lib/auth-paths"
import { cn } from "../../lib/utils"
import {
  mapResetPasswordApiErrors,
  validateResetPassword,
  type ResetPasswordFieldErrors,
} from "./reset-password-validation"

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const token = searchParams.get("token")?.trim() ?? ""
  const email = searchParams.get("email")?.trim() ?? ""

  const [password, setPassword] = useState("")
  const [passwordConfirmation, setPasswordConfirmation] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<ResetPasswordFieldErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const hasRequiredParams = Boolean(token && email)

  const clearFieldError = (field: keyof ResetPasswordFieldErrors) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!hasRequiredParams) {
      toast({
        variant: "destructive",
        title: "Invalid reset link",
        description: "This password reset link is incomplete. Request a new one from the login page.",
      })
      return
    }

    const nextErrors = validateResetPassword(password, passwordConfirmation)
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
      const response = await resetPassword({
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      })

      toast({
        variant: "success",
        title: "Password updated",
        description: response.message || "Your password has been reset. You can sign in now.",
      })
      navigate(AUTH_LOGIN_PATH, { replace: true })
    } catch (error) {
      if (error instanceof ApiError) {
        const apiFieldErrors = mapResetPasswordApiErrors(error.fieldErrors)
        if (Object.keys(apiFieldErrors).length > 0) {
          setFieldErrors((prev) => ({ ...prev, ...apiFieldErrors }))
        }

        toast({
          variant: "destructive",
          title: "Unable to reset password",
          description: error.message || "Please review highlighted fields and try again.",
        })
        return
      }

      toast({
        variant: "destructive",
        title: "Unable to reset password",
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
              <h1 className="font-display text-[24px] font-semibold leading-8 tracking-[-0.1px] text-text-default-500">
                Set a new password
              </h1>
              <p className="text-sm leading-[22px] text-text-neutral-400">
                {hasRequiredParams
                  ? `Choose a new password for ${email}.`
                  : "This reset link is invalid or incomplete. Request a new link from the login page."}
              </p>
            </div>

            {hasRequiredParams ? (
              <form className="flex w-full flex-col gap-6" onSubmit={(event) => void handleSubmit(event)}>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="reset-password" className="block text-sm font-medium leading-[22px]">
                      New password
                    </label>
                    <Input
                      id="reset-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Enter a new password"
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
                      onChange={(event) => {
                        setPassword(event.target.value)
                        clearFieldError("password")
                      }}
                    />
                    {fieldErrors.password ? (
                      <p className="text-xs text-text-negative">{fieldErrors.password}</p>
                    ) : null}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="reset-password-confirmation" className="block text-sm font-medium leading-[22px]">
                      Confirm password
                    </label>
                    <Input
                      id="reset-password-confirmation"
                      type={showPasswordConfirmation ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Re-enter your new password"
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
                      onChange={(event) => {
                        setPasswordConfirmation(event.target.value)
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
                  {isSubmitting ? "Updating password..." : "Update password"}
                </Button>
              </form>
            ) : (
              <Link
                to={AUTH_LOGIN_PATH}
                className={cn(buttonVariants({ variant: "primary", block: true }), "h-11 rounded-[14px] text-base font-semibold")}
              >
                Back to login
              </Link>
            )}

            <Link
              to={AUTH_LOGIN_PATH}
              className="text-center text-base font-semibold leading-6 text-text-default-500 underline-offset-2 hover:underline"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
