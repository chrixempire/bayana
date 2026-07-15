import { useState } from "react"
import { Modal } from "../ui/modal"
import { Button } from "../ui/button"
import { Checkbox } from "../ui/checkbox"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { cn } from "../../lib/utils"
import type { VolunteerListRow } from "../../pages/dashboard/volunteers-data"

type ColumnKey = "name" | "email" | "skills" | "activities" | "status" | "dateJoined"

const COLUMNS: { key: ColumnKey; label: string; value: (row: VolunteerListRow) => string }[] = [
  { key: "name", label: "Name", value: (r) => r.name },
  { key: "email", label: "Email", value: (r) => r.email },
  { key: "skills", label: "Skills", value: (r) => r.skills.join("; ") },
  { key: "activities", label: "Activities", value: (r) => String(r.activities) },
  { key: "status", label: "Status", value: (r) => (r.status === "active" ? "Active" : "Blacklisted") },
  { key: "dateJoined", label: "Date joined", value: (r) => r.dateJoined },
]

function download(rows: VolunteerListRow[], keys: ColumnKey[], type: "excel" | "csv") {
  const cols = COLUMNS.filter((c) => keys.includes(c.key))
  const escape = (value: string) => `"${value.replace(/"/g, '""')}"`
  const header = cols.map((c) => escape(c.label)).join(",")
  const body = rows.map((row) => cols.map((c) => escape(c.value(row))).join(","))
  const content = [header, ...body].join("\n")
  const mime = type === "excel" ? "application/vnd.ms-excel" : "text/csv;charset=utf-8;"
  const ext = type === "excel" ? "xls" : "csv"
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = `volunteers.${ext}`
  anchor.click()
  URL.revokeObjectURL(url)
}

export function ExportVolunteersModal({
  open,
  rows,
  onClose,
  onExported,
}: {
  open: boolean
  rows: VolunteerListRow[]
  onClose: () => void
  onExported?: () => void
}) {
  const [type, setType] = useState<"excel" | "csv">("excel")
  const [selected, setSelected] = useState<Set<ColumnKey>>(new Set(["status", "dateJoined"]))

  const toggle = (key: ColumnKey) => {
    const next = new Set(selected)
    if (next.has(key)) next.delete(key)
    else next.add(key)
    setSelected(next)
  }

  const canExport = selected.size > 0

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Export"
      size="md"
      footer={
        <>
          <Button type="button" variant="neutral" className="rounded-xl" onClick={onClose}>
            Close
          </Button>
          <Button
            type="button"
            variant="primary"
            className="rounded-xl"
            disabled={!canExport}
            onClick={() => {
              download(rows, [...selected], type)
              onExported?.()
            }}
          >
            Export
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-5 pb-2">
        <div className="flex flex-col gap-2">
          <p className="type-create-event-field-label text-text-events-strong">
            Export type <span className="text-text-negative">*</span>
          </p>
          <p className="type-create-event-caption">Choose export type to export all volunteers list data</p>
          <RadioGroup
            value={type}
            onValueChange={(value) => setType(value as "excel" | "csv")}
            className="mt-1 flex flex-row items-center gap-16"
          >
            <label className="inline-flex cursor-pointer items-center gap-2 text-sm leading-[22px] text-text-events-strong">
              <RadioGroupItem value="excel" size="sm" />
              Excel
            </label>
            <label className="inline-flex cursor-pointer items-center gap-2 text-sm leading-[22px] text-text-events-strong">
              <RadioGroupItem value="csv" size="sm" />
              CSV
            </label>
          </RadioGroup>
        </div>

        <div className="flex flex-col gap-2">
          <p className="type-create-event-field-label text-text-events-strong">
            Columns <span className="text-text-negative">*</span>
          </p>
          <p className="type-create-event-caption">Select all the columns you&apos;d like to export</p>
          <div className="mt-1 flex flex-wrap gap-x-6 gap-y-3">
            {COLUMNS.map((col) => (
              <label
                key={col.key}
                className={cn(
                  "inline-flex cursor-pointer items-center gap-2 text-sm leading-[22px] text-text-events-strong",
                )}
              >
                <Checkbox
                  size="sm"
                  checked={selected.has(col.key)}
                  onCheckedChange={() => toggle(col.key)}
                />
                {col.label}
              </label>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}
