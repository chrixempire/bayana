import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { AnalyticsStatCard } from "../../components/analytics/AnalyticsStatCard"
import { LineChart } from "../../components/analytics/charts"
import { DashboardLayout, DashboardWideContent, DashboardFullBleed } from "../../components/dashboard/DashboardLayout"
import { PersonAvatar } from "../../components/events/detail/PersonAvatar"
import { elevatedCardSurfaceClassName } from "../../components/events/detail/detail-primitives"
import { EventIcon } from "../../components/events/icons/EventIcon"
import { EVENT_ICON_SIZE } from "../../components/events/icons/event-icon-sizes"
import { VerificationStatusTag } from "../../components/verification/VerificationStatusTag"
import { QuickActionMenu } from "../../components/dashboard/QuickActionMenu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { DASHBOARD_TAB_PATHS } from "../../lib/dashboard-paths"
import { DASHBOARD_PAGE_GUTTER_PX } from "../../lib/dashboard-layout"
import { eventDetailPath } from "../../lib/event-detail-paths"
import {
  extractCausesFromResponse,
  getOrganisationCauses,
} from "../../lib/api/causes"
import { mapCausesToTableRows } from "../../lib/map-cause-to-table-row"
import { sectionTitleClassName } from "../../lib/auth-form-styles"
import { AnimatedPageTitle } from "../../components/ui/AnimatedPageTitle"
import {
  dashboardNeutralDropdownTriggerClassName,
  dropdownTriggerOpenClassName,
} from "../../lib/dropdown-trigger-styles"
import { toast } from "../../hooks/use-toast"
import { cn } from "../../lib/utils"
import type { VerificationStatus } from "./verification-data"
import { CHART_BLUE } from "./analytics-data"
import {
  ACTIVE_EVENTS_SERIES,
  DASHBOARD_SIDE_STATS,
  DASHBOARD_STATS,
  RECENT_REVIEWS,
  UNREAD_MESSAGES,
  type EventStatus,
  type UnreadMessage,
} from "./dashboard-data"
import type { EventTableRow } from "./events-types"

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


function SeeAllButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-7 shrink-0 cursor-pointer items-center rounded-lg bg-button-neutral px-2.5 text-xs font-semibold leading-5 text-text-events-strong shadow-button-neutral transition-colors hover:bg-button-neutral-hover"
    >
      See all
    </button>
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
    <div className={cn(elevatedCardSurfaceClassName, "flex h-32 min-w-0 flex-col gap-3 p-4")}>
      <span className="truncate type-small-medium text-text-table-header">Verification status</span>
      <VerificationStatusTag status={VERIFICATION_STATUS[status]} />
      <span className="truncate type-small-regular text-text-table-header">
        {VERIFICATION_DESCRIPTION[status]}
      </span>
    </div>
  )
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <EventIcon
          key={i}
          name={i < rating ? "star-fill-accent" : "star-fill-empty"}
          size={16}
          className="shrink-0"
        />
      ))}
    </span>
  )
}

function Thumb({ src }: { src?: string | null }) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) {
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
        <h3 className={sectionTitleClassName}>{title}</h3>
        {onSeeAll ? <SeeAllButton onClick={onSeeAll} /> : null}
      </div>
      {children}
    </div>
  )
}

const STATUS_LABEL: Record<NonNullable<EventTableRow["visibility"]["lifecycleStatus"]>, EventStatus> = {
  active: "Active",
  upcoming: "Upcoming",
  completed: "Completed",
}

function mapRowStatus(row: EventTableRow): EventStatus {
  return STATUS_LABEL[row.visibility.lifecycleStatus ?? "upcoming"] ?? "Upcoming"
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
  const [recentEvents, setRecentEvents] = useState<EventTableRow[]>([])
  const [recentEventsLoading, setRecentEventsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    void (async () => {
      setRecentEventsLoading(true)
      try {
        const response = await getOrganisationCauses()
        if (cancelled) return
        setRecentEvents(mapCausesToTableRows(extractCausesFromResponse(response)).slice(0, 5))
      } catch {
        if (!cancelled) setRecentEvents([])
      } finally {
        if (!cancelled) setRecentEventsLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  const showRecentEventsEmpty = !recentEventsLoading && recentEvents.length === 0

  return (
    <DashboardLayout activeTab="dashboard" showOnboardingBanner={isEmpty}>
      <DashboardWideContent flushBottom className="flex flex-col gap-6 pb-10">
        {verification === "rejected" ? (
          <DashboardFullBleed className="-mt-6 mb-0 sm:-mt-8">
            <div
              className="flex items-center justify-between gap-3 bg-[#f3395e] py-3 type-small-medium text-text-on-solid-bg"
              style={{ paddingLeft: DASHBOARD_PAGE_GUTTER_PX, paddingRight: DASHBOARD_PAGE_GUTTER_PX }}
            >
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
          <AnimatedPageTitle>Dashboard</AnimatedPageTitle>
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  dashboardNeutralDropdownTriggerClassName,
                  dropdownTriggerOpenClassName,
                )}
              >
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

            <QuickActionMenu disabled={isEmpty} />
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
              <h3 className={sectionTitleClassName}>Active events</h3>
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
              {showRecentEventsEmpty ? (
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
                  {recentEventsLoading
                    ? Array.from({ length: 3 }, (_, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-[minmax(0,348fr)_minmax(0,148fr)_minmax(0,200fr)_minmax(0,240fr)] items-center gap-3 border-b border-border-default-100 px-4 py-3 last:border-0"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="size-10 shrink-0 animate-pulse rounded-lg bg-bg-default-100" />
                            <div className="flex min-w-0 flex-1 flex-col gap-2">
                              <div className="h-3.5 w-40 animate-pulse rounded bg-bg-default-100" />
                              <div className="h-3 w-28 animate-pulse rounded bg-bg-default-100" />
                            </div>
                          </div>
                          <div className="h-3.5 w-12 animate-pulse rounded bg-bg-default-100" />
                          <div className="h-3.5 w-16 animate-pulse rounded bg-bg-default-100" />
                          <div className="h-3.5 w-24 animate-pulse rounded bg-bg-default-100" />
                        </div>
                      ))
                    : recentEvents.map((event) => {
                        const status = mapRowStatus(event)
                        const visibilityLabel =
                          event.visibility.type === "private"
                            ? "Private"
                            : event.visibility.type === "drafts"
                              ? "Draft"
                              : "Public"
                        return (
                          <button
                            key={event.id}
                            type="button"
                            onClick={() => navigate(eventDetailPath(event.id))}
                            className="grid w-full grid-cols-[minmax(0,348fr)_minmax(0,148fr)_minmax(0,200fr)_minmax(0,240fr)] items-center gap-3 border-b border-border-default-100 px-4 py-3 text-left transition-colors last:border-0 hover:bg-bg-default-100/60"
                          >
                            <div className="flex min-w-0 items-center gap-3">
                              <Thumb src={event.cause.thumbnailUrl ?? undefined} />
                              <div className="flex min-w-0 flex-col">
                                <span className="truncate text-sm font-medium leading-[22px] text-text-events-strong">
                                  {event.cause.title}
                                </span>
                                <span className="truncate text-xs leading-5 text-text-table-header">
                                  {event.cause.description}
                                </span>
                              </div>
                            </div>
                            <span className="text-sm leading-[22px] text-text-events-strong">Cause</span>
                            <div className="flex flex-col gap-0.5">
                              <span className="flex items-center gap-1 text-sm leading-[22px] text-text-events-strong">
                                <EventIcon
                                  name={
                                    event.visibility.type === "public"
                                      ? "earth-fill"
                                      : "lock-fill-red"
                                  }
                                  size={EVENT_ICON_SIZE.tableVisibility}
                                />
                                {visibilityLabel}
                              </span>
                              {event.visibility.type !== "drafts" ? (
                                <span className={cn("text-xs leading-5", STATUS_TONE[status])}>
                                  {status}
                                </span>
                              ) : null}
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <span className="text-sm leading-[22px] text-text-events-strong">
                                {event.date.range ?? "—"}
                              </span>
                              <span className="text-xs leading-5 text-text-table-header">
                                {event.date.time ?? ""}
                              </span>
                            </div>
                          </button>
                        )
                      })}
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
                <h3 className={cn("mb-3", sectionTitleClassName)}>
                  Recent reviews
                </h3>
                {isEmpty ? (
                  <div className="flex h-[240px] items-center justify-center text-sm leading-[22px] text-text-table-header">
                    No reviews yet
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {RECENT_REVIEWS.map((review) => (
                      <button
                        key={review.id}
                        type="button"
                        onClick={() => navigate(`${DASHBOARD_TAB_PATHS.volunteers}?tab=reviews`)}
                        className="flex w-full items-start gap-3 border-b border-border-default-100 py-3 text-left transition-colors last:border-0 hover:bg-bg-default-100/60"
                      >
                        <PersonAvatar name={review.name} tone={review.avatarTone} size={36} />
                        <div className="flex min-w-0 flex-1 flex-col gap-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="truncate text-sm font-medium leading-[22px] text-text-events-strong">
                              {review.name}
                            </span>
                            <StarRating rating={review.rating} />
                          </div>
                          <span className="truncate text-xs leading-5 text-text-table-header">
                            &ldquo;{review.text}&rdquo;
                          </span>
                        </div>
                      </button>
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
                          <span className="truncate text-sm font-medium leading-[22px] text-text-events-strong">
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
