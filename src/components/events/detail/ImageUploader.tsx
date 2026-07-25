import { useRef, useState } from "react"
import { cn } from "../../../lib/utils"
import { EventIcon } from "../icons/EventIcon"
import { EVENT_ICON_SIZE } from "../icons/event-icon-sizes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu"

export function ImageUploader({
  images,
  coverIndex,
  onImagesChange,
  onCoverChange,
  max = 4,
}: {
  images: string[]
  coverIndex: number
  onImagesChange: (images: string[]) => void
  onCoverChange: (index: number) => void
  max?: number
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const remaining = max - images.length

  const addFiles = (files: FileList | File[]) => {
    const incoming = Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, remaining)
    if (!incoming.length) return
    const urls = incoming.map((file) => URL.createObjectURL(file))
    onImagesChange([...images, ...urls])
  }

  const openPicker = () => {
    if (remaining > 0) inputRef.current?.click()
  }

  const removeAt = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index))
    if (coverIndex === index) onCoverChange(0)
    else if (coverIndex > index) onCoverChange(coverIndex - 1)
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(event) => {
          if (event.target.files) addFiles(event.target.files)
          event.target.value = ""
        }}
      />

      <button
        type="button"
        onClick={openPicker}
        onDragOver={(event) => {
          event.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(event) => {
          event.preventDefault()
          setDragOver(false)
          addFiles(event.dataTransfer.files)
        }}
        className={cn(
          "flex flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-border-input-default-200 bg-bg-on-canvas py-8 text-center transition-colors",
          dragOver && "border-border-input-active bg-bg-accent-soft/40",
          remaining === 0 ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:border-border-input-active",
        )}
      >
        <EventIcon name="upload-2-fill" size={20} className="text-icon-neutral" />
        <p className="text-sm font-[510] text-text-events-strong">
          {remaining === 0 ? "Maximum of 4 images added" : "Drag & drop or choose image"}
        </p>
        <p className="text-xs text-text-table-header">JPEG or PNG, 1280 by 620, Max file size: 1MB</p>
      </button>

      <div className="flex gap-3">
        {Array.from({ length: max }).map((_, index) => {
          const url = images[index]
          if (!url) {
            return (
              <button
                key={index}
                type="button"
                onClick={openPicker}
                className="size-16 rounded-xl border border-dashed border-border-input-default-200 bg-bg-on-canvas transition-colors hover:border-border-input-active"
                aria-label="Add image"
              />
            )
          }
          return (
            <div
              key={index}
              className="relative size-16 overflow-hidden rounded-xl border border-border-default-100"
            >
              <img src={url} alt="" className="size-full object-cover" />
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="absolute right-1 top-1 inline-flex size-5 cursor-pointer items-center justify-center rounded-full bg-white/85 text-text-table-header outline-none hover:bg-white"
                  aria-label="Image options"
                >
                  <EventIcon name="more-1-fill" size={EVENT_ICON_SIZE.composeAction} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onSelect={() => onCoverChange(index)}>
                    Set as cover
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-text-negative focus:bg-bg-negative-soft"
                    onSelect={() => removeAt(index)}
                  >
                    Remove
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {coverIndex === index ? (
                <span className="absolute inset-x-1 bottom-1 rounded bg-bg-accent px-1 py-0.5 text-center text-[10px] font-[510] leading-4 text-text-on-solid-bg">
                  Cover
                </span>
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}
