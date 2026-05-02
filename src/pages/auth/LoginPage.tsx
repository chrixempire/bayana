import { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { BayanaLogo } from "../../components/brand/BayanaLogo"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { ContinueArrowIcon } from "../../components/auth/icons/ContinueArrowIcon"
import { GoogleGIcon } from "../../components/auth/icons/GoogleGIcon"
import { toast } from "../../hooks/use-toast"
import { AUTH_CREATE_ACCOUNT_PATH, AUTH_HOME_PATH, AUTH_LOGIN_PATH } from "../../lib/auth-paths"
import { maskEmail } from "../../lib/mask-email"

const LOGIN_SENT_PARAM = "sent"
const LOGIN_EMAIL_STORAGE_KEY = "bayana-login-email"

function readInitialLoginEmail(): string {
  if (typeof window === "undefined") return ""
  try {
    const stored = sessionStorage.getItem(LOGIN_EMAIL_STORAGE_KEY)
    if (stored) return stored
    const raw = new URLSearchParams(window.location.search).get("email")
    if (!raw) return ""
    return decodeURIComponent(raw.replace(/\+/g, " "))
  } catch {
    return ""
  }
}

export function LoginPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const isCheckEmailState = searchParams.get(LOGIN_SENT_PARAM) === "1"
  const [email, setEmail] = useState(readInitialLoginEmail)
  const emailForCheckView = sessionStorage.getItem(LOGIN_EMAIL_STORAGE_KEY) ?? email
  const maskedEmailForCheckView = maskEmail(emailForCheckView) || "your email"

  const setLoginState = (next: { sent?: boolean }) => {
    const nextParams = new URLSearchParams(searchParams)

    if (typeof next.sent === "boolean") {
      if (next.sent) nextParams.set(LOGIN_SENT_PARAM, "1")
      else nextParams.delete(LOGIN_SENT_PARAM)
    }

    setSearchParams(nextParams, { replace: true })
  }

  const handleResend = () => {
    toast({
      variant: "success",
      title: "Login link resent",
      description: `A new sign-in link has been sent to ${maskedEmailForCheckView}.`,
    })
  }

  const handleBackToLogin = () => {
    navigate(AUTH_LOGIN_PATH, { replace: true })
  }

  const handleOpenEmail = () => {
    navigate(AUTH_HOME_PATH)
  }

  return (
    <main className="min-h-screen bg-bg-canvas text-text-default-500">
      <div className="mx-auto flex min-h-screen max-w-[1440px] justify-center px-6 py-14">
        <div className="mx-auto flex w-full max-w-[396px] flex-col items-center gap-8 pt-[88px]">
          <BayanaLogo className="h-12 w-auto" />

          {!isCheckEmailState ? (
            <LoginEmailStep
              defaultEmail={email}
              setEmail={setEmail}
              setLoginState={setLoginState}
            />
          ) : (
            <div className="flex w-full flex-col items-center gap-9">
              <div className="flex max-w-[420px] flex-col gap-4 text-center">
                <h1 className="font-display text-[20px] font-semibold leading-8 tracking-[-0.2px] text-text-default-500">
                  Check your email
                </h1>
                <p className="text-[17px] leading-8 tracking-[-0.1px] text-text-neutral-400">
                  We have sent a temporary login link to{" "}
                  <span className="text-text-default-500">{maskedEmailForCheckView}</span>, please check your inbox
                </p>
              </div>

              <div className="flex w-full flex-col gap-4">
                <Button
                  type="button"
                  variant="primary"
                  block
                  className="h-11 rounded-[14px] text-base font-semibold"
                  rightIcon={<ContinueArrowIcon className="size-4 text-white" />}
                  onClick={handleOpenEmail}
                >
                  Open email
                </Button>

                <Button
                  type="button"
                  variant="neutral"
                  block
                  className="h-11 rounded-[14px] text-base font-semibold"
                  leftIcon={<RefreshIcon className="size-5 text-text-neutral-400" />}
                  onClick={handleResend}
                >
                  Resend link
                </Button>
              </div>

              <button
                type="button"
                className="text-base font-semibold leading-6 text-text-default-500"
                onClick={handleBackToLogin}
              >
                Back to login
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

type LoginStateUpdater = (next: { sent?: boolean }) => void

function LoginEmailStep({
  defaultEmail,
  setEmail,
  setLoginState,
}: {
  defaultEmail: string
  setEmail: (value: string) => void
  setLoginState: LoginStateUpdater
}) {
  const [emailError, setEmailError] = useState("")

  const handleContinue = () => {
    if (!defaultEmail.trim()) {
      setEmailError("Email is required")
      toast({
        variant: "destructive",
        title: "There are issues with some fields",
        description: "Please review highlighted fields and try again.",
      })
      return
    }

    if (!defaultEmail.includes("@")) {
      setEmailError("Please enter a valid business email address")
      toast({
        variant: "destructive",
        title: "There are issues with some fields",
        description: "Please review highlighted fields and try again.",
      })
      return
    }

    setEmailError("")
    sessionStorage.setItem(LOGIN_EMAIL_STORAGE_KEY, defaultEmail.trim())
    setLoginState({ sent: true })
    console.log("login", { email: defaultEmail.trim() })
    toast({
      variant: "success",
      title: "Login link sent",
      description: "Check your email for your temporary Bayana sign-in link.",
    })
  }

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex flex-col gap-4 text-center">
        <h1 className="font-display text-[20px] font-semibold leading-8 tracking-[-0.2px] text-text-default-500">
          Log in to Bayana
        </h1>
        <p className="text-sm leading-[22px] text-text-neutral-400">
          Don&apos;t have an account?{" "}
          <Link to={AUTH_CREATE_ACCOUNT_PATH} className="font-medium text-[#278cff] underline underline-offset-2">
            Sign up
          </Link>
        </p>
      </div>

      <form
        className="flex w-full flex-col gap-6"
        onSubmit={(event) => {
          event.preventDefault()
          handleContinue()
        }}
      >
        <div className="flex flex-col gap-3">
          <label htmlFor="login-email" className="block text-sm font-medium leading-[22px] text-text-default-500">
            Email address
          </label>
          <Input
            id="login-email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="name@work-email.com"
            value={defaultEmail}
            invalid={Boolean(emailError)}
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
          className="h-11 rounded-[14px] text-base font-semibold"
          rightIcon={<ContinueArrowIcon className="size-4 text-white" />}
        >
          Continue with Email
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
          className="h-11 rounded-[14px] text-base font-semibold"
          leftIcon={<GoogleGIcon className="size-5" />}
          onClick={() =>
            toast({
              variant: "success",
              title: "Google sign-in",
              description: "Google authentication will be connected next.",
            })
          }
        >
          Continue with Google
        </Button>
      </form>
    </div>
  )
}

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className={className}>
      <path
        d="M16.667 10a6.667 6.667 0 1 1-1.953-4.714M16.667 3.333v4.286h-4.286"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
