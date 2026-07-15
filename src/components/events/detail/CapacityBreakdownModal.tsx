import { Button } from "../../ui/button"
import { Modal } from "../../ui/modal"
import type { VolunteersData } from "../../../pages/dashboard/event-detail-types"

export function CapacityBreakdownModal({
  open,
  onClose,
  data,
}: {
  open: boolean
  onClose: () => void
  data: VolunteersData
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Capacity breakdown"
      size="sm"
      footer={
        <Button variant="neutral" size="sm" className="rounded-[10px]" onClick={onClose}>
          Close
        </Button>
      }
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-[510] leading-[22px] text-text-table-header">
              Total volunteers
            </span>
            <span className="inline-flex h-6 items-center rounded-md bg-bg-default-100 px-2 text-xs font-[510] leading-4 text-text-table-header">
              {data.totals.spotsLeft} spot left
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-2xl font-semibold leading-8 text-text-events-strong">
              {data.totals.volunteers.current}
            </span>
            <span className="text-sm font-[510] leading-[22px] text-text-table-header">
              / {data.totals.volunteers.max}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {data.capacity.map((item) => {
            const left = item.total - item.filled
            const pct = item.total === 0 ? 0 : Math.round((item.filled / item.total) * 100)
            return (
              <div key={item.skill} className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-[510] leading-[22px] text-text-events-strong">
                    {item.skill} ({item.filled} / {item.total})
                  </span>
                  <span className="shrink-0 text-xs leading-5 text-text-table-header">
                    {left} spot left
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-default-100">
                  <div className="h-full rounded-full bg-bg-accent" style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Modal>
  )
}
