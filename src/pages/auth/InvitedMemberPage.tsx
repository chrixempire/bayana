import { useMemo, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { BayanaLogo } from "../../components/brand/BayanaLogo"
import { Button } from "../../components/ui/button"
import { Checkbox } from "../../components/ui/checkbox"
import { Input } from "../../components/ui/input"
import { toast } from "../../hooks/use-toast"
import {
  AUTH_CREATE_ACCOUNT_PATH,
  AUTH_HOME_PATH,
  AUTH_LOGIN_PATH,
} from "../../lib/auth-paths"

function decodeParam(value: string | null): string {
  if (!value) return ""
  try {
    return decodeURIComponent(value.replace(/\+/g, " "))
  } catch {
    return value
  }
}

export function InvitedMemberPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const organisationName = useMemo(() => {
    const raw = searchParams.get("org") ?? searchParams.get("organisation")
    const name = decodeParam(raw)
    return name.trim() || "Your organisation"
  }, [searchParams])

  const emailFromInvite = useMemo(() => decodeParam(searchParams.get("email")).trim(), [searchParams])
  const [emailInput, setEmailInput] = useState("")

  const [fullName, setFullName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const resolvedEmail = emailFromInvite || emailInput.trim()

  const onSubmit = () => {
    const next: Record<string, string> = {}
    if (!resolvedEmail) next.email = "Email is required"
    else if (!resolvedEmail.includes("@")) next.email = "Please enter a valid email address"
    if (!fullName.trim()) next.fullName = "Full name is required"
    if (password.length < 8) next.password = "Use at least 8 characters"
    if (password !== confirmPassword) next.confirmPassword = "Passwords do not match"
    if (!agreedToTerms) next.terms = "Please accept the terms to continue"

    setErrors(next)
    if (Object.keys(next).length > 0) {
      toast({
        variant: "destructive",
        title: "There are issues with some fields",
        description: "Please review highlighted fields and try again.",
      })
      return
    }

    console.log("invited-member-accept", { organisationName, email: resolvedEmail, fullName })
    toast({
      variant: "success",
      title: "You're in",
      description: `Welcome to ${organisationName} on Bayana.`,
    })
    navigate(AUTH_HOME_PATH)
  }

  return (
    <main className="min-h-screen bg-bg-canvas text-text-default-500">
      <div className="mx-auto flex min-h-screen max-w-[1440px] justify-center px-6 py-14">
        <div className="mx-auto w-full max-w-[400px] pt-20">
          <div className="text-center">
            <BayanaLogo className="mx-auto mb-8 h-12 w-auto" />
            <h1 className="text-2xl font-semibold leading-8 tracking-[-0.1px]">You&apos;ve been invited</h1>
            <p className="mt-3 text-sm leading-[22px] text-text-neutral-400">
              <span className="font-medium text-text-default-500">{organisationName}</span> invited you to join their
              workspace on Bayana as a team member.
            </p>
          </div>

          <form
            className="mt-10 space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              onSubmit()
            }}
          >
            <div className="space-y-2">
              <label htmlFor="invite-email" className="text-sm font-medium leading-[22px] text-text-default-500">
                Work email
              </label>
              <Input
                id="invite-email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@organisation.org"
                value={emailFromInvite || emailInput}
                disabled={Boolean(emailFromInvite)}
                readOnly={Boolean(emailFromInvite)}
                invalid={Boolean(errors.email)}
                onChange={(e) => {
                  if (emailFromInvite) return
                  setEmailInput(e.target.value)
                  if (errors.email) setErrors((prev) => ({ ...prev, email: "" }))
                }}
                className={emailFromInvite ? "opacity-90" : undefined}
              />
              {errors.email ? <p className="text-xs text-text-negative">{errors.email}</p> : null}
            </div>

            <div className="space-y-2">
              <label htmlFor="invite-full-name" className="text-sm font-medium leading-[22px] text-text-default-500">
                Full name
              </label>
              <Input
                id="invite-full-name"
                name="name"
                autoComplete="name"
                placeholder="Your full name"
                value={fullName}
                invalid={Boolean(errors.fullName)}
                onChange={(e) => {
                  setFullName(e.target.value)
                  if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: "" }))
                }}
              />
              {errors.fullName ? <p className="text-xs text-text-negative">{errors.fullName}</p> : null}
            </div>

            <div className="space-y-2">
              <label htmlFor="invite-password" className="text-sm font-medium leading-[22px] text-text-default-500">
                Create password
              </label>
              <Input
                id="invite-password"
                type="password"
                name="new-password"
                autoComplete="new-password"
                placeholder="At least 8 characters"
                value={password}
                invalid={Boolean(errors.password)}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (errors.password) setErrors((prev) => ({ ...prev, password: "" }))
                }}
              />
              {errors.password ? <p className="text-xs text-text-negative">{errors.password}</p> : null}
            </div>

            <div className="space-y-2">
              <label htmlFor="invite-confirm" className="text-sm font-medium leading-[22px] text-text-default-500">
                Confirm password
              </label>
              <Input
                id="invite-confirm"
                type="password"
                name="confirm-password"
                autoComplete="new-password"
                placeholder="Repeat password"
                value={confirmPassword}
                invalid={Boolean(errors.confirmPassword)}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: "" }))
                }}
              />
              {errors.confirmPassword ? <p className="text-xs text-text-negative">{errors.confirmPassword}</p> : null}
            </div>

            <div className="space-y-1 pt-1">
              <div className="flex items-start gap-2">
                <Checkbox
                  id="invite-terms"
                  size="sm"
                  className="mt-0.5"
                  checked={agreedToTerms}
                  onCheckedChange={(value) => {
                    setAgreedToTerms(value === true)
                    if (errors.terms) setErrors((prev) => ({ ...prev, terms: "" }))
                  }}
                />
                <label htmlFor="invite-terms" className="cursor-pointer text-sm leading-[22px] text-text-neutral-400">
                  I agree to Bayana&apos;s Privacy Policy and Terms of Use
                </label>
              </div>
              {errors.terms ? <p className="text-xs text-text-negative">{errors.terms}</p> : null}
            </div>

            <Button type="submit" variant="primary" block className="mt-2">
              Accept invitation
            </Button>
          </form>

          <p className="mt-8 text-center text-sm leading-[22px] text-text-neutral-400">
            Already have an account?{" "}
            <Link to={AUTH_LOGIN_PATH} className="font-medium text-text-default-500 underline-offset-2 hover:underline">
              Sign in
            </Link>
            {" · "}
            <Link
              to={AUTH_CREATE_ACCOUNT_PATH}
              className="font-medium text-text-default-500 underline-offset-2 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
