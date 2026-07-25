import { useRef, type KeyboardEvent } from "react"
import { EventIcon } from "../events/icons/EventIcon"
import { EVENT_ICON_SIZE } from "../events/icons/event-icon-sizes"
import { cn } from "../../lib/utils"

type MessageComposeBarProps = {
  value?: string
  onChange?: (value: string) => void
  onSend?: () => void
  onAttach?: (file: File) => void
  placeholder?: string
  readOnly?: boolean
  className?: string
}

export function MessageComposeBar({
  value = "",
  onChange,
  onSend,
  onAttach,
  placeholder = "Send a message",
  readOnly = false,
  className,
}: MessageComposeBarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canSend = !readOnly && value.trim().length > 0

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      onSend?.()
    }
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-2xl bg-bg-canvas p-3 shadow-button-neutral",
        className,
      )}
    >
      {readOnly ? (
        <p className="px-1 py-1 text-sm leading-[22px] text-input-placeholder">{placeholder}</p>
      ) : (
        <textarea
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder={placeholder}
          className="max-h-32 min-h-[30px] resize-none border-0 bg-transparent px-1 py-1 text-sm leading-[22px] text-text-events-strong outline-none placeholder:text-input-placeholder"
        />
      )}

      <div className="flex items-center justify-end gap-2">
        <input
          ref={fileInputRef}
          type="file"
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) onAttach?.(file)
            event.target.value = ""
          }}
        />
        <button
          type="button"
          aria-label="Attach file"
          disabled={readOnly}
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-[10px] bg-button-neutral shadow-button-neutral transition-colors hover:bg-button-neutral-hover disabled:cursor-default disabled:opacity-60"
        >
          <EventIcon name="attachment-fill" size={EVENT_ICON_SIZE.composeAction} />
        </button>
        <button
          type="button"
          aria-label="Send message"
          disabled={readOnly || !canSend}
          onClick={onSend}
          className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-[10px] bg-button-primary shadow-button-primary transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <EventIcon name="arrow-up-fill" size={EVENT_ICON_SIZE.composeAction} />
        </button>
      </div>
    </div>
  )
}
