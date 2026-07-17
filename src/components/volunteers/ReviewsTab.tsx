import { useMemo, useState } from "react"
import { ChevronRight, Search, Star } from "lucide-react"
import { DataTableEmptyState, DataTablePagination, FilterDropdown } from "../data-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Checkbox } from "../ui/checkbox"
import { Input } from "../ui/input"
import { PersonAvatar } from "../events/detail/PersonAvatar"
import { ReviewDetailsModal } from "./ReviewDetailsModal"
import { cn } from "../../lib/utils"
import { REVIEW_ROWS, REVIEW_TOTALS, type ReviewRow } from "../../pages/dashboard/reviews-data"

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn("size-4", i < rating ? "fill-[#f79e19] text-[#f79e19]" : "fill-bg-default-100 text-bg-default-100")}
        />
      ))}
    </span>
  )
}

function StatCard({ label, value, star }: { label: string; value: string | number; star?: boolean }) {
  return (
    <div className="flex flex-1 flex-col gap-2 rounded-2xl border border-border-default-100 bg-bg-canvas p-4">
      <span className="text-sm leading-[22px] text-text-table-header">{label}</span>
      <span className="flex items-center gap-1.5 font-display text-2xl font-semibold leading-8 text-text-events-strong">
        {value}
        {star ? <Star className="size-5 fill-[#f79e19] text-[#f79e19]" /> : null}
      </span>
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

  const emptyState = filtersActive
    ? { title: "No result found", description: "We couldn't find any result based on the filter" }
    : { title: "No reviews yet", description: "Reviews left by volunteers will appear here" }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row">
        <StatCard label="Average ratings" value={totals.average} star />
        <StatCard label="Total reviews" value={totals.total} />
      </div>

      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <FilterDropdown
            label="Ratings"
            options={RATING_OPTIONS}
            value={ratingFilter}
            onValueChange={(value) => {
              setRatingFilter(value)
              setPage(1)
            }}
          />
          <FilterDropdown label="Date" options={DATE_OPTIONS} value={dateSort} onValueChange={setDateSort} />
        </div>
        <div className="w-full xl:max-w-[300px]">
          <Input
            density="compact"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setPage(1)
            }}
            placeholder="Search volunteers"
            leftIcon={<Search className="size-4" />}
            aria-label="Search reviews"
          />
        </div>
      </div>

      <div className="rounded-xl border border-border-default-100 bg-bg-canvas">
        <Table contained={false} className="w-full table-fixed">
          <colgroup>
            <col style={{ width: "3rem" }} />
            <col style={{ width: "26%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "auto" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "3rem" }} />
          </colgroup>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-10">
                <Checkbox
                  size="sm"
                  checked={allPagedSelected ? true : pagedSelected > 0 ? "indeterminate" : false}
                  onCheckedChange={toggleAll}
                  disabled={paged.length === 0}
                  aria-label="Select all reviews"
                />
              </TableHead>
              <TableHead>Volunteer</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Review</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-12" />
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
                <TableRow key={row.id} className="cursor-pointer" onClick={() => setSelectedReview(row)}>
                  <TableCell onClick={(event) => event.stopPropagation()}>
                    <Checkbox
                      size="sm"
                      checked={selectedIds.has(row.id)}
                      onCheckedChange={() => toggleOne(row.id)}
                      aria-label={`Select review from ${row.name}`}
                    />
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
                    <Stars rating={row.rating} />
                  </TableCell>
                  <TableCell>
                    <span className="type-table-cell-secondary line-clamp-1">
                      {row.review ? `“${row.review}”` : "No review"}
                    </span>
                  </TableCell>
                  <TableCell className="type-table-cell-primary">{row.date}</TableCell>
                  <TableCell className="text-right">
                    <ChevronRight className="ml-auto size-4 text-icon-neutral" />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {total > 0 ? (
          <DataTablePagination
            className="border-t border-border-default-100 px-4 pb-4"
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
