import type { ComponentType } from "react"
import { Modal } from "../../ui/modal"
import { toast } from "../../../hooks/use-toast"
import { EventIcon } from "../icons/EventIcon"
import { EVENT_ICON_SIZE } from "../icons/event-icon-sizes"

type BrandIconProps = { className?: string }

function FacebookIcon({ className }: BrandIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
    </svg>
  )
}

function InstagramIcon({ className }: BrandIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function XLogoIcon({ className }: BrandIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.22-6.82-5.97 6.82H1.66l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23Zm-1.16 17.52h1.83L7.01 4.13H5.05l12.03 15.64Z" />
    </svg>
  )
}

export function ShareEventModal({
  open,
  onClose,
  shareUrl,
}: {
  open: boolean
  onClose: () => void
  shareUrl: string
}) {
  const copyLink = () => {
    void navigator.clipboard?.writeText(shareUrl)
    toast({ variant: "success", title: "Link copied to clipboard" })
  }

  const targets: Array<
    | { id: string; label: string; eventIcon: true; className: string; onClick: () => void }
    | { id: string; label: string; Icon: ComponentType<BrandIconProps>; className: string; onClick: () => void }
  > = [
    { id: "copy", label: "Copy link", eventIcon: true, className: "bg-bg-default-100 text-text-events-strong", onClick: copyLink },
    { id: "facebook", label: "Facebook", Icon: FacebookIcon, className: "bg-[#1877f2] text-white", onClick: () => toast({ title: "Share to Facebook" }) },
    { id: "instagram", label: "Instagram", Icon: InstagramIcon, className: "bg-gradient-to-br from-[#feda75] via-[#d62976] to-[#4f5bd5] text-white", onClick: () => toast({ title: "Share to Instagram" }) },
    { id: "x", label: "X", Icon: XLogoIcon, className: "bg-[#1c1c1c] text-white", onClick: () => toast({ title: "Share to X" }) },
  ]

  return (
    <Modal open={open} onClose={onClose} size="sm" bodyClassName="p-5">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 inline-flex size-8 cursor-pointer items-center justify-center rounded-full bg-white/85 text-text-table-header transition-colors hover:bg-white"
        aria-label="Close"
      >
        <EventIcon name="close-fill" size={EVENT_ICON_SIZE.meta} />
      </button>

      <div className="flex flex-col gap-5">
        <div className="relative flex aspect-[361/198] w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#e6d8ff] via-[#f2e7ff] to-[#ffe4cf]">
          <EventIcon name="pic-fill" size={36} className="opacity-70" />
        </div>

        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="font-display text-xl font-semibold leading-7 tracking-[-0.2px] text-text-events-strong">
            Share your event link
          </h2>
          <p className="text-sm leading-[22px] text-text-table-header">
            Use this link to invite volunteers
          </p>
        </div>

        <button
          type="button"
          onClick={copyLink}
          className="flex h-10 w-full items-center gap-2 rounded-lg border border-border-input-default-200 bg-input-surface px-3 text-left shadow-input-default"
        >
          <span className="min-w-0 flex-1 truncate text-sm text-text-table-header">{shareUrl}</span>
        </button>

        <div className="grid grid-cols-4">
          {targets.map((target) => (
            <button
              key={target.id}
              type="button"
              onClick={target.onClick}
              className="flex cursor-pointer flex-col items-center gap-2"
            >
              <span className={`flex size-10 items-center justify-center rounded-full ${target.className}`}>
                {"eventIcon" in target ? (
                  <EventIcon name="share-2-fill" size={EVENT_ICON_SIZE.meta} />
                ) : (
                  <target.Icon className="size-4" />
                )}
              </span>
              <span className="text-xs leading-5 text-text-table-header">{target.label}</span>
            </button>
          ))}
        </div>
      </div>
    </Modal>
  )
}
