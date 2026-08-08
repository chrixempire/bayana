import { useMemo } from "react"
import { DataTableEmptyState, RowActionsDropdown, TableCellStack } from "../data-table"
import { Checkbox } from "../ui/checkbox"
import { SegmentedProgress } from "../ui/segmented-progress"
import { Skeleton } from "../ui/skeleton"
import { StatusTag } from "../ui/status-tag"
import {
  TableCell,
  TableHead,
  TableRow,
  tableCellActionsClassName,
  tableCellSelectClassName,
  tableHeadActionsClassName,
  tableHeadSelectClassName,
  tableHeaderRowClassName,
  tableSelectControlClassName,
} from "../ui/table"
import { cn } from "../../lib/utils"
import {
  tableHeadCellClassName,
} from "../../lib/table-styles"
import type {
  EventsColumnDef,
  EventTableRow,
  EventsPageConfig,
} from "../../pages/dashboard/events-types"
import { EventCollabBadge, type EventCollabBadgeVariant } from "./icons/EventChipBadge"
import {
  DraftsVisibilityIcon,
  PrivateVisibilityIcon,
  PublicVisibilityIcon,
} from "./icons/VisibilityIcons"

const EMPTY_CELL = "—"
const TABLE_CLASS = "w-full table-fixed border-collapse caption-bottom"
const TABLE_MIN_WIDTH_PX = 1024

/** Column width by type — table-fixed relies on these. */
const COLUMN_WIDTHS: Record<string, string> = {
  checkbox: "48px",
  cause: "24%",
  collaborator: "16%",
  eventType: "10%",
  visibility: "12%",
  category: "14%",
  volunteerType: "16%",
  date: "14%",
  volunteers: "11%",
  actions: "48px",
}

const COLLABORATOR_TONE: Record<string, string> = {
  orange: "bg-bg-accent",
  purple: "bg-[#7c3aed]",
  blue: "bg-[#2ea1fe]",
  green: "bg-[#36b55c]",
}

const REQUEST_BADGES: Record<string, EventCollabBadgeVariant> = {
  "new-request": "new-request",
  organizer: "organizer",
  pending: "pending",
}

type EventsTableProps = {
  rows: EventTableRow[]
  columns: EventsPageConfig["columns"]
  rowActions: EventsPageConfig["rowActions"]
  draftRowActions?: EventsPageConfig["draftRowActions"]
  emptyState: EventsPageConfig["emptyState"]
  selectedIds: Set<string>
  onSelectedIdsChange: (ids: Set<string>) => void
  onRowAction?: (rowId: string, actionId: string) => void
  onRowClick?: (row: EventTableRow) => void
  loading?: boolean
  className?: string
}

function EventsTableColGroup({ columns }: { columns: EventsColumnDef[] }) {
  return (
    <colgroup>
      {columns.map((column) => (
        <col key={column.id} style={{ width: COLUMN_WIDTHS[column.type] ?? "12%" }} />
      ))}
    </colgroup>
  )
}

function formatLifecycleLabel(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

function VisibilityCell({ row }: { row: EventTableRow }) {
  const { type, lifecycleStatus } = row.visibility

  if (type === "drafts") {
    return (
      <div className="flex items-center gap-3">
        <DraftsVisibilityIcon className="shrink-0" />
        <TableCellStack primary="Drafts" />
      </div>
    )
  }

  const Icon = type === "private" ? PrivateVisibilityIcon : PublicVisibilityIcon
  const label = type === "private" ? "Private" : "Public"

  return (
    <div className="flex items-center gap-3">
      <Icon className="shrink-0" />
      <TableCellStack
        primary={label}
        secondary={lifecycleStatus ? formatLifecycleLabel(lifecycleStatus) : undefined}
      />
    </div>
  )
}

function VolunteersCell({ row }: { row: EventTableRow }) {
  if (!row.volunteers) {
    return <span className="type-table-cell-secondary">{EMPTY_CELL}</span>
  }

  const { current, max } = row.volunteers

  return (
    <div className="min-w-[88px]">
      <p className="type-table-cell-primary text-right">
        {current} of {max}
      </p>
      <div className="mt-1 flex h-[22px] flex-col justify-center">
        <SegmentedProgress value={current} max={max} />
      </div>
    </div>
  )
}

function CauseThumbnail({ title, thumbnailUrl }: { title: string; thumbnailUrl: string }) {
  return (
    <div className="h-12 w-[65px] shrink-0 overflow-hidden rounded-lg bg-bg-default-100">
      <img
        src={thumbnailUrl}
        alt=""
        className="size-full object-cover"
        onError={(event) => {
          const target = event.currentTarget
          target.style.display = "none"
          target.parentElement?.classList.add("bg-gradient-to-br", "from-bg-active-200", "to-bg-default-100")
        }}
      />
      <span className="sr-only">{title}</span>
    </div>
  )
}

function CollaboratorLogo({ name, tone, logoUrl }: NonNullable<EventTableRow["collaborator"]>) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()

  if (logoUrl) {
    return (
      <span className="size-7 shrink-0 overflow-hidden rounded-md bg-bg-default-100">
        <img src={logoUrl} alt="" className="size-full object-cover" />
      </span>
    )
  }

  return (
    <span
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-md text-[11px] font-semibold text-text-on-solid-bg",
        COLLABORATOR_TONE[tone ?? "orange"],
      )}
    >
      {initials}
    </span>
  )
}

function renderCell(
  column: EventsColumnDef,
  row: EventTableRow,
  ctx: {
    selectedIds: Set<string>
    toggleRow: (id: string) => void
    rowActions: EventsPageConfig["rowActions"]
    draftRowActions?: EventsPageConfig["draftRowActions"]
    onRowAction?: (rowId: string, actionId: string) => void
  },
) {
  switch (column.type) {
    case "checkbox":
      return (
        <div className={tableSelectControlClassName}>
          <Checkbox
            size="sm"
            checked={ctx.selectedIds.has(row.id)}
            onCheckedChange={() => ctx.toggleRow(row.id)}
            aria-label={`Select ${row.cause.title}`}
          />
        </div>
      )

    case "cause":
      return (
        <div className="flex items-center gap-3">
          <CauseThumbnail title={row.cause.title} thumbnailUrl={row.cause.thumbnailUrl} />
          <div className="flex min-w-0 flex-col gap-1">
            {row.requestBadges && row.requestBadges.length > 0 ? (
              <div className="flex flex-wrap items-center gap-1">
                {row.requestBadges.map((badge) => {
                  const variant = REQUEST_BADGES[badge]
                  return variant ? <EventCollabBadge key={badge} variant={variant} /> : null
                })}
              </div>
            ) : null}
            <TableCellStack primary={row.cause.title} secondary={row.cause.description} />
          </div>
        </div>
      )

    case "collaborator":
      return row.collaborator ? (
        <div className="flex items-center gap-2">
          <CollaboratorLogo {...row.collaborator} />
          <span className="type-table-cell-primary truncate">{row.collaborator.name}</span>
        </div>
      ) : (
        <span className="type-table-cell-secondary">{EMPTY_CELL}</span>
      )

    case "eventType":
      return row.eventType ? (
        <span className="type-table-cell-primary">
          {row.eventType === "needs" ? "Need" : "Cause"}
        </span>
      ) : (
        <span className="type-table-cell-secondary">{EMPTY_CELL}</span>
      )

    case "visibility":
      return <VisibilityCell row={row} />

    case "category":
      return row.visibility.type === "drafts" ? (
        <span className="type-table-cell-secondary">{EMPTY_CELL}</span>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          {row.category.tags.map((tag) => (
            <StatusTag key={tag}>{tag}</StatusTag>
          ))}
          {row.category.extraCount > 0 ? <StatusTag>+{row.category.extraCount}</StatusTag> : null}
        </div>
      )

    case "volunteerType":
      return row.volunteerType.type ? (
        <TableCellStack
          primary={row.volunteerType.type === "in-person" ? "In-person" : "Virtual"}
          secondary={row.volunteerType.detail ?? undefined}
        />
      ) : (
        <span className="type-table-cell-secondary">{EMPTY_CELL}</span>
      )

    case "date":
      return row.date.range ? (
        <TableCellStack primary={row.date.range} secondary={row.date.time ?? undefined} />
      ) : (
        <span className="type-table-cell-secondary">{EMPTY_CELL}</span>
      )

    case "volunteers":
      return <VolunteersCell row={row} />

    case "actions":
      return (
        <div className={tableSelectControlClassName}>
          <RowActionsDropdown
            actions={
              row.visibility.type === "drafts" && ctx.draftRowActions
                ? ctx.draftRowActions
                : ctx.rowActions
            }
            onAction={(actionId) => ctx.onRowAction?.(row.id, actionId)}
          />
        </div>
      )

    default:
      return <span className="type-table-cell-secondary">{EMPTY_CELL}</span>
  }
}

function EventsTableHeaderRow({
  columns,
  headerCheckboxState,
  onToggleAll,
  selectAllDisabled,
}: {
  columns: EventsColumnDef[]
  headerCheckboxState: boolean | "indeterminate"
  onToggleAll: () => void
  selectAllDisabled?: boolean
}) {
  return (
    <thead className="bg-bg-table-header">
      <tr className={tableHeaderRowClassName}>
        {columns.map((column) => {
          if (column.type === "checkbox") {
            return (
              <TableHead key={column.id} className={cn(tableHeadCellClassName, tableHeadSelectClassName)}>
                <div className={tableSelectControlClassName}>
                  <Checkbox
                    size="sm"
                    checked={headerCheckboxState}
                    onCheckedChange={onToggleAll}
                    disabled={selectAllDisabled}
                    aria-label="Select all rows"
                  />
                </div>
              </TableHead>
            )
          }

          return (
            <TableHead
              key={column.id}
              className={cn(
                tableHeadCellClassName,
                column.type === "actions" && tableHeadActionsClassName,
                column.type === "volunteers" && "text-right",
              )}
            >
              {column.label}
            </TableHead>
          )
        })}
      </tr>
    </thead>
  )
}

export function EventsTable({
  rows,
  columns,
  rowActions,
  draftRowActions,
  emptyState,
  selectedIds,
  onSelectedIdsChange,
  onRowAction,
  onRowClick,
  loading = false,
  className,
}: EventsTableProps) {
  const allSelected = rows.length > 0 && rows.every((row) => selectedIds.has(row.id))
  const someSelected = rows.some((row) => selectedIds.has(row.id)) && !allSelected

  const headerCheckboxState = useMemo(() => {
    if (allSelected) return true
    if (someSelected) return "indeterminate"
    return false
  }, [allSelected, someSelected])

  const toggleAll = () => {
    if (rows.length === 0) return
    if (allSelected) {
      onSelectedIdsChange(new Set())
      return
    }
    onSelectedIdsChange(new Set(rows.map((row) => row.id)))
  }

  const toggleRow = (rowId: string) => {
    const next = new Set(selectedIds)
    if (next.has(rowId)) next.delete(rowId)
    else next.add(rowId)
    onSelectedIdsChange(next)
  }

  const cellCtx = { selectedIds, toggleRow, rowActions, draftRowActions, onRowAction }

  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <div style={{ minWidth: TABLE_MIN_WIDTH_PX }}>
        {loading ? (
          <table className={TABLE_CLASS}>
            <EventsTableColGroup columns={columns} />
            <EventsTableHeaderRow
              columns={columns}
              headerCheckboxState={false}
              onToggleAll={() => {}}
              selectAllDisabled
            />
            <tbody>
              {Array.from({ length: 8 }).map((_, index) => (
                <TableRow key={index} className="hover:bg-transparent">
                  {columns.map((column) => (
                    <TableCell key={column.id} className={column.type === "actions" ? "text-right" : undefined}>
                      {column.type === "checkbox" ? (
                        <Skeleton className="size-4 rounded" />
                      ) : column.type === "actions" ? (
                        <Skeleton className="ml-auto size-8 rounded-full" />
                      ) : column.type === "cause" ? (
                        <div className="flex items-center gap-3">
                          <Skeleton className="size-9 shrink-0 rounded-lg" />
                          <div className="flex flex-col gap-1.5">
                            <Skeleton className="h-3 w-40" />
                            <Skeleton className="h-2.5 w-28" />
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1.5">
                          <Skeleton className="h-3 w-20" />
                          <Skeleton className="h-2.5 w-14" />
                        </div>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </tbody>
          </table>
        ) : rows.length === 0 ? (
          <table className={TABLE_CLASS}>
            <EventsTableColGroup columns={columns} />
            <EventsTableHeaderRow
              columns={columns}
              headerCheckboxState={headerCheckboxState}
              onToggleAll={toggleAll}
              selectAllDisabled
            />
            <tbody>
              <tr className="hover:bg-transparent">
                <TableCell colSpan={columns.length} className="p-0">
                  <DataTableEmptyState title={emptyState.title} description={emptyState.description} />
                </TableCell>
              </tr>
            </tbody>
          </table>
        ) : (
          <table className={TABLE_CLASS}>
            <EventsTableColGroup columns={columns} />
            <EventsTableHeaderRow
              columns={columns}
              headerCheckboxState={headerCheckboxState}
              onToggleAll={toggleAll}
              selectAllDisabled={false}
            />
            <tbody>
              {rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={selectedIds.has(row.id) ? "selected" : undefined}
                  className={onRowClick ? "cursor-pointer" : undefined}
                  onClick={
                    onRowClick
                      ? () => {
                          onRowClick(row)
                        }
                      : undefined
                  }
                >
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      className={cn(
                        column.type === "checkbox" && tableCellSelectClassName,
                        column.type === "actions" && tableCellActionsClassName,
                      )}
                      onClick={
                        column.type === "checkbox" || column.type === "actions"
                          ? (event) => event.stopPropagation()
                          : undefined
                      }
                    >
                      {renderCell(column, row, cellCtx)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
