import { Link } from "react-router-dom"
import { AUTH_ONBOARDING_PATH } from "../../lib/auth-paths"
import { ExternalLinkIcon, InfoCircleIcon } from "./icons"

export function OnboardingBanner() {
  return (
    <div className="flex items-center justify-center gap-3 bg-bg-accent px-4 py-2.5 text-sm font-medium leading-[22px] text-text-on-solid-bg sm:px-6">
      <div className="flex min-w-0 flex-1 items-center justify-center gap-2 sm:gap-2.5">
        <InfoCircleIcon className="text-text-on-solid-bg" />
        <p className="truncate text-center sm:text-left">
          Complete your organization onboarding to get full access to our platform
        </p>
      </div>
      <Link
        to={`${AUTH_ONBOARDING_PATH}/basic-information`}
        className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-text-on-solid-bg underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      >
        Complete
        <ExternalLinkIcon />
      </Link>
    </div>
  )
}
