import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { AUTH_CREATE_ACCOUNT_PATH, AUTH_LOGIN_PATH } from "../../lib/auth-paths"
import { cn } from "../../lib/utils"
import { CreateAccountForm } from "../../pages/auth/CreateAccountForm"
import { LoginForm } from "../../pages/auth/LoginForm"

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  return reduced
}

/**
 * Shared layout for login ↔ create-account with a 3D card flip.
 * Must stay mounted across both routes (pathless parent) so the flip can animate.
 */
export function AuthEntryFlipLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const reducedMotion = usePrefersReducedMotion()
  const isSignup = location.pathname === AUTH_CREATE_ACCOUNT_PATH
  const [flipped, setFlipped] = useState(isSignup)
  const [copyTick, setCopyTick] = useState(0)

  useEffect(() => {
    setFlipped(isSignup)
    setCopyTick((n) => n + 1)
  }, [isSignup])

  const switchToSignUp = () => {
    setFlipped(true)
    navigate(AUTH_CREATE_ACCOUNT_PATH, { replace: true })
  }

  const switchToSignIn = () => {
    setFlipped(false)
    const next = new URLSearchParams(location.search).get("next")
    const search = next ? `?next=${encodeURIComponent(next)}` : ""
    navigate(`${AUTH_LOGIN_PATH}${search}`, { replace: true })
  }

  return (
    <main className="min-h-screen bg-bg-canvas text-text-default-500">
      <div className="mx-auto flex min-h-screen max-w-[1440px] justify-center px-6 py-14">
        <div className="auth-entry-flip-scene w-full max-w-[396px] pt-[88px]">
          <div
            className={cn(
              "auth-entry-flip-card",
              flipped && "auth-entry-flip-card--flipped",
              reducedMotion && "auth-entry-flip-card--instant",
            )}
          >
            <div
              className="auth-entry-flip-face auth-entry-flip-face--front"
              aria-hidden={flipped}
              {...(flipped ? { inert: true } : {})}
            >
              <LoginForm
                onSwitchToSignUp={switchToSignUp}
                copyKey={flipped ? "signin-hidden" : `signin-${copyTick}`}
              />
            </div>
            <div
              className="auth-entry-flip-face auth-entry-flip-face--back"
              aria-hidden={!flipped}
              {...(!flipped ? { inert: true } : {})}
            >
              <CreateAccountForm
                onSwitchToSignIn={switchToSignIn}
                copyKey={!flipped ? "signup-hidden" : `signup-${copyTick}`}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
