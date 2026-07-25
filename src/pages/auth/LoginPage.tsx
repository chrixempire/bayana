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
import { login } from "../../lib/api/auth"
import { ApiError } from "../../lib/api/types"
import { redirectToGoogleAuth } from "../../lib/auth/google-oauth"
import { invalidateEmailVerificationCache } from "../../lib/auth/email-verification-cache"
import { resolvePostAuthPath } from "../../lib/auth/post-auth-routing"
import { setAuthSession } from "../../lib/auth/session"
import { AUTH_CREATE_ACCOUNT_PATH, AUTH_FORGOT_PASSWORD_PATH } from "../../lib/auth-paths"
import { mapLoginApiErrors, validateLogin, type LoginFieldErrors } from "./login-validation"

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const clearFieldError = (field: keyof LoginFieldErrors) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const nextErrors = validateLogin(email, password)
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
      const response = await login(email.trim(), password)
      setAuthSession(response.data.token, response.data.user)
      invalidateEmailVerificationCache()

      toast({
        variant: "success",
        title: "Welcome back",
        description: response.message || "You are signed in.",
      })

      navigate(resolvePostAuthPath(response.data.user), { replace: true })
    } catch (error) {
      if (error instanceof ApiError) {
        const apiFieldErrors = mapLoginApiErrors(error.fieldErrors)
        if (Object.keys(apiFieldErrors).length > 0) {
          setFieldErrors((prev) => ({ ...prev, ...apiFieldErrors }))
        }

        toast({
          variant: "destructive",
          title: "Unable to sign in",
          description: error.message || "Please check your email and password.",
        })
        return
      }

      toast({
        variant: "destructive",
        title: "Unable to sign in",
        description: "Something went wrong. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleSignIn = () => {
    try {
      redirectToGoogleAuth("organisation")
    } catch {
      toast({
        variant: "destructive",
        title: "Google sign-in unavailable",
        description: "API base URL is not configured for OAuth redirects.",
      })
    }
  }

  return (
    <main className="min-h-screen bg-bg-canvas text-text-default-500">
      <div className="mx-auto flex min-h-screen max-w-[1440px] justify-center px-6 py-14">
        <div className="mx-auto flex w-full max-w-[396px] flex-col items-center gap-8 pt-[88px]">
          <BayanaLogo className="h-12 w-auto" />

          <div className="flex w-full flex-col gap-8">
            <div className="flex flex-col gap-4 text-center">
              <h1 className="font-display text-[20px] font-semibold leading-8 tracking-[-0.2px] text-text-default-500">
                Log in to Bayana
              </h1>
              <p className="text-sm font-normal leading-[22px] tracking-[-0.1px] text-text-neutral-400">
                Don&apos;t have an account?{" "}
                <Link to={AUTH_CREATE_ACCOUNT_PATH} className="font-medium tracking-normal text-[#278cff] underline underline-offset-2">
                  Sign up
                </Link>
              </p>
            </div>

            <form className="flex w-full flex-col gap-6" onSubmit={(event) => void handleSubmit(event)}>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="login-email" className="block text-sm font-medium leading-[22px] tracking-normal text-text-default-500">
                    Email address
                  </label>
                  <Input
                    id="login-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="name@work-email.com"
                    value={email}
                    invalid={Boolean(fieldErrors.email)}
                    disabled={isSubmitting}
                    onChange={(event) => {
                      setEmail(event.target.value)
                      clearFieldError("email")
                    }}
                  />
                  {fieldErrors.email ? <p className="text-xs text-text-negative">{fieldErrors.email}</p> : null}
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-3">
                    <label
                      htmlFor="login-password"
                      className="block text-sm font-medium leading-[22px] tracking-normal text-text-default-500"
                    >
                      Password
                    </label>
                    <Link
                      to={AUTH_FORGOT_PASSWORD_PATH}
                      className="text-sm font-medium leading-[22px] tracking-normal text-[#278cff] underline-offset-2 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
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
                  {fieldErrors.password ? <p className="text-xs text-text-negative">{fieldErrors.password}</p> : null}
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
                {isSubmitting ? "Signing in..." : "Sign in"}
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
                className="h-11 rounded-[14px] text-base font-semibold"
                leftIcon={<GoogleGIcon className="size-5" />}
                onClick={handleGoogleSignIn}
              >
                Continue with Google
              </Button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
