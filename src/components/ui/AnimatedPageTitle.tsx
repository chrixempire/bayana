import type { ReactNode } from "react"
import { pageTitleClassName } from "../../lib/auth-form-styles"
import { cn } from "../../lib/utils"

export function AnimatedPageTitle({
  children,
  className,
  subtitle,
  subtitleClassName,
  align = "start",
}: {
  children: ReactNode
  className?: string
  subtitle?: ReactNode
  subtitleClassName?: string
  align?: "start" | "center"
}) {
  return (
    <div
      className={cn(
        "ui-page-heading-enter flex flex-col gap-3",
        align === "center" && "text-center",
      )}
    >
      <h1 className={cn(pageTitleClassName, className)}>{children}</h1>
      {subtitle ? (
        <div className={cn("ui-page-subtitle-enter", subtitleClassName)}>{subtitle}</div>
      ) : null}
    </div>
  )
}
