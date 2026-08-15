import { Link } from "react-router-dom"
import { buttonVariants } from "../ui/button-variants"
import { Button } from "../ui/button"
import type { SetupTask } from "../../pages/dashboard/getting-started-types"
import { cn } from "../../lib/utils"
import { EventIcon } from "../events/icons/EventIcon"
import { EVENT_ICON_SIZE } from "../events/icons/event-icon-sizes"

function ProgressRing({ current, total }: { current: number; total: number }) {
  const radius = 18
  const circumference = 2 * Math.PI * radius
  const progress = Math.min(Math.max(current / total, 0), 1)
  const dashOffset = circumference * (1 - progress)

  return (
    <div className="relative size-11 shrink-0" aria-hidden>
      <svg className="size-11 -rotate-90" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r={radius} fill="none" stroke="#ebeef2" strokeWidth="3" />
        <circle
          cx="22"
          cy="22"
          r={radius}
          fill="none"
          stroke="#ff7a1a"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold leading-none text-text-default-500">
        {current}/{total}
      </span>
    </div>
  )
}

function TaskIconBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-bg-default-100">{children}</div>
  )
}

function TaskAction({ action }: { action: SetupTask["action"] }) {
  if (action.kind === "active") {
    return (
      <Link
        to={action.href}
        className={cn(
          buttonVariants({ variant: "primary", size: "lg" }),
          "min-w-[104px] shrink-0 rounded-[10px] no-underline",
        )}
      >
        {action.label}
      </Link>
    )
  }

  if (action.kind === "under_review") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-bg-accent-soft px-2.5 py-1 text-xs font-semibold leading-5 text-text-on-accent-bg">
        <EventIcon name="time-fill" size={EVENT_ICON_SIZE.sessionBadge} className="text-text-on-accent-bg" />
        {action.label}
      </span>
    )
  }

  if (action.kind === "completed") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-bg-success-soft px-2.5 py-1 text-xs font-semibold leading-5 text-text-success">
        <EventIcon name="check-circle-fill" size={EVENT_ICON_SIZE.sessionBadge} className="text-text-success" />
        {action.label}
      </span>
    )
  }

  return (
    <Button
      type="button"
      size="lg"
      disabled
      className="min-w-[104px] shrink-0 rounded-[10px] text-text-disabled-300"
    >
      {action.label}
    </Button>
  )
}

const TASK_ICONS = {
  bank: <EventIcon name="bank-fill" size={EVENT_ICON_SIZE.nav} className="text-icon-neutral" />,
  invite: <EventIcon name="user-add-fill" size={EVENT_ICON_SIZE.nav} className="text-icon-neutral" />,
  event: <EventIcon name="calendar-fill" size={EVENT_ICON_SIZE.nav} className="text-icon-neutral" />,
} as const

export function SetupTaskCard({ task }: { task: SetupTask }) {
  const icon = task.icon ?? (task.id in TASK_ICONS ? TASK_ICONS[task.id as keyof typeof TASK_ICONS] : null)

  return (
    <article className="flex items-center gap-4 rounded-2xl border border-border-default-100 bg-bg-canvas p-4 shadow-[0_1px_2px_rgb(44_50_55/0.04)]">
      {task.progress ? <ProgressRing current={task.progress.current} total={task.progress.total} /> : icon ? <TaskIconBox>{icon}</TaskIconBox> : null}

      <div className="min-w-0 flex-1">
        <h3 className="type-small-medium text-text-events-strong">
          {task.title}
        </h3>
        <p className="mt-0.5 type-small-regular text-text-table-header">{task.description}</p>
      </div>

      <TaskAction action={task.action} />
    </article>
  )
}
