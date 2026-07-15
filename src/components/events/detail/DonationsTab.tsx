import { useState } from "react"
import { CreditCard, Landmark, Search } from "lucide-react"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table"
import { DataTableEmptyState, FilterDropdown, RowActionsDropdown } from "../../data-table"
import type { RowActionConfig } from "../../data-table"
import { toast } from "../../../hooks/use-toast"
import type { DonationsData } from "../../../pages/dashboard/event-detail-types"
import { PersonAvatar } from "./PersonAvatar"
import { WithdrawModal } from "./WithdrawModal"
import { DetailTableSkeleton } from "./DetailTableSkeleton"
import { useSimulatedLoading } from "../../../hooks/use-simulated-loading"

const ROW_ACTIONS: RowActionConfig[] = [{ id: "view", label: "View details", icon: "eye" }]

const CHANNEL_LABEL = {
  card: { label: "Card", icon: CreditCard },
  "bank-transfer": { label: "Bank transfer", icon: Landmark },
} as const

export function DonationsTab({ data }: { data: DonationsData }) {
  const [search, setSearch] = useState("")
  const [withdrawOpen, setWithdrawOpen] = useState(false)
  const [filters, setFilters] = useState({ amount: "Amount donated", channel: "Channel", date: "Date" })
  const loading = useSimulatedLoading()

  const isFiltered =
    Boolean(search.trim()) ||
    filters.amount !== "Amount donated" ||
    filters.channel !== "Channel" ||
    filters.date !== "Date"

  const clearFilters = () => {
    setSearch("")
    setFilters({ amount: "Amount donated", channel: "Channel", date: "Date" })
  }

  const query = search.trim().toLowerCase()
  const inAmountBucket = (amount: string) => {
    const v = Number(amount.replace(/[₦,]/g, ""))
    switch (filters.amount) {
      case "Under ₦5,000":
        return v < 5000
      case "₦5,000 to ₦20,000":
        return v >= 5000 && v <= 20000
      case "₦20,000 to ₦50,000":
        return v > 20000 && v <= 50000
      case "Above ₦50,000":
        return v > 50000
      default:
        return true
    }
  }
  const rows = data.rows.filter((row) => {
    if (filters.channel !== "Channel" && CHANNEL_LABEL[row.channel].label !== filters.channel) {
      return false
    }
    if (!inAmountBucket(row.amount)) return false
    if (query && ![row.id, row.donor, row.channel].join(" ").toLowerCase().includes(query)) {
      return false
    }
    return true
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="flex flex-1 flex-col gap-2 rounded-2xl border border-border-default-100 bg-bg-canvas p-4">
          <span className="text-sm font-[510] leading-[22px] text-text-table-header">Donation goal</span>
          <span className="font-display text-2xl font-semibold leading-8 text-text-events-strong">
            {data.goal}
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-3 rounded-2xl border border-border-default-100 bg-bg-canvas p-4">
          <span className="text-sm font-[510] leading-[22px] text-text-table-header">Donation progress</span>
          <div className="flex flex-col gap-1.5">
            <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-bg-default-100">
              <div
                className="h-full rounded-full bg-bg-accent"
                style={{
                  width: `${Math.min(100, Math.round((data.raisedValue / data.goalValue) * 100))}%`,
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-[510] leading-5 text-text-events-strong">{data.raised}</span>
              <span className="text-xs leading-5 text-text-table-header">of {data.goal}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2 rounded-2xl border border-border-default-100 bg-bg-canvas p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-[510] leading-[22px] text-text-table-header">
                Available for withdrawal
              </span>
              <span className="font-display text-2xl font-semibold leading-8 text-text-events-strong">
                {data.availableForWithdrawal}
              </span>
            </div>
            <Button
              variant="primary"
              size="sm"
              className="rounded-[10px]"
              onClick={() => setWithdrawOpen(true)}
            >
              Withdraw
            </Button>
          </div>
          <span className="text-xs leading-5 text-text-table-header">
            Amount withdrawn: {data.amountWithdrawn}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <FilterDropdown
            label="Amount donated"
            options={[
              "Amount donated",
              "Under ₦5,000",
              "₦5,000 to ₦20,000",
              "₦20,000 to ₦50,000",
              "Above ₦50,000",
            ]}
            value={filters.amount}
            onValueChange={(value) => setFilters((prev) => ({ ...prev, amount: value }))}
          />
          <FilterDropdown
            label="Channel"
            options={["Channel", "Card", "Bank transfer"]}
            value={filters.channel}
            onValueChange={(value) => setFilters((prev) => ({ ...prev, channel: value }))}
          />
          <FilterDropdown
            label="Date"
            options={["Date", "Today", "This week", "This month"]}
            value={filters.date}
            onValueChange={(value) => setFilters((prev) => ({ ...prev, date: value }))}
          />
          {isFiltered ? (
            <button
              type="button"
              onClick={clearFilters}
              className="cursor-pointer px-1 text-sm font-[510] text-bg-accent hover:underline"
            >
              Clear filters
            </button>
          ) : null}
        </div>
        <div className="w-full xl:max-w-[280px]">
          <Input
            density="compact"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search donation"
            leftIcon={<Search className="size-4" />}
            aria-label="Search donation"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border-default-100 bg-bg-canvas">
        {rows.length === 0 && !loading ? (
          <DataTableEmptyState
            title={isFiltered ? "No result found" : "No donations yet"}
            description={
              isFiltered
                ? "We couldn't find any result based on the filter."
                : "Once there are donations, they would appear here."
            }
          />
        ) : (
          <Table contained={false}>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="min-w-[110px] pl-4">Donation id</TableHead>
                <TableHead className="min-w-[200px]">Donor</TableHead>
                <TableHead className="min-w-[150px]">Channel</TableHead>
                <TableHead className="w-[140px]">Amount donated</TableHead>
                <TableHead className="w-[160px]">Date</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <DetailTableSkeleton
                  cells={[
                    "h-3 w-16",
                    "avatar",
                    "h-3 w-24",
                    "h-3 w-20",
                    "h-3 w-24",
                    "ml-auto size-8 rounded-full",
                  ]}
                />
              ) : (
                rows.map((row) => {
                const channel = CHANNEL_LABEL[row.channel]
                const ChannelIcon = channel.icon
                return (
                  <TableRow key={row.id}>
                    <TableCell className="pl-4 font-[510] text-text-events-strong">{row.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <PersonAvatar name={row.donor} tone={row.avatarTone} size={28} />
                        <span className="text-sm font-[510] leading-[22px] text-text-events-strong">
                          {row.donor}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1.5 text-text-table-header">
                        <ChannelIcon className="size-4" />
                        {channel.label}
                      </span>
                    </TableCell>
                    <TableCell className="font-[510] text-text-events-strong">{row.amount}</TableCell>
                    <TableCell className="text-text-table-header">{row.date}</TableCell>
                    <TableCell className="pr-4 text-right">
                      <RowActionsDropdown
                        actions={ROW_ACTIONS}
                        onAction={() => toast({ title: "Coming soon", description: "Donation details will be available after API integration." })}
                      />
                    </TableCell>
                  </TableRow>
                )
                })
              )}
            </TableBody>
          </Table>
        )}

        {rows.length > 0 && !loading ? (
          <div className="flex flex-col gap-2 border-t border-border-default-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="type-table-cell-secondary">Showing 1 to {rows.length} of {rows.length}</p>
            <p className="type-pagination">10 per page</p>
          </div>
        ) : null}
      </div>

      <WithdrawModal open={withdrawOpen} onClose={() => setWithdrawOpen(false)} donations={data} />
    </div>
  )
}
