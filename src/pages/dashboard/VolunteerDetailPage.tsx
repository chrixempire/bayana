import { useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { DashboardLayout } from "../../components/dashboard/DashboardLayout"
import { dashboardDetailContentClassName } from "../../lib/dashboard-layout"
import { DASHBOARD_TAB_PATHS } from "../../lib/dashboard-paths"
import { tableHeadCellClassName, tableSurfaceClassName } from "../../lib/table-styles"
import {
  featureSearchInputClassName,
  featureSearchWrapperClassName,
} from "../../lib/feature-search-styles"
import { DataTablePagination, FilterDropdown } from "../../components/data-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  tableCellActionsClassName,
  tableCellSelectClassName,
  tableHeadActionsClassName,
  tableHeadSelectClassName,
  tableHeaderRowClassName,
  tableSelectControlClassName,
} from "../../components/ui/table"
import { Checkbox } from "../../components/ui/checkbox"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { StatusTag } from "../../components/ui/status-tag"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { PersonAvatar } from "../../components/events/detail/PersonAvatar"
import { EventIcon, type EventIconName } from "../../components/events/icons/EventIcon"
import { EVENT_ICON_SIZE } from "../../components/events/icons/event-icon-sizes"
import { PublicVisibilityIcon, PrivateVisibilityIcon } from "../../components/events/icons/VisibilityIcons"
import { ConfirmModal } from "../../components/ui/confirm-modal"
import {
  VolunteerReviewDetailsModal,
  type ReviewDetail,
} from "../../components/events/detail/VolunteerReviewDetailsModal"
import { toast } from "../../hooks/use-toast"
import { cn } from "../../lib/utils"
import {
  getVolunteerDetail,
  type AttendanceCell,
  type VolunteerDetail,
} from "./volunteer-detail-data"

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "events", label: "Events" },
  { id: "donations", label: "Donations" },
  { id: "reviews", label: "Reviews" },
] as const
type VolunteerDetailTab = (typeof TABS)[number]["id"]

const CELL_TONE: Record<AttendanceCell, string> = {
  attended: "bg-[#36b55c]",
  "clocked-in": "bg-bg-accent",
  "no-show": "bg-[#f43b61]",
  empty: "bg-bg-default-100",
}

function StatusPill({ status }: { status: VolunteerDetail["status"] }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-lg px-2 text-xs font-medium leading-4",
        status === "active" ? "bg-bg-success-soft text-text-success" : "bg-bg-negative-soft text-text-negative",
      )}
    >
      {status === "active" ? "Active" : "Blacklisted"}
    </span>
  )
}

function InfoField({ icon, label, children }: { icon: EventIconName; label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="flex items-center gap-1.5 text-xs leading-5 text-text-table-header">
        <EventIcon name={icon} size={14} />
        {label}
      </span>
      {children}
    </div>
  )
}

function Chips({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <StatusTag key={item}>{item}</StatusTag>
      ))}
    </div>
  )
}

function StatCell({ value, unit, label }: { value: string; unit?: string; label: string }) {
  return (
    <div className="flex flex-1 flex-col gap-1 px-4 py-3">
      <span className="font-display text-2xl font-semibold leading-8 text-text-events-strong">
        {value}
        {unit ? <span className="ml-0.5 text-sm font-normal text-text-table-header">{unit}</span> : null}
      </span>
      <span className="text-sm leading-[22px] text-text-table-header">{label}</span>
    </div>
  )
}

function OverviewTab({ v }: { v: VolunteerDetail }) {
  return (
    <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
      {/* About */}
      <div className="w-full shrink-0 xl:w-[320px]">
        <section className="flex flex-col gap-4 rounded-2xl border border-border-default-100 bg-bg-canvas p-4">
          <h2 className="font-display text-xl font-semibold leading-7 text-text-events-strong">
            About volunteer
          </h2>
          <InfoField icon="user-3-fill" label="Full name">
            <span className="text-sm font-medium leading-[22px] text-text-events-strong">{v.name}</span>
          </InfoField>
          <InfoField icon="inbox-fill" label="Email">
            <span className="text-sm font-medium leading-[22px] text-text-events-strong">{v.email}</span>
          </InfoField>
          <InfoField icon="user-3-fill" label="Phone number">
            <span className="text-sm font-medium leading-[22px] text-text-events-strong">{v.phone}</span>
          </InfoField>
          <InfoField icon="calendar-fill" label="Date of birth">
            <span className="text-sm font-medium leading-[22px] text-text-events-strong">{v.dateOfBirth}</span>
          </InfoField>
          <InfoField icon="sparkles-fill" label="Skills">
            <Chips items={v.skills} />
          </InfoField>
          <InfoField icon="award-fill" label="Interests">
            <Chips items={v.interests} />
          </InfoField>
          <InfoField icon="calendar-fill" label="Account created">
            <span className="text-sm font-medium leading-[22px] text-text-events-strong">{v.accountCreated}</span>
          </InfoField>
        </section>
      </div>

      {/* Stats + attendance */}
      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <div className="flex flex-col divide-y divide-border-default-100 rounded-2xl border border-border-default-100 bg-bg-canvas sm:flex-row sm:divide-x sm:divide-y-0">
          <StatCell value={v.stats.hours} unit="hr" label="Volunteering hours" />
          <StatCell value={String(v.stats.events)} label="Events participated" />
          <StatCell value={v.stats.inCash} label="In Cash Donations" />
          <StatCell value={String(v.stats.inKind)} label="In Kind Donations" />
        </div>

        <section className="flex flex-col rounded-2xl border border-border-default-100 bg-bg-canvas">
          <div className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <p className="font-display text-2xl font-semibold leading-8 text-text-events-strong">
                {v.attendanceRate}
                <span className="ml-0.5 text-sm font-normal text-text-table-header">%</span>
              </p>
              <p className="text-sm leading-[22px] text-text-table-header">Average attendance rate</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs leading-5 text-text-table-header">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#36b55c]" /> Attended
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-bg-accent" /> Clocked in
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#f43b61]" /> No show
              </span>
            </div>
          </div>
          {v.attendance.map((row) => (
            <div
              key={row.id}
              className="flex flex-wrap items-center justify-between gap-4 border-t border-border-default-100 px-4 py-3.5"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium leading-[22px] text-text-events-strong">{row.event}</p>
                <p className="text-xs leading-5 text-text-table-header">{row.rate}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1.5">
                <div className="flex items-center gap-1">
                  {row.cells.map((cell, index) => (
                    <span key={index} className={cn("h-2.5 w-6 rounded-[3px]", CELL_TONE[cell])} />
                  ))}
                </div>
                <span className="text-xs leading-5 text-text-table-header">{row.sessions} Sessions</span>
              </div>
            </div>
          ))}
          <div className="border-t border-border-default-100">
            <DataTablePagination
              from={1}
              to={v.attendance.length}
              total={v.attendance.length}
              page={1}
              pageSize={10}
              totalPages={1}
              onPageChange={() => {}}
              onPageSizeChange={() => {}}
            />
          </div>
        </section>
      </div>
    </div>
  )
}

type ShellFilter = { label: string; options: string[]; value: string; onChange: (value: string) => void }

type TableShellProps<T> = {
  filters: ShellFilter[]
  query: string
  onQueryChange: (value: string) => void
  searchPlaceholder: string
  colgroup: React.ReactNode
  headerCells: React.ReactNode
  rows: T[]
  getRowId: (row: T, index: number) => string
  renderRow: (row: T, index: number) => React.ReactNode
  selectAllLabel: string
}

function TableShell<T>({
  filters,
  query,
  onQueryChange,
  searchPlaceholder,
  colgroup,
  headerCells,
  rows,
  getRowId,
  renderRow,
  selectAllLabel,
}: TableShellProps<T>) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set())

  const total = rows.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(page, totalPages)
  const paged = rows.slice((safePage - 1) * pageSize, safePage * pageSize)
  const pagedIds = paged.map((row, index) => getRowId(row, (safePage - 1) * pageSize + index))
  const pagedSelectedCount = pagedIds.filter((id) => selectedIds.has(id)).length
  const allPagedSelected = paged.length > 0 && pagedSelectedCount === paged.length
  const from = total === 0 ? 0 : (safePage - 1) * pageSize + 1
  const to = total === 0 ? 0 : Math.min(safePage * pageSize, total)

  const toggleAll = () => {
    const next = new Set(selectedIds)
    if (allPagedSelected) pagedIds.forEach((id) => next.delete(id))
    else pagedIds.forEach((id) => next.add(id))
    setSelectedIds(next)
  }

  const toggleOne = (id: string) => {
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelectedIds(next)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <FilterDropdown
              key={f.label}
              label={f.label}
              options={f.options}
              value={f.value}
              onValueChange={f.onChange}
            />
          ))}
        </div>
        <div className={featureSearchWrapperClassName}>
          <Input
            density="compact"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder={searchPlaceholder}
            leftIcon={<EventIcon name="search-line" size={EVENT_ICON_SIZE.search} />}
            aria-label={searchPlaceholder}
            className={featureSearchInputClassName}
          />
        </div>
      </div>
      <div className={tableSurfaceClassName}>
        <div className="w-full overflow-x-auto">
          <div style={{ minWidth: 820 }}>
            <Table contained={false} className="w-full table-fixed">
              {colgroup}
              <TableHeader>
                <TableRow className={tableHeaderRowClassName}>
                  <TableHead className={cn(tableHeadCellClassName, tableHeadSelectClassName)}>
                    <div className={tableSelectControlClassName}>
                      <Checkbox
                        size="sm"
                        checked={allPagedSelected ? true : pagedSelectedCount > 0 ? "indeterminate" : false}
                        onCheckedChange={toggleAll}
                        disabled={paged.length === 0}
                        aria-label={selectAllLabel}
                      />
                    </div>
                  </TableHead>
                  {headerCells}
                  <TableHead className={cn(tableHeadCellClassName, tableHeadActionsClassName)} />
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((row, index) => {
                  const rowId = getRowId(row, (safePage - 1) * pageSize + index)
                  return (
                    <TableRow key={rowId} data-state={selectedIds.has(rowId) ? "selected" : undefined}>
                      <TableCell className={tableCellSelectClassName} onClick={(event) => event.stopPropagation()}>
                        <div className={tableSelectControlClassName}>
                          <Checkbox
                            size="sm"
                            checked={selectedIds.has(rowId)}
                            onCheckedChange={() => toggleOne(rowId)}
                            aria-label={`Select row ${rowId}`}
                          />
                        </div>
                      </TableCell>
                      {renderRow(row, (safePage - 1) * pageSize + index)}
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </div>
        <DataTablePagination
          from={from}
          to={to}
          total={total}
          page={safePage}
          pageSize={pageSize}
          totalPages={totalPages}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size)
            setPage(1)
          }}
        />
      </div>
    </div>
  )
}

function EventsTab({ v }: { v: VolunteerDetail }) {
  const [query, setQuery] = useState("")
  const [type, setType] = useState("All types")
  const [visibility, setVisibility] = useState("All visibility")
  const [status, setStatus] = useState("All status")
  const rows = v.events.filter((row) => {
    if (type !== "All types" && row.eventType !== type) return false
    if (visibility !== "All visibility" && (row.visibility === "private" ? "Private" : "Public") !== visibility) return false
    if (status !== "All status" && row.lifecycle !== status) return false
    if (query.trim() && !`${row.title} ${row.description}`.toLowerCase().includes(query.trim().toLowerCase())) return false
    return true
  })
  return (
    <TableShell
      rows={rows}
      getRowId={(row) => row.id}
      selectAllLabel="Select all events"
      query={query}
      onQueryChange={setQuery}
      searchPlaceholder="Search events"
      filters={[
        { label: "Event type", options: ["All types", "Cause", "Need"], value: type, onChange: setType },
        { label: "Category", options: ["All categories", "Youth Development", "Education"], value: "All categories", onChange: () => {} },
        { label: "Visibility", options: ["All visibility", "Public", "Private"], value: visibility, onChange: setVisibility },
        { label: "Status", options: ["All status", "Upcoming", "Active", "Completed"], value: status, onChange: setStatus },
        { label: "Date", options: ["Any date", "Today", "This week", "This month"], value: "Any date", onChange: () => {} },
      ]}
      colgroup={
        <colgroup>
          <col style={{ width: "48px" }} />
          <col style={{ width: "28%" }} />
          <col style={{ width: "12%" }} />
          <col style={{ width: "14%" }} />
          <col style={{ width: "18%" }} />
          <col style={{ width: "16%" }} />
          <col style={{ width: "48px" }} />
        </colgroup>
      }
      headerCells={
        <>
          <TableHead>Event</TableHead>
          <TableHead>Event type</TableHead>
          <TableHead>Visibility</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Date</TableHead>
        </>
      }
      renderRow={(row) => {
        const VisIcon = row.visibility === "private" ? PrivateVisibilityIcon : PublicVisibilityIcon
        return (
          <>
            <TableCell>
              <div className="flex items-center gap-3">
                <span className="size-10 shrink-0 overflow-hidden rounded-lg bg-bg-default-100">
                  <img src={row.thumbnailUrl} alt="" className="size-full object-cover" onError={(e) => (e.currentTarget.style.visibility = "hidden")} />
                </span>
                <div className="flex min-w-0 flex-col">
                  <span className="type-table-cell-primary truncate">{row.title}</span>
                  <span className="type-table-cell-secondary truncate">{row.description}</span>
                </div>
              </div>
            </TableCell>
            <TableCell className="type-table-cell-primary">{row.eventType}</TableCell>
            <TableCell>
              <div className="flex items-start gap-2">
                <VisIcon className="mt-0.5 shrink-0" />
                <div className="flex flex-col">
                  <span className="type-table-cell-primary">{row.visibility === "private" ? "Private" : "Public"}</span>
                  <span className="type-table-cell-secondary">{row.lifecycle}</span>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap items-center gap-1">
                {row.categories.map((c) => (
                  <StatusTag key={c}>{c}</StatusTag>
                ))}
                {row.extraCount > 0 ? <StatusTag>+{row.extraCount}</StatusTag> : null}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-col">
                <span className="type-table-cell-primary">{row.date}</span>
                <span className="type-table-cell-secondary">{row.time}</span>
              </div>
            </TableCell>
            <TableCell className={cn(tableCellActionsClassName, "text-right")} onClick={(event) => event.stopPropagation()}>
              <RowMenu
                items={[
                  { icon: "eye-fill", label: "View details" },
                  { icon: "user-group-fill", label: "View volunteers" },
                  { icon: "share-2-fill", label: "Get shareable link" },
                ]}
              />
            </TableCell>
          </>
        )
      }}
    />
  )
}

function DonationStatusTag({ status }: { status: "in-transit" | "completed" }) {
  return status === "completed" ? (
    <span className="inline-flex h-6 items-center gap-1 rounded-lg bg-[#e7f7ed] px-2 text-xs font-medium leading-4 text-[#2f9e57]">
      <EventIcon name="check-circle-fill" size={12} /> Completed
    </span>
  ) : (
    <span className="inline-flex h-6 items-center gap-1 rounded-lg bg-bg-accent-soft px-2 text-xs font-medium leading-4 text-[#b25e09]">
      <EventIcon name="box-3-fill" size={12} /> In transit
    </span>
  )
}

function DonationsTab({ v }: { v: VolunteerDetail }) {
  const [query, setQuery] = useState("")
  const [type, setType] = useState("All types")
  const [status, setStatus] = useState("All status")
  const rows = v.donations.filter((row) => {
    const typeLabel = row.type === "in-kind" ? "In kind" : "In cash"
    const statusLabel = row.status === "completed" ? "Completed" : "In transit"
    if (type !== "All types" && typeLabel !== type) return false
    if (status !== "All status" && statusLabel !== status) return false
    if (query.trim() && !`${row.id} ${typeLabel} ${row.detail}`.toLowerCase().includes(query.trim().toLowerCase())) return false
    return true
  })
  return (
    <TableShell
      rows={rows}
      getRowId={(row, index) => `${row.id}-${index}`}
      selectAllLabel="Select all donations"
      query={query}
      onQueryChange={setQuery}
      searchPlaceholder="Search donations"
      filters={[
        { label: "Donation type", options: ["All types", "In cash", "In kind"], value: type, onChange: setType },
        { label: "Status", options: ["All status", "In transit", "Completed"], value: status, onChange: setStatus },
        { label: "Date", options: ["Any date", "Today", "This week", "This month"], value: "Any date", onChange: () => {} },
      ]}
      colgroup={
        <colgroup>
          <col style={{ width: "48px" }} />
          <col style={{ width: "26%" }} />
          <col style={{ width: "26%" }} />
          <col style={{ width: "18%" }} />
          <col style={{ width: "18%" }} />
          <col style={{ width: "48px" }} />
        </colgroup>
      }
      headerCells={
        <>
          <TableHead>Donation id</TableHead>
          <TableHead>Donation type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
        </>
      }
      renderRow={(row) => (
        <>
          <TableCell>
            <span className="inline-flex items-center rounded-md bg-bg-default-100 px-2 py-0.5 text-xs font-medium text-text-table-header">
              {row.id}
            </span>
          </TableCell>
          <TableCell>
            <div className="flex flex-col">
              <span className="type-table-cell-primary">{row.type === "in-kind" ? "In kind" : "In cash"}</span>
              <span className="type-table-cell-secondary">{row.detail}</span>
            </div>
          </TableCell>
          <TableCell>
            <DonationStatusTag status={row.status} />
          </TableCell>
          <TableCell className="type-table-cell-secondary">{row.date}</TableCell>
          <TableCell className={cn(tableCellActionsClassName, "text-right")} onClick={(event) => event.stopPropagation()}>
            <RowMenu
              items={[
                { icon: "eye-fill", label: "View details" },
                { icon: "check-circle-fill", label: "Confirm receipt" },
                { icon: "flag-2-fill", label: "Flag issues" },
              ]}
            />
          </TableCell>
        </>
      )}
    />
  )
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => (
        <EventIcon
          key={index}
          name={index < rating ? "star-fill-accent" : "star-fill"}
          size={EVENT_ICON_SIZE.meta}
          className="shrink-0"
        />
      ))}
    </div>
  )
}

function ReviewsTab({ v, onOpenReview }: { v: VolunteerDetail; onOpenReview: (review: ReviewDetail) => void }) {
  const [query, setQuery] = useState("")
  const [rating, setRating] = useState("All ratings")
  const rows = v.reviews.filter((row) => {
    if (rating !== "All ratings" && `${row.rating} stars` !== rating) return false
    if (query.trim() && !`${row.eventTitle} ${row.review}`.toLowerCase().includes(query.trim().toLowerCase())) return false
    return true
  })
  const openReview = (row: (typeof rows)[number]) =>
    onOpenReview({
      eventTitle: "Weekend teaching program at Makoko community",
      rating: row.rating,
      review: row.review,
      dateAdded: "7 Jan 2025 12:20 PM",
    })
  return (
    <TableShell
      rows={rows}
      getRowId={(row) => row.id}
      selectAllLabel="Select all reviews"
      query={query}
      onQueryChange={setQuery}
      searchPlaceholder="Search reviews"
      filters={[
        { label: "Ratings", options: ["All ratings", "5 stars", "4 stars", "3 stars"], value: rating, onChange: setRating },
        { label: "Date", options: ["Any date", "Today", "This week", "This month"], value: "Any date", onChange: () => {} },
      ]}
      colgroup={
        <colgroup>
          <col style={{ width: "48px" }} />
          <col style={{ width: "24%" }} />
          <col style={{ width: "16%" }} />
          <col style={{ width: "34%" }} />
          <col style={{ width: "16%" }} />
          <col style={{ width: "48px" }} />
        </colgroup>
      }
      headerCells={
        <>
          <TableHead>Event</TableHead>
          <TableHead>Rating</TableHead>
          <TableHead>Review</TableHead>
          <TableHead>Date</TableHead>
        </>
      }
      renderRow={(row) => (
        <>
          <TableCell className="cursor-pointer" onClick={() => openReview(row)}>
            <div className="flex items-center gap-3">
              <span className="size-10 shrink-0 overflow-hidden rounded-lg bg-bg-default-100">
                <img src={row.thumbnailUrl} alt="" className="size-full object-cover" onError={(e) => (e.currentTarget.style.visibility = "hidden")} />
              </span>
              <div className="flex min-w-0 flex-col">
                <span className="type-table-cell-primary truncate">{row.eventTitle}</span>
                <span className="type-table-cell-secondary truncate">{row.eventDescription}</span>
              </div>
            </div>
          </TableCell>
          <TableCell className="cursor-pointer" onClick={() => openReview(row)}>
            <StarRating rating={row.rating} />
          </TableCell>
          <TableCell className="type-table-cell-secondary cursor-pointer" onClick={() => openReview(row)}>
            <span className="line-clamp-1">&ldquo;{row.review}&rdquo;</span>
          </TableCell>
          <TableCell className="type-table-cell-secondary cursor-pointer" onClick={() => openReview(row)}>
            {row.date}
          </TableCell>
          <TableCell className={cn(tableCellActionsClassName, "cursor-pointer")} onClick={() => openReview(row)}>
            <div className={tableSelectControlClassName}>
              <EventIcon name="arrow-right-fill" size={EVENT_ICON_SIZE.meta} className="text-icon-neutral" />
            </div>
          </TableCell>
        </>
      )}
    />
  )
}

function RowMenu({ items }: { items: { icon: EventIconName; label: string }[] }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Row actions"
          className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full text-icon-neutral outline-none transition-colors hover:bg-bg-default-100 focus-visible:ring-2 focus-visible:ring-border-input-active"
          onClick={(event) => event.stopPropagation()}
        >
          <EventIcon name="more-1-fill" size={EVENT_ICON_SIZE.tableMore} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[11rem]">
        {items.map((item) => (
          <DropdownMenuItem
            key={item.label}
            onSelect={() =>
              toast({ title: "Coming soon", description: `${item.label} will be available after API integration.` })
            }
          >
            <EventIcon name={item.icon} size={EVENT_ICON_SIZE.dropdownItem} className="text-icon-neutral" />
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function VolunteerDetailPage() {
  const { volunteerId } = useParams()
  const navigate = useNavigate()
  const [volunteer, setVolunteer] = useState<VolunteerDetail>(() => getVolunteerDetail(volunteerId))
  const [tab, setTab] = useState<VolunteerDetailTab>("overview")
  const [reviewModal, setReviewModal] = useState<ReviewDetail | null>(null)
  const [blacklistOpen, setBlacklistOpen] = useState(false)
  const v = volunteer

  const toggleBlacklist = () => {
    const next = v.status === "active" ? "blacklisted" : "active"
    setVolunteer((prev) => ({ ...prev, status: next }))
    toast({
      variant: "success",
      title: next === "blacklisted" ? "Volunteer added to blacklist" : "Volunteer removed from blacklist",
    })
  }

  const content = useMemo(() => {
    switch (tab) {
      case "events":
        return <EventsTab v={v} />
      case "donations":
        return <DonationsTab v={v} />
      case "reviews":
        return <ReviewsTab v={v} onOpenReview={setReviewModal} />
      default:
        return <OverviewTab v={v} />
    }
  }, [tab, v])

  return (
    <DashboardLayout activeTab="volunteers">
      <div className={cn(dashboardDetailContentClassName, "flex flex-col gap-5 py-5")}>
        {/* breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-text-table-header">
          <button
            type="button"
            onClick={() => navigate(DASHBOARD_TAB_PATHS.volunteers)}
            className="cursor-pointer transition-colors hover:text-text-events-strong"
          >
            Volunteers
          </button>
          <EventIcon name="arrow-right-line" size={12} className="shrink-0 text-icon-neutral" />
          <span className="text-text-events-strong">{v.name}</span>
        </nav>

        {/* header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <PersonAvatar name={v.name} tone={v.avatarTone} imageUrl={v.avatarImage} size={56} />
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-2xl font-semibold leading-8 tracking-[-0.1px] text-text-events-strong">
                  {v.name}
                </h1>
                <StatusPill status={v.status} />
              </div>
              <p className="text-sm leading-[22px] text-text-table-header">
                @{v.handle} · Joined {v.joined}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="neutral"
              size="sm"
              className="h-9 rounded-lg"
              leftIcon={<EventIcon name="inbox-fill" size={EVENT_ICON_SIZE.buttonLeading} />}
              onClick={() => toast({ title: "Coming soon", description: "Messaging will be available after API integration." })}
            >
              Send message
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="neutral" size="sm" className="size-9 rounded-lg px-0" aria-label="More actions">
                  <EventIcon name="more-1-fill" size={EVENT_ICON_SIZE.tableMore} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[11rem]">
                {v.status === "blacklisted" ? (
                  <DropdownMenuItem className="text-text-success focus:bg-bg-success-soft" onSelect={() => setBlacklistOpen(true)}>
                    <EventIcon name="stop-fill" size={EVENT_ICON_SIZE.dropdownItem} success />
                    Remove from blacklist
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem className="text-text-negative focus:bg-bg-negative-soft" onSelect={() => setBlacklistOpen(true)}>
                    <EventIcon name="stop-fill" size={EVENT_ICON_SIZE.dropdownItem} negative />
                    Add to blacklist
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* tabs */}
        <div className="flex gap-6 border-b border-border-default-100">
          {TABS.map((t) => {
            const active = t.id === tab
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  "type-events-tab relative cursor-pointer pb-3 transition-colors",
                  active
                    ? "text-text-events-strong after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:rounded-full after:bg-bg-accent"
                    : "text-text-table-header hover:text-text-neutral-400",
                )}
              >
                {t.label}
              </button>
            )
          })}
        </div>

        {content}
      </div>

      <VolunteerReviewDetailsModal review={reviewModal} onClose={() => setReviewModal(null)} />

      <ConfirmModal
        open={blacklistOpen}
        onClose={() => setBlacklistOpen(false)}
        title={v.status === "active" ? "Add to blacklist" : "Remove from blacklist"}
        description={
          v.status === "active"
            ? "You're about to add this volunteer to blacklist. This means this volunteer will no longer be able to see or participate in future events."
            : "You're about to remove this volunteer from the blacklist. They will be able to see and participate in future events again."
        }
        confirmLabel={v.status === "active" ? "Blacklist" : "Remove"}
        cancelLabel="Close"
        variant={v.status === "active" ? "destructive" : "primary"}
        onConfirm={() => {
          toggleBlacklist()
          setBlacklistOpen(false)
        }}
      />
    </DashboardLayout>
  )
}
