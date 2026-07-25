import { Link } from "react-router-dom"
import { AUTH_ONBOARDING_PATH } from "../../lib/auth-paths"
import { EventIcon } from "../events/icons/EventIcon"
import { EVENT_ICON_SIZE } from "../events/icons/event-icon-sizes"

export function OnboardingBanner() {
  return (
    <div className="flex items-center justify-center gap-3 bg-bg-accent px-4 py-2.5 type-small-medium text-text-on-solid-bg sm:px-6">
      <div className="flex min-w-0 flex-1 items-center justify-center gap-2 sm:gap-2.5">
        <EventIcon name="information-fill" size={EVENT_ICON_SIZE.meta} inverted />
        <p className="truncate text-center sm:text-left">
          Complete your organization onboarding to get full access to our platform
        </p>
      </div>
      <Link
        to={`${AUTH_ONBOARDING_PATH}/basic-information`}
        className="inline-flex shrink-0 items-center gap-1.5 type-small-bold text-text-on-solid-bg underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      >
        Complete
        <EventIcon name="arrow-right-up-fill" size={EVENT_ICON_SIZE.buttonLeading} inverted />
      </Link>
    </div>
  )
}
