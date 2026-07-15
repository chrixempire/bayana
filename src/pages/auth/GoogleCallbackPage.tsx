import { useEffect, useRef, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { SpinnerIcon } from "../../components/auth/icons/SpinnerIcon"
import { BayanaLogo } from "../../components/brand/BayanaLogo"
import { buttonVariants } from "../../components/ui/button-variants"
import { toast } from "../../hooks/use-toast"
import {
  completeGoogleOAuthCallback,
  extractAuthToken,
  extractAuthUser,
  getAuthUserProfile,
} from "../../lib/api/auth"
import type { AuthUser } from "../../lib/api/types"
import { AUTH_CREATE_ACCOUNT_PATH, AUTH_LOGIN_PATH } from "../../lib/auth-paths"
import { invalidateEmailVerificationCache } from "../../lib/auth/email-verification-cache"
import { resolvePostAuthPath } from "../../lib/auth/post-auth-routing"
import { setAuthSession, setAuthTokenOnly } from "../../lib/auth/session"
import { cn } from "../../lib/utils"

type CallbackState = "loading" | "success" | "error"

function readCallbackToken(searchParams: URLSearchParams): string {
  return (
    searchParams.get("token")?.trim() ||
    searchParams.get("access_token")?.trim() ||
    searchParams.get("auth_token")?.trim() ||
    ""
  )
}

function readCallbackTokenFromHash(): string {
  const hash = window.location.hash.replace(/^#/, "")
  if (!hash) return ""

  return readCallbackToken(new URLSearchParams(hash))
}

export function GoogleCallbackPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const hasStarted = useRef(false)

  const errorMessage = searchParams.get("error_description")?.trim() || searchParams.get("error")?.trim() || ""
  const [state, setState] = useState<CallbackState>(() => (errorMessage ? "error" : "loading"))
  const [message, setMessage] = useState(errorMessage || "")

  useEffect(() => {
    if (hasStarted.current) return
    hasStarted.current = true

    if (errorMessage) return

    void (async () => {
      const finishSignIn = async (token: string, userFromResponse?: AuthUser) => {
        setAuthTokenOnly(token)

        const user = userFromResponse ?? extractAuthUser(await getAuthUserProfile())
        setAuthSession(token, user)
        invalidateEmailVerificationCache()

        setState("success")
        toast({
          variant: "success",
          title: "Signed in with Google",
          description: "Continuing to Bayana.",
        })

        window.setTimeout(() => {
          navigate(resolvePostAuthPath(user), { replace: true })
        }, 800)
      }

      try {
        const tokenFromUrl = readCallbackToken(searchParams) || readCallbackTokenFromHash()
        if (tokenFromUrl) {
          await finishSignIn(tokenFromUrl)
          return
        }

        const code = searchParams.get("code")?.trim()
        if (code) {
          const response = await completeGoogleOAuthCallback(searchParams)
          await finishSignIn(extractAuthToken(response), extractAuthUser(response))
          return
        }

        setState("error")
        setMessage(
          "Google sign-in did not return an authentication token. If you were shown a JSON response on the API site, the backend needs to redirect back to this app after Google sign-in.",
        )
      } catch {
        setState("error")
        setMessage("We could not complete Google sign-in. Please try again.")
      }
    })()
  }, [errorMessage, navigate, searchParams])

  return (
    <main className="flex min-h-dvh items-center justify-center bg-bg-canvas px-6 py-8 text-text-default-500">
      <div className="mx-auto flex w-full max-w-[396px] flex-col items-center gap-8 text-center">
        <BayanaLogo className="h-12 w-auto" />

        {state === "loading" ? (
          <div className="flex flex-col items-center gap-4">
            <SpinnerIcon className="size-8 text-[#278cff]" />
            <div className="flex flex-col gap-2">
              <h1 className="font-display text-[24px] font-semibold leading-8 tracking-[-0.1px]">
                Completing Google sign-in
              </h1>
              <p className="text-sm leading-[22px] text-text-neutral-400">Please wait while we finish signing you in.</p>
            </div>
          </div>
        ) : null}

        {state === "success" ? (
          <div className="flex flex-col gap-3">
            <h1 className="font-display text-[24px] font-semibold leading-8 tracking-[-0.1px]">Signed in</h1>
            <p className="text-sm leading-[22px] text-text-neutral-400">Taking you to Bayana...</p>
          </div>
        ) : null}

        {state === "error" ? (
          <div className="flex w-full flex-col items-center gap-6">
            <div className="flex flex-col gap-3">
              <h1 className="font-display text-[24px] font-semibold leading-8 tracking-[-0.1px]">Sign-in failed</h1>
              <p className="text-sm leading-[22px] text-text-neutral-400">
                {message || "We could not complete Google sign-in."}
              </p>
            </div>
            <div className="flex w-full flex-col gap-3">
              <Link to={AUTH_LOGIN_PATH} className={cn(buttonVariants({ variant: "primary", block: true }))}>
                Back to login
              </Link>
              <Link to={AUTH_CREATE_ACCOUNT_PATH} className={cn(buttonVariants({ variant: "neutral", block: true }))}>
                Create account
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  )
}
