import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import {
  ArrowUpRight,
  CalendarDays,
  ChevronDown,
  CircleAlert,
  Globe,
  Lock,
  MessageSquarePlus,
  Plus,
  Search,
  Settings,
  Star,
  UserPlus,
} from "lucide-react"
import { DashboardLayout, DashboardWideContent, DashboardFullBleed } from "../../components/dashboard/DashboardLayout"
import { PersonAvatar } from "../../components/events/detail/PersonAvatar"
import { LineChart } from "../../components/analytics/charts"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { DASHBOARD_TAB_PATHS } from "../../lib/dashboard-paths"
import { toast } from "../../hooks/use-toast"
import { cn } from "../../lib/utils"
import { CHART_BLUE } from "./analytics-data"
import {
  ACTIVE_EVENTS_SERIES,
  DASHBOARD_SIDE_STATS,
  DASHBOARD_STATS,
  RECENT_EVENTS,
  RECENT_REVIEWS,
  UNREAD_MESSAGES,
  type DashboardStat,
  type EventStatus,
  type UnreadMessage,
} from "./dashboard-data"

const DATE_OPTIONS = ["This month", "Last month", "Last 3 months", "This year", "All time"]

const STATUS_TONE: Record<EventStatus, string> = {
  Active: "text-text-success",
  Upcoming: "text-text-warning",
  Completed: "text-text-table-header",
}

type VerificationState = "verified" | "incomplete" | "review" | "rejected"

const VERIFICATION_META: Record<VerificationState, { label: string; badge: string; description: string }> = {
  verified: { label: "Verified", badge: "bg-bg-success-soft text-text-success", description: "Your account is verified!" },
  incomplete: { label: "Incomplete", badge: "bg-bg-default-100 text-text-table-header", description: "You haven't started your verification yet" },
  review: { label: "In review", badge: "bg-bg-warning-soft text-text-warning", description: "We're reviewing your documents" },
  rejected: { label: "Rejected", badge: "bg-bg-negative-soft text-text-negative", description: "Your details was rejected" },
}

function StatCell({ card, empty }: { card: DashboardStat; empty: boolean }) {
  return (
    <div className="flex flex-1 flex-col gap-2 p-4">
      <span className="text-sm leading-[22px] text-text-table-header">{card.label}</span>
      <span className="flex items-center gap-1.5 font-display text-2xl font-semibold leading-8 text-text-events-strong">
        {empty ? card.emptyValue : card.value}
        {card.star ? <Star className="size-5 fill-[#f79e19] text-[#f79e19]" /> : null}
      </span>
      <span className="text-sm leading-[22px]">
        <span
          className={cn(
            "font-medium",
            empty ? "text-text-table-header" : card.trend === "up" ? "text-text-success" : "text-text-negative",
          )}
        >
          {empty ? "0.0%" : card.delta}
        </span>{" "}
        <span className="text-text-table-header">from last 30 days</span>
      </span>
    </div>
  )
}

function SectionCard({
  title,
  onSeeAll,
  children,
  className,
}: {
  title: string
  onSeeAll?: () => void
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex flex-col rounded-2xl border border-border-default-100 bg-bg-canvas", className)}>
      <div className="flex items-center justify-between px-4 pt-4">
        <h3 className="font-display text-lg font-semibold leading-6 text-text-events-strong">{title}</h3>
        {onSeeAll ? (
          <button
            type="button"
            onClick={onSeeAll}
            className="inline-flex h-8 cursor-pointer items-center rounded-lg border border-border-default-100 px-3 text-sm font-medium text-text-events-strong transition-colors hover:bg-bg-default-100"
          >
            See all
          </button>
        ) : null}
      </div>
      {children}
    </div>
  )
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn("size-3.5", i < rating ? "fill-[#f79e19] text-[#f79e19]" : "fill-bg-default-100 text-bg-default-100")}
        />
      ))}
    </span>
  )
}

function Thumb({ src }: { src: string }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return <span className="block size-10 shrink-0 rounded-lg bg-gradient-to-br from-bg-accent-soft to-bg-default-100" />
  }
  return (
    <img
      src={src}
      alt=""
      className="size-10 shrink-0 rounded-lg object-cover"
      onError={() => setFailed(true)}
    />
  )
}

function MessageAvatar({ message }: { message: UnreadMessage }) {
  if (message.members.length <= 1) {
    const m = message.members[0]
    return <PersonAvatar name={m?.name ?? message.name} tone={m?.avatarTone ?? "orange"} imageUrl={m?.avatarImage} size={40} />
  }
  return (
    <div className="relative flex shrink-0 items-center">
      {message.members.slice(0, 2).map((m, index) => (
        <span key={index} className={cn("rounded-full ring-2 ring-bg-canvas", index > 0 && "-ml-3")}>
          <PersonAvatar name={m.name} tone={m.avatarTone} imageUrl={m.avatarImage} size={28} />
        </span>
      ))}
      {message.extra > 0 ? (
        <span className="-ml-3 inline-flex size-5 items-center justify-center rounded-full bg-bg-accent text-[10px] font-semibold text-text-on-solid-bg ring-2 ring-bg-canvas">
          +{message.extra}
        </span>
      ) : null}
    </div>
  )
}

export function DashboardPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isEmpty = searchParams.get("scenario") === "empty"

  const verificationParam = searchParams.get("verification") as VerificationState | null
  const verification: VerificationState =
    verificationParam && verificationParam in VERIFICATION_META
      ? verificationParam
      : isEmpty
        ? "incomplete"
        : "verified"
  const verificationMeta = VERIFICATION_META[verification]

  const [dateLabel, setDateLabel] = useState("This month")
  const [actionQuery, setActionQuery] = useState("")

  const QUICK_ACTIONS = [
    { icon: Plus, label: "Create a cause", shortcut: "C", run: () => navigate("/events/create") },
    { icon: Plus, label: "Create a need", shortcut: "N", run: () => navigate("/events/create") },
    { icon: MessageSquarePlus, label: "Create a new message", shortcut: "M", run: () => navigate(DASHBOARD_TAB_PATHS.messages) },
    { icon: UserPlus, label: "Invite a team member", run: () => toast({ title: "Coming soon", description: "Team invites will be available after API integration." }) },
    { icon: Settings, label: "Settings", shortcut: "S", run: () => toast({ title: "Coming soon", description: "Settings will be available soon." }) },
  ]
  const filteredActions = QUICK_ACTIONS.filter((a) =>
    a.label.toLowerCase().includes(actionQuery.trim().toLowerCase()),
  )

  return (
    <DashboardLayout activeTab="dashboard" showOnboardingBanner={isEmpty}>
      <DashboardWideContent flushBottom className="flex flex-col gap-6 pb-10">
        {verification === "rejected" ? (
          <DashboardFullBleed className="-mt-6 mb-0 sm:-mt-8">
            <div className="flex items-center justify-between gap-3 bg-[#f3395e] px-10 py-3 text-sm font-medium text-text-on-solid-bg">
              <span className="flex items-center gap-2">
                <CircleAlert className="size-4" />
                Your organization onboarding has been rejected. Please view details to understand why
              </span>
              <button
                type="button"
                onClick={() => toast({ title: "Coming soon", description: "Rejection details will be available after API integration." })}
                className="inline-flex shrink-0 cursor-pointer items-center gap-1 font-semibold underline-offset-2 hover:underline"
              >
                View details
                <ArrowUpRight className="size-4" />
              </button>
            </div>
          </DashboardFullBleed>
        ) : null}
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-display text-2xl font-semibold leading-8 tracking-[-0.2px] text-text-default-500">
            Dashboard
          </h1>
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger className="type-events-filter inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-border-input-default-200 bg-input-surface px-3 shadow-input-default outline-none hover:bg-bg-on-canvas data-[state=open]:border-border-input-active">
                <CalendarDays className="size-4 text-icon-neutral" />
                <span>{dateLabel}</span>
                <ChevronDown className="size-4 text-icon-neutral" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[11rem]">
                {DATE_OPTIONS.map((option) => (
                  <DropdownMenuItem
                    key={option}
                    className={cn("cursor-pointer", option === dateLabel && "bg-bg-accent-soft font-medium text-bg-accent")}
                    onSelect={() => setDateLabel(option)}
                  >
                    {option}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu onOpenChange={(open) => !open && setActionQuery("")}>
              <DropdownMenuTrigger
                disabled={isEmpty}
                className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg bg-button-primary px-3.5 text-sm font-semibold text-text-on-solid-bg shadow-button-primary transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:bg-bg-active-200 disabled:text-text-disabled-300 disabled:shadow-none"
              >
                Quick action
                <ChevronDown className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[320px] p-2">
                <div className="relative mb-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-icon-neutral" />
                  <input
                    value={actionQuery}
                    onChange={(event) => setActionQuery(event.target.value)}
                    onKeyDown={(event) => event.stopPropagation()}
                    placeholder="Type a command or search..."
                    className="h-9 w-full rounded-lg border border-border-default-100 bg-bg-canvas pl-9 pr-3 text-sm text-text-events-strong outline-none placeholder:text-input-placeholder focus-visible:border-border-input-active"
                  />
                </div>
                <p className="px-2 py-1.5 text-xs font-medium text-text-table-header">Quick actions</p>
                {filteredActions.map((action) => {
                  const Icon = action.icon
                  return (
                    <DropdownMenuItem
                      key={action.label}
                      className="cursor-pointer justify-between"
                      onSelect={action.run}
                    >
                      <span className="flex items-center gap-2">
                        <Icon className="size-4 text-icon-neutral" />
                        {action.label}
                      </span>
                      {action.shortcut ? (
                        <span className="text-xs text-text-table-header">{action.shortcut}</span>
                      ) : null}
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left column */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            <div className="flex flex-col gap-4">
              <div className="flex divide-x divide-border-default-100 rounded-2xl border border-border-default-100 bg-bg-canvas">
                <StatCell card={DASHBOARD_STATS[0]} empty={isEmpty} />
                <StatCell card={DASHBOARD_STATS[1]} empty={isEmpty} />
              </div>
              <div className="flex divide-x divide-border-default-100 rounded-2xl border border-border-default-100 bg-bg-canvas">
                <StatCell card={DASHBOARD_STATS[2]} empty={isEmpty} />
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <span className="text-sm leading-[22px] text-text-table-header">Verification status</span>
                  <span
                    className={cn(
                      "inline-flex h-6 w-fit items-center rounded-lg px-2 text-xs font-[510]",
                      verificationMeta.badge,
                    )}
                  >
                    {verificationMeta.label}
                  </span>
                  <span className="text-sm leading-[22px] text-text-table-header">
                    {verificationMeta.description}
                  </span>
                </div>
              </div>
            </div>

            <SectionCard title="Active events">
              <div className="px-4 pb-4 pt-2">
                {isEmpty ? (
                  <div className="flex h-[300px] flex-col justify-between text-xs text-text-table-header">
                    <span>1000</span>
                    <div className="border-t border-border-default-100 pt-1">
                      <div className="flex justify-between">
                        <span>1 Mar</span>
                        <span>31 Mar</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <LineChart
                    height={300}
                    xStart="1 Mar"
                    xEnd="31 Mar"
                    series={[{ label: "Active events", color: CHART_BLUE, data: ACTIVE_EVENTS_SERIES }]}
                  />
                )}
              </div>
            </SectionCard>

            <SectionCard title="Recent events" onSeeAll={() => navigate(DASHBOARD_TAB_PATHS.events)}>
              {isEmpty ? (
                <div className="flex h-[240px] items-center justify-center text-sm text-text-table-header">
                  No events yet
                </div>
              ) : (
                <div className="mt-3 overflow-hidden">
                  <div className="grid grid-cols-[1.6fr_0.8fr_1fr_1.1fr] gap-3 border-b border-border-default-100 px-4 pb-2 text-xs font-medium text-text-table-header">
                    <span>Event</span>
                    <span>Event type</span>
                    <span>Visibility</span>
                    <span>Date</span>
                  </div>
                  {RECENT_EVENTS.map((event, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-[1.6fr_0.8fr_1fr_1.1fr] items-center gap-3 border-b border-border-default-100 px-4 py-3 last:border-0"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <Thumb src={event.thumb} />
                        <div className="flex min-w-0 flex-col">
                          <span className="truncate text-sm font-[510] text-text-events-strong">{event.title}</span>
                          <span className="truncate text-xs text-text-table-header">{event.subtitle}</span>
                        </div>
                      </div>
                      <span className="text-sm text-text-events-strong">{event.type}</span>
                      <div className="flex flex-col gap-0.5">
                        <span className="flex items-center gap-1 text-sm text-text-events-strong">
                          {event.visibility === "Public" ? (
                            <Globe className="size-3.5 text-text-success" />
                          ) : (
                            <Lock className="size-3.5 text-text-negative" />
                          )}
                          {event.visibility}
                        </span>
                        <span className={cn("text-xs", STATUS_TONE[event.status])}>{event.status}</span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm text-text-events-strong">{event.dateRange}</span>
                        <span className="text-xs text-text-table-header">{event.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-6">
            <div className="flex divide-x divide-border-default-100 rounded-2xl border border-border-default-100 bg-bg-canvas">
              <StatCell card={DASHBOARD_SIDE_STATS[0]} empty={isEmpty} />
              <StatCell card={DASHBOARD_SIDE_STATS[1]} empty={isEmpty} />
            </div>

            <SectionCard title="Recent reviews" onSeeAll={isEmpty ? undefined : () => toast({ title: "Coming soon", description: "Reviews will be available after API integration." })}>
              {isEmpty ? (
                <div className="flex h-[240px] items-center justify-center text-sm text-text-table-header">
                  No reviews yet
                </div>
              ) : (
                <div className="mt-3 flex flex-col">
                  {RECENT_REVIEWS.map((review) => (
                    <div key={review.id} className="flex items-start gap-3 border-b border-border-default-100 px-4 py-3 last:border-0">
                      <PersonAvatar name={review.name} tone={review.avatarTone} size={36} />
                      <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-sm font-[510] text-text-events-strong">{review.name}</span>
                          <StarRating rating={review.rating} />
                        </div>
                        <span className="truncate text-xs text-text-table-header">&ldquo;{review.text}&rdquo;</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>

            <SectionCard title="Unread messages" onSeeAll={() => navigate(DASHBOARD_TAB_PATHS.messages)}>
              {isEmpty ? (
                <div className="flex h-[200px] items-center justify-center text-sm text-text-table-header">
                  No unread message yet
                </div>
              ) : (
                <div className="mt-3 flex flex-col">
                  {UNREAD_MESSAGES.map((message) => (
                    <button
                      key={message.id}
                      type="button"
                      onClick={() => navigate(DASHBOARD_TAB_PATHS.messages)}
                      className="flex items-start gap-3 border-b border-border-default-100 px-4 py-3 text-left transition-colors last:border-0 hover:bg-bg-default-100/60"
                    >
                      <MessageAvatar message={message} />
                      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-sm font-[510] text-text-events-strong">{message.name}</span>
                          <span className="shrink-0 text-xs text-text-table-header">{message.time}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-xs text-text-table-header">{message.preview}</span>
                          {message.unread > 0 ? (
                            <span className="inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-bg-accent text-[10px] font-semibold text-text-on-solid-bg">
                              {message.unread}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </SectionCard>
          </div>
        </div>
      </DashboardWideContent>
    </DashboardLayout>
  )
}
