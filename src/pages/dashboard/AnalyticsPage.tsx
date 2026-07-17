import { useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { CalendarDays, ChevronDown, FileDown, Sparkles, Star } from "lucide-react"
import { DashboardLayout, DashboardWideContent } from "../../components/dashboard/DashboardLayout"
import { FilterDropdown, DataTablePagination } from "../../components/data-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover"
import {
  ChartCard,
  ChartLegend,
  LineChart,
  NigeriaDotMap,
  PieChart,
  PieLegend,
  SkillBars,
} from "../../components/analytics/charts"
import { ExportReportModal } from "../../components/analytics/ExportReportModal"
import { downloadImpactReport } from "../../lib/impact-report"
import { toast } from "../../hooks/use-toast"
import { cn } from "../../lib/utils"
import {
  AGE_RANGE,
  CHART_BLUE,
  CHART_ORANGE,
  CHART_X_END,
  CHART_X_START,
  DONATION_STATS,
  DONOR_COMPARISON,
  EVENT_ACTIVITY_DONATIONS,
  EVENT_ACTIVITY_VOLUNTEERS,
  EVENT_DONATIONS,
  GENDER,
  OVERVIEW_STATS,
  TOP_SKILLS,
  VOLUNTEER_GROWTH,
  VOLUNTEER_STATS,
  type AnalyticsTab,
  type StatCard,
} from "./analytics-data"

const TABS: { id: AnalyticsTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "donations", label: "Donations" },
  { id: "volunteers", label: "Volunteers" },
]

const DATE_OPTIONS = ["This month", "Last month", "Last 3 months", "This year", "All time"]

function pctOf(slices: { value: number }[], index: number) {
  const total = slices.reduce((sum, s) => sum + s.value, 0)
  return total > 0 ? `${Math.round((slices[index].value / total) * 100)}%` : "0%"
}

function StatCardView({ card, empty }: { card: StatCard; empty: boolean }) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-border-default-100 bg-bg-canvas p-4">
      <span className="text-sm leading-[22px] text-text-table-header">{card.label}</span>
      <span className="flex items-center gap-1.5 font-display text-2xl font-semibold leading-8 text-text-events-strong">
        {empty ? "—" : card.value}
        {!empty && card.star ? <Star className="size-5 fill-[#f79e19] text-[#f79e19]" /> : null}
      </span>
      <span className="text-sm leading-[22px]">
        <span
          className={cn(
            "font-medium",
            empty ? "text-text-table-header" : card.trend === "up" ? "text-text-success" : "text-text-negative",
          )}
        >
          {empty ? "0.0%" : card.delta}
        </span>{" "}
        <span className="text-text-table-header">from last 30 days</span>
      </span>
    </div>
  )
}

function StatGrid({ cards, empty }: { cards: StatCard[]; empty: boolean }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <StatCardView key={card.label} card={card} empty={empty} />
      ))}
    </div>
  )
}

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="flex h-[300px] items-center justify-center text-sm text-text-table-header">{label}</div>
  )
}

export function AnalyticsPage() {
  const [searchParams] = useSearchParams()
  const isEmpty = searchParams.get("scenario") === "empty"

  const [tab, setTab] = useState<AnalyticsTab>("overview")
  const [dateLabel, setDateLabel] = useState("This month")
  const [demographic, setDemographic] = useState("Volunteers")
  const [sortBy, setSortBy] = useState("Amount raised")
  const [exportOpen, setExportOpen] = useState(false)

  // Event donations table
  const [page, setPage] = useState(1)
  const pageSize = 10
  const rows = useMemo(() => (isEmpty ? [] : EVENT_DONATIONS), [isEmpty])
  const total = rows.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(page, totalPages)
  const paged = useMemo(
    () => rows.slice((safePage - 1) * pageSize, safePage * pageSize),
    [rows, safePage],
  )

  return (
    <DashboardLayout activeTab="analytics">
      <DashboardWideContent flushBottom className="flex flex-col gap-6 pb-10">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-display text-2xl font-semibold leading-8 tracking-[-0.2px] text-text-default-500">
            Analytics
          </h1>
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger className="type-events-filter inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-border-input-default-200 bg-input-surface px-3 shadow-input-default outline-none hover:bg-bg-on-canvas data-[state=open]:border-border-input-active">
                <CalendarDays className="size-4 text-icon-neutral" />
                <span>{dateLabel}</span>
                <ChevronDown className="size-4 text-icon-neutral" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[11rem]">
                {DATE_OPTIONS.map((option) => (
                  <DropdownMenuItem
                    key={option}
                    className={cn("cursor-pointer", option === dateLabel && "bg-bg-accent-soft font-medium text-bg-accent")}
                    onSelect={() => setDateLabel(option)}
                  >
                    {option}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <button
              type="button"
              onClick={() => setExportOpen(true)}
              className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg bg-button-primary px-3.5 text-sm font-semibold text-text-on-solid-bg shadow-button-primary transition-opacity hover:opacity-90"
            >
              <FileDown className="size-4" />
              Download impact report
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-border-default-100">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={cn(
                "type-events-tab relative cursor-pointer pb-3",
                tab === item.id
                  ? "text-text-events-strong after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:rounded-full after:bg-bg-accent"
                  : "text-text-table-header hover:text-text-neutral-400",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        {tab === "overview" ? (
          <>
            <StatGrid cards={OVERVIEW_STATS} empty={isEmpty} />
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <ChartCard
                title="Event Activity"
                legend={
                  <ChartLegend
                    items={[
                      { label: "Donations", color: CHART_BLUE },
                      { label: "New volunteers", color: CHART_ORANGE },
                    ]}
                  />
                }
              >
                {isEmpty ? (
                  <EmptyChart label="No data yet" />
                ) : (
                  <LineChart
                    height={300}
                    xStart={CHART_X_START}
                    xEnd={CHART_X_END}
                    series={[
                      { label: "Donations", color: CHART_BLUE, data: EVENT_ACTIVITY_DONATIONS },
                      { label: "New volunteers", color: CHART_ORANGE, data: EVENT_ACTIVITY_VOLUNTEERS },
                    ]}
                  />
                )}
              </ChartCard>

              <ChartCard
                title="Demographics"
                action={
                  <FilterDropdown
                    label="Volunteers"
                    options={["Volunteers", "Donations", "Events", "Cash raised", "Reviews"]}
                    value={demographic}
                    onValueChange={setDemographic}
                  />
                }
              >
                {isEmpty ? <EmptyChart label="No data yet" /> : <NigeriaDotMap height={300} />}
              </ChartCard>
            </div>
          </>
        ) : null}

        {tab === "donations" ? (
          <>
            <StatGrid cards={DONATION_STATS} empty={isEmpty} />
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <div className="flex flex-col rounded-2xl border border-border-default-100 bg-bg-canvas">
                <div className="flex items-center justify-between gap-3 p-4">
                  <h3 className="font-display text-lg font-semibold leading-6 text-text-events-strong">
                    Event donations
                  </h3>
                  <FilterDropdown
                    label="Amount raised"
                    options={["Amount raised", "No. of donors", "Average donation"]}
                    value={sortBy}
                    onValueChange={setSortBy}
                  />
                </div>
                <Table contained={false} className="w-full">
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Event</TableHead>
                      <TableHead>Total raised</TableHead>
                      <TableHead>No. of donors</TableHead>
                      <TableHead>Average donation</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paged.length === 0 ? (
                      <TableRow className="hover:bg-transparent">
                        <TableCell colSpan={4} className="py-16 text-center text-sm text-text-table-header">
                          No data yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      paged.map((row, index) => (
                        <TableRow key={index} className="hover:bg-transparent">
                          <TableCell className="max-w-[200px] truncate type-table-cell-primary">
                            {row.event}
                          </TableCell>
                          <TableCell className="type-table-cell-primary">{row.totalRaised}</TableCell>
                          <TableCell className="type-table-cell-primary">{row.donors}</TableCell>
                          <TableCell className="type-table-cell-primary">{row.averageDonation}</TableCell>
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
                    onPageChange={setPage}
                  />
                ) : null}
              </div>

              <ChartCard
                title="Donor comparison"
                legend={
                  <ChartLegend
                    items={[
                      { label: "New donor", color: CHART_BLUE, value: pctOf(DONOR_COMPARISON, 0) },
                      { label: "Returning donor", color: CHART_ORANGE, value: pctOf(DONOR_COMPARISON, 1) },
                    ]}
                  />
                }
              >
                {isEmpty ? (
                  <EmptyChart label="No data yet" />
                ) : (
                  <div className="flex flex-1 items-center justify-center py-4">
                    <PieChart slices={DONOR_COMPARISON} size={260} />
                  </div>
                )}
              </ChartCard>
            </div>
          </>
        ) : null}

        {tab === "volunteers" ? (
          <>
            <StatGrid cards={VOLUNTEER_STATS} empty={isEmpty} />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <ChartCard title="Age range" legend={null}>
                {isEmpty ? (
                  <EmptyChart label="No data yet" />
                ) : (
                  <div className="flex flex-1 flex-col items-center justify-center gap-5">
                    <PieChart slices={AGE_RANGE} size={200} />
                    <PieLegend slices={AGE_RANGE} />
                  </div>
                )}
              </ChartCard>

              <ChartCard title="Gender" legend={null}>
                {isEmpty ? (
                  <EmptyChart label="No data yet" />
                ) : (
                  <div className="flex flex-1 flex-col items-center justify-center gap-5">
                    <PieChart slices={GENDER} size={200} />
                    <PieLegend slices={GENDER} />
                  </div>
                )}
              </ChartCard>

              <ChartCard
                title="Top 5 skills"
                action={
                  <Popover>
                    <PopoverTrigger className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-border-default-100 bg-bg-canvas px-2.5 text-sm font-medium text-text-events-strong outline-none hover:bg-bg-default-100 data-[state=open]:border-border-input-active">
                      <Sparkles className="size-4 text-bg-accent" />
                      Insights
                    </PopoverTrigger>
                    <PopoverContent
                      align="end"
                      className="max-w-[220px] rounded-xl bg-[#2c3237] px-3 py-2 text-xs leading-5 text-white shadow-lg"
                    >
                      40% of volunteers selected Teaching as a skill.
                    </PopoverContent>
                  </Popover>
                }
              >
                {isEmpty ? <EmptyChart label="No data yet" /> : <SkillBars rows={TOP_SKILLS} />}
              </ChartCard>
            </div>

            <ChartCard
              title="Volunteer growth"
              legend={<span className="text-sm font-medium text-text-success">+8.6%</span>}
            >
              {isEmpty ? (
                <EmptyChart label="No data yet" />
              ) : (
                <LineChart
                  height={320}
                  xStart={CHART_X_START}
                  xEnd={CHART_X_END}
                  series={[{ label: "New volunteers", color: CHART_BLUE, data: VOLUNTEER_GROWTH }]}
                />
              )}
            </ChartCard>
          </>
        ) : null}
      </DashboardWideContent>

      <ExportReportModal
        key={exportOpen ? "open" : "closed"}
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        onExport={(type) => {
          setExportOpen(false)
          downloadImpactReport(type)
          toast({ variant: "success", title: type === "pdf" ? "Preparing PDF report" : "Report exported" })
        }}
      />
    </DashboardLayout>
  )
}
