import { useEffect, useRef, useState } from "react"
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom"
import { SpinnerIcon } from "../../components/auth/icons/SpinnerIcon"
import { BayanaLogo } from "../../components/brand/BayanaLogo"
import { buttonVariants } from "../../components/ui/button-variants"
import { toast } from "../../hooks/use-toast"
import { verifyEmail } from "../../lib/api/auth"
import { ApiError } from "../../lib/api/types"
import { markEmailAsVerified } from "../../lib/auth/email-verification-cache"
import { getAuthToken } from "../../lib/auth/session"
import { AUTH_CREATE_ACCOUNT_PATH, AUTH_LOGIN_PATH, AUTH_ONBOARDING_PATH } from "../../lib/auth-paths"
import { cn } from "../../lib/utils"

type VerifyState = "loading" | "success" | "error" | "missing-session"

export function EmailVerifyPage() {
  const navigate = useNavigate()
  const { id, hash } = useParams<{ id: string; hash: string }>()
  const [searchParams] = useSearchParams()
  const hasStarted = useRef(false)

  const expires = searchParams.get("expires")?.replace(/\.$/, "") ?? ""
  const signature = searchParams.get("signature")?.replace(/\.$/, "") ?? ""
  const linkComplete = Boolean(id && hash && expires && signature)

  const [state, setState] = useState<VerifyState>(() => {
    if (!getAuthToken()) return "missing-session"
    return linkComplete ? "loading" : "error"
  })
  const [errorMessage, setErrorMessage] = useState(() =>
    getAuthToken() && !linkComplete ? "This verification link is incomplete or invalid." : "",
  )

  useEffect(() => {
    if (hasStarted.current) return
    hasStarted.current = true

    if (!getAuthToken()) return
    if (!id || !hash || !expires || !signature) return

    void verifyEmail(id, hash, expires, signature)
      .then((response) => {
        markEmailAsVerified()
        setState("success")
        toast({
          variant: "success",
          title: "Email verified",
          description: response.message || "Your email has been confirmed.",
        })

        window.setTimeout(() => {
          navigate(`${AUTH_ONBOARDING_PATH}/basic-information`, { replace: true })
        }, 1200)
      })
      .catch((error) => {
        setState("error")
        setErrorMessage(
          error instanceof ApiError ? error.message : "We could not verify your email. Please try again.",
        )
      })
  }, [expires, hash, id, navigate, signature])

  return (
    <main className="flex min-h-dvh items-center justify-center bg-bg-canvas px-6 py-8 text-text-default-500">
      <div className="mx-auto flex w-full max-w-[396px] flex-col items-center gap-8 text-center">
        <BayanaLogo className="h-12 w-auto" />

          {state === "loading" ? (
            <div className="flex flex-col items-center gap-4">
              <SpinnerIcon className="size-8 text-[#278cff]" />
              <div className="flex flex-col gap-2">
                <h1 className="font-display text-[24px] font-semibold leading-8 tracking-[-0.1px]">
                  Verifying your email
                </h1>
                <p className="text-sm leading-[22px] text-text-neutral-400">Please wait while we confirm your account.</p>
              </div>
            </div>
          ) : null}

          {state === "success" ? (
            <div className="flex flex-col gap-3">
              <h1 className="font-display text-[24px] font-semibold leading-8 tracking-[-0.1px]">Email verified</h1>
              <p className="text-sm leading-[22px] text-text-neutral-400">Taking you to onboarding...</p>
            </div>
          ) : null}

          {state === "missing-session" ? (
            <div className="flex w-full flex-col items-center gap-6">
              <div className="flex flex-col gap-3">
                <h1 className="font-display text-[24px] font-semibold leading-8 tracking-[-0.1px]">
                  Open this link in the same browser
                </h1>
                <p className="text-sm leading-[22px] text-text-neutral-400">
                  Sign in on this device first, then open the verification link from your email again.
                </p>
              </div>
              <div className="flex w-full flex-col gap-3">
                <Link to={AUTH_LOGIN_PATH} className={cn(buttonVariants({ variant: "primary", block: true }))}>
                  Sign in
                </Link>
                <Link to={AUTH_CREATE_ACCOUNT_PATH} className={cn(buttonVariants({ variant: "neutral", block: true }))}>
                  Create account
                </Link>
              </div>
            </div>
          ) : null}

          {state === "error" ? (
            <div className="flex w-full flex-col items-center gap-6">
              <div className="flex flex-col gap-3">
                <h1 className="font-display text-[24px] font-semibold leading-8 tracking-[-0.1px]">
                  Verification failed
                </h1>
                <p className="text-sm leading-[22px] text-text-neutral-400">{errorMessage}</p>
              </div>
              <Link
                to={`${AUTH_ONBOARDING_PATH}/check-email`}
                className={cn(buttonVariants({ variant: "primary", block: true }))}
              >
                Back to check email
              </Link>
            </div>
          ) : null}
      </div>
    </main>
  )
}
