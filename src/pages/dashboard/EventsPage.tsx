import { useEffect, useMemo, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { CreateEventTypeModal } from "../../components/create-event/CreateEventTypeModal"
import { createEventPath } from "../../lib/create-event-paths"
import type { CreateEventType } from "../../lib/create-event-paths"
import { eventDetailPath } from "../../lib/event-detail-paths"
import { parseEventsTab, withTabSearchParam } from "../../lib/dashboard-tab-params"
import { EventsTable } from "../../components/events/EventsTable"
import { EventsProgressBadge } from "../../components/events/EventsProgressBadge"
import { EventsSubTabs } from "../../components/events/EventsSubTabs"
import {
  DataTablePagination,
  DateRangeFilter,
  FilterDropdown,
  MultiSelectFilter,
} from "../../components/data-table"
import {
  DashboardFullBleed,
  DashboardLayout,
  DashboardWideContent,
} from "../../components/dashboard/DashboardLayout"
import { DASHBOARD_PAGE_GUTTER_PX } from "../../lib/dashboard-layout"
import { pageTitleClassName } from "../../lib/auth-form-styles"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { EventIcon } from "../../components/events/icons/EventIcon"
import { EVENT_ICON_SIZE } from "../../components/events/icons/event-icon-sizes"
import { ConfirmModal } from "../../components/ui/confirm-modal"
import { isDateInRange, type ResolvedDateRange } from "../../lib/event-date-filters"
import { tableSurfaceClassName } from "../../lib/table-styles"
import {
  featureSearchInputClassName,
  featureSearchWrapperClassName,
} from "../../lib/feature-search-styles"
import { toast } from "../../hooks/use-toast"
import { useSimulatedLoading } from "../../hooks/use-simulated-loading"
import {
  deleteOrganisationCause,
  extractCausesFromResponse,
  getOrganisationCauses,
} from "../../lib/api/causes"
import { ApiError } from "../../lib/api/types"
import { mapCausesToTableRows } from "../../lib/map-cause-to-table-row"
import {
  getEventsPageConfig,
  getEventsScenarioData,
  parseEventsTableScenario,
} from "./events-scenarios"
import type { EventsTabId, EventTableRow } from "./events-types"

const VISIBILITY_LABEL: Record<string, string> = {
  public: "Public",
  private: "Private",
  drafts: "Drafts",
}
const STATUS_LABEL: Record<string, string> = {
  upcoming: "Upcoming",
  active: "Active",
  completed: "Completed",
}
const TYPE_LABEL: Record<string, string> = {
  "in-person": "In-person",
  virtual: "Virtual",
}
const KIND_BY_TAB: Record<EventsTabId, string> = {
  causes: "cause",
  needs: "needs",
  collaborations: "collaboration",
}

/** Maps a collaboration row's request badges to its Status-filter label. */
function rowRequestStatusLabel(row: EventTableRow): string {
  const badges = row.requestBadges ?? []
  if (badges.includes("new-request")) return "New request"
  if (badges.includes("pending")) return "Pending"
  return "Accepted"
}

function buildEventDetailUrl(row: EventTableRow) {
  if (row.kind === "collaboration") {
    const params = new URLSearchParams()
    if (row.eventType === "needs") params.set("kind", "needs")
    const collab = row.requestBadges?.includes("new-request")
      ? "new-request"
      : row.requestBadges?.includes("pending")
        ? "pending"
        : row.requestBadges?.includes("organizer")
          ? "accepted"
          : null
    if (collab) params.set("collab", collab)
    const query = params.toString()
    return `${eventDetailPath(row.id)}${query ? `?${query}` : ""}`
  }
  return eventDetailPath(row.id)
}

type DeleteTarget = { id: string; kind: "draft" | "event" } | null

export function EventsPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [createModalOpen, setCreateModalOpen] = useState(false)
  // Causes come from the API only — no static/mock table rows.
  const scenario = parseEventsTableScenario(searchParams.get("scenario") ?? "empty")
  const pageConfig = getEventsPageConfig()
  const scenarioData = getEventsScenarioData(scenario)
  const defaultTab = scenarioData.activeTab
  const activeTab = parseEventsTab(searchParams.get("tab"), defaultTab)

  const goToTab = (tab: EventsTabId) => {
    setSearchParams((prev) => withTabSearchParam(prev, tab, defaultTab), { replace: true })
  }

  const [rows, setRows] = useState<EventTableRow[]>([])
  const [causesLoading, setCausesLoading] = useState(false)

  useEffect(() => {
    if (activeTab !== "causes") return

    let cancelled = false

    void (async () => {
      setCausesLoading(true)

      try {
        const response = await getOrganisationCauses()
        if (cancelled) return

        const apiCauseRows = mapCausesToTableRows(extractCausesFromResponse(response))
        setRows((previous) => {
          const otherRows = previous.filter((row) => (row.kind ?? "cause") !== "cause")
          return [...apiCauseRows, ...otherRows]
        })
      } catch (error) {
        if (cancelled) return

        toast({
          variant: "destructive",
          title: "Unable to load causes",
          description: error instanceof ApiError ? error.message : "Please try again.",
        })
      } finally {
        if (!cancelled) setCausesLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [activeTab])

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(scenarioData.pagination.pageSize)
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null)
  const [filterValues, setFilterValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(pageConfig.filters.map((filter) => [filter.id, filter.options[0] ?? ""])),
  )
  const [multiFilterValues, setMultiFilterValues] = useState<Record<string, string[]>>({})
  const [dateRanges, setDateRanges] = useState<Record<string, ResolvedDateRange | null>>({
    startDate: null,
    endDate: null,
  })

  const loading = useSimulatedLoading() || (activeTab === "causes" && causesLoading)
  const activeTabConfig = pageConfig.tabs.find((tab) => tab.id === activeTab) ?? pageConfig.tabs[0]
  const activeKind = KIND_BY_TAB[activeTab]
  const kindCount = rows.filter((row) => (row.kind ?? "cause") === activeKind).length

  // Per-tab config overrides (collaborations uses a distinct column/filter set).
  const columns = activeTabConfig.columns ?? pageConfig.columns
  const filters = activeTabConfig.filters ?? pageConfig.filters
  const rowActions = activeTabConfig.rowActions ?? pageConfig.rowActions
  const emptyState = activeTabConfig.emptyState ?? pageConfig.emptyState

  // Reset filters/search when the active tab's filter set changes.
  const [seededTab, setSeededTab] = useState(activeTab)
  if (seededTab !== activeTab) {
    setSeededTab(activeTab)
    setFilterValues(
      Object.fromEntries(
        filters.filter((filter) => !filter.multi).map((filter) => [filter.id, filter.options[0] ?? ""]),
      ),
    )
    setMultiFilterValues({})
    setDateRanges({ startDate: null, endDate: null })
    setSearchQuery("")
  }

  const filtersActive =
    Object.values(multiFilterValues).some((selected) => selected.length > 0) ||
    Object.entries(filterValues).some(
      ([id, value]) =>
        id !== "startDate" &&
        id !== "endDate" &&
        value &&
        !value.startsWith("All") &&
        !value.startsWith("Any"),
    ) ||
    // Date filters only count as active once BOTH ends are set.
    Boolean(dateRanges.startDate && dateRanges.endDate) ||
    searchQuery.trim().length > 0

  const resolvedEmptyState = filtersActive
    ? { title: "No result found", description: "We couldn't find any result based on the filter" }
    : emptyState

  const clearFilters = () => {
    setFilterValues(
      Object.fromEntries(
        filters.filter((f) => !f.multi).map((f) => [f.id, f.options[0] ?? ""]),
      ),
    )
    setMultiFilterValues({})
    setDateRanges({ startDate: null, endDate: null })
    setSearchQuery("")
    setPage(1)
  }

  const filteredRows = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    const isAny = (value: string) => !value || value.startsWith("All") || value.startsWith("Any")

    return rows.filter((row) => {
      if ((row.kind ?? "cause") !== activeKind) return false
      if (!isAny(filterValues.category) && !row.category.tags.includes(filterValues.category)) {
        return false
      }
      if (
        !isAny(filterValues.volunteeringType) &&
        TYPE_LABEL[row.volunteerType.type ?? ""] !== filterValues.volunteeringType
      ) {
        return false
      }
      if (
        !isAny(filterValues.eventType) &&
        (row.eventType === "needs" ? "Need" : "Cause") !== filterValues.eventType
      ) {
        return false
      }

      // Multi-select (collaboration) filters — an empty selection means "any".
      const catSel = multiFilterValues.category ?? []
      if (catSel.length && !row.category.tags.some((tag) => catSel.includes(tag))) return false
      const etSel = multiFilterValues.eventType ?? []
      if (etSel.length && !etSel.includes(row.eventType === "needs" ? "Need" : "Cause")) return false
      const visSel = multiFilterValues.visibility ?? []
      if (visSel.length && !visSel.includes(VISIBILITY_LABEL[row.visibility.type] ?? "")) return false
      const statusSel = multiFilterValues.status ?? []
      if (statusSel.length && !statusSel.includes(rowRequestStatusLabel(row))) return false
      if (
        !isAny(filterValues.visibility) &&
        VISIBILITY_LABEL[row.visibility.type] !== filterValues.visibility
      ) {
        return false
      }
      if (
        !isAny(filterValues.status) &&
        STATUS_LABEL[row.visibility.lifecycleStatus ?? ""] !== filterValues.status
      ) {
        return false
      }
      // Date filtering only applies once BOTH the start-date and end-date filters
      // are set — a start date alone (or end alone) does not filter the table.
      if (dateRanges.startDate && dateRanges.endDate) {
        if (!isDateInRange(row.date.startDate, dateRanges.startDate)) return false
        if (!isDateInRange(row.date.endDate, dateRanges.endDate)) return false
      }

      if (query) {
        const haystack = [
          row.cause.title,
          row.cause.description,
          row.category.tags.join(" "),
          row.volunteerType.detail ?? "",
        ]
          .join(" ")
          .toLowerCase()
        if (!haystack.includes(query)) return false
      }

      return true
    })
  }, [rows, activeKind, searchQuery, filterValues, multiFilterValues, dateRanges])

  const pagination = useMemo(() => {
    const total = filteredRows.length
    const totalPages = Math.max(1, Math.ceil(total / pageSize))
    const safePage = Math.min(page, totalPages)
    const from = total === 0 ? 0 : (safePage - 1) * pageSize + 1
    const to = total === 0 ? 0 : Math.min(safePage * pageSize, total)
    return { total, totalPages, safePage, from, to }
  }, [filteredRows.length, page, pageSize])

  const pagedRows = useMemo(() => {
    const start = (pagination.safePage - 1) * pageSize
    return filteredRows.slice(start, start + pageSize)
  }, [filteredRows, pageSize, pagination.safePage])

  const handleRowAction = (rowId: string, actionId: string) => {
    if (actionId === "share-link") {
      const row = rows.find((item) => item.id === rowId)
      if (row?.shareUrl) {
        void navigator.clipboard?.writeText(row.shareUrl)
        toast({ variant: "success", title: "Link copied to clipboard" })
        return
      }
    }
    if (actionId === "delete-event") {
      setDeleteTarget({ id: rowId, kind: "event" })
      return
    }
    if (actionId === "delete-draft") {
      setDeleteTarget({ id: rowId, kind: "draft" })
      return
    }
    if (actionId === "continue-draft") {
      navigate(createEventPath())
      return
    }
    if (actionId === "view-details" || actionId === "edit-event") {
      const row = rows.find((item) => item.id === rowId)
      navigate(row ? buildEventDetailUrl(row) : eventDetailPath(rowId))
      return
    }
    if (actionId === "view-volunteers") {
      navigate(eventDetailPath(rowId, "volunteers"))
      return
    }
    if (actionId === "post-updates") {
      navigate(eventDetailPath(rowId, "updates"))
      return
    }

    toast({
      title: "Coming soon",
      description: "This action will be available after API integration.",
    })
  }

  const confirmDelete = () => {
    if (!deleteTarget) return

    const row = rows.find((item) => item.id === deleteTarget.id)
    const isCauseRow = (row?.kind ?? "cause") === "cause"

    void (async () => {
      if (isCauseRow) {
        try {
          await deleteOrganisationCause(deleteTarget.id)
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Unable to delete cause",
            description: error instanceof ApiError ? error.message : "Please try again.",
          })
          return
        }
      }

      setRows((prev) => prev.filter((row) => row.id !== deleteTarget.id))
      toast({
        variant: "success",
        title: deleteTarget.kind === "draft" ? "Draft deleted" : "Event deleted",
      })
      setDeleteTarget(null)
    })()
  }

  const setFilterValue = (filterId: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [filterId]: value }))
    setPage(1)
  }

  const setDateFilter = (filterId: string, label: string, range: ResolvedDateRange | null) => {
    setFilterValues((prev) => ({ ...prev, [filterId]: label }))
    setDateRanges((prev) => ({ ...prev, [filterId]: range }))
    setPage(1)
  }

  const handleCreateTypeSelect = (type: CreateEventType) => {
    setCreateModalOpen(false)
    navigate(createEventPath(type))
  }

  return (
    <DashboardLayout activeTab="events">
      <CreateEventTypeModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSelect={handleCreateTypeSelect}
      />

      <ConfirmModal
        open={deleteTarget?.kind === "draft"}
        onClose={() => setDeleteTarget(null)}
        title="Delete draft"
        description="You're about to delete this draft. This means that you no longer want to continue with the creation of this event."
        confirmLabel="Delete draft"
        variant="primary"
        onConfirm={confirmDelete}
      />
      <ConfirmModal
        open={deleteTarget?.kind === "event"}
        onClose={() => setDeleteTarget(null)}
        title="Delete event"
        description="You're about to delete this event. This means the event will be permanently removed and any associated donations will be refunded. This action cannot be undone"
        confirmLabel="Delete event"
        variant="destructive"
        onConfirm={confirmDelete}
      />

      <DashboardWideContent flushBottom className="flex flex-col gap-6">
        <div className="flex shrink-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <h1 className={pageTitleClassName}>
            {pageConfig.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3">
            <EventsProgressBadge
              current={kindCount}
              total={Math.max(kindCount, activeTabConfig.progressLimit)}
              label={activeTabConfig.progressLabel}
            />
            <Button
              variant="primary"
              size="sm"
              className="h-10 min-h-10 rounded-xl px-3.5"
              onClick={() => setCreateModalOpen(true)}
            >
              {pageConfig.createButtonLabel}
            </Button>
          </div>
        </div>

        <section className="flex shrink-0 flex-col">
          <DashboardFullBleed className="border-b border-border-default-100">
            <div
              style={{
                paddingLeft: DASHBOARD_PAGE_GUTTER_PX,
                paddingRight: DASHBOARD_PAGE_GUTTER_PX,
              }}
            >
              <EventsSubTabs
                tabs={pageConfig.tabs.map((tab) => ({
                  id: tab.id,
                  label: tab.label,
                  count: tab.showCount
                    ? rows.filter((row) => (row.kind ?? "cause") === KIND_BY_TAB[tab.id]).length
                    : undefined,
                }))}
                activeTab={activeTab}
                onTabChange={(id) => {
                  goToTab(id)
                  setPage(1)
                }}
              />
            </div>
          </DashboardFullBleed>

          <div className="flex flex-col gap-3 pt-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {filters.map((filter) =>
                filter.id === "startDate" || filter.id === "endDate" ? (
                  <DateRangeFilter
                    key={filter.id}
                    label={filter.label}
                    options={filter.options}
                    value={filterValues[filter.id]}
                    onChange={(label, range) => setDateFilter(filter.id, label, range)}
                    maxDate={
                      filter.id === "startDate"
                        ? (dateRanges.endDate?.to ?? dateRanges.endDate?.from)
                        : undefined
                    }
                    minDate={
                      filter.id === "endDate"
                        ? (dateRanges.startDate?.from ?? dateRanges.startDate?.to)
                        : undefined
                    }
                  />
                ) : filter.multi ? (
                  <MultiSelectFilter
                    key={filter.id}
                    label={filter.label}
                    options={filter.options}
                    values={multiFilterValues[filter.id] ?? []}
                    onValuesChange={(values) => {
                      setMultiFilterValues((prev) => ({ ...prev, [filter.id]: values }))
                      setPage(1)
                    }}
                  />
                ) : (
                  <FilterDropdown
                    key={filter.id}
                    label={filter.label}
                    options={filter.options}
                    value={filterValues[filter.id]}
                    onValueChange={(value) => setFilterValue(filter.id, value)}
                  />
                ),
              )}
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

            <div className={featureSearchWrapperClassName}>
              <Input
                density="compact"
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value)
                  setPage(1)
                }}
                placeholder={activeTabConfig.searchPlaceholder}
                leftIcon={<EventIcon name="search-line" size={EVENT_ICON_SIZE.search} />}
                aria-label={activeTabConfig.searchPlaceholder}
                className={featureSearchInputClassName}
              />
            </div>
          </div>
        </section>

        <div className={tableSurfaceClassName}>
          <EventsTable
            rows={pagedRows}
            columns={columns}
            rowActions={rowActions}
            draftRowActions={pageConfig.draftRowActions}
            emptyState={resolvedEmptyState}
            selectedIds={selectedIds}
            onSelectedIdsChange={setSelectedIds}
            onRowAction={handleRowAction}
            onRowClick={(row) => navigate(buildEventDetailUrl(row))}
            loading={loading}
          />

          {loading ? null : (
            <DataTablePagination
              from={pagination.from}
              to={pagination.to}
              total={pagination.total}
              page={pagination.safePage}
              pageSize={pageSize}
              totalPages={pagination.totalPages}
              pageSizeOptions={pageConfig.pagination.pageSizeOptions}
              onPageChange={setPage}
              onPageSizeChange={(nextSize) => {
                setPageSize(nextSize)
                setPage(1)
              }}
            />
          )}
        </div>
      </DashboardWideContent>
    </DashboardLayout>
  )
}
