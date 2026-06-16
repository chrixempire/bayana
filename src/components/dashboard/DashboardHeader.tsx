import { BayanaLogo } from "../brand/BayanaLogo"
import { BellIcon, ChevronUpDownIcon, LightbulbIcon, SearchIcon } from "./icons"

type DashboardHeaderProps = {
  organizationName?: string
  organizationInitial?: string
  planLabel?: string
  userInitial?: string
}

export function DashboardHeader({
  organizationName = "Acme Incorporation",
  organizationInitial = "A",
  planLabel = "Free",
  userInitial = "D",
}: DashboardHeaderProps) {
  return (
    <header className="grid w-full grid-cols-1 items-center gap-4 px-4 py-3 text-text-on-solid-bg sm:px-6 sm:py-3.5 lg:grid-cols-[minmax(0,1fr)_minmax(240px,480px)_minmax(0,1fr)] lg:gap-6">
      <div className="flex min-w-0 items-center gap-3 justify-self-start sm:gap-4">
        <BayanaLogo className="h-9 w-9 shrink-0" />

        <button
          type="button"
          className="inline-flex min-w-0 max-w-[220px] cursor-pointer items-center gap-2.5 rounded-xl bg-bg-on-nav/80 px-2.5 py-2 text-left transition-colors hover:bg-bg-on-on-nav focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 sm:max-w-none"
          aria-label="Switch organization"
        >
          <span
            aria-hidden
            className="flex size-7 shrink-0 items-center justify-center rounded-md bg-bg-accent text-xs font-bold text-text-on-solid-bg"
          >
            {organizationInitial}
          </span>
          <span className="truncate text-sm font-medium leading-[22px]">{organizationName}</span>
          <ChevronUpDownIcon />
        </button>

        <span className="inline-flex shrink-0 items-center rounded-full bg-bg-accent px-2 py-0.5 text-[11px] font-semibold leading-4 text-text-on-solid-bg">
          {planLabel}
        </span>
      </div>

      <div className="flex w-full justify-center lg:col-start-2">
        <label className="relative flex w-full max-w-[480px] items-center">
          <span className="sr-only">Search</span>
          <SearchIcon className="pointer-events-none absolute left-3 text-text-on-solid-bg/70" />
          <input
            type="search"
            placeholder="Search.."
            className="h-10 w-full rounded-xl border-0 bg-bg-on-nav/70 py-0 pl-9 pr-14 text-sm text-text-on-solid-bg placeholder:text-text-on-solid-bg/50 shadow-none outline-none ring-0 focus-visible:ring-2 focus-visible:ring-white/25"
          />
          <kbd className="pointer-events-none absolute right-3 hidden rounded-md bg-bg-on-on-nav/60 px-1.5 py-0.5 text-[10px] font-medium text-text-on-solid-bg/80 sm:inline">
            ⌘+K
          </kbd>
        </label>
      </div>

      <div className="flex shrink-0 items-center gap-3 justify-self-end sm:gap-4 lg:col-start-3">
        <button
          type="button"
          className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-xl bg-bg-accent px-3 text-sm font-semibold text-text-on-solid-bg transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
        >
          <LightbulbIcon />
          Upgrade
        </button>

        <button
          type="button"
          className="relative inline-flex size-9 cursor-pointer items-center justify-center rounded-lg text-text-on-solid-bg transition-colors hover:bg-bg-on-nav focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          aria-label="Notifications"
        >
          <BellIcon />
          <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-button-negative" aria-hidden />
        </button>

        <span className="hidden h-6 w-px bg-bg-on-on-nav/80 sm:block" aria-hidden />

        <button
          type="button"
          className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#f5d9c8] text-sm font-semibold text-[#5c3d2e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          aria-label="Account menu"
        >
          {userInitial}
        </button>
      </div>
    </header>
  )
}
