import type { ReactNode } from "react"
import { cn } from "../../lib/utils"

export type TableCellStackProps = {
  primary: ReactNode
  secondary?: ReactNode
  className?: string
  primaryClassName?: string
  secondaryClassName?: string
}

export function TableCellStack({
  primary,
  secondary,
  className,
  primaryClassName,
  secondaryClassName,
}: TableCellStackProps) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1", className)}>
      <p className={cn("type-table-cell-primary truncate", primaryClassName)}>{primary}</p>
      {secondary != null && secondary !== "" ? (
        <p className={cn("type-table-cell-secondary truncate", secondaryClassName)}>{secondary}</p>
      ) : null}
    </div>
  )
}
