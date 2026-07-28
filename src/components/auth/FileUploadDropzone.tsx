import { useEffect, useMemo, useRef, useState } from "react"
import { cn } from "../../lib/utils"
import { ONBOARDING_FILE_MAX_SIZE_BYTES } from "../../pages/auth/onboarding-validation"

type UploadStatus = "idle" | "uploading" | "uploaded"

function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0KB"
  const mb = bytes / (1024 * 1024)
  if (mb >= 1) return `${mb.toFixed(mb >= 10 ? 0 : 1)}MB`
  return `${Math.max(1, Math.round(bytes / 1024))}KB`
}

export function FileUploadDropzone({
  value,
  onChange,
  accept = ".jpg,.jpeg,.png,.pdf",
  maxSizeHint = "JPG, PDF,& PNG file size up to 2MB",
  maxSizeBytes = ONBOARDING_FILE_MAX_SIZE_BYTES,
  sizeErrorMessage = "File must not be greater than 2048 kilobytes.",
  onSizeErrorChange,
}: {
  value: File | null
  onChange: (file: File | null) => void
  accept?: string
  maxSizeHint?: string
  maxSizeBytes?: number
  sizeErrorMessage?: string
  onSizeErrorChange?: (message: string) => void
}) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [status, setStatus] = useState<UploadStatus>(value ? "uploaded" : "idle")
  const [progress, setProgress] = useState(value ? 100 : 0)
  const [fileSize, setFileSize] = useState<string>(value ? formatFileSize(value.size) : "")
  const reportSizeError = (message: string) => {
    onSizeErrorChange?.(message)
  }

  // Sync internal upload state when the controlled `value` changes from outside
  // (e.g. the parent form clears or presets the file). Adjusting during render is
  // the recommended alternative to a prop-syncing effect.
  const [prevValue, setPrevValue] = useState(value)
  if (value !== prevValue) {
    setPrevValue(value)
    if (value && status === "idle") {
      setStatus("uploaded")
      setProgress(100)
      setFileSize(formatFileSize(value.size))
    } else if (!value && status !== "idle") {
      setStatus("idle")
      setProgress(0)
      setFileSize("")
    }
  }

  useEffect(() => {
    if (!value) {
      reportSizeError("")
      return
    }

    if (value.size > maxSizeBytes) {
      reportSizeError(sizeErrorMessage)
      return
    }

    reportSizeError("")
  }, [value, maxSizeBytes, sizeErrorMessage])

  useEffect(() => {
    if (status !== "uploading") return
    const id = window.setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + Math.floor(Math.random() * 16) + 8, 100)
        if (next >= 100) {
          window.clearInterval(id)
          setStatus("uploaded")
          return 100
        }
        return next
      })
    }, 260)
    return () => window.clearInterval(id)
  }, [status])

  const supportedTypesText = useMemo(() => maxSizeHint, [maxSizeHint])
  const fileName = value?.name ?? ""

  const startUpload = (file: File) => {
    onChange(file)
    setFileSize(formatFileSize(file.size))
    setProgress(18)
    setStatus("uploading")
  }

  const onFiles = (files: FileList | null) => {
    const file = files?.[0]
    if (!file) return

    if (file.size > maxSizeBytes) {
      reportSizeError(sizeErrorMessage)
      if (inputRef.current) inputRef.current.value = ""
      return
    }

    reportSizeError("")
    startUpload(file)
  }

  const clearFile = () => {
    onChange(null)
    setProgress(0)
    setStatus("idle")
    setFileSize("")
    reportSizeError("")
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept}
        onChange={(e) => onFiles(e.target.files)}
      />

      {status === "idle" ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={(e) => {
            e.preventDefault()
            setIsDragging(false)
          }}
          onDrop={(e) => {
            e.preventDefault()
            setIsDragging(false)
            onFiles(e.dataTransfer.files)
          }}
          className={cn(
            "flex h-[102px] w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed bg-white px-4 py-3 text-center transition-colors",
            isDragging ? "border-[#ff7415] bg-[#fff7f2]" : "border-[#dfe4e9]",
          )}
        >
          <span className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#eef1f4] text-[#656f78]">
            <UploadIcon />
          </span>
          <span className="text-sm font-medium leading-[22px] text-[#2c3237]">Drag & drop or choose file</span>
          <span className="mt-1 text-[11px] leading-4 text-[#9aa4af]">{supportedTypesText}</span>
        </button>
      ) : (
        <div className="rounded-xl border border-[#dfe4e9] bg-white px-3 py-2.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#f4f6f8] text-[#656f78]">
              <FileIcon />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium leading-5 text-[#2c3237]">{fileName}</p>
              <p className="mt-0.5 text-[11px] leading-4 text-[#8a949e]">
                {fileSize}
                {status === "uploading" ? ` - ${progress}%` : ""}
              </p>
            </div>
            <button
              type="button"
              aria-label="Replace uploaded file"
              className="inline-flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded text-[#8a949e] transition-colors hover:bg-[#f4f6f8] hover:text-[#59636e]"
              onClick={() => inputRef.current?.click()}
            >
              <EditIcon />
            </button>
            <button
              type="button"
              aria-label="Remove uploaded file"
              className="inline-flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded text-[#8a949e] transition-colors hover:bg-[#f4f6f8] hover:text-[#59636e]"
              onClick={clearFile}
            >
              <TrashIcon />
            </button>
          </div>
          {status === "uploading" ? (
            <div className="mt-2 h-1 rounded-full bg-[#e7ebef]">
              <div className="h-1 rounded-full bg-[#ff7415] transition-all" style={{ width: `${progress}%` }} />
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

function UploadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M7 9V3.5m0 0L4.8 5.7M7 3.5l2.2 2.2M3.5 9.5v1A1.5 1.5 0 0 0 5 12h4a1.5 1.5 0 0 0 1.5-1.5v-1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function FileIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M4 1.75h3.8L10.5 4.5v7.75H4A1.25 1.25 0 0 1 2.75 11V3A1.25 1.25 0 0 1 4 1.75Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/>
      <path d="M7.8 1.8V4.5h2.7" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/>
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M2.8 3h6.4M4.3 3V2a.8.8 0 0 1 .8-.8h1.8a.8.8 0 0 1 .8.8v1m-4.9 0 .4 6.2c.03.42.38.75.8.75h3.6c.42 0 .77-.33.8-.75L9.2 3M5.1 5.2v3.1m1.8-3.1v3.1" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
    </svg>
  )
}

function EditIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M8.65 1.8a1.05 1.05 0 1 1 1.49 1.49L4.6 8.85l-1.98.5.49-1.98L8.65 1.8Zm0 0 .5-.5a1.05 1.05 0 0 1 1.49 1.49l-.5.5"
        stroke="currentColor"
        strokeWidth="1.05"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
