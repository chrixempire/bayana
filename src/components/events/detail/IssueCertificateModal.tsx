import { useRef, useState } from "react"
import { cn } from "../../../lib/utils"
import { EventIcon } from "../icons/EventIcon"
import { EVENT_ICON_SIZE } from "../icons/event-icon-sizes"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Checkbox } from "../../ui/checkbox"
import { Modal } from "../../ui/modal"
import { toast } from "../../../hooks/use-toast"
import type { Volunteer } from "../../../pages/dashboard/event-detail-types"
import { PersonAvatar } from "./PersonAvatar"

function reliabilityColor(score: number) {
  if (score >= 80) return "text-text-success"
  if (score >= 70) return "text-button-primary"
  if (score >= 50) return "text-text-warning"
  return "text-text-negative"
}

export function IssueCertificateModal({
  open,
  onClose,
  volunteers,
}: {
  open: boolean
  onClose: () => void
  volunteers: Volunteer[]
}) {
  const [search, setSearch] = useState("")
  const [multiSelect, setMultiSelect] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const justLongPressed = useRef(false)

  const reset = () => {
    setMultiSelect(false)
    setSelected(new Set())
    setSearch("")
  }

  const close = () => {
    reset()
    onClose()
  }

  const rows = volunteers.filter((v) => v.name.toLowerCase().includes(search.trim().toLowerCase()))
  const allSelected = rows.length > 0 && rows.every((row) => selected.has(row.id))

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      // Leaving multi-select once everything is deselected returns to the initial state.
      if (next.size === 0) setMultiSelect(false)
      return next
    })
  }

  const toggleAll = () => {
    if (allSelected) {
      setSelected(new Set())
      setMultiSelect(false)
    } else {
      setSelected(new Set(rows.map((row) => row.id)))
    }
  }

  const startLongPress = (id: string) => {
    if (multiSelect) return
    longPressTimer.current = setTimeout(() => {
      justLongPressed.current = true
      setMultiSelect(true)
      setSelected(new Set([id]))
    }, 450)
  }
  const cancelLongPress = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current)
  }

  const issue = (name: string) => {
    toast({ variant: "success", title: `Certificate issued · ${name}` })
  }

  const issueBulk = () => {
    toast({ variant: "success", title: `${selected.size} certificates issued` })
    close()
  }

  return (
    <Modal
      open={open}
      onClose={close}
      size="sm"
      bodyClassName="p-5"
      footer={
        multiSelect ? (
          <>
            <Button variant="neutral" size="sm" className="rounded-[10px]" onClick={close}>
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="rounded-[10px]"
              disabled={selected.size === 0}
              onClick={issueBulk}
            >
              Issue certificates
            </Button>
          </>
        ) : (
          <Button variant="neutral" size="sm" className="rounded-[10px]" onClick={close}>
            Close
          </Button>
        )
      }
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="flex size-12 items-center justify-center rounded-xl bg-[#eaf6ff] text-button-primary">
          <EventIcon name="award-fill" size={24} />
        </span>
        <h2 className="font-display text-xl font-semibold leading-7 tracking-[-0.2px] text-text-events-strong">
          Issue certificate
        </h2>
        <p className="text-sm leading-[22px] text-text-table-header">
          Choose volunteers you would like to issue certificates to
        </p>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <div className="flex-1">
          <Input
            density="compact"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search volunteers"
            leftIcon={<EventIcon name="search-line" size={EVENT_ICON_SIZE.search} />}
            aria-label="Search volunteers"
          />
        </div>
        {multiSelect ? (
          <label className="flex shrink-0 cursor-pointer items-center gap-2 text-sm font-medium text-text-events-strong">
            <Checkbox size="sm" checked={allSelected} onCheckedChange={toggleAll} aria-label="Select all" />
            Select all
          </label>
        ) : null}
      </div>

      <p className="mt-2 text-xs leading-5 text-text-table-header">
        {multiSelect
          ? "Deselect all volunteers to revert to initial state"
          : "Long press a volunteer to start multi-selection"}
      </p>

      <div className="mt-3 flex max-h-[320px] flex-col overflow-y-auto">
        {rows.map((row) => (
          <div
            key={row.id}
            onMouseDown={() => startLongPress(row.id)}
            onMouseUp={cancelLongPress}
            onMouseLeave={cancelLongPress}
            onTouchStart={() => startLongPress(row.id)}
            onTouchEnd={cancelLongPress}
            onClick={() => {
              if (justLongPressed.current) {
                justLongPressed.current = false
                return
              }
              if (multiSelect) toggle(row.id)
            }}
            className={cn(
              "flex items-center gap-3 rounded-xl py-3 pr-1",
              multiSelect && "cursor-pointer select-none",
            )}
          >
            {multiSelect ? (
              <Checkbox
                size="sm"
                checked={selected.has(row.id)}
                onCheckedChange={() => toggle(row.id)}
                aria-label={`Select ${row.name}`}
              />
            ) : null}
            <PersonAvatar name={row.name} tone={row.avatarTone} imageUrl={row.avatarImage || undefined} size={36} />
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-medium leading-[22px] text-text-events-strong">
                {row.name}
              </span>
              <span className="text-xs leading-5 text-text-table-header">
                Reliability score:{" "}
                <span className={cn("font-medium", reliabilityColor(row.reliability ?? 0))}>
                  {row.reliability ?? 0}%
                </span>
              </span>
            </div>
            <Button
              variant="neutral"
              size="sm"
              className="h-8 min-h-8 shrink-0 rounded-[10px]"
              onClick={(event) => {
                event.stopPropagation()
                issue(row.name)
              }}
            >
              Issue
            </Button>
          </div>
        ))}
      </div>
    </Modal>
  )
}
