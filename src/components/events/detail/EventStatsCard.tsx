import { ArrowRight, Check, Clock, MapPin, MoreHorizontal, Video } from "lucide-react"
import { cn } from "../../../lib/utils"
import type {
  EventDetail,
  EventSession,
  EventSessionAttendees,
} from "../../../pages/dashboard/event-detail-types"
import { DetailSmallButton } from "./detail-primitives"

function StatCell({
  value,
  suffix,
  label,
  className,
}: {
  value: string
  suffix?: string
  label: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-b border-border-default-100 p-4",
        className,
      )}
    >
      <div className="flex items-baseline gap-1">
        <span className="font-display text-xl font-semibold leading-7 text-text-events-strong">
          {value}
        </span>
        {suffix ? (
          <span className="text-xs font-[510] leading-5 text-text-table-header">{suffix}</span>
        ) : null}
      </div>
      <span className="text-sm font-[510] leading-[22px] text-text-table-header">{label}</span>
    </div>
  )
}

function AvatarStack({ attendees }: { attendees: EventSessionAttendees }) {
  return (
    <div className="flex items-center">
      {attendees.avatars.map((avatar, index) => (
        <span
          key={index}
          className={cn(
            "flex size-4 items-center justify-center rounded-full border-[0.5px] text-[10px] font-semibold not-last:-mr-1.5",
            avatar.tone === "purple"
              ? "border-[#ca2efe] bg-[#fcf4ff] text-[#ca2efe]"
              : "border-[#2ea1fe] bg-[#eaf6ff] text-[#2ea1fe]",
          )}
          style={{ zIndex: attendees.avatars.length - index }}
        >
          {avatar.imageUrl ? (
            <img src={avatar.imageUrl} alt="" className="size-full rounded-full object-cover" />
          ) : (
            avatar.initial
          )}
        </span>
      ))}
    </div>
  )
}

/** Explicit `timing` wins; fall back to the base `happening` flag only when unset. */
function resolveTiming(session: EventSession) {
  return session.timing ?? (session.happening ? "happening" : undefined)
}

function isHighlighted(session: EventSession) {
  const timing = resolveTiming(session)
  return timing === "happening" || timing === "upcoming"
}

function SessionTimingBadge({ session }: { session: EventSession }) {
  const timing = resolveTiming(session)
  if (timing === "happening") {
    return (
      <span className="inline-flex h-4 items-center gap-0.5 rounded bg-[#36b55c] px-1 text-[10px] font-semibold leading-[18px] tracking-[0.1px] text-text-on-solid-bg">
        <Check className="size-2.5" strokeWidth={3} />
        Happening
      </span>
    )
  }
  if (timing === "done") {
    return (
      <span className="inline-flex h-4 items-center gap-0.5 rounded bg-bg-active-200 px-1 text-[10px] font-semibold leading-[18px] tracking-[0.1px] text-text-table-header">
        <Check className="size-2.5" strokeWidth={3} />
        Done
      </span>
    )
  }
  if (timing === "upcoming" && session.daysLabel) {
    return (
      <span className="inline-flex h-4 items-center rounded bg-bg-accent px-1 text-[10px] font-semibold leading-[18px] tracking-[0.1px] text-text-on-solid-bg">
        {session.daysLabel}
      </span>
    )
  }
  return null
}

function DateBadge({ session }: { session: EventSession }) {
  const highlighted = isHighlighted(session)
  return (
    <div className="flex w-10 shrink-0 flex-col overflow-hidden rounded-lg shadow-button-neutral">
      <div
        className={cn(
          "flex h-3 items-center justify-center",
          highlighted ? "bg-bg-accent" : "bg-bg-active-200",
        )}
      >
        <span
          className={cn(
            "text-[10px] font-[510] leading-3 tracking-[0.5px]",
            highlighted ? "text-text-on-solid-bg" : "text-text-table-header",
          )}
        >
          {session.month}
        </span>
      </div>
      <div className="flex h-7 items-center justify-center bg-bg-canvas">
        <span className="text-xs font-semibold leading-5 text-text-events-strong">
          {session.day}
        </span>
      </div>
    </div>
  )
}

function SessionRow({ session, onAction }: { session: EventSession; onAction?: () => void }) {
  return (
    <div className="flex items-center gap-4 border-b border-border-default-100 py-4 last:border-b-0">
      <DateBadge session={session} />

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-1.5">
          <SessionTimingBadge session={session} />
          <div className="flex items-center gap-1 text-text-table-header">
            <Clock className="size-3 shrink-0" />
            <span className="text-xs font-normal leading-5">{session.time}</span>
          </div>
        </div>

        <p className="truncate text-sm font-[510] leading-[22px] text-text-events-strong">
          {session.title}
        </p>

        <div className="flex items-center gap-1">
          {session.meetLink ? (
            <>
              <Video className="size-4 shrink-0 text-button-primary" />
              <span className="truncate text-xs font-normal leading-5 text-button-primary">
                {session.meetLink}
              </span>
            </>
          ) : (
            <>
              <MapPin className="size-4 shrink-0 text-icon-negative" />
              <span className="truncate text-xs font-normal leading-5 text-text-table-header">
                {session.location}
              </span>
            </>
          )}
        </div>

        {session.attendees ? (
          <div className="flex items-center gap-1.5">
            <AvatarStack attendees={session.attendees} />
            <span className="truncate text-xs font-normal leading-5 text-text-table-header">
              {session.attendees.summary}
            </span>
          </div>
        ) : null}
      </div>

      <DetailSmallButton className="shrink-0" aria-label="Session actions" onClick={onAction}>
        <MoreHorizontal className="size-3" />
      </DetailSmallButton>
    </div>
  )
}

export function EventStatsCard({
  stats,
  sessions,
  onViewMore,
  onSessionAction,
}: {
  stats: EventDetail["stats"]
  sessions: EventSession[]
  onViewMore?: () => void
  onSessionAction?: () => void
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border-default-100 bg-bg-canvas">
      <div className="grid grid-cols-2">
        <StatCell
          value={String(stats.volunteers.current)}
          suffix={`/ ${stats.volunteers.max}`}
          label="Volunteers"
        />
        <StatCell
          value={stats.donations.current}
          suffix={`/ ${stats.donations.max}`}
          label="Donations"
          className="border-l"
        />
        <StatCell
          value={String(stats.sessions.current)}
          suffix={`/ ${stats.sessions.max}`}
          label="Sessions"
        />
        <StatCell value={stats.attendance} label="Attendance" className="border-l" />
      </div>

      <div className="flex items-center px-4 pt-4">
        <h2 className="font-display text-xl font-semibold leading-7 text-text-events-strong">
          Sessions
        </h2>
      </div>

      <div className="flex flex-col px-4">
        {sessions.map((session) => (
          <SessionRow key={session.id} session={session} onAction={onSessionAction} />
        ))}
      </div>

      <div className="flex items-center justify-center border-t border-border-default-100 py-4">
        <DetailSmallButton className="border-transparent bg-transparent shadow-none" onClick={onViewMore}>
          View more
          <ArrowRight className="size-3" />
        </DetailSmallButton>
      </div>
    </section>
  )
}
