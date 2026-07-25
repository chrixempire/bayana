import { useState } from "react"
import { cn } from "../../../lib/utils"
import { Input } from "../../ui/input"
import { Modal } from "../../ui/modal"
import { FilterDropdown } from "../../data-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table"
import { toast } from "../../../hooks/use-toast"
import { EventIcon } from "../icons/EventIcon"
import { EVENT_ICON_SIZE } from "../icons/event-icon-sizes"
import type { VolunteersData } from "../../../pages/dashboard/event-detail-types"
import { PersonAvatar } from "./PersonAvatar"

/** Deterministic QR-like pattern (decorative placeholder until real codes exist). */
function FauxQr() {
  const size = 21
  const isFinder = (r: number, c: number) => {
    const inBox = (br: number, bc: number) =>
      r >= br && r < br + 7 && c >= bc && c < bc + 7
    const ring = (br: number, bc: number) =>
      (r === br || r === br + 6 || c === bc || c === bc + 6) && inBox(br, bc)
    const core = (br: number, bc: number) =>
      r >= br + 2 && r < br + 5 && c >= bc + 2 && c < bc + 5
    return (
      ring(0, 0) || core(0, 0) || ring(0, 14) || core(0, 14) || ring(14, 0) || core(14, 0)
    )
  }
  const inFinderZone = (r: number, c: number) =>
    (r < 8 && c < 8) || (r < 8 && c > 12) || (r > 12 && c < 8)

  return (
    <svg viewBox="0 0 21 21" className="size-full" role="img" aria-label="QR code">
      <rect width="21" height="21" fill="#fff" />
      {Array.from({ length: size }).flatMap((_, r) =>
        Array.from({ length: size }).map((_, c) => {
          const filled = inFinderZone(r, c) ? isFinder(r, c) : (r * 7 + c * 13 + r * c) % 3 === 0
          return filled ? <rect key={`${r}-${c}`} x={c} y={r} width="1" height="1" fill="#20083a" /> : null
        }),
      )}
    </svg>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-1 flex-col gap-2 rounded-xl border border-border-default-100 bg-bg-canvas p-3">
      <span className="text-xs font-[510] leading-5 text-text-table-header">{label}</span>
      <span className="font-display text-xl font-semibold leading-7 text-text-events-strong">
        {value}
      </span>
    </div>
  )
}

export function AttendanceModal({
  open,
  onClose,
  volunteers,
}: {
  open: boolean
  onClose: () => void
  volunteers: VolunteersData
}) {
  const [mode, setMode] = useState<"in" | "out">("in")
  const [search, setSearch] = useState("")
  const attendees = volunteers.rows.filter((row) => row.status === "accepted")

  return (
    <Modal open={open} onClose={onClose} size="full" title="Attendance" flushBody className="max-h-[92vh]">
      <div className="flex flex-col md:flex-row">
        {/* Left QR panel */}
        <div className="flex flex-col gap-4 border-b border-border-default-100 p-6 md:w-[280px] md:shrink-0 md:border-b-0 md:border-r">
          <div className="flex gap-4 border-b border-border-default-100">
            {(["in", "out"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setMode(value)}
                className={cn(
                  "-mb-px border-b-2 pb-2 text-sm font-[510] transition-colors",
                  mode === value
                    ? "border-border-input-active text-text-events-strong"
                    : "border-transparent text-text-table-header hover:text-text-events-strong",
                )}
              >
                {value === "in" ? "Clock in" : "Clock out"}
              </button>
            ))}
          </div>

          <p className="text-xs leading-5 text-text-table-header">
            Show this QR code to volunteers so they scan to clock {mode}
          </p>

          <div className="aspect-square w-full overflow-hidden rounded-xl border border-border-default-100 p-3">
            <FauxQr />
          </div>

          <button
            type="button"
            onClick={() => toast({ title: "QR code downloaded" })}
            className="inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-border-default-100 bg-button-neutral text-sm font-[510] text-text-events-strong shadow-button-neutral hover:bg-button-neutral-clicked"
          >
            <EventIcon name="upload-2-fill" size={EVENT_ICON_SIZE.meta} />
            Download
          </button>

          <div className="flex items-center gap-2 text-xs text-text-table-header">
            <span className="h-px flex-1 bg-border-default-100" />
            or send this code
            <span className="h-px flex-1 bg-border-default-100" />
          </div>

          <div className="flex h-10 items-center gap-2 rounded-lg border border-border-input-default-200 bg-input-surface px-3">
            <span className="min-w-0 flex-1 truncate text-sm font-[510] text-text-events-strong">123456</span>
            <button
              type="button"
              onClick={() => {
                void navigator.clipboard?.writeText("123456")
                toast({ variant: "success", title: "Code copied" })
              }}
              className="shrink-0 cursor-pointer text-icon-neutral"
              aria-label="Copy code"
            >
              <EventIcon name="file-fill" size={EVENT_ICON_SIZE.meta} />
            </button>
          </div>

          <p className="rounded-lg bg-bg-on-canvas p-3 text-xs leading-5 text-text-table-header">
            Please ensure that volunteers clock out at the end of an event session.
          </p>
        </div>

        {/* Right attendance table */}
        <div className="flex flex-1 flex-col gap-4 bg-bg-on-canvas p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <FilterDropdown label="Today" options={["Today", "Yesterday", "This week"]} />
            <div className="w-full sm:max-w-[260px]">
              <Input
                density="compact"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search volunteers"
                leftIcon={<EventIcon name="search-line" size={EVENT_ICON_SIZE.search} />}
                aria-label="Search attendance"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <StatCard label="Awaiting" value={String(attendees.length)} />
            <StatCard label="Clocked in" value="0" />
            <StatCard label="Clocked out" value="0" />
            <StatCard label="No show" value="0" />
          </div>

          <div className="overflow-hidden rounded-xl border border-border-default-100 bg-bg-canvas">
            <Table contained={false}>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="min-w-[180px] pl-4">Volunteer</TableHead>
                  <TableHead className="w-[90px]">Clock in</TableHead>
                  <TableHead className="w-[90px]">Clock out</TableHead>
                  <TableHead className="w-[80px]">Hours</TableHead>
                  <TableHead className="w-[120px]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendees.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="pl-4">
                      <div className="flex items-center gap-2.5">
                        <PersonAvatar name={row.name} tone={row.avatarTone} size={28} />
                        <span className="flex min-w-0 flex-col">
                          <span className="truncate text-sm font-[510] leading-[22px] text-text-events-strong">
                            {row.name}
                          </span>
                          <span className="truncate text-xs leading-5 text-text-table-header">
                            {row.skills[0]}
                          </span>
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-text-table-header">--</TableCell>
                    <TableCell className="text-text-table-header">--</TableCell>
                    <TableCell className="text-text-table-header">--</TableCell>
                    <TableCell>
                      <span className="inline-flex h-6 items-center gap-1 rounded-lg bg-bg-warning-soft px-2 text-xs font-[510] leading-4 text-text-warning">
                        Awaiting
                        <EventIcon name="down-fill" size={EVENT_ICON_SIZE.composeAction} />
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </Modal>
  )
}
