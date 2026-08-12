import { useRef, useState } from "react"
import { EventIcon } from "../events/icons/EventIcon"
import { EVENT_ICON_SIZE } from "../events/icons/event-icon-sizes"
import { Modal } from "../ui/modal"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { CreateEventFieldLabel } from "./CreateEventFieldLabel"
import type { InKindItem } from "../../pages/dashboard/create-event-types"

type ItemDraft = {
  name: string
  description: string
  quantity: string
  imageUrl: string | null
  file?: File
}

const EMPTY_DRAFT: ItemDraft = { name: "", description: "", quantity: "", imageUrl: null }

function toDraft(item: InKindItem | null): ItemDraft {
  if (!item) return EMPTY_DRAFT
  return {
    name: item.name,
    description: item.description,
    quantity: item.quantity > 0 ? String(item.quantity) : "",
    imageUrl: item.imageUrl,
    file: item.file,
  }
}

export function CreateEventAddItemModal({
  open,
  item,
  onClose,
  onSubmit,
}: {
  open: boolean
  /** When set, the modal edits this item; otherwise it adds a new one. */
  item: InKindItem | null
  onClose: () => void
  onSubmit: (item: InKindItem) => void
}) {
  // The parent remounts this modal (via `key`) whenever it opens, so a lazy
  // initializer is enough to seed the draft from the item being edited.
  const [draft, setDraft] = useState<ItemDraft>(() => toDraft(item))
  const inputRef = useRef<HTMLInputElement>(null)

  const quantityValue = Number.parseInt(draft.quantity, 10)
  const canSubmit =
    draft.name.trim().length > 0 &&
    draft.description.trim().length > 0 &&
    Number.isFinite(quantityValue) &&
    quantityValue > 0

  const handleSubmit = () => {
    if (!canSubmit) return
    onSubmit({
      id: item?.id ?? crypto.randomUUID(),
      name: draft.name.trim(),
      description: draft.description.trim(),
      quantity: quantityValue,
      imageUrl: draft.imageUrl,
      file: draft.file,
    })
  }

  const handleFile = (file: File | undefined) => {
    if (!file) return
    setDraft((prev) => ({
      ...prev,
      file,
      imageUrl: URL.createObjectURL(file),
    }))
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add item"
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
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            {item ? "Save item" : "Add item"}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4 pb-2">
        <div className="flex flex-col gap-2">
          <CreateEventFieldLabel label="Name" required />
          <Input
            density="compact"
            value={draft.name}
            onChange={(event) => setDraft((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="Enter item name"
          />
        </div>

        <div className="flex flex-col gap-2">
          <CreateEventFieldLabel label="Description" required />
          <Textarea
            value={draft.description}
            onChange={(event) =>
              setDraft((prev) => ({ ...prev, description: event.target.value }))
            }
            placeholder="Enter description"
            className="min-h-[96px] rounded-xl"
          />
          <p className="type-create-event-caption">Specs, Size, Condition</p>
        </div>

        <div className="flex flex-col gap-2">
          <CreateEventFieldLabel label="Quantity required" required />
          <Input
            density="compact"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={draft.quantity}
            onChange={(event) =>
              setDraft((prev) => ({ ...prev, quantity: event.target.value.replace(/[^0-9]/g, "") }))
            }
            placeholder="0"
          />
        </div>

        <div className="flex flex-col gap-2">
          <CreateEventFieldLabel label="Supporting image" />
          {draft.imageUrl ? (
            <div className="relative size-[72px] overflow-hidden rounded-lg border border-border-default-100 bg-bg-default-100">
              <img src={draft.imageUrl} alt="" className="size-full object-cover" />
              <button
                type="button"
                aria-label="Remove image"
                onClick={() => setDraft((prev) => ({ ...prev, imageUrl: null, file: undefined }))}
                className="absolute right-1 top-1 inline-flex size-6 cursor-pointer items-center justify-center rounded-full bg-bg-canvas text-text-events-strong shadow-[0_2px_8px_rgba(44,50,55,0.12)] hover:bg-bg-on-canvas"
              >
                <EventIcon name="delete-fill" size={EVENT_ICON_SIZE.fieldHint} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault()
                handleFile(event.dataTransfer.files?.[0])
              }}
              className="flex h-[110px] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#E1E5EA] bg-bg-canvas p-4 text-center transition-colors hover:bg-bg-on-canvas/80"
            >
              <span className="inline-flex items-center justify-center gap-1 rounded-lg border border-border-default-100 bg-bg-canvas px-2 py-1.5 text-text-table-header">
                <EventIcon name="upload-2-fill" size={EVENT_ICON_SIZE.buttonLeading} />
                <EventIcon name="add-circle-fill" size={EVENT_ICON_SIZE.buttonTrailing} />
              </span>
              <span className="type-events-tab text-center">Drag &amp; drop or choose image</span>
              <span className="type-create-event-caption text-center">
                JPEG or PNG, 1280 by 820, Max file size: 1MB
              </span>
            </button>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png"
            className="sr-only"
            onChange={(event) => {
              handleFile(event.target.files?.[0])
              event.target.value = ""
            }}
          />
        </div>
      </div>
    </Modal>
  )
}
