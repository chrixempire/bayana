import { useEffect, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import { cn } from "../../lib/utils"

const SIZE_CLASS = {
  sm: "max-w-[400px]",
  md: "max-w-[480px]",
  lg: "max-w-[560px]",
  xl: "max-w-[720px]",
  full: "max-w-[1160px]",
} as const

export type ModalProps = {
  open: boolean
  onClose: () => void
  title?: ReactNode
  children: ReactNode
  footer?: ReactNode
  size?: keyof typeof SIZE_CLASS
  /** Removes the default body padding (e.g. the two-column Volunteer details). */
  flushBody?: boolean
  className?: string
  headerClassName?: string
  bodyClassName?: string
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = "md",
  flushBody = false,
  className,
  headerClassName,
  bodyClassName,
}: ModalProps) {
  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKeyDown)

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 cursor-pointer bg-bg-overlay"
        aria-label="Close dialog"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative z-10 flex max-h-[90vh] w-full flex-col overflow-hidden rounded-3xl bg-bg-canvas shadow-[0_24px_60px_rgba(44,50,55,0.18)]",
          SIZE_CLASS[size],
          className,
        )}
      >
        {title ? (
          <div
            className={cn(
              "flex shrink-0 items-start justify-between gap-4 px-6 pt-6",
              flushBody && "pb-5",
              headerClassName,
            )}
          >
            <h2 className="font-display text-xl font-semibold leading-7 tracking-[-0.2px] text-text-events-strong">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-bg-default-100 text-text-table-header transition-colors hover:bg-bg-active-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-input-active"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
          </div>
        ) : null}

        <div
          className={cn(
            "min-h-0 flex-1 overflow-y-auto",
            !flushBody && "px-6 pt-4",
            !flushBody && !footer && "pb-6",
            bodyClassName,
          )}
        >
          {children}
        </div>

        {footer ? (
          <div className="flex shrink-0 items-center justify-end gap-2 border-t border-border-default-100 px-6 py-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  )
}
