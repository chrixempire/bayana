import { useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { DashboardLayout, DashboardWideContent } from "../../components/dashboard/DashboardLayout"
import { AnalyticsStatCard } from "../../components/analytics/AnalyticsStatCard"
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
import { EventIcon } from "../../components/events/icons/EventIcon"
import { EVENT_ICON_SIZE } from "../../components/events/icons/event-icon-sizes"
import { elevatedCardSurfaceClassName } from "../../components/events/detail/detail-primitives"
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

function StatGrid({ cards, empty }: { cards: StatCard[]; empty: boolean }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <AnalyticsStatCard key={card.label} card={card} empty={empty} />
      ))}
    </div>
  )
}

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="flex h-[300px] items-center justify-center text-sm leading-[22px] text-text-table-header">
      {label}
    </div>
  )
}

function InsightsButton() {
  return (
    <Popover>
      <PopoverTrigger className="inline-flex h-7 cursor-pointer items-center gap-1 rounded-lg px-2.5 text-xs font-semibold leading-5 text-text-events-strong outline-none hover:bg-bg-default-100 data-[state=open]:bg-bg-default-100">
        <EventIcon name="sparkles-fill" size={EVENT_ICON_SIZE.composeAction} />
        Insights
        <EventIcon name="down-fill" size={EVENT_ICON_SIZE.composeAction} />
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="max-w-[220px] rounded-xl bg-[#2c3237] px-3 py-2 text-xs leading-5 text-white shadow-lg"
      >
        40% of volunteers selected Teaching as a skill.
      </PopoverContent>
    </Popover>
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
        {/* Header — Figma 80px content header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-display text-2xl font-semibold leading-8 tracking-[-0.1px] text-text-default-500">
            Analytics
          </h1>
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-[10px] bg-button-neutral px-3 text-sm font-semibold leading-[22px] text-text-events-strong shadow-button-neutral outline-none hover:bg-button-neutral-hover data-[state=open]:bg-button-neutral-clicked">
                <EventIcon name="calendar-fill" size={EVENT_ICON_SIZE.nav} />
                <span>{dateLabel}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[11rem]">
                {DATE_OPTIONS.map((option) => (
                  <DropdownMenuItem
                    key={option}
                    className={cn(
                      "cursor-pointer",
                      option === dateLabel && "bg-bg-accent-soft font-medium text-bg-accent",
                    )}
                    onSelect={() => setDateLabel(option)}
                  >
                    {option}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <button
              type="button"
              disabled={isEmpty}
              onClick={() => !isEmpty && setExportOpen(true)}
              className={cn(
                "inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-[10px] px-3 text-sm font-semibold leading-[22px] transition-opacity",
                isEmpty
                  ? "cursor-not-allowed bg-button-disabled text-text-disabled-300"
                  : "bg-button-primary text-text-on-solid-bg shadow-button-primary hover:opacity-90",
              )}
            >
              <EventIcon
                name="add-circle-fill"
                size={EVENT_ICON_SIZE.buttonLeading}
                inverted={!isEmpty}
              />
              Download impact report
              <EventIcon
                name="add-circle-fill"
                size={EVENT_ICON_SIZE.buttonTrailing}
                inverted={!isEmpty}
              />
            </button>
          </div>
        </div>

        {/* Tabs — Figma h-40 border-b-2 active indicator */}
        <div className="flex gap-4 border-b border-border-default-100">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={cn(
                "relative flex h-10 cursor-pointer items-center py-2 text-sm font-[510] leading-[22px]",
                tab === item.id
                  ? "border-b-2 border-border-input-active text-text-events-strong"
                  : "text-text-table-header hover:text-text-neutral-400",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        {tab === "overview" ? (
          <>
            <div className="flex flex-col gap-4">
              <StatGrid cards={OVERVIEW_STATS.slice(0, 4)} empty={isEmpty} />
              <StatGrid cards={OVERVIEW_STATS.slice(4)} empty={isEmpty} />
            </div>
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
                    appearance="events"
                    triggerClassName="h-7 min-h-7 px-2.5 text-xs"
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
            <div className="flex flex-col gap-4">
              <StatGrid cards={DONATION_STATS.slice(0, 4)} empty={isEmpty} />
              <StatGrid cards={DONATION_STATS.slice(4)} empty={isEmpty} />
            </div>
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <div className={cn(elevatedCardSurfaceClassName, "flex flex-col")}>
                <div className="flex items-center justify-between gap-3 p-4">
                  <h3 className="text-base font-semibold leading-6 text-text-events-strong">Event donations</h3>
                  <FilterDropdown
                    label="Amount raised"
                    options={["Amount raised", "No. of donors", "Average donation"]}
                    value={sortBy}
                    onValueChange={setSortBy}
                    appearance="events"
                    triggerClassName="h-7 min-h-7 px-2.5 text-xs"
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
                        <TableCell colSpan={4} className="py-16 text-center text-sm leading-[22px] text-text-table-header">
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

              <ChartCard title="Top 5 skills" action={<InsightsButton />}>
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
