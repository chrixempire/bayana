import { useMemo } from "react"
import { DataTableEmptyState, RowActionsDropdown, TableCellStack } from "../data-table"
import { Checkbox } from "../ui/checkbox"
import { StatusTag } from "../ui/status-tag"
import { TableCell, TableHead, TableRow } from "../ui/table"
import { cn } from "../../lib/utils"
import type { EventTableRow, EventsPageConfig } from "../../pages/dashboard/events-types"
import {
  DraftsVisibilityIcon,
  PrivateVisibilityIcon,
  PublicVisibilityIcon,
} from "./icons/VisibilityIcons"

const EMPTY_CELL = "—"
const TABLE_CLASS = "w-full table-fixed border-separate border-spacing-0 caption-bottom text-sm"
const TABLE_MIN_WIDTH_PX = 1024
const HEADER_CELL_CLASS =
  "h-11 border-b border-border-default-100 bg-bg-on-canvas py-0 type-events-table-head"

type EventsTableProps = {
  rows: EventTableRow[]
  columns: EventsPageConfig["columns"]
  rowActions: EventsPageConfig["rowActions"]
  emptyState: EventsPageConfig["emptyState"]
  selectedIds: Set<string>
  onSelectedIdsChange: (ids: Set<string>) => void
  onRowAction?: (rowId: string, actionId: string) => void
  className?: string
}

function EventsTableColGroup() {
  return (
    <colgroup>
      <col style={{ width: "3rem" }} />
      <col style={{ width: "24%" }} />
      <col style={{ width: "12%" }} />
      <col style={{ width: "14%" }} />
      <col style={{ width: "16%" }} />
      <col style={{ width: "14%" }} />
      <col style={{ width: "11%" }} />
      <col style={{ width: "3rem" }} />
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
      <div className="flex items-start gap-2">
        <DraftsVisibilityIcon className="mt-0.5 shrink-0" />
        <TableCellStack primary="Drafts" />
      </div>
    )
  }

  const Icon = type === "private" ? PrivateVisibilityIcon : PublicVisibilityIcon
  const label = type === "private" ? "Private" : "Public"

  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 shrink-0" />
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
  const percent = max > 0 ? Math.min(100, Math.round((current / max) * 100)) : 0

  return (
    <div className="min-w-[88px]">
      <p className="type-table-cell-primary">
        {current} of {max}
      </p>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-bg-default-100">
        <div
          className={cn("h-full rounded-full transition-all", percent > 0 ? "bg-bg-accent" : "bg-transparent")}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

function CauseThumbnail({ title, thumbnailUrl }: { title: string; thumbnailUrl: string }) {
  return (
    <div className="size-10 shrink-0 overflow-hidden rounded-lg bg-bg-default-100">
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

function EventsTableHeaderRow({
  columns,
  headerCheckboxState,
  onToggleAll,
  selectAllDisabled,
}: {
  columns: EventsPageConfig["columns"]
  headerCheckboxState: boolean | "indeterminate"
  onToggleAll: () => void
  selectAllDisabled?: boolean
}) {
  return (
    <thead>
      <tr>
        {columns.map((column) => {
          if (column.type === "checkbox") {
            return (
              <TableHead key={column.id} className={cn("w-10", HEADER_CELL_CLASS)}>
                <Checkbox
                  size="sm"
                  checked={headerCheckboxState}
                  onCheckedChange={onToggleAll}
                  disabled={selectAllDisabled}
                  aria-label="Select all rows"
                />
              </TableHead>
            )
          }

          return (
            <TableHead
              key={column.id}
              className={cn(HEADER_CELL_CLASS, column.type === "actions" && "w-12")}
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
  emptyState,
  selectedIds,
  onSelectedIdsChange,
  onRowAction,
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

  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <div style={{ minWidth: TABLE_MIN_WIDTH_PX }}>
        {rows.length === 0 ? (
          <table className={TABLE_CLASS}>
            <EventsTableColGroup />
            <EventsTableHeaderRow
              columns={columns}
              headerCheckboxState={headerCheckboxState}
              onToggleAll={toggleAll}
              selectAllDisabled
            />
            <tbody>
              <tr className="hover:bg-transparent">
                <TableCell colSpan={columns.length} className="p-0">
                  <DataTableEmptyState
                    title={emptyState.title}
                    description={emptyState.description}
                  />
                </TableCell>
              </tr>
            </tbody>
          </table>
        ) : (
          <table className={TABLE_CLASS}>
            <EventsTableColGroup />
            <EventsTableHeaderRow
              columns={columns}
              headerCheckboxState={headerCheckboxState}
              onToggleAll={toggleAll}
              selectAllDisabled={false}
            />
            <tbody>
              {rows.map((row) => (
                <TableRow key={row.id} data-state={selectedIds.has(row.id) ? "selected" : undefined}>
                  <TableCell>
                    <Checkbox
                      size="sm"
                      checked={selectedIds.has(row.id)}
                      onCheckedChange={() => toggleRow(row.id)}
                      aria-label={`Select ${row.cause.title}`}
                    />
                  </TableCell>

                  <TableCell>
                    <div className="flex items-start gap-3">
                      <CauseThumbnail title={row.cause.title} thumbnailUrl={row.cause.thumbnailUrl} />
                      <TableCellStack primary={row.cause.title} secondary={row.cause.description} />
                    </div>
                  </TableCell>

                  <TableCell>
                    <VisibilityCell row={row} />
                  </TableCell>

                  <TableCell>
                    {row.visibility.type === "drafts" ? (
                      <span className="type-table-cell-secondary">{EMPTY_CELL}</span>
                    ) : (
                        <div className="flex flex-wrap items-center gap-1">
                          {row.category.tags.map((tag) => (
                            <StatusTag key={tag}>{tag}</StatusTag>
                          ))}
                          {row.category.extraCount > 0 ? (
                            <StatusTag>+{row.category.extraCount}</StatusTag>
                          ) : null}
                      </div>
                    )}
                  </TableCell>

                  <TableCell>
                    {row.volunteerType.type ? (
                      <TableCellStack
                        primary={row.volunteerType.type === "in-person" ? "In-person" : "Virtual"}
                        secondary={row.volunteerType.detail ?? undefined}
                      />
                    ) : (
                      <span className="type-table-cell-secondary">{EMPTY_CELL}</span>
                    )}
                  </TableCell>

                  <TableCell>
                    {row.date.range ? (
                      <TableCellStack primary={row.date.range} secondary={row.date.time ?? undefined} />
                    ) : (
                      <span className="type-table-cell-secondary">{EMPTY_CELL}</span>
                    )}
                  </TableCell>

                  <TableCell>
                    <VolunteersCell row={row} />
                  </TableCell>

                  <TableCell className="text-right">
                    <RowActionsDropdown
                      actions={rowActions}
                      onAction={(actionId) => onRowAction?.(row.id, actionId)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
