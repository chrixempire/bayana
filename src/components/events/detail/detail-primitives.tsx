import type { ButtonHTMLAttributes, ReactNode } from "react"
import { cn } from "../../../lib/utils"

/** Rounded surface card matching Figma "Card" (16px radius, hairline border). */
export function DetailCard({
  title,
  action,
  children,
  className,
  bodyClassName,
}: {
  title?: string
  action?: ReactNode
  children: ReactNode
  className?: string
  bodyClassName?: string
}) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-border-default-100 bg-bg-canvas",
        className,
      )}
    >
      {title ? (
        <div className="flex items-center justify-between gap-3 px-4 pt-4">
          <h2 className="truncate font-display text-xl font-semibold leading-7 text-text-events-strong">
            {title}
          </h2>
          {action}
        </div>
      ) : null}
      <div className={cn("flex flex-col gap-3 p-4", bodyClassName)}>{children}</div>
    </section>
  )
}

/** Read-only pill used for categories and skills. */
export function DetailChip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-7 shrink-0 items-center rounded-full bg-bg-canvas px-2.5 text-sm font-[510] leading-[22px] text-text-events-strong shadow-[0px_2px_2px_-1px_rgba(44,50,55,0.04),0px_1px_1px_-0.5px_rgba(44,50,55,0.04),0px_0px_0px_1px_rgba(44,50,55,0.12)]">
      {children}
    </span>
  )
}

/** 28px-tall neutral control (Provide signature, View more, session kebab). */
export function DetailSmallButton({
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-7 cursor-pointer items-center justify-center gap-1 rounded-lg border border-border-default-100 bg-button-neutral px-2.5 text-xs font-[510] leading-5 text-text-events-strong shadow-button-neutral transition-colors hover:bg-button-neutral-clicked focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-input-active",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

/** Section label above a value group (Description, Category, …). */
export function DetailFieldLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-normal leading-5 text-text-table-header">{children}</p>
  )
}
