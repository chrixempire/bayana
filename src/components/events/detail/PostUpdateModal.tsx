import { useState } from "react"
import { ImageIcon, Paperclip, X } from "lucide-react"
import { Button } from "../../ui/button"
import { Modal } from "../../ui/modal"
import { toast } from "../../../hooks/use-toast"
import { PersonAvatar } from "./PersonAvatar"

export function PostUpdateModal({
  open,
  onClose,
  onPost,
}: {
  open: boolean
  onClose: () => void
  onPost: (body: string) => void
}) {
  const [value, setValue] = useState("")

  const submit = () => {
    if (!value.trim()) return
    onPost(value.trim())
    toast({ variant: "success", title: "Update posted" })
    setValue("")
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} size="sm" bodyClassName="p-4">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 inline-flex size-8 cursor-pointer items-center justify-center rounded-full bg-bg-default-100 text-text-table-header transition-colors hover:bg-bg-active-200"
        aria-label="Close"
      >
        <X className="size-4" />
      </button>

      <div className="mt-8 flex gap-2.5">
        <PersonAvatar name="Acme" tone="orange" size={28} />
        <textarea
          autoFocus
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Post an update..."
          rows={4}
          className="min-h-[96px] w-full resize-none bg-transparent text-sm leading-[22px] text-text-events-strong outline-none placeholder:text-input-placeholder"
        />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-1 text-icon-neutral">
          <button type="button" className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg hover:bg-bg-default-100" aria-label="Add image">
            <ImageIcon className="size-4" />
          </button>
          <button type="button" className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg hover:bg-bg-default-100" aria-label="Add attachment">
            <Paperclip className="size-4" />
          </button>
        </div>
        <Button
          variant="primary"
          size="sm"
          className="rounded-[10px]"
          disabled={!value.trim()}
          onClick={submit}
        >
          Post
        </Button>
      </div>
    </Modal>
  )
}
