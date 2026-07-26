import { useCallback, useEffect, useMemo, useState } from "react"
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom"
import { SpinnerIcon } from "../../components/auth/icons/SpinnerIcon"
import { BayanaLogo } from "../../components/brand/BayanaLogo"
import { buttonVariants } from "../../components/ui/button-variants"
import { attemptEmailVerification } from "../../lib/auth/attempt-email-verification"
import { finishEmailVerificationSuccess } from "../../lib/auth/email-verification-feedback"
import {
  buildEmailVerifyPath,
  isMalformedEmailVerifySplat,
  resolveEmailVerifyParams,
} from "../../lib/auth/parse-email-verify-link"
import { setPendingEmailVerify } from "../../lib/auth/pending-email-verify"
import { consumeVerifyAfterLogin } from "../../lib/auth/verify-flow-state"
import { AUTH_CREATE_ACCOUNT_PATH, AUTH_LOGIN_PATH, AUTH_ONBOARDING_PATH } from "../../lib/auth-paths"
import {
  authBodyTextClassName,
  authNeutralButtonClassName,
  authPrimaryButtonClassName,
} from "../../lib/auth-form-styles"
import { cn } from "../../lib/utils"

type VerifyState = "loading" | "success" | "error" | "needs-sign-in"

const ONBOARDING_ENTRY_PATH = `${AUTH_ONBOARDING_PATH}/basic-information`

export function EmailVerifyPage() {
  const navigate = useNavigate()
  const { id, hash, "*": splat } = useParams<{ id?: string; hash?: string; "*"?: string }>()
  const [searchParams] = useSearchParams()

  const verifyParams = useMemo(
    () =>
      resolveEmailVerifyParams({
        splat,
        id,
        hash,
        searchParams,
      }),
    [hash, id, searchParams, splat],
  )

  const linkComplete = verifyParams !== null

  const loginHref = useMemo(() => {
    if (!verifyParams) return AUTH_LOGIN_PATH
    return `${AUTH_LOGIN_PATH}?next=${encodeURIComponent(buildEmailVerifyPath(verifyParams))}`
  }, [verifyParams])

  const [state, setState] = useState<VerifyState>(() => (linkComplete ? "loading" : "error"))
  const [errorMessage, setErrorMessage] = useState(() =>
    linkComplete ? "" : "This verification link is incomplete or invalid.",
  )
  const [successMessage, setSuccessMessage] = useState("Your email has been confirmed.")

  const runVerification = useCallback(async () => {
    if (!verifyParams) return

    setState("loading")

    const result = await attemptEmailVerification(verifyParams)

    if (result.status === "success") {
      setSuccessMessage(result.message)
      setState("success")
      await finishEmailVerificationSuccess(result.message)

      const verifiedAfterLogin = consumeVerifyAfterLogin()

      if (verifiedAfterLogin) {
        navigate(ONBOARDING_ENTRY_PATH, { replace: true })
        return
      }

      navigate(
        `${AUTH_LOGIN_PATH}?next=${encodeURIComponent(ONBOARDING_ENTRY_PATH)}`,
        { replace: true },
      )
      return
    }

    if (result.status === "needs-auth") {
      setPendingEmailVerify(verifyParams)
      setState("needs-sign-in")
      return
    }

    setState("error")
    setErrorMessage(result.message)
  }, [navigate, verifyParams])

  useEffect(() => {
    if (!verifyParams) return

    const rawPath = (splat ?? "").replace(/^\/+/, "")
    const shouldNormalize =
      Boolean(rawPath && isMalformedEmailVerifySplat(rawPath)) ||
      Boolean(id && !hash && isMalformedEmailVerifySplat(id))

    if (shouldNormalize) {
      navigate(buildEmailVerifyPath(verifyParams), { replace: true })
    }
  }, [hash, id, navigate, splat, verifyParams])

  useEffect(() => {
    if (!verifyParams) return

    const rawPath = (splat ?? "").replace(/^\/+/, "")
    if (rawPath && isMalformedEmailVerifySplat(rawPath)) return
    if (id && !hash && isMalformedEmailVerifySplat(id)) return

    void runVerification()
  }, [id, hash, runVerification, splat, verifyParams])

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
              <p className={authBodyTextClassName}>Please wait while we confirm your account.</p>
            </div>
          </div>
        ) : null}

        {state === "success" ? (
          <div className="flex flex-col gap-3">
            <h1 className="font-display text-[24px] font-semibold leading-8 tracking-[-0.1px]">Email verified</h1>
            <p className={authBodyTextClassName}>{successMessage}</p>
            <p className={authBodyTextClassName}>Continuing...</p>
          </div>
        ) : null}

        {state === "needs-sign-in" ? (
          <div className="flex w-full flex-col items-center gap-6">
            <div className="flex flex-col gap-3">
              <h1 className="font-display text-[24px] font-semibold leading-8 tracking-[-0.1px]">
                Sign in to verify your email
              </h1>
              <p className={authBodyTextClassName}>
                Sign in to the account that received this email. We&apos;ll verify it next.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3">
              <Link
                to={loginHref}
                className={cn(buttonVariants({ variant: "primary", block: true }), authPrimaryButtonClassName)}
              >
                Sign in
              </Link>
              <Link
                to={AUTH_CREATE_ACCOUNT_PATH}
                className={cn(buttonVariants({ variant: "neutral", block: true }), authNeutralButtonClassName)}
              >
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
              <p className={authBodyTextClassName}>{errorMessage}</p>
            </div>
            <Link
              to={`${AUTH_ONBOARDING_PATH}/check-email`}
              className={cn(buttonVariants({ variant: "primary", block: true }), authPrimaryButtonClassName)}
            >
              Back to check email
            </Link>
          </div>
        ) : null}
      </div>
    </main>
  )
}
