import { useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  CalendarDays,
  Cake,
  ChevronRight,
  Flag,
  Heart,
  Mail,
  MessageSquare,
  MoreHorizontal,
  Phone,
  Search,
  ShieldBan,
  ShieldCheck,
  Sparkles,
  Star,
  User,
  Users,
  Eye,
  Share2,
  CircleCheck,
  Truck,
} from "lucide-react"
import { DashboardLayout } from "../../components/dashboard/DashboardLayout"
import { DASHBOARD_PAGE_GUTTER_PX } from "../../lib/dashboard-layout"
import { DASHBOARD_TAB_PATHS } from "../../lib/dashboard-paths"
import { DataTablePagination, FilterDropdown } from "../../components/data-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
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
        "inline-flex h-6 items-center rounded-lg px-2 text-xs font-[510] leading-4",
        status === "active" ? "bg-bg-success-soft text-text-success" : "bg-bg-negative-soft text-text-negative",
      )}
    >
      {status === "active" ? "Active" : "Blacklisted"}
    </span>
  )
}

function InfoField({ icon: Icon, label, children }: { icon: typeof Mail; label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="flex items-center gap-1.5 text-xs leading-5 text-text-table-header">
        <Icon className="size-3.5" />
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
          <InfoField icon={User} label="Full name">
            <span className="text-sm font-[510] leading-[22px] text-text-events-strong">{v.name}</span>
          </InfoField>
          <InfoField icon={Mail} label="Email">
            <span className="text-sm font-[510] leading-[22px] text-text-events-strong">{v.email}</span>
          </InfoField>
          <InfoField icon={Phone} label="Phone number">
            <span className="text-sm font-[510] leading-[22px] text-text-events-strong">{v.phone}</span>
          </InfoField>
          <InfoField icon={Cake} label="Date of birth">
            <span className="text-sm font-[510] leading-[22px] text-text-events-strong">{v.dateOfBirth}</span>
          </InfoField>
          <InfoField icon={Sparkles} label="Skills">
            <Chips items={v.skills} />
          </InfoField>
          <InfoField icon={Heart} label="Interests">
            <Chips items={v.interests} />
          </InfoField>
          <InfoField icon={CalendarDays} label="Account created">
            <span className="text-sm font-[510] leading-[22px] text-text-events-strong">{v.accountCreated}</span>
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
                <p className="truncate text-sm font-[510] leading-[22px] text-text-events-strong">{row.event}</p>
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
          <div className="border-t border-border-default-100 px-4 pb-4">
            <DataTablePagination
              from={1}
              to={1}
              total={1}
              page={1}
              pageSize={10}
              totalPages={1}
              onPageChange={() => {}}
            />
          </div>
        </section>
      </div>
    </div>
  )
}

type ShellFilter = { label: string; options: string[]; value: string; onChange: (value: string) => void }

function TableShell({
  filters,
  query,
  onQueryChange,
  searchPlaceholder,
  head,
  children,
  total,
}: {
  filters: ShellFilter[]
  query: string
  onQueryChange: (value: string) => void
  searchPlaceholder: string
  head: React.ReactNode
  children: React.ReactNode
  total: number
}) {
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
        <div className="w-full xl:max-w-[300px]">
          <Input
            density="compact"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder={searchPlaceholder}
            leftIcon={<Search className="size-4" />}
            aria-label={searchPlaceholder}
          />
        </div>
      </div>
      <div className="rounded-xl border border-border-default-100 bg-bg-canvas">
        <div className="w-full overflow-x-auto">
          <div style={{ minWidth: 820 }}>
            <Table contained={false} className="w-full table-fixed">
              {head}
              <TableBody>{children}</TableBody>
            </Table>
          </div>
        </div>
        <DataTablePagination
          className="border-t border-border-default-100 px-4 pb-4"
          from={1}
          to={total}
          total={total}
          page={1}
          pageSize={10}
          totalPages={1}
          onPageChange={() => {}}
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
      total={rows.length}
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
      head={
        <>
          <colgroup>
            <col style={{ width: "3rem" }} />
            <col style={{ width: "28%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "3rem" }} />
          </colgroup>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-10" />
              <TableHead>Event</TableHead>
              <TableHead>Event type</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
        </>
      }
    >
      {rows.map((row) => {
        const VisIcon = row.visibility === "private" ? PrivateVisibilityIcon : PublicVisibilityIcon
        return (
          <TableRow key={row.id}>
            <TableCell />
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
            <TableCell className="text-right">
              <RowMenu
                items={[
                  { icon: Eye, label: "View details" },
                  { icon: Users, label: "View volunteers" },
                  { icon: Share2, label: "Get shareable link" },
                ]}
              />
            </TableCell>
          </TableRow>
        )
      })}
    </TableShell>
  )
}

function DonationStatusTag({ status }: { status: "in-transit" | "completed" }) {
  return status === "completed" ? (
    <span className="inline-flex h-6 items-center gap-1 rounded-lg bg-[#e7f7ed] px-2 text-xs font-[510] leading-4 text-[#2f9e57]">
      <CircleCheck className="size-3" /> Completed
    </span>
  ) : (
    <span className="inline-flex h-6 items-center gap-1 rounded-lg bg-bg-accent-soft px-2 text-xs font-[510] leading-4 text-[#b25e09]">
      <Truck className="size-3" /> In transit
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
      total={rows.length}
      query={query}
      onQueryChange={setQuery}
      searchPlaceholder="Search donations"
      filters={[
        { label: "Donation type", options: ["All types", "In cash", "In kind"], value: type, onChange: setType },
        { label: "Status", options: ["All status", "In transit", "Completed"], value: status, onChange: setStatus },
        { label: "Date", options: ["Any date", "Today", "This week", "This month"], value: "Any date", onChange: () => {} },
      ]}
      head={
        <>
          <colgroup>
            <col style={{ width: "3rem" }} />
            <col style={{ width: "26%" }} />
            <col style={{ width: "26%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "3rem" }} />
          </colgroup>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-10" />
              <TableHead>Donation id</TableHead>
              <TableHead>Donation type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
        </>
      }
    >
      {rows.map((row, index) => (
        <TableRow key={`${row.id}-${index}`}>
          <TableCell />
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
          <TableCell className="text-right">
            <RowMenu
              items={[
                { icon: Eye, label: "View details" },
                { icon: CircleCheck, label: "Confirm receipt" },
                { icon: Flag, label: "Flag issues" },
              ]}
            />
          </TableCell>
        </TableRow>
      ))}
    </TableShell>
  )
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={cn(
            "size-4",
            index < rating ? "fill-bg-accent text-bg-accent" : "fill-bg-default-100 text-bg-default-100",
          )}
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
  return (
    <TableShell
      total={rows.length}
      query={query}
      onQueryChange={setQuery}
      searchPlaceholder="Search reviews"
      filters={[
        { label: "Ratings", options: ["All ratings", "5 stars", "4 stars", "3 stars"], value: rating, onChange: setRating },
        { label: "Date", options: ["Any date", "Today", "This week", "This month"], value: "Any date", onChange: () => {} },
      ]}
      head={
        <>
          <colgroup>
            <col style={{ width: "3rem" }} />
            <col style={{ width: "24%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "34%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "3rem" }} />
          </colgroup>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-10" />
              <TableHead>Event</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Review</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
        </>
      }
    >
      {rows.map((row) => (
        <TableRow
          key={row.id}
          className="cursor-pointer"
          onClick={() =>
            onOpenReview({
              eventTitle: "Weekend teaching program at Makoko community",
              rating: row.rating,
              review: row.review,
              dateAdded: "7 Jan 2025 12:20 PM",
            })
          }
        >
          <TableCell />
          <TableCell>
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
          <TableCell>
            <StarRating rating={row.rating} />
          </TableCell>
          <TableCell className="type-table-cell-secondary">
            <span className="line-clamp-1">&ldquo;{row.review}&rdquo;</span>
          </TableCell>
          <TableCell className="type-table-cell-secondary">{row.date}</TableCell>
          <TableCell className="text-right">
            <ChevronRight className="ml-auto size-4 text-icon-neutral" />
          </TableCell>
        </TableRow>
      ))}
    </TableShell>
  )
}

function RowMenu({ items }: { items: { icon: typeof Eye; label: string }[] }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Row actions"
          className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full text-icon-neutral outline-none transition-colors hover:bg-bg-default-100 focus-visible:ring-2 focus-visible:ring-border-input-active"
          onClick={(event) => event.stopPropagation()}
        >
          <MoreHorizontal className="size-4" />
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
            <item.icon className="size-4 text-icon-neutral" />
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

  const GUTTER = { paddingLeft: DASHBOARD_PAGE_GUTTER_PX, paddingRight: DASHBOARD_PAGE_GUTTER_PX }

  return (
    <DashboardLayout activeTab="volunteers">
      <div style={GUTTER} className="flex flex-col gap-5 py-5">
        {/* breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-text-table-header">
          <button
            type="button"
            onClick={() => navigate(DASHBOARD_TAB_PATHS.volunteers)}
            className="cursor-pointer transition-colors hover:text-text-events-strong"
          >
            Volunteers
          </button>
          <ChevronRight className="size-3 shrink-0" />
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
              leftIcon={<MessageSquare className="size-4" />}
              onClick={() => toast({ title: "Coming soon", description: "Messaging will be available after API integration." })}
            >
              Send message
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="neutral" size="sm" className="size-9 rounded-lg px-0" aria-label="More actions">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[11rem]">
                {v.status === "blacklisted" ? (
                  <DropdownMenuItem className="text-text-success focus:bg-bg-success-soft" onSelect={() => setBlacklistOpen(true)}>
                    <ShieldCheck className="size-4 text-text-success" />
                    Remove from blacklist
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem className="text-text-negative focus:bg-bg-negative-soft" onSelect={() => setBlacklistOpen(true)}>
                    <ShieldBan className="size-4 text-icon-negative" />
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
