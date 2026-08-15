import { useMemo, useState } from "react"
import { cn } from "../../../lib/utils"
import { Input } from "../../ui/input"
import { Textarea } from "../../ui/textarea"
import { Checkbox } from "../../ui/checkbox"
import { ConfirmModal } from "../../ui/confirm-modal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu"
import { CapacityBreakdownModal } from "./CapacityBreakdownModal"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table"
import { DataTableEmptyState, DataTablePagination, FilterDropdown, RowActionsDropdown } from "../../data-table"
import type { RowActionConfig } from "../../data-table"
import { toast } from "../../../hooks/use-toast"
import { updateCauseParticipantStatus } from "../../../lib/api/cause-participants"
import { formatApiError } from "../../../lib/api/format-api-error"
import { useSimulatedLoading } from "../../../hooks/use-simulated-loading"
import { DetailTableSkeleton } from "./DetailTableSkeleton"
import type {
  Volunteer,
  VolunteersData,
  VolunteerStatus,
} from "../../../pages/dashboard/event-detail-types"
import { EventIcon } from "../icons/EventIcon"
import { EVENT_ICON_SIZE } from "../icons/event-icon-sizes"
import {
  elevatedCardSurfaceClassName,
  NewVolunteerBadge,
  OverviewCapacityBadge,
  OverviewCard,
  OverviewViewButton,
  TableSkillTag,
} from "./detail-primitives"
import { PersonAvatar } from "./PersonAvatar"
import { VolunteerStatusTag } from "./VolunteerStatusTag"
import { VolunteerDetailsModal } from "./VolunteerDetailsModal"

type VolunteerActionType = "accept" | "decline" | "waitlist" | "remove"

const ACTION_CONFIG: Record<
  VolunteerActionType,
  { title: string; description: string; confirmLabel: string; variant: "primary" | "destructive"; withReason?: boolean }
> = {
  accept: {
    title: "Accept request",
    description:
      "You're about to accept this volunteer's request to join this cause. This means that they become a participant of the cause and can attend the event.",
    confirmLabel: "Accept request",
    variant: "primary",
  },
  decline: {
    title: "Decline request",
    description:
      "You're about to decline this volunteer's request to join this event. This means that you don't want them to be a participant of this event.",
    confirmLabel: "Decline request",
    variant: "destructive",
  },
  waitlist: {
    title: "Add to waitlist",
    description: "They would be notified that they have been added to waitlist.",
    confirmLabel: "Add to waitlist",
    variant: "primary",
  },
  remove: {
    title: "Remove volunteer",
    description:
      "You're about to remove this volunteer from the event. Let them know why you're removing them.",
    confirmLabel: "Remove volunteer",
    variant: "destructive",
    withReason: true,
  },
}

const ROW_ACTIONS: RowActionConfig[] = [
  { id: "view", label: "View details", iconName: "eye-fill" },
  { id: "accept", label: "Accept request", iconName: "check-fill" },
  { id: "waitlist", label: "Add to waitlist", iconName: "add-circle-fill" },
  { id: "decline", label: "Decline request", iconName: "close-fill" },
  { id: "remove", label: "Remove volunteer", iconName: "delete-fill", destructive: true },
]

function SkillsCell({ skills }: { skills: string[] }) {
  const [first, ...rest] = skills
  if (!first) return <span className="text-text-table-header">--</span>
  return (
    <div className="flex items-center gap-2">
      <TableSkillTag>{first}</TableSkillTag>
      {rest.length > 0 ? <TableSkillTag muted>+{rest.length}</TableSkillTag> : null}
    </div>
  )
}

function recomputeTotals(
  rows: Volunteer[],
  prev: VolunteersData["totals"],
): VolunteersData["totals"] {
  const accepted = rows.filter((row) => row.status === "accepted").length
  return {
    ...prev,
    volunteers: { ...prev.volunteers, current: accepted },
    spotsLeft: Math.max(0, prev.volunteers.max - accepted),
    pending: rows.filter((row) => row.status === "pending").length,
    waitlists: rows.filter((row) => row.status === "waitlist").length,
  }
}

export function VolunteersTab({
  data,
  onChange,
  causeUuid,
}: {
  data: VolunteersData
  onChange: (data: VolunteersData) => void
  /** When set, accept/decline hit the participants API instead of mutating locally. */
  causeUuid?: string | null
}) {
  const [search, setSearch] = useState("")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [detailVolunteer, setDetailVolunteer] = useState<Volunteer | null>(null)
  const [action, setAction] = useState<{ type: VolunteerActionType; volunteer: Volunteer } | null>(null)
  const [reason, setReason] = useState("")
  const [bulk, setBulk] = useState<"accept" | "decline" | "waitlist" | null>(null)
  const [capacityOpen, setCapacityOpen] = useState(false)
  const [filters, setFilters] = useState({ skills: "All skills", status: "All status", date: "All time" })
  const loading = useSimulatedLoading()

  const rows = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return data.rows
    return data.rows.filter((row) =>
      [row.name, row.email, row.skills.join(" "), row.reason ?? ""].join(" ").toLowerCase().includes(query),
    )
  }, [data.rows, search])

  const allSelected = rows.length > 0 && rows.every((row) => selectedIds.has(row.id))
  const someSelected = rows.some((row) => selectedIds.has(row.id))

  const toggleAll = () => {
    setSelectedIds(allSelected ? new Set() : new Set(rows.map((row) => row.id)))
  }

  const toggleOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleRowAction = (volunteer: Volunteer, actionId: string) => {
    if (actionId === "view") {
      setDetailVolunteer(volunteer)
      return
    }
    setAction({ type: actionId as VolunteerActionType, volunteer })
    setReason("")
  }

  const commitRows = (rows: Volunteer[]) => {
    onChange({ ...data, rows, totals: recomputeTotals(rows, data.totals) })
  }

  const clearSelection = (id: string) =>
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })

  const applyLocalDecision = (type: VolunteerActionType, volunteer: Volunteer) => {
    const nextStatus: VolunteerStatus | null =
      type === "accept" ? "accepted" : type === "waitlist" ? "waitlist" : null
    const rows = nextStatus
      ? data.rows.map((row) => (row.id === volunteer.id ? { ...row, status: nextStatus } : row))
      : data.rows.filter((row) => row.id !== volunteer.id) // decline / remove
    commitRows(rows)
    toast({ variant: "success", title: `${ACTION_CONFIG[type].confirmLabel} · ${volunteer.name}` })
    setDetailVolunteer(null)
    clearSelection(volunteer.id)
  }

  const confirmAction = () => {
    if (!action) return
    const { type, volunteer } = action

    // Accept/decline are the only API-backed decisions; waitlist/remove stay local
    // until the participants API supports them.
    if (causeUuid && (type === "accept" || type === "decline")) {
      void (async () => {
        try {
          await updateCauseParticipantStatus(
            causeUuid,
            volunteer.id,
            type === "accept" ? "approved" : "rejected",
          )
          applyLocalDecision(type, volunteer)
        } catch (error) {
          toast({
            variant: "destructive",
            title: type === "accept" ? "Unable to accept request" : "Unable to decline request",
            description: formatApiError(error, "Please try again."),
          })
        }
      })()
      return
    }

    applyLocalDecision(type, volunteer)
  }

  const activeConfig = action ? ACTION_CONFIG[action.type] : null
  const selectionCount = selectedIds.size

  const bulkConfig = bulk
    ? {
        accept: {
          title: "Accept request",
          description: `You're about to accept the request for ${selectionCount} volunteers to join this cause.`,
          confirmLabel: "Accept request",
          variant: "primary" as const,
        },
        decline: {
          title: "Decline request",
          description: `You're about to decline ${selectionCount} volunteers's request. This means that you don't want them to be participants of this event.`,
          confirmLabel: "Decline request",
          variant: "destructive" as const,
        },
        waitlist: {
          title: "Add to waitlist",
          description: `You're about to add ${selectionCount} volunteers's request to the waitlist.`,
          confirmLabel: "Add to waitlist",
          variant: "primary" as const,
        },
      }[bulk]
    : null

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row">
        <OverviewCard
          label="Total volunteers"
          value={String(data.totals.volunteers.current)}
          suffix={`/ ${data.totals.volunteers.max}`}
          headerExtra={
            data.totals.spotsLeft > 0 ? (
              <OverviewCapacityBadge>
                {data.totals.spotsLeft} spot left
              </OverviewCapacityBadge>
            ) : null
          }
          footerExtra={
            <OverviewViewButton
              label="View capacity breakdown"
              onClick={() => setCapacityOpen(true)}
            />
          }
        />
        <OverviewCard
          label="Pending requests"
          value={String(data.totals.pending)}
        />
        <OverviewCard label="Waitlists" value={String(data.totals.waitlists)} />
      </div>

      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap gap-2">
          <FilterDropdown
            appearance="events"
            label="Skills"
            options={["All skills", "IT Training", "Teaching", "Public Speaking"]}
            value={filters.skills}
            onValueChange={(value) => setFilters((prev) => ({ ...prev, skills: value }))}
          />
          <FilterDropdown
            appearance="events"
            label="Status"
            options={["All status", "Pending", "Accepted", "Waitlist"]}
            value={filters.status}
            onValueChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
          />
          <FilterDropdown
            appearance="events"
            label="Date applied"
            options={["All time", "Today", "This week", "This month"]}
            value={filters.date}
            onValueChange={(value) => setFilters((prev) => ({ ...prev, date: value }))}
          />
        </div>
        <div className="w-full xl:max-w-[400px]">
          <Input
            density="compact"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search volunteers"
            leftIcon={<EventIcon name="search-line" size={EVENT_ICON_SIZE.search} />}
            aria-label="Search volunteers"
            className="h-8 min-h-8 rounded-[10px] border-0 bg-[#EDF0F2] shadow-none"
          />
        </div>
      </div>

      <div className={cn(elevatedCardSurfaceClassName, "overflow-hidden")}>
        {rows.length > 0 && selectionCount > 0 && !loading ? (
          <div className="flex h-12 items-center justify-between gap-3 border-b border-border-default-100 bg-bg-on-canvas px-4">
            <div className="flex items-center gap-3">
              <Checkbox
                size="sm"
                checked={allSelected ? true : "indeterminate"}
                onCheckedChange={toggleAll}
                aria-label="Select all volunteers"
              />
              <span className="text-sm font-medium leading-[22px] text-text-events-strong">
                {selectionCount} of {data.rows.length} selected
              </span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger className="type-events-filter inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-[10px] bg-button-neutral px-3 text-sm font-semibold leading-[22px] text-text-events-strong shadow-button-neutral outline-none hover:bg-button-neutral-hover focus-visible:ring-2 focus-visible:ring-border-input-active">
                Actions
                <EventIcon name="down-fill" size={EVENT_ICON_SIZE.buttonTrailing} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => setBulk("accept")}>Accept request</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setBulk("waitlist")}>Add to waitlist</DropdownMenuItem>
                <DropdownMenuItem
                  className="text-text-negative focus:bg-bg-negative-soft"
                  onSelect={() => setBulk("decline")}
                >
                  Decline request
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : null}
        {rows.length === 0 && !loading ? (
          <DataTableEmptyState
            title="No volunteers yet"
            description="Once a volunteer sends a request, they would appear here."
          />
        ) : (
          <Table contained={false}>
            {selectionCount === 0 ? (
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-12 px-0 text-center">
                  <Checkbox
                    size="sm"
                    checked={allSelected ? true : someSelected ? "indeterminate" : false}
                    onCheckedChange={toggleAll}
                    aria-label="Select all volunteers"
                  />
                </TableHead>
                <TableHead className="min-w-[240px]">Volunteer</TableHead>
                <TableHead className="min-w-[150px]">Skills</TableHead>
                <TableHead className="min-w-[180px]">Reason</TableHead>
                <TableHead className="w-[120px]">Status</TableHead>
                <TableHead className="w-[140px]">Date applied</TableHead>
                <TableHead className="w-12 px-0 text-center" />
              </TableRow>
            </TableHeader>
            ) : null}
            <TableBody>
              {loading ? (
                <DetailTableSkeleton
                  cells={[
                    "size-4",
                    "avatar",
                    "h-6 w-24 rounded-md",
                    "h-3 w-40",
                    "h-6 w-16 rounded-lg",
                    "h-3 w-20",
                    "ml-auto size-8 rounded-full",
                  ]}
                />
              ) : (
                rows.map((row) => (
                <TableRow key={row.id} data-state={selectedIds.has(row.id) ? "selected" : undefined}>
                  <TableCell className="pl-4">
                    <Checkbox
                      size="sm"
                      checked={selectedIds.has(row.id)}
                      onCheckedChange={() => toggleOne(row.id)}
                      aria-label={`Select ${row.name}`}
                    />
                  </TableCell>
                  <TableCell>
                    <button
                      type="button"
                      className="flex items-center gap-3 text-left"
                      onClick={() => setDetailVolunteer(row)}
                    >
                      <PersonAvatar name={row.name} tone={row.avatarTone} imageUrl={row.avatarImage || undefined} size={36} />
                      <span className="flex min-w-0 flex-col">
                        <span className="flex items-center gap-1.5">
                          <span className="type-table-cell-primary truncate">{row.name}</span>
                          {row.isNew ? <NewVolunteerBadge /> : null}
                        </span>
                        <span className="type-table-cell-secondary truncate">{row.email}</span>
                      </span>
                    </button>
                  </TableCell>
                  <TableCell>
                    <SkillsCell skills={row.skills} />
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "block max-w-[220px] truncate",
                        row.reason ? "type-table-cell-primary" : "type-table-cell-secondary",
                      )}
                    >
                      {row.reason ?? "--"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <VolunteerStatusTag status={row.status} />
                  </TableCell>
                  <TableCell className="type-table-cell-secondary">{row.dateApplied}</TableCell>
                  <TableCell className="pr-4 text-right">
                    <RowActionsDropdown
                      actions={ROW_ACTIONS}
                      onAction={(actionId) => handleRowAction(row, actionId)}
                      triggerIcon={
                        <EventIcon name="more-1-fill" size={EVENT_ICON_SIZE.tableMore} />
                      }
                    />
                  </TableCell>
                </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}

        {rows.length > 0 && !loading ? (
          <DataTablePagination
            className="border-t border-border-default-100"
            from={1}
            to={rows.length}
            total={rows.length}
            page={1}
            pageSize={10}
            totalPages={1}
            pageSizeOptions={[10, 25, 50]}
            onPageChange={() => {}}
            onPageSizeChange={() => {}}
          />
        ) : null}
      </div>

      <VolunteerDetailsModal
        volunteer={detailVolunteer}
        onClose={() => setDetailVolunteer(null)}
        onAccept={(volunteer) => {
          setAction({ type: "accept", volunteer })
          setReason("")
        }}
        onDecline={(volunteer) => {
          setAction({ type: "decline", volunteer })
          setReason("")
        }}
        onWaitlist={(volunteer) => {
          setAction({ type: "waitlist", volunteer })
          setReason("")
        }}
        onRemove={(volunteer) => {
          setAction({ type: "remove", volunteer })
          setReason("")
        }}
      />

      {action && activeConfig ? (
        <ConfirmModal
          open
          onClose={() => setAction(null)}
          title={activeConfig.title}
          description={activeConfig.description}
          confirmLabel={activeConfig.confirmLabel}
          variant={activeConfig.variant}
          onConfirm={confirmAction}
        >
          {activeConfig.withReason ? (
            <div className="mt-4 flex flex-col gap-1.5">
              <label className="text-xs font-normal leading-5 text-text-table-header">Reason</label>
              <Textarea
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder="Let the volunteer know why"
                rows={3}
              />
            </div>
          ) : null}
        </ConfirmModal>
      ) : null}

      {bulk && bulkConfig ? (
        <ConfirmModal
          open
          onClose={() => setBulk(null)}
          title={bulkConfig.title}
          description={bulkConfig.description}
          confirmLabel={bulkConfig.confirmLabel}
          variant={bulkConfig.variant}
          onConfirm={() => {
            const targetIds = data.rows.filter((row) => selectedIds.has(row.id)).map((row) => row.id)

            const applyBulk = (ids: string[]) => {
              const applyIds = new Set(ids)
              const nextStatus: VolunteerStatus | null =
                bulk === "accept" ? "accepted" : bulk === "waitlist" ? "waitlist" : null
              const rows = nextStatus
                ? data.rows.map((row) =>
                    applyIds.has(row.id) ? { ...row, status: nextStatus } : row,
                  )
                : data.rows.filter((row) => !applyIds.has(row.id)) // decline
              commitRows(rows)
              setSelectedIds(new Set())
            }

            if (causeUuid && (bulk === "accept" || bulk === "decline")) {
              const apiStatus = bulk === "accept" ? "approved" : "rejected"
              void (async () => {
                const results = await Promise.allSettled(
                  targetIds.map((id) => updateCauseParticipantStatus(causeUuid, id, apiStatus)),
                )
                const succeeded = targetIds.filter((_, index) => results[index]?.status === "fulfilled")
                const failed = targetIds.length - succeeded.length

                if (succeeded.length > 0) applyBulk(succeeded)

                if (failed > 0) {
                  toast({
                    variant: "destructive",
                    title: `${bulkConfig.confirmLabel} failed for ${failed} volunteer${failed === 1 ? "" : "s"}`,
                    description: succeeded.length > 0 ? "The rest were updated." : "Please try again.",
                  })
                } else {
                  toast({ variant: "success", title: `${bulkConfig.confirmLabel} · ${succeeded.length} volunteers` })
                }
              })()
              return
            }

            applyBulk(targetIds)
            toast({ variant: "success", title: `${bulkConfig.confirmLabel} · ${selectionCount} volunteers` })
          }}
        />
      ) : null}

      <CapacityBreakdownModal open={capacityOpen} onClose={() => setCapacityOpen(false)} data={data} />
    </div>
  )
}
