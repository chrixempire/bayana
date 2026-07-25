import { useState } from "react"
import { Link } from "react-router-dom"
import { ContinueArrowIcon } from "../../components/auth/icons/ContinueArrowIcon"
import { SpinnerIcon } from "../../components/auth/icons/SpinnerIcon"
import { BayanaLogo } from "../../components/brand/BayanaLogo"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { toast } from "../../hooks/use-toast"
import { forgotPassword } from "../../lib/api/auth"
import { ApiError } from "../../lib/api/types"
import { AUTH_LOGIN_PATH } from "../../lib/auth-paths"

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      setEmailError("Email is required")
      toast({
        variant: "destructive",
        title: "There are issues with some fields",
        description: "Please enter your email address.",
      })
      return
    }

    if (!trimmedEmail.includes("@")) {
      setEmailError("Please enter a valid email address")
      toast({
        variant: "destructive",
        title: "There are issues with some fields",
        description: "Please enter a valid email address.",
      })
      return
    }

    setEmailError("")
    setIsSubmitting(true)

    try {
      const response = await forgotPassword(trimmedEmail)
      setIsSubmitted(true)
      toast({
        variant: "success",
        title: "Reset link sent",
        description: response.message || "Check your inbox for a password reset link.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Unable to send reset link",
        description: error instanceof ApiError ? error.message : "Please try again in a moment.",
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
                Forgot your password?
              </h1>
              <p className="text-sm leading-[22px] text-text-neutral-400">
                {isSubmitted
                  ? "If an account exists for that email, we've sent a reset link. Check your inbox and follow the instructions."
                  : "Enter the email associated with your account and we'll send you a reset link."}
              </p>
            </div>

            {!isSubmitted ? (
              <form className="flex w-full flex-col gap-6" onSubmit={(event) => void handleSubmit(event)}>
                <div className="flex flex-col gap-2">
                  <label htmlFor="forgot-password-email" className="block text-sm font-medium leading-[22px] tracking-normal">
                    Email address
                  </label>
                  <Input
                    id="forgot-password-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="name@work-email.com"
                    value={email}
                    invalid={Boolean(emailError)}
                    disabled={isSubmitting}
                    onChange={(event) => {
                      setEmail(event.target.value)
                      if (emailError) setEmailError("")
                    }}
                  />
                  {emailError ? <p className="text-xs text-text-negative">{emailError}</p> : null}
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
                  {isSubmitting ? "Sending reset link..." : "Send reset link"}
                </Button>
              </form>
            ) : null}

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
