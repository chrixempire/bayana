import { useMemo, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import {
  DashboardFullBleed,
  DashboardLayout,
  DashboardWideContent,
} from "../../components/dashboard/DashboardLayout"
import { DASHBOARD_PAGE_GUTTER_PX } from "../../lib/dashboard-layout"
import { pageTitleClassName } from "../../lib/auth-form-styles"
import {
  DataTableEmptyState,
  DataTablePagination,
  DateRangeFilter,
  FilterDropdown,
  MultiSelectFilter,
} from "../../components/data-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, tableCellSelectClassName, tableHeadActionsClassName, tableHeadSelectClassName, tableHeaderRowClassName, tableSelectControlClassName } from "../../components/ui/table"
import { tableHeadCellClassName } from "../../lib/table-styles"
import { Checkbox } from "../../components/ui/checkbox"
import { Input } from "../../components/ui/input"
import { StatusTag } from "../../components/ui/status-tag"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { PersonAvatar } from "../../components/events/detail/PersonAvatar"
import {
  elevatedCardSurfaceClassName,
  OverviewCard,
} from "../../components/events/detail/detail-primitives"
import { EventIcon } from "../../components/events/icons/EventIcon"
import { EVENT_ICON_SIZE } from "../../components/events/icons/event-icon-sizes"
import { ReviewsTab } from "../../components/volunteers/ReviewsTab"
import { ExportVolunteersModal } from "../../components/dashboard/ExportVolunteersModal"
import { parseVolunteerSubTab, withTabSearchParam } from "../../lib/dashboard-tab-params"
import { isDateInRange, type ResolvedDateRange } from "../../lib/event-date-filters"
import { downloadCsv } from "../../lib/csv"
import { REVIEW_ROWS } from "./reviews-data"
import { toast } from "../../hooks/use-toast"
import { useSimulatedLoading } from "../../hooks/use-simulated-loading"
import { cn } from "../../lib/utils"
import {
  VOLUNTEER_ROWS,
  VOLUNTEER_SKILL_OPTIONS,
  VOLUNTEER_TOTALS,
  type VolunteerListRow,
} from "./volunteers-data"

const PAGE_SIZE_OPTIONS = [10, 20, 50]

function StatusPill({ status }: { status: VolunteerListRow["status"] }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-lg px-2 text-xs font-[510] leading-4",
        status === "active"
          ? "bg-bg-success-soft text-text-success"
          : "bg-bg-negative-soft text-text-negative",
      )}
    >
      {status === "active" ? "Active" : "Blacklisted"}
    </span>
  )
}

const SUB_TABS = [
  { id: "volunteers", label: "Volunteers" },
  { id: "reviews", label: "Reviews" },
] as const
type VolunteerTab = (typeof SUB_TABS)[number]["id"]

export function VolunteersPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const isEmptyScenario = searchParams.get("scenario") === "empty"
  const activeTab = parseVolunteerSubTab(searchParams.get("tab"))

  const goToTab = (tab: VolunteerTab) => {
    setSearchParams((prev) => withTabSearchParam(prev, tab, "volunteers"), { replace: true })
  }

  const [rows, setRows] = useState<VolunteerListRow[]>(isEmptyScenario ? [] : VOLUNTEER_ROWS)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [skillsFilter, setSkillsFilter] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState("All status")
  const [dateLabel, setDateLabel] = useState("Any date")
  const [dateRange, setDateRange] = useState<ResolvedDateRange | null>(null)
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [exportOpen, setExportOpen] = useState(false)
  const [exportRows, setExportRows] = useState<VolunteerListRow[]>([])

  const loading = useSimulatedLoading()

  const totals = isEmptyScenario ? { total: 0, active: 0, blacklisted: 0 } : VOLUNTEER_TOTALS

  const filtersActive =
    skillsFilter.length > 0 ||
    statusFilter !== "All status" ||
    Boolean(dateRange) ||
    query.trim().length > 0

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows.filter((row) => {
      if (skillsFilter.length && !row.skills.some((s) => skillsFilter.includes(s))) return false
      if (statusFilter !== "All status" && (statusFilter === "Active" ? "active" : "blacklisted") !== row.status) {
        return false
      }
      if (!isDateInRange(row.dateJoinedIso, dateRange)) return false
      if (q && !`${row.name} ${row.email}`.toLowerCase().includes(q)) return false
      return true
    })
  }, [rows, skillsFilter, statusFilter, dateRange, query])

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(page, totalPages)
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)

  const pagedSelectedCount = paged.filter((row) => selectedIds.has(row.id)).length
  const allPagedSelected = paged.length > 0 && pagedSelectedCount === paged.length
  const selectionCount = selectedIds.size

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

  const setBlacklist = (ids: string[], blacklisted: boolean) => {
    setRows((prev) =>
      prev.map((row) =>
        ids.includes(row.id) ? { ...row, status: blacklisted ? "blacklisted" : "active" } : row,
      ),
    )
    toast({
      variant: "success",
      title: blacklisted
        ? `${ids.length > 1 ? `${ids.length} volunteers` : "Volunteer"} added to blacklist`
        : `${ids.length > 1 ? `${ids.length} volunteers` : "Volunteer"} removed from blacklist`,
    })
  }

  const clearFilters = () => {
    setSkillsFilter([])
    setStatusFilter("All status")
    setDateLabel("Any date")
    setDateRange(null)
    setQuery("")
    setPage(1)
  }

  const emptyState = filtersActive
    ? { title: "No result found", description: "We couldn't find any result based on the filter" }
    : { title: "No volunteers yet", description: "Once a volunteer joins any of your causes, they would appear here" }

  const GUTTER = { paddingLeft: DASHBOARD_PAGE_GUTTER_PX, paddingRight: DASHBOARD_PAGE_GUTTER_PX }

  return (
    <DashboardLayout activeTab="volunteers">
      <DashboardWideContent flushBottom className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <h1 className={pageTitleClassName}>
            Volunteers
          </h1>
          <button
            type="button"
            className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-[10px] bg-button-neutral px-3 text-sm font-semibold leading-[22px] text-text-events-strong shadow-button-neutral transition-colors hover:bg-button-neutral-hover"
            onClick={() => {
              if (activeTab === "reviews") {
                downloadCsv(
                  "reviews",
                  ["Volunteer", "Email", "Rating", "Review", "Date"],
                  REVIEW_ROWS.map((r) => [r.name, r.email, r.rating, r.review ?? "No review", r.date]),
                )
                toast({ variant: "success", title: "Reviews exported" })
                return
              }
              setExportRows(filtered)
              setExportOpen(true)
            }}
          >
            <EventIcon name="upload-2-fill" size={EVENT_ICON_SIZE.buttonLeading} />
            Export
          </button>
        </div>

        {/* sub-tabs */}
        <DashboardFullBleed className="border-b border-border-default-100">
          <div style={GUTTER}>
            <div className="flex gap-6">
              {SUB_TABS.map((tab) => {
                const active = tab.id === activeTab
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => goToTab(tab.id)}
                    className={cn(
                      "type-events-tab relative cursor-pointer pb-3 transition-colors",
                      active
                        ? "text-text-events-strong after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:rounded-full after:bg-bg-accent"
                        : "text-text-table-header hover:text-text-neutral-400",
                    )}
                  >
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>
        </DashboardFullBleed>

        {activeTab === "reviews" ? (
          <ReviewsTab isEmpty={isEmptyScenario} />
        ) : (
          <>
            <div className="flex flex-col gap-4 sm:flex-row">
              <OverviewCard label="Total volunteers" value={String(totals.total)} />
              <OverviewCard label="Active volunteers" value={String(totals.active)} />
              <OverviewCard label="Blacklisted volunteers" value={String(totals.blacklisted)} />
            </div>

            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <MultiSelectFilter
                  label="Skills"
                  options={[...VOLUNTEER_SKILL_OPTIONS]}
                  values={skillsFilter}
                  onValuesChange={(values) => {
                    setSkillsFilter(values)
                    setPage(1)
                  }}
                />
                <FilterDropdown
                  appearance="events"
                  label="Status"
                  options={["All status", "Active", "Blacklisted"]}
                  value={statusFilter}
                  onValueChange={(value) => {
                    setStatusFilter(value)
                    setPage(1)
                  }}
                  showLeadingIcon={false}
                />
                <DateRangeFilter
                  label="Date joined"
                  options={["Any date", "Today", "This week", "This month", "Custom range"]}
                  value={dateLabel}
                  onChange={(label, range) => {
                    setDateLabel(label)
                    setDateRange(range)
                    setPage(1)
                  }}
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
              <div className="w-full xl:max-w-[300px]">
                <Input
                  density="compact"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value)
                    setPage(1)
                  }}
                  placeholder="Search volunteers"
                  leftIcon={<EventIcon name="search-line" size={EVENT_ICON_SIZE.search} />}
                  aria-label="Search volunteers"
                  className="h-8 min-h-8 rounded-[10px] border-0 bg-bg-default-100 px-3 shadow-none"
                />
              </div>
            </div>

            <div className={cn(elevatedCardSurfaceClassName, "overflow-hidden")}>
              <Table contained={false} className="w-full table-fixed">
                <colgroup>
                  <col style={{ width: "48px" }} />
                  <col style={{ width: "26%" }} />
                  <col style={{ width: "18%" }} />
                  <col style={{ width: "14%" }} />
                  <col style={{ width: "14%" }} />
                  <col style={{ width: "16%" }} />
                  <col style={{ width: "48px" }} />
                </colgroup>

                {selectionCount > 0 ? (
                  <thead>
                    <tr>
                      <th colSpan={7} className="border-b border-border-default-100 bg-bg-table-header p-0">
                        <div className="flex h-12 items-center justify-between gap-3 px-4">
                          <div className="flex items-center gap-3">
                            <Checkbox
                              size="sm"
                              checked={allPagedSelected ? true : "indeterminate"}
                              onCheckedChange={toggleAll}
                              aria-label="Select all volunteers"
                            />
                            <span className="text-sm font-[510] leading-[22px] text-text-events-strong">
                              {selectionCount} of {total} selected
                            </span>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-[10px] bg-button-neutral px-3 text-sm font-semibold leading-[22px] text-text-events-strong shadow-button-neutral outline-none hover:bg-button-neutral-hover focus-visible:ring-2 focus-visible:ring-border-input-active">
                              Actions
                              <EventIcon name="down-fill" size={EVENT_ICON_SIZE.buttonTrailing} />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="min-w-[11rem]">
                              <DropdownMenuItem
                                onSelect={() => {
                                  setBlacklist([...selectedIds], true)
                                  setSelectedIds(new Set())
                                }}
                              >
                                <EventIcon name="close-circle-fill" size={EVENT_ICON_SIZE.dropdownItem} className="text-icon-neutral" />
                                Add to blacklist
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onSelect={() => {
                                  setBlacklist([...selectedIds], false)
                                  setSelectedIds(new Set())
                                }}
                              >
                                <EventIcon name="check-circle-fill" size={EVENT_ICON_SIZE.dropdownItem} className="text-icon-neutral" />
                                Remove from blacklist
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onSelect={() => {
                                  setExportRows(filtered.filter((row) => selectedIds.has(row.id)))
                                  setExportOpen(true)
                                }}
                              >
                                <EventIcon name="upload-2-fill" size={EVENT_ICON_SIZE.dropdownItem} />
                                Export selected
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </th>
                    </tr>
                  </thead>
                ) : (
                  <TableHeader>
                    <TableRow className={tableHeaderRowClassName}>
                      <TableHead className={cn(tableHeadCellClassName, tableHeadSelectClassName)}>
                        <div className={tableSelectControlClassName}>
                          <Checkbox
                            size="sm"
                            checked={allPagedSelected ? true : pagedSelectedCount > 0 ? "indeterminate" : false}
                            onCheckedChange={toggleAll}
                            disabled={paged.length === 0}
                            aria-label="Select all volunteers"
                          />
                        </div>
                      </TableHead>
                      <TableHead>Volunteer</TableHead>
                      <TableHead>Skills</TableHead>
                      <TableHead>Activities</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date joined</TableHead>
                      <TableHead className={cn(tableHeadCellClassName, tableHeadActionsClassName)} />
                    </TableRow>
                  </TableHeader>
                )}

                <TableBody>
                  {paged.length === 0 ? (
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={7} className="p-0">
                        <DataTableEmptyState title={emptyState.title} description={emptyState.description} />
                      </TableCell>
                    </TableRow>
                  ) : (
                    paged.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={selectedIds.has(row.id) ? "selected" : undefined}
                        className="cursor-pointer"
                        onClick={() => navigate(`/volunteers/${row.id}`)}
                      >
                        <TableCell className={tableCellSelectClassName} onClick={(event) => event.stopPropagation()}>
                          <div className={tableSelectControlClassName}>
                            <Checkbox
                              size="sm"
                              checked={selectedIds.has(row.id)}
                              onCheckedChange={() => toggleOne(row.id)}
                              aria-label={`Select ${row.name}`}
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <PersonAvatar
                              name={row.name}
                              tone={row.avatarTone}
                              imageUrl={row.avatarImage}
                              size={40}
                            />
                            <div className="flex min-w-0 flex-col">
                              <span className="type-table-cell-primary truncate">{row.name}</span>
                              <span className="type-table-cell-secondary truncate">{row.email}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap items-center gap-1">
                            <StatusTag>{row.skills[0]}</StatusTag>
                            {row.skills.length > 1 ? <StatusTag>+{row.skills.length - 1}</StatusTag> : null}
                          </div>
                        </TableCell>
                        <TableCell className="type-table-cell-primary">
                          {row.activities} {row.activities === 1 ? "activity" : "activities"}
                        </TableCell>
                        <TableCell>
                          <StatusPill status={row.status} />
                        </TableCell>
                        <TableCell className="type-table-cell-secondary">{row.dateJoined}</TableCell>
                        <TableCell className="text-right" onClick={(event) => event.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                type="button"
                                aria-label={`Actions for ${row.name}`}
                                className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full text-icon-neutral outline-none transition-colors hover:bg-bg-default-100 focus-visible:ring-2 focus-visible:ring-border-input-active"
                              >
                                <EventIcon name="more-1-fill" size={EVENT_ICON_SIZE.tableMore} />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="min-w-[11rem]">
                              <DropdownMenuItem onSelect={() => navigate(`/volunteers/${row.id}`)}>
                                <EventIcon name="eye-fill" size={EVENT_ICON_SIZE.dropdownItem} />
                                View details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onSelect={() =>
                                  toast({
                                    title: "Coming soon",
                                    description: `Messaging ${row.name} will be available after API integration.`,
                                  })
                                }
                              >
                                <EventIcon name="inbox-fill" size={EVENT_ICON_SIZE.dropdownItem} className="text-icon-neutral" />
                                Send message
                              </DropdownMenuItem>
                              {row.status === "blacklisted" ? (
                                <DropdownMenuItem
                                  className="text-text-success focus:bg-bg-success-soft"
                                  onSelect={() => setBlacklist([row.id], false)}
                                >
                                  <EventIcon name="check-circle-fill" size={EVENT_ICON_SIZE.dropdownItem} className="text-text-success" />
                                  Remove from blacklist
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  className="text-text-negative focus:bg-bg-negative-soft"
                                  onSelect={() => setBlacklist([row.id], true)}
                                >
                                  <EventIcon name="close-circle-fill" size={EVENT_ICON_SIZE.dropdownItem} className="text-icon-negative" />
                                  Add to blacklist
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {total > 0 && !loading ? (
                <DataTablePagination
                  className="border-t border-border-default-100 px-4 pb-4"
                  from={(safePage - 1) * pageSize + 1}
                  to={Math.min(safePage * pageSize, total)}
                  total={total}
                  page={safePage}
                  pageSize={pageSize}
                  totalPages={totalPages}
                  pageSizeOptions={PAGE_SIZE_OPTIONS}
                  onPageChange={setPage}
                  onPageSizeChange={(size) => {
                    setPageSize(size)
                    setPage(1)
                  }}
                />
              ) : null}
            </div>
          </>
        )}
      </DashboardWideContent>

      <ExportVolunteersModal
        open={exportOpen}
        rows={exportRows}
        onClose={() => setExportOpen(false)}
        onExported={() => {
          setExportOpen(false)
          toast({ variant: "success", title: "Volunteers exported" })
        }}
      />
    </DashboardLayout>
  )
}
