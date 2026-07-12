import { useMemo, useState } from "react"
import {
  Check,
  CircleCheck,
  Clock,
  Eye,
  Flag,
  MessageSquare,
  MoreHorizontal,
  Search,
  Truck,
} from "lucide-react"
import { DataTableEmptyState, DataTablePagination, FilterDropdown } from "../../data-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu"
import { Input } from "../../ui/input"
import { Button } from "../../ui/button"
import { PersonAvatar } from "./PersonAvatar"
import { TableCell, TableHead, TableRow } from "../../ui/table"
import { cn } from "../../../lib/utils"
import type {
  InKindDonationRow,
  InKindDonationStatus,
  NeedsInKindData,
} from "../../../pages/dashboard/event-detail-types"

const STATUS_CONFIG: Record<
  InKindDonationStatus,
  { label: string; icon: typeof Truck; className: string }
> = {
  "in-transit": { label: "In transit", icon: Truck, className: "bg-bg-accent-soft text-[#b25e09]" },
  pledged: { label: "Pledged", icon: Clock, className: "bg-bg-accent-soft text-[#b25e09]" },
  confirmed: { label: "Confirmed", icon: CircleCheck, className: "bg-[#e7f7ed] text-[#2f9e57]" },
  flagged: { label: "Flagged", icon: Flag, className: "bg-[#fdeaed] text-[#c8324b]" },
}

export function InKindStatusTag({ status }: { status: InKindDonationStatus }) {
  const { label, icon: Icon, className } = STATUS_CONFIG[status]
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1 rounded-lg px-2 text-xs font-[510] leading-4",
        className,
      )}
    >
      <Icon className="size-3" />
      {label}
    </span>
  )
}

function StatCard({
  label,
  children,
  badge,
}: {
  label: string
  children: React.ReactNode
  badge?: string
}) {
  return (
    <div className="flex flex-1 flex-col gap-2 rounded-2xl border border-border-default-100 bg-bg-canvas p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm leading-[22px] text-text-table-header">{label}</span>
        {badge ? (
          <span className="rounded-md bg-bg-default-100 px-1.5 py-0.5 text-[11px] font-medium text-text-table-header">
            {badge}
          </span>
        ) : null}
      </div>
      {children}
    </div>
  )
}

const HEADER_CELL = "h-11 border-b border-border-default-100 bg-bg-on-canvas py-0 type-events-table-head"
const PAGE_SIZE = 10

export function NeedsInKindDonationsTab({
  data,
  onViewDetails,
  onConfirmReceipt,
  onMessageDonor,
}: {
  data: NeedsInKindData
  onViewDetails: (row: InKindDonationRow) => void
  onConfirmReceipt: (row: InKindDonationRow) => void
  onMessageDonor: (row: InKindDonationRow) => void
}) {
  const [status, setStatus] = useState("All status")
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return data.rows.filter((row) => {
      if (status !== "All status" && STATUS_CONFIG[row.status].label !== status) return false
      if (q && !`${row.donor} ${row.id}`.toLowerCase().includes(q)) return false
      return true
    })
  }, [data.rows, status, query])

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
  const progress = data.totalItems > 0 ? Math.min(100, (data.itemsReceived / data.totalItems) * 100) : 0

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <StatCard label="Total items required" badge={data.itemsLeft < data.totalItems ? `${data.itemsLeft} items left` : undefined}>
          <span className="font-display text-2xl font-semibold leading-8 text-text-events-strong">
            {data.totalItems}
          </span>
        </StatCard>
        <StatCard label="Donors">
          <span className="font-display text-2xl font-semibold leading-8 text-text-events-strong">
            {data.donorsCount}
          </span>
        </StatCard>
        <StatCard label="Donation progress">
          <div className="mt-1 flex flex-col gap-1.5">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-default-100">
              <div className="h-full rounded-full bg-bg-accent" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex justify-between text-xs leading-5 text-text-table-header">
              <span>0</span>
              <span>{data.totalItems} items</span>
            </div>
          </div>
        </StatCard>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <FilterDropdown
            label="Status"
            options={["All status", "In transit", "Pledged", "Confirmed", "Flagged"]}
            value={status}
            onValueChange={(value) => {
              setStatus(value)
              setPage(1)
            }}
          />
          <FilterDropdown label="Date" options={["Any date", "Today", "This week", "This month"]} value="Any date" />
        </div>
        <div className="w-full sm:max-w-[280px]">
          <Input
            density="compact"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setPage(1)
            }}
            placeholder="Search"
            leftIcon={<Search className="size-4" />}
            aria-label="Search donations"
          />
        </div>
      </div>

      <div className="rounded-xl border border-border-default-100 bg-bg-canvas">
        <div className="w-full overflow-x-auto">
          <div style={{ minWidth: 820 }}>
            <table className="w-full table-fixed border-separate border-spacing-0 caption-bottom text-sm">
              <colgroup>
                <col style={{ width: "3rem" }} />
                <col style={{ width: "16%" }} />
                <col style={{ width: "24%" }} />
                <col style={{ width: "16%" }} />
                <col style={{ width: "16%" }} />
                <col style={{ width: "20%" }} />
                <col style={{ width: "3rem" }} />
              </colgroup>
              <thead>
                <tr>
                  <TableHead className={cn("w-10", HEADER_CELL)} />
                  <TableHead className={HEADER_CELL}>Donation id</TableHead>
                  <TableHead className={HEADER_CELL}>Donor</TableHead>
                  <TableHead className={HEADER_CELL}>Number of items</TableHead>
                  <TableHead className={HEADER_CELL}>Status</TableHead>
                  <TableHead className={HEADER_CELL}>Date</TableHead>
                  <TableHead className={cn("w-12", HEADER_CELL)} />
                </tr>
              </thead>
              <tbody>
                {paged.length === 0 ? (
                  <tr className="hover:bg-transparent">
                    <TableCell colSpan={7} className="p-0">
                      <DataTableEmptyState
                        title="No donations yet"
                        description="Once there are donations, they would appear here"
                      />
                    </TableCell>
                  </tr>
                ) : (
                  paged.map((row, index) => (
                    <TableRow
                      key={`${row.id}-${index}`}
                      className="cursor-pointer"
                      onClick={() => onViewDetails(row)}
                    >
                      <TableCell />
                      <TableCell className="type-table-cell-secondary">{row.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <PersonAvatar name={row.donor} tone={row.avatarTone} size={28} />
                          <span className="type-table-cell-primary truncate">{row.donor}</span>
                        </div>
                      </TableCell>
                      <TableCell className="type-table-cell-primary">{row.itemsCount}</TableCell>
                      <TableCell>
                        <InKindStatusTag status={row.status} />
                      </TableCell>
                      <TableCell className="type-table-cell-secondary">{row.date}</TableCell>
                      <TableCell className="text-right" onClick={(event) => event.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="neutral"
                              className="size-8 min-h-8 rounded-full border-0 bg-transparent p-0 shadow-none hover:bg-bg-default-100"
                              aria-label="Row actions"
                            >
                              <MoreHorizontal className="size-4 text-icon-neutral" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="min-w-[11rem]">
                            <DropdownMenuItem onSelect={() => onViewDetails(row)}>
                              <Eye className="size-4 text-icon-neutral" />
                              View details
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => onMessageDonor(row)}>
                              <MessageSquare className="size-4 text-icon-neutral" />
                              Message donor
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => onConfirmReceipt(row)}>
                              <Check className="size-4 text-icon-neutral" />
                              Confirm receipt
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {total > 0 ? (
          <DataTablePagination
            className="border-t border-border-default-100 px-4 pb-4"
            from={(safePage - 1) * PAGE_SIZE + 1}
            to={Math.min(safePage * PAGE_SIZE, total)}
            total={total}
            page={safePage}
            pageSize={PAGE_SIZE}
            totalPages={totalPages}
            pageSizeOptions={[10, 20, 50]}
            onPageChange={setPage}
            onPageSizeChange={() => {}}
          />
        ) : null}
      </div>
    </div>
  )
}
