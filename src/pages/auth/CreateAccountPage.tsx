import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ContinueArrowIcon } from "../../components/auth/icons/ContinueArrowIcon"
import { GoogleGIcon } from "../../components/auth/icons/GoogleGIcon"
import { BayanaLogo } from "../../components/brand/BayanaLogo"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { toast } from "../../hooks/use-toast"
import { AUTH_LOGIN_PATH, AUTH_ONBOARDING_PATH } from "../../lib/auth-paths"

export function CreateAccountPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")

  const onContinue = () => {
    if (!email.includes("@")) {
      const msg = "Please enter a valid business email address"
      setEmailError(msg)
      toast({
        variant: "destructive",
        title: "There are issues with some fields",
        description: "Please review highlighted fields and try again.",
      })
      return
    }
    setEmailError("")
    console.log("create-account", { email })
    toast({
      variant: "success",
      title: "Confirmation email has been sent successfully!",
    })
    navigate(`${AUTH_ONBOARDING_PATH}/check-email`, { state: { email } })
  }

  return (
    <main className="min-h-screen bg-bg-canvas text-text-default-500">
      <div className="mx-auto flex min-h-screen max-w-[1440px] justify-center px-6 py-14">
        <div className="mx-auto flex w-full max-w-[396px] flex-col items-center gap-11 pt-[88px]">
          <BayanaLogo className="h-12 w-auto" />

          <div className="flex w-full flex-col gap-11">
            <div className="flex flex-col gap-4 text-center">
              <h1 className="font-display text-[20px] font-semibold leading-8 tracking-[-0.2px] text-text-default-500">
                Get started with Bayana
              </h1>
              <p className="text-sm leading-[22px] text-text-neutral-400">
              Already have an account?{" "}
                <Link to={AUTH_LOGIN_PATH} className="font-medium text-[#278cff] underline underline-offset-2">
                  Sign in
                </Link>
              </p>
            </div>

            <form
              className="flex w-full flex-col gap-7"
              onSubmit={(event) => {
                event.preventDefault()
                onContinue()
              }}
            >
              <div className="flex flex-col gap-3">
                <label
                  htmlFor="create-account-email"
                  className="block text-sm font-medium leading-[22px] text-text-default-500"
                >
                  Email address
                </label>
                <Input
                  id="create-account-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="name@work-email.com"
                  value={email}
                  invalid={Boolean(emailError)}
                  onChange={(e) => {
                    setEmail(e.target.value)
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
                    title: "Google sign-up",
                    description: "Google authentication will be connected next.",
                  })
                }
              >
                Continue with Google
              </Button>
            </form>
          </div>

          <p className="max-w-[260px] text-center text-[10px] leading-5 text-text-neutral-400">
            By signing up, you agree to Bayana&apos;s{" "}
            <button type="button" className="font-medium text-[#278cff] underline underline-offset-2">
              Privacy Policy
            </button>{" "}
            and{" "}
            <button type="button" className="font-medium text-[#278cff] underline underline-offset-2">
              Terms of Use
            </button>
          </p>
        </div>
      </div>
    </main>
  )
}
