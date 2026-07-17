import type { ReactNode } from "react"
import { Button } from "./button"
import { Modal } from "./modal"

export type ConfirmModalProps = {
  open: boolean
  onClose: () => void
  title: string
  description: ReactNode
  confirmLabel: string
  cancelLabel?: string
  variant?: "primary" | "destructive"
  onConfirm: () => void
  /** Extra content between the description and the footer (e.g. a reason field). */
  children?: ReactNode
}

export function ConfirmModal({
  open,
  onClose,
  title,
  description,
  confirmLabel,
  cancelLabel = "Close",
  variant = "primary",
  onConfirm,
  children,
}: ConfirmModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="neutral" size="sm" className="rounded-[10px]" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button
            variant={variant}
            size="sm"
            className="rounded-[10px]"
            onClick={() => {
              onConfirm()
              onClose()
            }}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-sm leading-[22px] text-text-table-header">{description}</p>
      {children}
    </Modal>
  )
}
