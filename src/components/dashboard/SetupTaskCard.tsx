import type { ReactNode } from "react"
import { Link } from "react-router-dom"
import { buttonVariants } from "../ui/button-variants"
import { Button } from "../ui/button"
import type { SetupTask } from "../../pages/dashboard/getting-started-types"
import { cn } from "../../lib/utils"

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

function TaskIconBox({ children }: { children: ReactNode }) {
  return (
    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-bg-default-100">{children}</div>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("size-3 shrink-0", className)} viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M2 6l2.5 2.5L10 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("size-3 shrink-0", className)} viewBox="0 0 12 12" fill="none" aria-hidden>
      <circle cx="6" cy="6" r="4.25" stroke="currentColor" strokeWidth="1.2" />
      <path d="M6 3.5V6l1.75 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
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
        <ClockIcon />
        {action.label}
      </span>
    )
  }

  if (action.kind === "completed") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-bg-success-soft px-2.5 py-1 text-xs font-semibold leading-5 text-text-success">
        <CheckIcon />
        {action.label}
      </span>
    )
  }

  return (
    <Button type="button" size="lg" disabled className="min-w-[104px] shrink-0 rounded-[10px]">
      {action.label}
    </Button>
  )
}

export function BankIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("size-5 text-icon-neutral", className)} viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M3 8.5 10 4l7 4.5M5 9.5v5.5h2v-3h6v3h2V9.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M4 15.5h12" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  )
}

export function TeamInviteIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("size-5 text-icon-neutral", className)} viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="8" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M3.5 15c.6-2.2 2.4-3.5 4.5-3.5s3.9 1.3 4.5 3.5M14.5 8.5V6M13.5 7.5h2"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function EventIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("size-5 text-icon-neutral", className)} viewBox="0 0 20 20" fill="none" aria-hidden>
      <rect x="4" y="5" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M7 4v2M13 4v2M4 8.5h12" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  )
}

const TASK_ICONS = {
  bank: <BankIcon />,
  invite: <TeamInviteIcon />,
  event: <EventIcon />,
} as const

export function SetupTaskCard({ task }: { task: SetupTask }) {
  const icon = task.icon ?? (task.id in TASK_ICONS ? TASK_ICONS[task.id as keyof typeof TASK_ICONS] : null)

  return (
    <article className="flex items-center gap-4 rounded-2xl border border-border-default-100 bg-bg-canvas p-4 shadow-[0_1px_2px_rgb(44_50_55/0.04)]">
      {task.progress ? <ProgressRing current={task.progress.current} total={task.progress.total} /> : icon ? <TaskIconBox>{icon}</TaskIconBox> : null}

      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold leading-[22px] text-text-default-500">{task.title}</h3>
        <p className="mt-0.5 text-sm leading-[22px] text-text-neutral-400">{task.description}</p>
      </div>

      <TaskAction action={task.action} />
    </article>
  )
}
