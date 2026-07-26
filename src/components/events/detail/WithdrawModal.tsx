import { useState } from "react"
import { Button } from "../../ui/button"
import { Modal } from "../../ui/modal"
import { EventIcon } from "../icons/EventIcon"
import { EVENT_ICON_SIZE } from "../icons/event-icon-sizes"
import type { DonationsData } from "../../../pages/dashboard/event-detail-types"

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm leading-[22px] text-text-table-header">{label}</span>
      <span className="text-sm font-medium leading-[22px] text-text-events-strong">{value}</span>
    </div>
  )
}

export function WithdrawModal({
  open,
  onClose,
  donations,
}: {
  open: boolean
  onClose: () => void
  donations: DonationsData
}) {
  const [amount, setAmount] = useState("")

  return (
    <Modal open={open} onClose={onClose} size="md" bodyClassName="px-6 pt-6">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 inline-flex size-8 cursor-pointer items-center justify-center rounded-full bg-bg-default-100 text-text-table-header transition-colors hover:bg-bg-active-200"
        aria-label="Close"
      >
        <EventIcon name="close-fill" size={EVENT_ICON_SIZE.meta} />
      </button>

      <div className="flex flex-col items-center gap-2 text-center">
        <span className="flex size-12 items-center justify-center rounded-xl bg-bg-default-100 text-text-table-header">
          <EventIcon name="file-fill" size={24} />
        </span>
        <h2 className="font-display text-xl font-semibold leading-7 tracking-[-0.2px] text-text-events-strong">
          Withdraw
        </h2>
        <p className="text-sm leading-[22px] text-text-table-header">
          Proceed to withdraw donations to your account
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium leading-[22px] text-input-label">
            Amount <span className="text-text-negative">*</span>
          </label>
          <div className="flex h-11 items-center gap-2 rounded-xl border border-border-input-default-200 bg-input-surface px-3 shadow-input-default focus-within:border-border-input-active">
            <span className="flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#008751] text-[8px] font-bold text-white">
              ₦
            </span>
            <input
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              inputMode="decimal"
              placeholder="0.00"
              className="min-w-0 flex-1 bg-transparent text-sm leading-[22px] text-text-events-strong outline-none placeholder:text-input-placeholder"
            />
            <button
              type="button"
              onClick={() => setAmount(donations.availableForWithdrawal.replace(/[₦,]/g, ""))}
              className="shrink-0 cursor-pointer text-sm font-medium text-button-primary"
            >
              All
            </button>
          </div>
          <p className="text-xs leading-5 text-text-table-header">
            Available withdrawal balance: {donations.availableForWithdrawal}
          </p>
        </div>

        <div className="flex flex-col gap-2 rounded-xl bg-bg-on-canvas p-3">
          <SummaryRow label="Amount" value="₦ 0.00" />
          <SummaryRow label="Platform fee (2.5%)" value="₦ 12,000.00" />
          <SummaryRow label="Amount to receive" value="₦ 0.00" />
          <p className="border-t border-border-default-100 pt-2 text-xs leading-5 text-text-table-header">
            Platform fee will be deducted on every withdrawal
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium leading-[22px] text-text-events-strong">Bank account</span>
          <div className="flex items-center gap-3 rounded-xl border border-border-default-100 p-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-bg-default-100 text-text-table-header">
              <EventIcon name="file-fill" size={EVENT_ICON_SIZE.meta} />
            </span>
            <div className="flex min-w-0 flex-1 flex-col">
              <p className="text-sm font-medium leading-[22px] text-text-events-strong">No account</p>
              <p className="truncate text-xs leading-5 text-text-table-header">
                Add your business bank account
              </p>
            </div>
            <Button
              variant="neutral"
              size="sm"
              className="rounded-[10px]"
              leftIcon={<EventIcon name="add-circle-fill" size={EVENT_ICON_SIZE.fieldHint} />}
            >
              Add
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-2 border-t border-border-default-100 pb-6 pt-4">
        <Button variant="neutral" size="sm" className="rounded-[10px]" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" size="sm" className="rounded-[10px]" disabled>
          Withdraw
        </Button>
      </div>
    </Modal>
  )
}
