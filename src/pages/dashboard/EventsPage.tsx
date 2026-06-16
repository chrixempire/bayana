import { useMemo, useState } from "react"
import { Plus, Search } from "lucide-react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { CreateEventTypeModal } from "../../components/create-event/CreateEventTypeModal"
import { createEventPath } from "../../lib/create-event-paths"
import type { CreateEventType } from "../../lib/create-event-paths"
import { EventsTable } from "../../components/events/EventsTable"
import { EventsProgressBadge } from "../../components/events/EventsProgressBadge"
import { EventsSubTabs } from "../../components/events/EventsSubTabs"
import { DataTablePagination, FilterDropdown } from "../../components/data-table"
import {
  DashboardFullBleed,
  DashboardLayout,
  DashboardWideContent,
} from "../../components/dashboard/DashboardLayout"
import { DASHBOARD_PAGE_GUTTER_PX } from "../../lib/dashboard-layout"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { toast } from "../../hooks/use-toast"
import {
  getEventsPageConfig,
  getEventsScenarioData,
  parseEventsTableScenario,
} from "./events-scenarios"
import type { EventsTabId } from "./events-types"

export function EventsPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const scenario = parseEventsTableScenario(searchParams.get("scenario"))
  const pageConfig = getEventsPageConfig()
  const scenarioData = getEventsScenarioData(scenario)

  const [activeTab, setActiveTab] = useState<EventsTabId>(scenarioData.activeTab)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [page, setPage] = useState(scenarioData.pagination.page)
  const [pageSize, setPageSize] = useState(scenarioData.pagination.pageSize)
  const [filterValues, setFilterValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(pageConfig.filters.map((filter) => [filter.id, filter.options[0] ?? ""])),
  )

  const activeTabConfig = pageConfig.tabs.find((tab) => tab.id === activeTab) ?? pageConfig.tabs[0]

  const filteredRows = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return scenarioData.rows

    return scenarioData.rows.filter((row) => {
      const haystack = [
        row.cause.title,
        row.cause.description,
        row.category.tags.join(" "),
        row.volunteerType.detail ?? "",
      ]
        .join(" ")
        .toLowerCase()

      return haystack.includes(query)
    })
  }, [scenarioData.rows, searchQuery])

  const pagination = useMemo(() => {
    const total = scenario === "filled" ? scenarioData.pagination.total : filteredRows.length
    const totalPages = Math.max(1, Math.ceil(total / pageSize))
    const safePage = Math.min(page, totalPages)
    const from = total === 0 ? 0 : (safePage - 1) * pageSize + 1
    const to = total === 0 ? 0 : Math.min(safePage * pageSize, total)

    return { total, totalPages, safePage, from, to }
  }, [filteredRows.length, page, pageSize, scenario, scenarioData.pagination.total])

  const pagedRows = useMemo(() => {
    if (scenario === "filled") {
      return filteredRows
    }

    const start = (pagination.safePage - 1) * pageSize
    return filteredRows.slice(start, start + pageSize)
  }, [filteredRows, pageSize, pagination.safePage, scenario])

  const handleRowAction = (rowId: string, actionId: string) => {
    if (actionId === "share-link") {
      const row = scenarioData.rows.find((item) => item.id === rowId)
      if (row?.shareUrl) {
        void navigator.clipboard?.writeText(row.shareUrl)
        toast({ variant: "success", title: "Link copied to clipboard" })
        return
      }
    }

    toast({
      title: "Coming soon",
      description: "This action will be available after API integration.",
    })
  }

  const setFilterValue = (filterId: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [filterId]: value }))
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
      <DashboardWideContent flushBottom className="flex flex-col gap-6">
        <div className="flex shrink-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <h1 className="font-display text-2xl font-semibold leading-8 tracking-[-0.2px] text-text-default-500">
            {pageConfig.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3">
            <EventsProgressBadge
              current={scenarioData.progress.current}
              total={scenarioData.progress.total}
              label={activeTabConfig.progressLabel}
            />
            <Button
              variant="primary"
              size="sm"
              className="h-10 min-h-10 rounded-xl px-3.5"
              leftIcon={<Plus className="size-4" />}
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
                tabs={pageConfig.tabs.map((tab) => ({ id: tab.id, label: tab.label }))}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </div>
          </DashboardFullBleed>

          <div className="flex flex-col gap-3 pt-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap gap-2">
              {pageConfig.filters.map((filter) => (
                <FilterDropdown
                  key={filter.id}
                  label={filter.label}
                  options={filter.options}
                  value={filterValues[filter.id]}
                  onValueChange={(value) => setFilterValue(filter.id, value)}
                />
              ))}
            </div>

            <div className="w-full xl:max-w-[280px]">
              <Input
                density="compact"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={activeTabConfig.searchPlaceholder}
                leftIcon={<Search className="size-4" />}
                aria-label={activeTabConfig.searchPlaceholder}
              />
            </div>
          </div>
        </section>

        <div className="rounded-xl border border-border-default-100 bg-bg-canvas">
          <EventsTable
            rows={pagedRows}
            columns={pageConfig.columns}
            rowActions={pageConfig.rowActions}
            emptyState={pageConfig.emptyState}
            selectedIds={selectedIds}
            onSelectedIdsChange={setSelectedIds}
            onRowAction={handleRowAction}
          />

          <DataTablePagination
            className="border-t border-border-default-100 px-4 pb-4"
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
        </div>
      </DashboardWideContent>
    </DashboardLayout>
  )
}
