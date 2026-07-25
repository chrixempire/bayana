import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { AnalyticsStatCard } from "../../components/analytics/AnalyticsStatCard"
import { LineChart } from "../../components/analytics/charts"
import { DashboardLayout, DashboardWideContent, DashboardFullBleed } from "../../components/dashboard/DashboardLayout"
import { PersonAvatar } from "../../components/events/detail/PersonAvatar"
import { elevatedCardSurfaceClassName } from "../../components/events/detail/detail-primitives"
import { EventIcon, type EventIconName } from "../../components/events/icons/EventIcon"
import { EVENT_ICON_SIZE } from "../../components/events/icons/event-icon-sizes"
import { VerificationStatusTag } from "../../components/verification/VerificationStatusTag"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { DASHBOARD_TAB_PATHS } from "../../lib/dashboard-paths"
import { toast } from "../../hooks/use-toast"
import { cn } from "../../lib/utils"
import type { VerificationStatus } from "./verification-data"
import { CHART_BLUE } from "./analytics-data"
import {
  ACTIVE_EVENTS_SERIES,
  DASHBOARD_SIDE_STATS,
  DASHBOARD_STATS,
  RECENT_EVENTS,
  RECENT_REVIEWS,
  UNREAD_MESSAGES,
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

const VERIFICATION_DESCRIPTION: Record<VerificationState, string> = {
  verified: "Your account is verified!",
  incomplete: "You haven't started your verification yet",
  review: "We're reviewing your documents",
  rejected: "Your details was rejected",
}

const VERIFICATION_STATUS: Record<VerificationState, VerificationStatus> = {
  verified: "verified",
  incomplete: "incomplete",
  review: "in-review",
  rejected: "rejected",
}

type QuickAction = {
  icon: EventIconName
  label: string
  shortcut?: string
  run: () => void
}

function SeeAllButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-7 shrink-0 cursor-pointer items-center gap-1 rounded-lg bg-button-neutral px-2.5 text-xs font-semibold leading-5 text-text-events-strong shadow-button-neutral transition-colors hover:bg-button-neutral-hover"
    >
      <EventIcon name="add-circle-fill" size={EVENT_ICON_SIZE.buttonLeading} />
      See all
      <EventIcon name="down-fill" size={EVENT_ICON_SIZE.buttonTrailing} />
    </button>
  )
}

function ShortcutChip({ children }: { children: string }) {
  return (
    <span className="inline-flex h-4 items-center justify-center rounded bg-bg-default-100 px-1.5 text-[10px] font-semibold leading-[18px] tracking-[0.1px] text-text-events-strong">
      {children}
    </span>
  )
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <EventIcon
          key={i}
          name={i < rating ? "star-fill-accent" : "star-fill"}
          size={16}
          className="shrink-0"
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
    return (
      <PersonAvatar
        name={m?.name ?? message.name}
        tone={m?.avatarTone ?? "orange"}
        imageUrl={m?.avatarImage}
        size={40}
      />
    )
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

function VerificationStatCard({
  verification,
  empty,
}: {
  verification: VerificationState
  empty: boolean
}) {
  const status = empty ? "incomplete" : verification

  return (
    <div className={cn(elevatedCardSurfaceClassName, "flex min-w-0 flex-1 flex-col gap-3 p-4")}>
      <span className="truncate text-sm font-[510] leading-[22px] text-text-table-header">
        Verification status
      </span>
      <VerificationStatusTag status={VERIFICATION_STATUS[status]} />
      <span className="text-sm leading-[22px] text-text-table-header">
        {VERIFICATION_DESCRIPTION[status]}
      </span>
    </div>
  )
}

function DashboardSectionCard({
  title,
  onSeeAll,
  children,
  headerClassName,
}: {
  title: string
  onSeeAll?: () => void
  children: React.ReactNode
  headerClassName?: string
}) {
  return (
    <div className={cn(elevatedCardSurfaceClassName, "flex flex-col")}>
      <div className={cn("flex items-center justify-between px-4 pt-4", headerClassName)}>
        <h3 className="text-base font-semibold leading-6 text-text-events-strong">{title}</h3>
        {onSeeAll ? <SeeAllButton onClick={onSeeAll} /> : null}
      </div>
      {children}
    </div>
  )
}

export function DashboardPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isEmpty = searchParams.get("scenario") === "empty"

  const verificationParam = searchParams.get("verification") as VerificationState | null
  const verification: VerificationState =
    verificationParam && verificationParam in VERIFICATION_DESCRIPTION
      ? verificationParam
      : isEmpty
        ? "incomplete"
        : "verified"

  const [dateLabel, setDateLabel] = useState("This month")
  const [actionQuery, setActionQuery] = useState("")

  const quickActions: QuickAction[] = [
    { icon: "add-circle-fill", label: "Create a cause", shortcut: "C", run: () => navigate("/events/create") },
    { icon: "add-circle-fill", label: "Create a need", shortcut: "N", run: () => navigate("/events/create") },
    {
      icon: "add-circle-fill",
      label: "Create a new message",
      shortcut: "M",
      run: () => navigate(DASHBOARD_TAB_PATHS.messages),
    },
    {
      icon: "user-add-fill",
      label: "Invite a team member",
      run: () =>
        toast({ title: "Coming soon", description: "Team invites will be available after API integration." }),
    },
    {
      icon: "settings-3-fill",
      label: "Settings",
      shortcut: "S",
      run: () => toast({ title: "Coming soon", description: "Settings will be available soon." }),
    },
  ]
  const filteredActions = quickActions.filter((action) =>
    action.label.toLowerCase().includes(actionQuery.trim().toLowerCase()),
  )

  return (
    <DashboardLayout activeTab="dashboard" showOnboardingBanner={isEmpty}>
      <DashboardWideContent flushBottom className="flex flex-col gap-6 pb-10">
        {verification === "rejected" ? (
          <DashboardFullBleed className="-mt-6 mb-0 sm:-mt-8">
            <div className="flex items-center justify-between gap-3 bg-[#f3395e] px-10 py-3 text-sm font-medium text-text-on-solid-bg">
              <span className="flex items-center gap-2">
                <EventIcon name="info-fill" size={EVENT_ICON_SIZE.nav} inverted />
                Your organization onboarding has been rejected. Please view details to understand why
              </span>
              <button
                type="button"
                onClick={() =>
                  toast({
                    title: "Coming soon",
                    description: "Rejection details will be available after API integration.",
                  })
                }
                className="inline-flex shrink-0 cursor-pointer items-center gap-1 font-semibold underline-offset-2 hover:underline"
              >
                View details
                <EventIcon name="arrow-right-fill" size={EVENT_ICON_SIZE.nav} inverted />
              </button>
            </div>
          </DashboardFullBleed>
        ) : null}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-display text-2xl font-semibold leading-8 tracking-[-0.1px] text-text-default-500">
            Dashboard
          </h1>
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-[10px] bg-button-neutral px-3 text-sm font-semibold leading-[22px] text-text-events-strong shadow-button-neutral outline-none hover:bg-button-neutral-hover data-[state=open]:bg-button-neutral-clicked">
                <EventIcon name="calendar-fill" size={EVENT_ICON_SIZE.nav} />
                <span>{dateLabel}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[11rem]">
                {DATE_OPTIONS.map((option) => (
                  <DropdownMenuItem
                    key={option}
                    className={cn(
                      "cursor-pointer",
                      option === dateLabel && "bg-bg-accent-soft font-medium text-bg-accent",
                    )}
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
                className={cn(
                  "inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-[10px] px-3 text-sm font-semibold leading-[22px] transition-opacity disabled:cursor-not-allowed",
                  isEmpty
                    ? "bg-button-disabled text-text-disabled-300"
                    : "bg-button-primary text-text-on-solid-bg shadow-button-primary hover:opacity-90",
                )}
              >
                <EventIcon
                  name="add-circle-fill"
                  size={EVENT_ICON_SIZE.buttonLeading}
                  inverted={!isEmpty}
                />
                Quick action
                <EventIcon
                  name="down-fill"
                  size={EVENT_ICON_SIZE.buttonTrailing}
                  inverted={!isEmpty}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[480px] p-1.5">
                <div className="relative mb-1 px-0.5">
                  <EventIcon
                    name="search-line"
                    size={EVENT_ICON_SIZE.search}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
                  />
                  <input
                    value={actionQuery}
                    onChange={(event) => setActionQuery(event.target.value)}
                    onKeyDown={(event) => event.stopPropagation()}
                    placeholder="Type a command or search..."
                    className="h-8 w-full rounded-lg border border-border-default-100 bg-bg-canvas pl-9 pr-3 text-sm font-[510] leading-[22px] text-text-events-strong outline-none placeholder:text-input-placeholder focus-visible:border-border-input-active"
                  />
                </div>
                <p className="px-2 py-1 text-xs font-medium leading-5 text-text-table-header">Quick actions</p>
                {filteredActions.map((action) => (
                  <DropdownMenuItem
                    key={action.label}
                    className="h-8 cursor-pointer gap-1 rounded-lg p-2"
                    onSelect={action.run}
                  >
                    <EventIcon name={action.icon} size={EVENT_ICON_SIZE.dropdownItem} />
                    <span className="flex-1 px-1 text-sm font-[510] leading-[22px]">{action.label}</span>
                    {action.shortcut ? <ShortcutChip>{action.shortcut}</ShortcutChip> : null}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <div className="flex min-w-0 flex-1 flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <AnalyticsStatCard card={DASHBOARD_STATS[0]} empty={isEmpty} />
                <AnalyticsStatCard card={DASHBOARD_STATS[1]} empty={isEmpty} />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <AnalyticsStatCard card={DASHBOARD_STATS[2]} empty={isEmpty} />
                <VerificationStatCard verification={verification} empty={isEmpty} />
              </div>
            </div>

            <div className={cn(elevatedCardSurfaceClassName, "flex flex-col gap-4 p-4")}>
              <h3 className="text-base font-semibold leading-6 text-text-events-strong">Active events</h3>
              {isEmpty ? (
                <div className="flex h-[300px] flex-col justify-between px-0 pb-0 text-sm leading-[22px] text-text-table-header">
                  <span>1000</span>
                  <div>
                    <div className="mb-1 border-t border-border-default-100" />
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

            <DashboardSectionCard
              title="Recent events"
              onSeeAll={() => navigate(DASHBOARD_TAB_PATHS.events)}
            >
              {isEmpty ? (
                <div className="flex h-[240px] items-center justify-center text-sm leading-[22px] text-text-table-header">
                  No events yet
                </div>
              ) : (
                <div className="mt-2 overflow-hidden pb-2">
                  <div className="grid grid-cols-[minmax(0,348fr)_minmax(0,148fr)_minmax(0,200fr)_minmax(0,240fr)] gap-3 border-b border-border-default-100 px-4 pb-2 text-xs font-medium leading-5 text-text-table-header">
                    <span>Event</span>
                    <span>Event type</span>
                    <span>Visibility</span>
                    <span>Date</span>
                  </div>
                  {RECENT_EVENTS.map((event, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-[minmax(0,348fr)_minmax(0,148fr)_minmax(0,200fr)_minmax(0,240fr)] items-center gap-3 border-b border-border-default-100 px-4 py-3 last:border-0"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <Thumb src={event.thumb} />
                        <div className="flex min-w-0 flex-col">
                          <span className="truncate text-sm font-[510] leading-[22px] text-text-events-strong">
                            {event.title}
                          </span>
                          <span className="truncate text-xs leading-5 text-text-table-header">
                            {event.subtitle}
                          </span>
                        </div>
                      </div>
                      <span className="text-sm leading-[22px] text-text-events-strong">{event.type}</span>
                      <div className="flex flex-col gap-0.5">
                        <span className="flex items-center gap-1 text-sm leading-[22px] text-text-events-strong">
                          <EventIcon
                            name={event.visibility === "Public" ? "earth-fill" : "lock-fill-red"}
                            size={EVENT_ICON_SIZE.tableVisibility}
                          />
                          {event.visibility}
                        </span>
                        <span className={cn("text-xs leading-5", STATUS_TONE[event.status])}>
                          {event.status}
                        </span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm leading-[22px] text-text-events-strong">{event.dateRange}</span>
                        <span className="text-xs leading-5 text-text-table-header">{event.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </DashboardSectionCard>
          </div>

          <div className="flex w-full shrink-0 flex-col gap-6 xl:w-[400px]">
            <div className={elevatedCardSurfaceClassName}>
              <div className="grid grid-cols-2">
                <AnalyticsStatCard card={DASHBOARD_SIDE_STATS[0]} empty={isEmpty} embedded />
                <AnalyticsStatCard card={DASHBOARD_SIDE_STATS[1]} empty={isEmpty} embedded />
              </div>
              <div className="px-4 pb-4 pt-2">
                <h3 className="mb-3 text-base font-semibold leading-6 text-text-events-strong">
                  Recent reviews
                </h3>
                {isEmpty ? (
                  <div className="flex h-[240px] items-center justify-center text-sm leading-[22px] text-text-table-header">
                    No reviews yet
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {RECENT_REVIEWS.map((review) => (
                      <div
                        key={review.id}
                        className="flex items-start gap-3 border-b border-border-default-100 py-3 last:border-0"
                      >
                        <PersonAvatar name={review.name} tone={review.avatarTone} size={36} />
                        <div className="flex min-w-0 flex-1 flex-col gap-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="truncate text-sm font-[510] leading-[22px] text-text-events-strong">
                              {review.name}
                            </span>
                            <StarRating rating={review.rating} />
                          </div>
                          <span className="truncate text-xs leading-5 text-text-table-header">
                            &ldquo;{review.text}&rdquo;
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <DashboardSectionCard
              title="Unread messages"
              onSeeAll={() => navigate(DASHBOARD_TAB_PATHS.messages)}
              headerClassName="pb-2"
            >
              {isEmpty ? (
                <div className="flex h-[200px] items-center justify-center text-sm leading-[22px] text-text-table-header">
                  No unread message yet
                </div>
              ) : (
                <div className="flex flex-col px-4 pb-4">
                  {UNREAD_MESSAGES.map((message) => (
                    <button
                      key={message.id}
                      type="button"
                      onClick={() => navigate(DASHBOARD_TAB_PATHS.messages)}
                      className="flex items-start gap-3 border-b border-border-default-100 py-3 text-left transition-colors last:border-0 hover:bg-bg-default-100/60"
                    >
                      <MessageAvatar message={message} />
                      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-sm font-[510] leading-[22px] text-text-events-strong">
                            {message.name}
                          </span>
                          <span className="shrink-0 text-xs leading-5 text-text-table-header">{message.time}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-xs leading-5 text-text-table-header">{message.preview}</span>
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
            </DashboardSectionCard>
          </div>
        </div>
      </DashboardWideContent>
    </DashboardLayout>
  )
}
