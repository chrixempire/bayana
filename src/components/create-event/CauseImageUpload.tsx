import { useCallback, useEffect, useRef, useState } from "react"
import { EventIcon } from "../events/icons/EventIcon"
import { EVENT_ICON_SIZE } from "../events/icons/event-icon-sizes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { cn } from "../../lib/utils"
import type { CreateEventImage } from "../../pages/dashboard/create-event-types"
import { CREATE_EVENT_IMAGE_UPLOADER_HEIGHT_PX } from "../../lib/dashboard-layout"
import { CREATE_EVENT_MAX_IMAGES } from "../../pages/dashboard/create-event-types"

type CauseImageUploadProps = {
  images: CreateEventImage[]
  onChange: (images: CreateEventImage[]) => void
}

function createImageFromFile(file: File): CreateEventImage {
  return {
    id: crypto.randomUUID(),
    previewUrl: URL.createObjectURL(file),
    name: file.name,
    isCover: false,
    file,
  }
}

function ImageUploadProgressBar({ progress }: { progress: number }) {
  return (
    <div
      className="absolute inset-x-2 bottom-2 h-1.5 overflow-hidden rounded-full bg-[#EDF0F2]"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full bg-bg-accent transition-[width] duration-150 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  )
}

type ImageSlotProps = {
  image: CreateEventImage
  uploadProgress?: number
  onSetCover: () => void
  onRemove: () => void
  onReplace: (file: File) => void
}

function ImageSlot({ image, uploadProgress, onSetCover, onRemove, onReplace }: ImageSlotProps) {
  const isUploading = uploadProgress != null && uploadProgress < 100
  const replaceInputRef = useRef<HTMLInputElement>(null)

  const openReplacePicker = () => {
    replaceInputRef.current?.click()
  }

  return (
    <div className="relative aspect-square overflow-hidden rounded-lg border border-border-default-100 bg-bg-default-100">
      <img src={image.previewUrl} alt="" className="size-full object-cover" />

      {image.isCover && !isUploading ? (
        <span className="absolute bottom-2 left-1/2 z-[1] -translate-x-1/2 rounded-full bg-bg-accent px-2.5 py-0.5 text-[11px] font-medium leading-4 text-text-on-solid-bg">
          Cover
        </span>
      ) : null}

      {isUploading ? <ImageUploadProgressBar progress={uploadProgress} /> : null}

      {!isUploading ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="absolute right-1.5 top-1.5 z-[2] inline-flex size-7 cursor-pointer items-center justify-center rounded-full bg-bg-canvas text-text-events-strong shadow-[0_2px_8px_rgba(44,50,55,0.12)] outline-none hover:bg-bg-on-canvas focus-visible:ring-2 focus-visible:ring-border-input-active"
              aria-label="Image options"
            >
              <EventIcon name="more-1-fill" size={EVENT_ICON_SIZE.meta} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[168px] rounded-xl p-1.5">
            <DropdownMenuItem className="cursor-pointer gap-2.5 px-3 py-2" onClick={openReplacePicker}>
              <EventIcon name="pen-fill" size={EVENT_ICON_SIZE.meta} className="shrink-0" />
              Change image
            </DropdownMenuItem>
            {!image.isCover ? (
              <DropdownMenuItem className="cursor-pointer gap-2.5 px-3 py-2" onClick={onSetCover}>
                <EventIcon name="eye-fill" size={EVENT_ICON_SIZE.meta} className="shrink-0" />
                Set as cover
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuItem
              className="cursor-pointer gap-2.5 px-3 py-2 text-text-events-strong focus:text-text-events-strong"
              onClick={onRemove}
            >
              <EventIcon name="delete-fill" size={EVENT_ICON_SIZE.meta} className="shrink-0" />
              Delete image
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}

      <input
        ref={replaceInputRef}
        type="file"
        accept="image/jpeg,image/png"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) onReplace(file)
          event.target.value = ""
        }}
      />
    </div>
  )
}

export function CauseImageUpload({ images, onChange }: CauseImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const uploadTimersRef = useRef<Map<string, ReturnType<typeof setInterval>>>(new Map())
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgressById, setUploadProgressById] = useState<Record<string, number>>({})

  const slots = Array.from({ length: CREATE_EVENT_MAX_IMAGES }, (_, index) => images[index] ?? null)
  const showGallery = images.length > 0

  const clearUploadTimer = useCallback((id: string) => {
    const timer = uploadTimersRef.current.get(id)
    if (timer) {
      clearInterval(timer)
      uploadTimersRef.current.delete(id)
    }
  }, [])

  const startUploadSimulation = useCallback(
    (ids: string[]) => {
      ids.forEach((id) => {
        clearUploadTimer(id)
        setUploadProgressById((prev) => ({ ...prev, [id]: 0 }))

        let progress = 0
        const timer = setInterval(() => {
          progress += 6 + Math.random() * 14
          if (progress >= 100) {
            clearUploadTimer(id)
            setUploadProgressById((prev) => {
              const next = { ...prev }
              delete next[id]
              return next
            })
            return
          }
          setUploadProgressById((prev) => ({ ...prev, [id]: progress }))
        }, 120)

        uploadTimersRef.current.set(id, timer)
      })
    },
    [clearUploadTimer],
  )

  useEffect(() => {
    const timers = uploadTimersRef.current
    return () => {
      timers.forEach((timer) => clearInterval(timer))
      timers.clear()
    }
  }, [])

  const addFiles = (files: FileList | null) => {
    if (!files?.length) return
    const remaining = CREATE_EVENT_MAX_IMAGES - images.length
    const nextFiles = Array.from(files).slice(0, remaining)
    if (nextFiles.length === 0) return

    const added = nextFiles.map(createImageFromFile)
    const merged = [...images, ...added]
    if (!merged.some((image) => image.isCover) && merged[0]) {
      merged[0] = { ...merged[0], isCover: true }
    }
    onChange(merged)
    startUploadSimulation(added.map((image) => image.id))
  }

  const setCover = (id: string) => {
    onChange(images.map((image) => ({ ...image, isCover: image.id === id })))
  }

  const removeImage = (id: string) => {
    clearUploadTimer(id)
    setUploadProgressById((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
    const next = images.filter((image) => image.id !== id)
    if (next.length > 0 && !next.some((image) => image.isCover)) {
      next[0] = { ...next[0], isCover: true }
    }
    onChange(next)
  }

  const replaceImage = (id: string, file: File) => {
    onChange(
      images.map((image) =>
        image.id === id ? { ...createImageFromFile(file), id, isCover: image.isCover } : image,
      ),
    )
    startUploadSimulation([id])
  }

  const openFilePicker = () => {
    if (images.length < CREATE_EVENT_MAX_IMAGES) {
      inputRef.current?.click()
    }
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <button
        type="button"
        onClick={openFilePicker}
        onDragOver={(event) => {
          event.preventDefault()
          if (images.length < CREATE_EVENT_MAX_IMAGES) setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault()
          setIsDragging(false)
          addFiles(event.dataTransfer.files)
        }}
        disabled={images.length >= CREATE_EVENT_MAX_IMAGES}
        className={cn(
          "flex h-[130px] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#E1E5EA] bg-bg-canvas p-4 text-center transition-colors",
          isDragging
            ? "border-border-input-active bg-bg-accent-soft/30"
            : "hover:bg-bg-on-canvas/80",
          images.length >= CREATE_EVENT_MAX_IMAGES && "cursor-not-allowed opacity-60",
        )}
        style={{ height: CREATE_EVENT_IMAGE_UPLOADER_HEIGHT_PX }}
      >
        <span className="inline-flex items-center justify-center rounded-lg border border-border-default-100 bg-bg-canvas px-2 py-1.5 text-text-table-header">
          <EventIcon name="upload-2-fill" size={EVENT_ICON_SIZE.buttonLeading} />
        </span>
        <span className="type-events-tab text-center">Drag & drop or choose image</span>
        <span className="type-create-event-caption text-center">
          JPEG or PNG, 1280 by 820, Max file size: 1MB
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        multiple
        className="sr-only"
        onChange={(event) => {
          addFiles(event.target.files)
          event.target.value = ""
        }}
      />

      {showGallery ? (
        <div className="grid w-full grid-cols-4 gap-2">
          {slots.map((image, index) =>
            image ? (
              <ImageSlot
                key={image.id}
                image={image}
                uploadProgress={uploadProgressById[image.id]}
                onSetCover={() => setCover(image.id)}
                onRemove={() => removeImage(image.id)}
                onReplace={(file) => replaceImage(image.id, file)}
              />
            ) : (
              <button
                key={`empty-${index}`}
                type="button"
                onClick={openFilePicker}
                disabled={images.length >= CREATE_EVENT_MAX_IMAGES}
                className="aspect-square cursor-pointer rounded-lg border border-border-default-100 bg-bg-canvas transition-colors hover:bg-bg-on-canvas disabled:cursor-default disabled:opacity-60"
                aria-label="Add image"
              />
            ),
          )}
        </div>
      ) : null}
    </div>
  )
}
