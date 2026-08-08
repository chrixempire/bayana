import { useRef, type PointerEvent } from "react"
import {
  handAngleFromHour12,
  handAngleFromMinute,
  hour12FromAngle,
  minuteFromAngle,
  polarToCartesian,
  type ClockTimeParts,
} from "../../lib/time-picker"
import { cn } from "../../lib/utils"

const SIZE = 256
const CX = SIZE / 2
const CY = SIZE / 2
const NUMBER_RADIUS = 92

type ClockMode = "hours" | "minutes"

type ClockTimePickerFaceProps = {
  parts: ClockTimeParts
  mode: ClockMode
  onModeChange: (mode: ClockMode) => void
  onChange: (parts: ClockTimeParts) => void
}

function HourMarkers({
  onSelect,
}: {
  onSelect: (hour: number) => void
}) {
  return (
    <>
      {Array.from({ length: 12 }, (_, index) => {
        const hour = index === 0 ? 12 : index
        const { x, y } = polarToCartesian(CX, CY, NUMBER_RADIUS, handAngleFromHour12(hour))

        return (
          <button
            key={hour}
            type="button"
            aria-label={`${hour} o'clock`}
            className="absolute flex size-9 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-sm font-medium leading-[22px] text-text-events-strong transition-colors hover:bg-bg-canvas/80"
            style={{ left: x, top: y }}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation()
              onSelect(hour)
            }}
          >
            {hour}
          </button>
        )
      })}
    </>
  )
}

function MinuteMarkers() {
  return (
    <>
      {Array.from({ length: 12 }, (_, index) => {
        const minute = index * 5
        const { x, y } = polarToCartesian(CX, CY, NUMBER_RADIUS, handAngleFromMinute(minute))

        return (
          <span
            key={minute}
            className="absolute flex size-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center text-[11px] font-medium leading-4 text-text-table-header"
            style={{ left: x, top: y }}
            aria-hidden
          >
            {minute}
          </span>
        )
      })}
    </>
  )
}

export function ClockTimePickerFace({ parts, mode, onModeChange, onChange }: ClockTimePickerFaceProps) {
  const faceRef = useRef<HTMLDivElement>(null)

  const handAngle =
    mode === "hours" ? handAngleFromHour12(parts.hour12) : handAngleFromMinute(parts.minute)
  const handTip = polarToCartesian(CX, CY, NUMBER_RADIUS, handAngle)

  const updateFromPointer = (clientX: number, clientY: number) => {
    const rect = faceRef.current?.getBoundingClientRect()
    if (!rect) return

    const dx = clientX - (rect.left + rect.width / 2)
    const dy = clientY - (rect.top + rect.height / 2)
    const distance = Math.hypot(dx, dy)
    if (distance < 20) return

    const radians = Math.atan2(dy, dx)
    const angleDeg = ((radians * 180) / Math.PI + 90 + 360) % 360

    if (mode === "hours") {
      const hour12 = hour12FromAngle(angleDeg)
      onChange({ ...parts, hour12 })
      onModeChange("minutes")
      return
    }

    onChange({ ...parts, minute: minuteFromAngle(angleDeg) })
  }

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.preventDefault()
    faceRef.current?.setPointerCapture(event.pointerId)
    updateFromPointer(event.clientX, event.clientY)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!faceRef.current?.hasPointerCapture(event.pointerId)) return
    updateFromPointer(event.clientX, event.clientY)
  }

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (faceRef.current?.hasPointerCapture(event.pointerId)) {
      faceRef.current.releasePointerCapture(event.pointerId)
    }
  }

  return (
    <div className="relative mx-auto select-none" style={{ width: SIZE, height: SIZE }}>
      <div
        ref={faceRef}
        role="application"
        aria-label={mode === "hours" ? "Select hour" : "Select minute"}
        className="relative size-full touch-none rounded-full bg-bg-default-100"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <svg className="pointer-events-none absolute inset-0 size-full" viewBox={`0 0 ${SIZE} ${SIZE}`}>
          <circle cx={CX} cy={CY} r={NUMBER_RADIUS} fill="none" stroke="#ebeef2" strokeWidth="1" />
          <line
            x1={CX}
            y1={CY}
            x2={handTip.x}
            y2={handTip.y}
            stroke="#ff7a1a"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle
            cx={handTip.x}
            cy={handTip.y}
            r={mode === "hours" ? 20 : 16}
            fill="#ff7a1a"
          />
        </svg>

        {mode === "hours" ? (
          <HourMarkers
            onSelect={(hour12) => {
              onChange({ ...parts, hour12 })
              onModeChange("minutes")
            }}
          />
        ) : (
          <MinuteMarkers />
        )}
      </div>

      <button
        type="button"
        className={cn(
          "absolute left-1/2 top-1/2 z-10 flex size-11 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-2 bg-bg-canvas text-sm font-semibold leading-[22px] shadow-button-neutral transition-colors",
          mode === "hours"
            ? "border-bg-accent text-bg-accent"
            : "border-border-default-100 text-text-events-strong hover:border-bg-accent hover:text-bg-accent",
        )}
        onPointerDown={(event) => event.stopPropagation()}
        onClick={() => onModeChange(mode === "hours" ? "minutes" : "hours")}
        aria-label={mode === "hours" ? "Switch to minute selection" : "Switch to hour selection"}
      >
        {mode === "hours" ? parts.hour12 : String(parts.minute).padStart(2, "0")}
      </button>
    </div>
  )
}
