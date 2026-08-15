import { useMemo, useState } from "react"
import { DataTableEmptyState, DataTablePagination, FilterDropdown } from "../data-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  tableCellActionsClassName,
  tableCellSelectClassName,
  tableHeadActionsClassName,
  tableHeadSelectClassName,
  tableHeaderRowClassName,
  tableSelectControlClassName,
} from "../ui/table"
import { tableHeadCellClassName } from "../../lib/table-styles"
import { Checkbox } from "../ui/checkbox"
import { Input } from "../ui/input"
import { PersonAvatar } from "../events/detail/PersonAvatar"
import { elevatedCardSurfaceClassName } from "../events/detail/detail-primitives"
import { EventIcon } from "../events/icons/EventIcon"
import { EVENT_ICON_SIZE } from "../events/icons/event-icon-sizes"
import { ReviewDetailsModal } from "./ReviewDetailsModal"
import { cn } from "../../lib/utils"
import { REVIEW_ROWS, REVIEW_TOTALS, type ReviewRow } from "../../pages/dashboard/reviews-data"

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-1">
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

function ReviewsStatCard({
  label,
  value,
  star,
}: {
  label: string
  value: string | number
  star?: boolean
}) {
  return (
    <div className={cn(elevatedCardSurfaceClassName, "flex min-w-0 flex-1 flex-col gap-3 p-4")}>
      <span className="truncate text-sm font-medium leading-[22px] text-text-table-header">{label}</span>
      <div className="flex items-center gap-1">
        <span className="font-display text-xl font-semibold leading-7 text-text-events-strong">{value}</span>
        {star ? (
          <EventIcon
            name={value === "0.0" || value === 0 ? "star-fill" : "star-fill-accent"}
            size={16}
            className="shrink-0"
          />
        ) : null}
      </div>
    </div>
  )
}

const RATING_OPTIONS = ["All ratings", "5 stars", "4 stars", "3 stars", "2 stars", "1 star"]
const DATE_OPTIONS = ["Newest first", "Oldest first"]

export function ReviewsTab({ isEmpty }: { isEmpty: boolean }) {
  const [rows] = useState<ReviewRow[]>(isEmpty ? [] : REVIEW_ROWS)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [ratingFilter, setRatingFilter] = useState("All ratings")
  const [dateSort, setDateSort] = useState("Newest first")
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedReview, setSelectedReview] = useState<ReviewRow | null>(null)

  const totals = isEmpty ? { average: "0.0", total: 0 } : REVIEW_TOTALS

  const filtersActive = ratingFilter !== "All ratings" || query.trim().length > 0

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const ratingValue = ratingFilter === "All ratings" ? null : Number(ratingFilter[0])
    const result = rows.filter((row) => {
      if (ratingValue !== null && row.rating !== ratingValue) return false
      if (q && !`${row.name} ${row.email}`.toLowerCase().includes(q)) return false
      return true
    })
    return dateSort === "Oldest first" ? [...result].reverse() : result
  }, [rows, ratingFilter, query, dateSort])

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(page, totalPages)
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)

  const pagedSelected = paged.filter((row) => selectedIds.has(row.id)).length
  const allPagedSelected = paged.length > 0 && pagedSelected === paged.length

  const toggleAll = () => {
    const next = new Set(selectedIds)
    if (allPagedSelected) paged.forEach((row) => next.delete(row.id))
    else paged.forEach((row) => next.add(row.id))
    setSelectedIds(next)
  }
  const toggleOne = (id: string) => {
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelectedIds(next)
  }

  const clearFilters = () => {
    setRatingFilter("All ratings")
    setQuery("")
    setPage(1)
  }

  const emptyState = filtersActive
    ? { title: "No result found", description: "We couldn't find any result based on the filter" }
    : {
        title: "No review yet",
        description: "Once a volunteer drops a review, it would appear here",
      }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ReviewsStatCard label="Average ratings" value={totals.average} star />
        <ReviewsStatCard label="Total reviews" value={totals.total} />
      </div>

      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <FilterDropdown
            appearance="events"
            showLeadingIcon={false}
            label="Ratings"
            options={RATING_OPTIONS}
            value={ratingFilter}
            onValueChange={(value) => {
              setRatingFilter(value)
              setPage(1)
            }}
          />
          <FilterDropdown
            appearance="events"
            showLeadingIcon={false}
            label="Date"
            options={DATE_OPTIONS}
            value={dateSort}
            onValueChange={setDateSort}
          />
          {filtersActive ? (
            <button
              type="button"
              onClick={clearFilters}
              className="type-events-filter cursor-pointer px-1 font-medium text-text-nav-tab-active transition-colors hover:text-bg-accent"
            >
              Clear filters
            </button>
          ) : null}
        </div>
        <div className="w-full xl:w-[400px]">
          <Input
            density="compact"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setPage(1)
            }}
            placeholder="Search volunteers"
            leftIcon={<EventIcon name="search-line" size={EVENT_ICON_SIZE.search} />}
            aria-label="Search reviews"
            className="h-8 min-h-8 rounded-[10px] border-0 bg-[#EDF0F2] shadow-none"
          />
        </div>
      </div>

      <div className={cn(elevatedCardSurfaceClassName, "overflow-hidden")}>
        <Table contained={false} className="w-full table-fixed">
          <colgroup>
            <col style={{ width: "48px" }} />
            <col style={{ width: "300px" }} />
            <col style={{ width: "200px" }} />
            <col />
            <col style={{ width: "160px" }} />
            <col style={{ width: "48px" }} />
          </colgroup>
          <TableHeader>
            <TableRow className={tableHeaderRowClassName}>
              <TableHead className={cn(tableHeadCellClassName, tableHeadSelectClassName)}>
                <div className={tableSelectControlClassName}>
                  <Checkbox
                    size="sm"
                    checked={allPagedSelected ? true : pagedSelected > 0 ? "indeterminate" : false}
                    onCheckedChange={toggleAll}
                    disabled={paged.length === 0}
                    aria-label="Select all reviews"
                  />
                </div>
              </TableHead>
              <TableHead>Volunteer</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Review</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className={cn(tableHeadCellClassName, tableHeadActionsClassName)} />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6} className="p-0">
                  <DataTableEmptyState title={emptyState.title} description={emptyState.description} />
                </TableCell>
              </TableRow>
            ) : (
              paged.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={selectedIds.has(row.id) ? "selected" : undefined}
                  className="cursor-pointer"
                  onClick={() => setSelectedReview(row)}
                >
                  <TableCell className={tableCellSelectClassName} onClick={(event) => event.stopPropagation()}>
                    <div className={tableSelectControlClassName}>
                      <Checkbox
                        size="sm"
                        checked={selectedIds.has(row.id)}
                        onCheckedChange={() => toggleOne(row.id)}
                        aria-label={`Select review from ${row.name}`}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <PersonAvatar name={row.name} tone={row.avatarTone} size={40} />
                      <div className="flex min-w-0 flex-col">
                        <span className="type-table-cell-primary truncate">{row.name}</span>
                        <span className="type-table-cell-secondary truncate">{row.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StarRating rating={row.rating} />
                  </TableCell>
                  <TableCell>
                    <span className="type-table-cell-secondary line-clamp-1">
                      {row.review ? `“${row.review}”` : "No review"}
                    </span>
                  </TableCell>
                  <TableCell className="type-table-cell-primary">{row.date}</TableCell>
                  <TableCell className={tableCellActionsClassName} onClick={(event) => event.stopPropagation()}>
                    <div className={tableSelectControlClassName}>
                      <button
                        type="button"
                        aria-label={`Open review from ${row.name}`}
                        onClick={() => setSelectedReview(row)}
                        className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full text-icon-neutral outline-none transition-colors hover:bg-bg-default-100 focus-visible:ring-2 focus-visible:ring-border-input-active"
                      >
                        <EventIcon name="more-1-fill" size={EVENT_ICON_SIZE.tableMore} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {total > 0 ? (
          <DataTablePagination
            from={(safePage - 1) * pageSize + 1}
            to={Math.min(safePage * pageSize, total)}
            total={total}
            page={safePage}
            pageSize={pageSize}
            totalPages={totalPages}
            pageSizeOptions={[10, 20, 50]}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size)
              setPage(1)
            }}
          />
        ) : null}
      </div>

      <ReviewDetailsModal
        open={selectedReview !== null}
        review={selectedReview}
        onClose={() => setSelectedReview(null)}
      />
    </div>
  )
}
