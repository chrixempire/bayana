import { useRef, useState } from "react"
import { Info, PenLine } from "lucide-react"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Modal } from "../../ui/modal"
import { toast } from "../../../hooks/use-toast"

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-[510] leading-[22px] text-input-label">
        {label} <span className="text-text-negative">*</span>
      </label>
      {children}
    </div>
  )
}

/** Lightweight canvas signature pad (draw with mouse / touch). */
function SignaturePad({ onDrawnChange }: { onDrawnChange: (hasInk: boolean) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const [empty, setEmpty] = useState(true)

  const point = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return null
    const rect = canvas.getBoundingClientRect()
    return {
      x: (event.clientX - rect.left) * (canvas.width / rect.width),
      y: (event.clientY - rect.top) * (canvas.height / rect.height),
    }
  }

  const start = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    const p = point(event)
    if (!ctx || !p) return
    drawing.current = true
    canvas?.setPointerCapture(event.pointerId)
    ctx.beginPath()
    ctx.moveTo(p.x, p.y)
  }

  const move = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return
    const ctx = canvasRef.current?.getContext("2d")
    const p = point(event)
    if (!ctx || !p) return
    ctx.lineTo(p.x, p.y)
    ctx.strokeStyle = "#2c3237"
    ctx.lineWidth = 2
    ctx.lineCap = "round"
    ctx.stroke()
    if (empty) {
      setEmpty(false)
      onDrawnChange(true)
    }
  }

  const end = () => {
    drawing.current = false
  }

  const clear = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
    setEmpty(true)
    onDrawnChange(false)
  }

  return (
    <div className="relative h-[120px] w-full overflow-hidden rounded-xl border border-border-input-default-200 bg-input-surface">
      <canvas
        ref={canvasRef}
        width={640}
        height={240}
        className="size-full touch-none"
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerLeave={end}
      />
      {empty ? (
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center gap-1.5 text-sm text-input-placeholder">
          <PenLine className="size-4" />
          Start drawing...
        </span>
      ) : (
        <button
          type="button"
          onClick={clear}
          className="absolute right-2 top-2 cursor-pointer rounded-md bg-bg-default-100 px-2 py-1 text-xs font-[510] text-text-table-header hover:bg-bg-active-200"
        >
          Clear
        </button>
      )}
    </div>
  )
}

export function ProvideSignatureModal({
  open,
  onClose,
  defaultName = "Daniel Osonuga",
  defaultPosition = "Founder",
}: {
  open: boolean
  onClose: () => void
  defaultName?: string
  defaultPosition?: string
}) {
  const [name, setName] = useState(defaultName)
  const [position, setPosition] = useState(defaultPosition)
  const [hasSignature, setHasSignature] = useState(false)

  const save = () => {
    toast({ variant: "success", title: "Signature saved" })
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Provide signature"
      size="xl"
      footer={
        <>
          <Button variant="neutral" size="sm" className="rounded-[10px]" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="rounded-[10px]"
            disabled={!name.trim() || !position.trim() || !hasSignature}
            onClick={save}
          >
            Save
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-5 md:flex-row md:items-start">
        {/* Preview */}
        <div className="flex w-full flex-col gap-4 rounded-2xl bg-[#ebd9ff] p-4 md:w-[200px] md:shrink-0">
          <div className="flex flex-1 flex-col justify-between rounded-xl bg-bg-canvas p-3">
            <div className="flex flex-col gap-2">
              <span className="h-2 w-2/3 rounded-full bg-bg-default-100" />
              <span className="h-2 w-full rounded-full bg-bg-default-100" />
              <span className="h-2 w-4/5 rounded-full bg-bg-default-100" />
            </div>
            <div className="mt-6 flex flex-col">
              <span className="text-xs font-[510] leading-5 text-[#140425]">{name || "Name"}</span>
              <span className="text-[10px] leading-4 text-[#513a69]">
                {position ? `${position}, Acme Incorporation` : "Position, Company"}
              </span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="flex flex-1 flex-col gap-4">
          <Field label="Full name">
            <Input density="compact" value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Position">
            <Input density="compact" value={position} onChange={(e) => setPosition(e.target.value)} />
          </Field>
          <Field label="Signature">
            <SignaturePad onDrawnChange={setHasSignature} />
          </Field>

          <div className="flex items-start gap-2 rounded-xl bg-bg-on-canvas p-3">
            <Info className="mt-0.5 size-4 shrink-0 text-icon-neutral" />
            <div className="flex flex-col">
              <p className="text-sm font-[510] leading-[22px] text-text-events-strong">
                Apply once, use everywhere
              </p>
              <p className="text-xs leading-5 text-text-table-header">
                Detail provided here would apply to subsequent events unless specified otherwise
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
