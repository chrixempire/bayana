import { Fragment } from "react"
import { Skeleton } from "../../ui/skeleton"
import { TableCell, TableRow } from "../../ui/table"

/** Cell spec: "avatar" renders an avatar + two text bars; any other string is a Skeleton className. */
export type SkeletonCell = "avatar" | string

export function DetailTableSkeleton({
  cells,
  rows = 6,
}: {
  cells: SkeletonCell[]
  rows?: number
}) {
  return (
    <Fragment>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex} className="hover:bg-transparent">
          {cells.map((cell, cellIndex) =>
            cell === "avatar" ? (
              <TableCell key={cellIndex} className={cellIndex === 0 ? "pl-4" : undefined}>
                <div className="flex items-center gap-3">
                  <Skeleton className="size-9 shrink-0 rounded-full" />
                  <div className="flex flex-col gap-1.5">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-2.5 w-40" />
                  </div>
                </div>
              </TableCell>
            ) : (
              <TableCell key={cellIndex} className={cellIndex === 0 ? "pl-4" : undefined}>
                <Skeleton className={cell} />
              </TableCell>
            ),
          )}
        </TableRow>
      ))}
    </Fragment>
  )
}
