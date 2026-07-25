import { useMemo } from "react"
import { cn } from "../../lib/utils"
import { tablePaginationClassName } from "../../lib/table-styles"
import { EventIcon } from "../events/icons/EventIcon"
import { EVENT_ICON_SIZE } from "../events/icons/event-icon-sizes"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination"

export type DataTablePaginationProps = {
  from: number
  to: number
  total: number
  page: number
  pageSize: number
  totalPages: number
  pageSizeOptions?: number[]
  onPageChange: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  className?: string
}

/** e.g. page 1 → 1, 2, 3, …, last — page 3 → 1, …, 3, 4, …, last */
function buildPageItems(current: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= 0) return []
  if (totalPages <= 3) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  if (current <= 2) {
    const items: (number | "ellipsis")[] = [1, 2, 3]
    if (totalPages > 3) {
      items.push("ellipsis", totalPages)
    }
    return items
  }

  if (current >= totalPages - 1) {
    return [1, "ellipsis", totalPages - 2, totalPages - 1, totalPages]
  }

  return [1, "ellipsis", current, current + 1, "ellipsis", totalPages]
}

export function DataTablePagination({
  from,
  to,
  total,
  page,
  pageSize,
  totalPages,
  pageSizeOptions = [10, 25, 50],
  onPageChange,
  onPageSizeChange,
  className,
}: DataTablePaginationProps) {
  const pageItems = useMemo(() => buildPageItems(page, Math.max(totalPages, 1)), [page, totalPages])

  if (total === 0) return null

  return (
    <div className={cn(tablePaginationClassName, className)}>
      <p className="type-pagination text-left text-text-table-header">
        Showing {from} to {to} of {total}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        {onPageSizeChange ? (
          <label className="inline-flex cursor-pointer items-center gap-1.5">
            <span className="sr-only">Rows per page</span>
            <span className="relative inline-flex items-center">
              <select
                value={pageSize}
                onChange={(event) => onPageSizeChange(Number(event.target.value))}
                className="type-pagination cursor-pointer appearance-none bg-transparent py-1 pr-6 pl-0 outline-none"
              >
                {pageSizeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option} per page
                  </option>
                ))}
              </select>
              <EventIcon
                name="down-fill"
                size={EVENT_ICON_SIZE.meta}
                className="pointer-events-none absolute right-0 text-icon-neutral"
              />
            </span>
          </label>
        ) : null}

        <Pagination className="mx-0 w-auto justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                disabled={page <= 1}
                onClick={() => onPageChange(Math.max(1, page - 1))}
              />
            </PaginationItem>

            {pageItems.map((item, index) =>
              item === "ellipsis" ? (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={item}>
                  <PaginationLink isActive={item === page} onClick={() => onPageChange(item)}>
                    {item}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}

            <PaginationItem>
              <PaginationNext
                disabled={page >= totalPages}
                onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
