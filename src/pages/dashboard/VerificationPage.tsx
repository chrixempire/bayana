import { useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { cn } from "../../lib/utils"
import { DashboardLayout, DashboardWideContent } from "../../components/dashboard/DashboardLayout"
import {
  DataTableEmptyState,
  DataTablePagination,
  DateRangeFilter,
  MultiSelectFilter,
} from "../../components/data-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Checkbox } from "../../components/ui/checkbox"
import { Input } from "../../components/ui/input"
import { elevatedCardSurfaceClassName, OverviewCard } from "../../components/events/detail/detail-primitives"
import { EventIcon } from "../../components/events/icons/EventIcon"
import { EVENT_ICON_SIZE } from "../../components/events/icons/event-icon-sizes"
import {
  VerificationStatusTag,
  verificationRowShowsNavArrow,
} from "../../components/verification/VerificationStatusTag"
import { isDateInRange, type ResolvedDateRange } from "../../lib/event-date-filters"
import { toast } from "../../hooks/use-toast"
import {
  VERIFICATION_ROWS,
  VERIFICATION_STATUS_LABELS,
  VERIFICATION_TOTALS,
  type VerificationRow,
} from "./verification-data"

const STATUS_OPTIONS = ["Requires action", "Incomplete", "In review", "Verified", "Rejected"]

export function VerificationPage() {
  const [searchParams] = useSearchParams()
  const isEmpty = searchParams.get("scenario") === "empty"

  const [rows] = useState<VerificationRow[]>(isEmpty ? [] : VERIFICATION_ROWS)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [statusFilters, setStatusFilters] = useState<string[]>([])
  const [dateLabel, setDateLabel] = useState("Any date")
  const [dateRange, setDateRange] = useState<ResolvedDateRange | null>(null)
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const totals = isEmpty ? { total: 0, ongoing: 0, verified: 0 } : VERIFICATION_TOTALS

  const filtersActive =
    statusFilters.length > 0 || Boolean(dateRange) || query.trim().length > 0

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows.filter((row) => {
      if (statusFilters.length && !statusFilters.includes(VERIFICATION_STATUS_LABELS[row.status])) {
        return false
      }
      if (!isDateInRange(row.lastUpdatedIso, dateRange)) return false
      if (q && !`${row.title} ${row.subtitle}`.toLowerCase().includes(q)) return false
      return true
    })
  }, [rows, statusFilters, dateRange, query])

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
    : { title: "No verification yet", description: "Verification requests will appear here" }

  const openRow = (row: VerificationRow) => {
    if (!verificationRowShowsNavArrow(row.status)) return
    toast({
      title: "Coming soon",
      description: "Verification details will be available after API integration.",
    })
  }

  return (
    <DashboardLayout activeTab="verification">
      <DashboardWideContent flushBottom className="flex flex-col gap-6">
        <h1 className="font-display text-2xl font-semibold leading-8 tracking-[-0.2px] text-text-default-500">
          Verification
        </h1>

        <div className="flex flex-col gap-4 sm:flex-row">
          <OverviewCard label="Total verifications" value={String(totals.total)} />
          <OverviewCard label="Ongoing verifications" value={String(totals.ongoing)} />
          <OverviewCard label="Verified" value={String(totals.verified)} />
        </div>

        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <MultiSelectFilter
              appearance="events"
              label="Status"
              options={STATUS_OPTIONS}
              values={statusFilters}
              onValuesChange={(values) => {
                setStatusFilters(values)
                setPage(1)
              }}
            />
            <DateRangeFilter
              appearance="events"
              label="Last updated"
              options={["Any date", "Today", "This week", "This month", "Custom range"]}
              value={dateLabel}
              onChange={(label, range) => {
                setDateLabel(label)
                setDateRange(range)
                setPage(1)
              }}
            />
          </div>
          <div className="w-full xl:max-w-[400px]">
            <Input
              density="compact"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setPage(1)
              }}
              placeholder="Search verifications"
              leftIcon={<EventIcon name="search-line" size={EVENT_ICON_SIZE.search} />}
              aria-label="Search verifications"
              className="h-8 min-h-8 rounded-[10px] border-0 bg-bg-default-100 px-3 shadow-none"
            />
          </div>
        </div>

        <div className={cn(elevatedCardSurfaceClassName, "overflow-hidden")}>
          <Table contained={false} className="w-full table-fixed">
            <colgroup>
              <col style={{ width: "3rem" }} />
              <col style={{ width: "auto" }} />
              <col style={{ width: "22%" }} />
              <col style={{ width: "22%" }} />
              <col style={{ width: "3rem" }} />
            </colgroup>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-10 pl-4">
                  <Checkbox
                    size="sm"
                    checked={allPagedSelected ? true : pagedSelected > 0 ? "indeterminate" : false}
                    onCheckedChange={toggleAll}
                    disabled={paged.length === 0}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead className="min-w-[240px]">Verification</TableHead>
                <TableHead className="min-w-[140px]">Status</TableHead>
                <TableHead className="min-w-[160px]">Last updated</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={5} className="p-0">
                    <DataTableEmptyState title={emptyState.title} description={emptyState.description} />
                  </TableCell>
                </TableRow>
              ) : (
                paged.map((row) => {
                  const showArrow = verificationRowShowsNavArrow(row.status)
                  return (
                    <TableRow
                      key={row.id}
                      data-state={selectedIds.has(row.id) ? "selected" : undefined}
                      className={cn(showArrow && "cursor-pointer")}
                      onClick={() => openRow(row)}
                    >
                      <TableCell className="pl-4" onClick={(event) => event.stopPropagation()}>
                        <Checkbox
                          size="sm"
                          checked={selectedIds.has(row.id)}
                          onCheckedChange={() => toggleOne(row.id)}
                          aria-label={`Select ${row.title}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex min-w-0 flex-col gap-1">
                          <span className="truncate text-sm font-[510] leading-[22px] text-text-events-strong">
                            {row.title}
                          </span>
                          <span className="truncate text-sm font-normal leading-[22px] tracking-[-0.1px] text-text-table-header">
                            {row.subtitle}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <VerificationStatusTag status={row.status} />
                      </TableCell>
                      <TableCell className="text-sm font-[510] leading-[22px] text-text-events-strong">
                        {row.lastUpdated}
                      </TableCell>
                      <TableCell className="pr-4 text-right">
                        <span
                          className={cn(
                            "inline-flex size-8 items-center justify-center",
                            !showArrow && "invisible",
                          )}
                          aria-hidden={!showArrow}
                        >
                          <EventIcon name="arrow-right-fill" size={EVENT_ICON_SIZE.tableMore} />
                        </span>
                      </TableCell>
                    </TableRow>
                  )
                })
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
      </DashboardWideContent>
    </DashboardLayout>
  )
}
