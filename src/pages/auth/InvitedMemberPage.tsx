import { useMemo } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { BayanaLogo } from "../../components/brand/BayanaLogo"
import { Button } from "../../components/ui/button"
import { ContinueArrowIcon } from "../../components/auth/icons/ContinueArrowIcon"
import { AUTH_LOGIN_PATH } from "../../lib/auth-paths"
import { maskEmail } from "../../lib/mask-email"

function decodeParam(value: string | null): string {
  if (!value) return ""
  try {
    return decodeURIComponent(value.replace(/\+/g, " "))
  } catch {
    return value
  }
}

function organisationInitial(name: string): string {
  const t = name.trim()
  if (!t) return "?"
  return t[0].toUpperCase()
}

/**
 * Org invite landing — query params (all optional, demo defaults match design):
 * `?name=` invitee first name · `inviter=` · `org=` | `organisation=` · `email=`
 */
export function InvitedMemberPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const inviteeFirstName = useMemo(() => decodeParam(searchParams.get("name")).trim() || "", [searchParams])

  const inviterName = useMemo(() => decodeParam(searchParams.get("inviter")).trim() || "", [searchParams])

  const organisationName = useMemo(() => {
    const raw = searchParams.get("org") ?? searchParams.get("organisation")
    return decodeParam(raw).trim() || "n"
  }, [searchParams])

  const inviteEmail = useMemo(() => decodeParam(searchParams.get("email")).trim(), [searchParams])
  const maskedEmail = maskEmail(inviteEmail) || maskEmail("")

  const orgLetter = organisationInitial(organisationName)

  const handleLogIn = () => {
    if (inviteEmail) {
      navigate(`${AUTH_LOGIN_PATH}?email=${encodeURIComponent(inviteEmail)}`)
      return
    }
    navigate(AUTH_LOGIN_PATH)
  }

  return (
    <main className="min-h-screen bg-bg-canvas text-text-default-500">
      <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col items-center justify-center px-6 py-14">
        <div className="flex w-full max-w-[420px] flex-col items-center gap-[40px] text-center">
          <div className="flex w-full flex-col items-center gap-6">
            <div className="flex items-center justify-center gap-3">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-border-default-100 bg-white shadow-[0_1px_2px_rgb(44_50_55/6%)]">
                <BayanaLogo className="h-9 w-auto" alt="Bayana" />
              </div>
              <div
                className="flex size-12 shrink-0 items-center justify-center rounded-[4.8px] bg-bg-accent text-[22px] font-semibold leading-none text-white shadow-[inset_0_-1px_0_rgb(0_0_0/8%)]"
                aria-hidden
              >
                {orgLetter}
              </div>
            </div>

            <div className="flex max-w-[400px] flex-col gap-3">
              <h1 className="font-display text-[24px] font-semibold leading-8 tracking-[-0.1px] text-text-default-500">
                Welcome, {inviteeFirstName}
              </h1>
              <p className="text-sm font-normal leading-[22px] text-text-neutral-400">
                <span className="font-medium text-text-default-500">{inviterName}</span> has invited you to{" "}
                <span className="font-medium text-text-default-500">{organisationName}</span>. To accept invitation please
                login as <span className="font-medium text-text-default-500">{maskedEmail}</span>
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="primary"
            block
            className=" text-base font-semibold"
            rightIcon={<ContinueArrowIcon className="size-4 text-white" />}
            onClick={handleLogIn}
          >
            Log in
          </Button>
        </div>
      </div>
    </main>
  )
}
