import { useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { ChevronRight, Search } from "lucide-react"
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
import { isDateInRange, type ResolvedDateRange } from "../../lib/event-date-filters"
import { toast } from "../../hooks/use-toast"
import { cn } from "../../lib/utils"
import {
  VERIFICATION_ROWS,
  VERIFICATION_STATUS_LABELS,
  VERIFICATION_TOTALS,
  type VerificationRow,
  type VerificationStatus,
} from "./verification-data"

const STATUS_TONE: Record<VerificationStatus, string> = {
  "requires-action": "bg-bg-info-soft text-text-info",
  incomplete: "bg-bg-default-100 text-text-table-header",
  "in-review": "bg-bg-warning-soft text-text-warning",
  verified: "bg-bg-success-soft text-text-success",
  rejected: "bg-bg-negative-soft text-text-negative",
}

function StatusBadge({ status }: { status: VerificationStatus }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-lg px-2 text-xs font-[510] leading-4",
        STATUS_TONE[status],
      )}
    >
      {VERIFICATION_STATUS_LABELS[status]}
    </span>
  )
}

function OverviewCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-1 flex-col gap-2 rounded-2xl border border-border-default-100 bg-bg-canvas p-4">
      <span className="text-sm leading-[22px] text-text-table-header">{label}</span>
      <span className="font-display text-2xl font-semibold leading-8 text-text-events-strong">
        {value}
      </span>
    </div>
  )
}

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

  return (
    <DashboardLayout activeTab="verification">
      <DashboardWideContent flushBottom className="flex flex-col gap-6">
        <h1 className="font-display text-2xl font-semibold leading-8 tracking-[-0.2px] text-text-default-500">
          Verification
        </h1>

        <div className="flex flex-col gap-4 sm:flex-row">
          <OverviewCard label="Total verifications" value={totals.total} />
          <OverviewCard label="Ongoing verifications" value={totals.ongoing} />
          <OverviewCard label="Verified" value={totals.verified} />
        </div>

        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <MultiSelectFilter
              label="Status"
              options={STATUS_OPTIONS}
              values={statusFilters}
              onValuesChange={(values) => {
                setStatusFilters(values)
                setPage(1)
              }}
            />
            <DateRangeFilter
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
              leftIcon={<Search className="size-4" />}
              aria-label="Search verifications"
            />
          </div>
        </div>

        <div className="rounded-xl border border-border-default-100 bg-bg-canvas">
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
                <TableHead className="w-10">
                  <Checkbox
                    size="sm"
                    checked={allPagedSelected ? true : pagedSelected > 0 ? "indeterminate" : false}
                    onCheckedChange={toggleAll}
                    disabled={paged.length === 0}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last updated</TableHead>
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
                paged.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={selectedIds.has(row.id) ? "selected" : undefined}
                    className="cursor-pointer"
                    onClick={() =>
                      toast({
                        title: "Coming soon",
                        description: "Verification details will be available after API integration.",
                      })
                    }
                  >
                    <TableCell onClick={(event) => event.stopPropagation()}>
                      <Checkbox
                        size="sm"
                        checked={selectedIds.has(row.id)}
                        onCheckedChange={() => toggleOne(row.id)}
                        aria-label={`Select ${row.title}`}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="type-table-cell-primary">{row.title}</span>
                        <span className="type-table-cell-secondary">{row.subtitle}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={row.status} />
                    </TableCell>
                    <TableCell className="type-table-cell-primary">{row.lastUpdated}</TableCell>
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
      </DashboardWideContent>
    </DashboardLayout>
  )
}
