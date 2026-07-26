import { useMemo, useState } from "react"
import { cn } from "../../../lib/utils"
import { EventIcon } from "../icons/EventIcon"
import { EVENT_ICON_SIZE } from "../icons/event-icon-sizes"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Modal } from "../../ui/modal"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table"
import { DataTableEmptyState, DataTablePagination, FilterDropdown } from "../../data-table"
import type { Review, ReviewsData } from "../../../pages/dashboard/event-detail-types"
import { PersonAvatar } from "./PersonAvatar"
import { DetailTableSkeleton } from "./DetailTableSkeleton"
import { useSimulatedLoading } from "../../../hooks/use-simulated-loading"

function StarRating({ rating, className }: { rating: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <EventIcon
          key={index}
          name={index < rating ? "star-fill-accent" : "star-fill"}
          size={14}
          className="shrink-0"
        />
      ))}
    </span>
  )
}

function StatCard({ label, value, star }: { label: string; value: string; star?: boolean }) {
  return (
    <div className="flex flex-1 flex-col gap-3 rounded-2xl border border-border-default-100 bg-bg-canvas p-4">
      <span className="text-sm font-medium leading-[22px] text-text-table-header">{label}</span>
      <span className="flex items-center gap-1.5 font-display text-2xl font-semibold leading-8 text-text-events-strong">
        {value}
        {star ? <EventIcon name="star-fill-accent" size={20} className="shrink-0" /> : null}
      </span>
    </div>
  )
}

function ReviewField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-normal leading-5 text-text-table-header">{label}</span>
      {children}
    </div>
  )
}

function ReviewDetailsModal({ review, onClose }: { review: Review | null; onClose: () => void }) {
  if (!review) return null
  return (
    <Modal
      open={Boolean(review)}
      onClose={onClose}
      title="Review details"
      size="sm"
      footer={
        <Button variant="neutral" size="sm" className="rounded-[10px]" onClick={onClose}>
          Close
        </Button>
      }
    >
      <div className="flex flex-col gap-4">
        <ReviewField label="Volunteer">
          <div className="flex items-center gap-2.5">
            <PersonAvatar name={review.name} tone={review.avatarTone} imageUrl={review.avatarImage || undefined} size={28} />
            <span className="text-sm font-medium leading-[22px] text-text-events-strong">{review.name}</span>
          </div>
        </ReviewField>
        <ReviewField label="Ratings">
          <StarRating rating={review.rating} />
        </ReviewField>
        <ReviewField label="Review">
          <p className="text-sm leading-[22px] text-text-events-strong">{review.comment || "No review"}</p>
        </ReviewField>
        <ReviewField label="Date added">
          <p className="text-sm font-medium leading-[22px] text-text-events-strong">{review.date}</p>
        </ReviewField>
      </div>
    </Modal>
  )
}

export function ReviewsTab({ data }: { data: ReviewsData }) {
  const [search, setSearch] = useState("")
  const [detail, setDetail] = useState<Review | null>(null)
  const [filters, setFilters] = useState({ ratings: "Ratings", date: "Date" })
  const loading = useSimulatedLoading()

  const rows = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return data.rows
    return data.rows.filter((row) => [row.name, row.comment].join(" ").toLowerCase().includes(query))
  }, [data.rows, search])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row">
        <StatCard label="Average ratings" value={String(data.averageRating)} star />
        <StatCard label="Total reviews" value={String(data.totalReviews)} />
      </div>

      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap gap-2">
          <FilterDropdown
            label="Ratings"
            options={["Ratings", "5 stars", "4 stars", "3 stars"]}
            value={filters.ratings}
            onValueChange={(value) => setFilters((prev) => ({ ...prev, ratings: value }))}
          />
          <FilterDropdown
            label="Date"
            options={["Date", "Today", "This week", "This month"]}
            value={filters.date}
            onValueChange={(value) => setFilters((prev) => ({ ...prev, date: value }))}
          />
        </div>
        <div className="w-full xl:max-w-[280px]">
          <Input
            density="compact"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search reviews"
            leftIcon={<EventIcon name="search-line" size={EVENT_ICON_SIZE.search} />}
            aria-label="Search reviews"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border-default-100 bg-bg-canvas">
        {rows.length === 0 && !loading ? (
          <DataTableEmptyState
            title="No review yet"
            description="Once a volunteer drops a review, it would appear here."
          />
        ) : (
          <Table contained={false}>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="min-w-[220px] pl-4">Volunteer</TableHead>
                <TableHead className="w-[130px]">Rating</TableHead>
                <TableHead className="min-w-[220px]">Review</TableHead>
                <TableHead className="w-[150px]">Date</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <DetailTableSkeleton
                  cells={["avatar", "h-3.5 w-24", "h-3 w-48", "h-3 w-20", "ml-auto size-4"]}
                />
              ) : (
                rows.map((row) => (
                <TableRow key={row.id} className="cursor-pointer" onClick={() => setDetail(row)}>
                  <TableCell className="pl-4">
                    <div className="flex items-center gap-3">
                      <PersonAvatar name={row.name} tone={row.avatarTone} imageUrl={row.avatarImage || undefined} size={36} />
                      <span className="flex min-w-0 flex-col">
                        <span className="type-table-cell-primary truncate">{row.name}</span>
                        <span className="type-table-cell-secondary truncate">
                          {row.name.toLowerCase().replace(/\s+/g, ".")}@email.com
                        </span>
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StarRating rating={row.rating} />
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "block max-w-[260px] truncate",
                        row.comment ? "type-table-cell-primary" : "type-table-cell-secondary",
                      )}
                    >
                      {row.comment || "No review"}
                    </span>
                  </TableCell>
                  <TableCell className="type-table-cell-secondary">{row.date}</TableCell>
                  <TableCell className="pr-4 text-right">
                    <EventIcon name="arrow-right-fill" size={EVENT_ICON_SIZE.meta} className="inline text-icon-neutral" />
                  </TableCell>
                </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}

        {rows.length > 0 && !loading ? (
          <DataTablePagination
            className="border-t border-border-default-100"
            from={1}
            to={rows.length}
            total={rows.length}
            page={1}
            pageSize={10}
            totalPages={1}
            pageSizeOptions={[10, 25, 50]}
            onPageChange={() => {}}
            onPageSizeChange={() => {}}
          />
        ) : null}
      </div>

      <ReviewDetailsModal review={detail} onClose={() => setDetail(null)} />
    </div>
  )
}
