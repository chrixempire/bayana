import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { HelpCircle, LogOut, User } from "lucide-react"
import { BayanaLogo } from "../brand/BayanaLogo"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { performLogout } from "../../lib/auth/logout"
import { toast } from "../../hooks/use-toast"
import { ChevronUpDownIcon, LightbulbIcon } from "./icons"
import { HeaderSearch } from "./HeaderSearch"
import { HeaderNotifications } from "./HeaderNotifications"

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
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    if (isLoggingOut) return
    setIsLoggingOut(true)
    await performLogout(navigate)
  }

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
        <HeaderSearch />
      </div>

      <div className="flex shrink-0 items-center gap-3 justify-self-end sm:gap-4 lg:col-start-3">
        <button
          type="button"
          className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-xl bg-bg-accent px-3 text-sm font-semibold text-text-on-solid-bg transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
        >
          <LightbulbIcon />
          Upgrade
        </button>

        <HeaderNotifications />

        <span className="hidden h-6 w-px bg-bg-on-on-nav/80 sm:block" aria-hidden />

        <DropdownMenu>
          <DropdownMenuTrigger
            type="button"
            className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#f5d9c8] text-sm font-semibold text-[#5c3d2e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            aria-label="Account menu"
          >
            {userInitial}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[15rem] p-1.5">
            <div className="flex items-center gap-2.5 px-2.5 py-2">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#f5d9c8] text-sm font-semibold text-[#5c3d2e]">
                {userInitial}
              </span>
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-semibold text-text-events-strong">Daniel Osonuga</span>
                <span className="text-xs text-text-table-header">Administrator</span>
              </div>
            </div>
            <div className="my-1 border-t border-border-default-100" />
            <DropdownMenuItem
              className="cursor-pointer rounded-lg px-2.5 py-2 text-sm"
              onSelect={() => navigate("/settings")}
            >
              <User className="size-4 text-icon-neutral" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer rounded-lg px-2.5 py-2 text-sm"
              onSelect={() => toast({ title: "Coming soon", description: "Help & support will be available soon." })}
            >
              <HelpCircle className="size-4 text-icon-neutral" />
              Help &amp; support
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer rounded-lg px-2.5 py-2 text-sm text-text-negative focus:bg-bg-negative-soft"
              disabled={isLoggingOut}
              onSelect={() => void handleLogout()}
            >
              <LogOut className="size-4 text-icon-negative" />
              {isLoggingOut ? "Signing out..." : "Sign out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
