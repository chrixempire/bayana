import { useState } from "react"
import { Modal } from "../ui/modal"
import { Button } from "../ui/button"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"

export function ExportReportModal({
  open,
  onClose,
  onExport,
}: {
  open: boolean
  onClose: () => void
  onExport: (type: "pdf" | "csv") => void
}) {
  const [type, setType] = useState<"pdf" | "csv">("pdf")

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
            onClick={() => onExport(type)}
          >
            Export
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-2 pb-2">
        <p className="type-create-event-field-label text-text-events-strong">
          Export type <span className="text-text-negative">*</span>
        </p>
        <p className="type-create-event-caption">Choose export type to export all volunteers list data</p>
        <RadioGroup
          value={type}
          onValueChange={(value) => setType(value as "pdf" | "csv")}
          className="mt-1 flex flex-row items-center gap-16"
        >
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm leading-[22px] text-text-events-strong">
            <RadioGroupItem value="pdf" size="sm" />
            PDF
          </label>
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm leading-[22px] text-text-events-strong">
            <RadioGroupItem value="csv" size="sm" />
            CSV (Donations only)
          </label>
        </RadioGroup>
      </div>
    </Modal>
  )
}
