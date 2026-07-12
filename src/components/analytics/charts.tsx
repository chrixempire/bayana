import { useEffect, useRef, useState } from "react"
import { cn } from "../../lib/utils"
import { CHART_TRACK } from "../../pages/dashboard/analytics-data"

/** Measure a container's width so charts can render at crisp, pixel-accurate coordinates. */
function useMeasuredWidth() {
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      const next = entries[0]?.contentRect.width ?? 0
      setWidth(next)
    })
    observer.observe(el)
    setWidth(el.clientWidth)
    return () => observer.disconnect()
  }, [])
  return [ref, width] as const
}

/** Catmull-Rom → cubic Bézier smoothing for a series of points. */
function smoothPath(points: { x: number; y: number }[]) {
  if (points.length < 2) return ""
  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] ?? p2
    const c1x = p1.x + (p2.x - p0.x) / 6
    const c1y = p1.y + (p2.y - p0.y) / 6
    const c2x = p2.x - (p3.x - p1.x) / 6
    const c2y = p2.y - (p3.y - p1.y) / 6
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`
  }
  return d
}

export function ChartLegend({ items }: { items: { label: string; color: string; value?: string }[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
      {items.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-1.5 text-sm leading-[22px] text-text-table-header">
          <span className="size-3 rounded-[3px]" style={{ backgroundColor: item.color }} />
          {item.label}
          {item.value ? <span className="font-semibold text-text-events-strong">{item.value}</span> : null}
        </span>
      ))}
    </div>
  )
}

/** Legend rows with swatch, label and percentage — used beneath pie charts. */
export function PieLegend({ slices }: { slices: { label: string; value: number; color: string }[] }) {
  const total = slices.reduce((sum, s) => sum + s.value, 0)
  return (
    <div className="flex w-full flex-col gap-2">
      {slices.map((s) => (
        <div key={s.label} className="flex items-center justify-between gap-3 text-sm leading-[22px]">
          <span className="inline-flex items-center gap-1.5 text-text-table-header">
            <span className="size-3 rounded-[3px]" style={{ backgroundColor: s.color }} />
            {s.label}
          </span>
          <span className="font-semibold text-text-events-strong">
            {total > 0 ? Math.round((s.value / total) * 100) : 0}%
          </span>
        </div>
      ))}
    </div>
  )
}

type LineSeries = { label: string; color: string; data: number[] }

export function LineChart({
  series,
  maxY = 1000,
  xStart,
  xEnd,
  height = 300,
  dateLabel = "14 Mar, 2026",
}: {
  series: LineSeries[]
  maxY?: number
  xStart: string
  xEnd: string
  height?: number
  dateLabel?: string
}) {
  const [ref, width] = useMeasuredWidth()
  const [hover, setHover] = useState<number | null>(null)

  const padLeft = 8
  const padRight = 8
  const padTop = 8
  const padBottom = 28
  const w = Math.max(width, 1)
  const plotW = w - padLeft - padRight
  const plotH = height - padTop - padBottom
  const count = series[0]?.data.length ?? 0

  const xAt = (i: number) => padLeft + (count <= 1 ? 0 : (i / (count - 1)) * plotW)
  const yAt = (v: number) => padTop + plotH - (v / maxY) * plotH

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left - padLeft
    const i = Math.round((x / plotW) * (count - 1))
    setHover(Math.max(0, Math.min(count - 1, i)))
  }

  return (
    <div className="flex size-full flex-col">
      <div className="mb-1 text-xs leading-5 text-text-table-header">{maxY.toLocaleString()}</div>
      <div
        ref={ref}
        className="relative min-h-0 flex-1"
        style={{ height }}
        onMouseMove={handleMove}
        onMouseLeave={() => setHover(null)}
      >
        {width > 0 ? (
          <svg width={w} height={height} className="overflow-visible">
            {/* baseline */}
            <line
              x1={padLeft}
              y1={padTop + plotH}
              x2={w - padRight}
              y2={padTop + plotH}
              stroke={CHART_TRACK}
              strokeWidth={1}
            />
            {hover !== null ? (
              <line
                x1={xAt(hover)}
                y1={padTop}
                x2={xAt(hover)}
                y2={padTop + plotH}
                stroke="#c7ccd1"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
            ) : null}
            {series.map((s) => {
              const pts = s.data.map((v, i) => ({ x: xAt(i), y: yAt(v) }))
              return (
                <path
                  key={s.label}
                  d={smoothPath(pts)}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )
            })}
            {hover !== null
              ? series.map((s) => (
                  <circle
                    key={s.label}
                    cx={xAt(hover)}
                    cy={yAt(s.data[hover])}
                    r={4}
                    fill="#fff"
                    stroke={s.color}
                    strokeWidth={2.5}
                  />
                ))
              : null}
          </svg>
        ) : null}

        {hover !== null ? (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 rounded-xl bg-[#2c3237] px-3 py-2 text-xs text-white shadow-lg"
            style={{ left: xAt(hover), top: 4 }}
          >
            <div className="mb-1 font-medium">{dateLabel}</div>
            {series.map((s) => (
              <div key={s.label} className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="size-2 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-white/70">{s.label}</span>
                <span className="ml-auto font-medium">{s.data[hover]}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
      <div className="mt-1 flex items-center justify-between text-xs leading-5 text-text-table-header">
        <span>{xStart}</span>
        <span>{xEnd}</span>
      </div>
    </div>
  )
}

type Slice = { label: string; value: number; color: string }

export function PieChart({ slices, size = 220 }: { slices: Slice[]; size?: number }) {
  const [hover, setHover] = useState<number | null>(null)
  const total = slices.reduce((sum, s) => sum + s.value, 0)
  const cx = size / 2
  const cy = size / 2
  const r = size / 2 - 8 // leave room so a hovered slice can pop out without clipping

  const angles = slices.map((s) => (total > 0 ? (s.value / total) * Math.PI * 2 : 0))
  const arcs = slices.map((s, i) => {
    const start = -Math.PI / 2 + angles.slice(0, i).reduce((sum, a) => sum + a, 0)
    const angle = angles[i]
    const end = start + angle
    const large = angle > Math.PI ? 1 : 0
    const x1 = cx + r * Math.cos(start)
    const y1 = cy + r * Math.sin(start)
    const x2 = cx + r * Math.cos(end)
    const y2 = cy + r * Math.sin(end)
    const mid = start + angle / 2
    const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`
    return { d, mid, slice: s }
  })

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="overflow-visible">
        {arcs.map((arc, i) => {
          const active = hover === i
          const dx = active ? Math.cos(arc.mid) * 6 : 0
          const dy = active ? Math.sin(arc.mid) * 6 : 0
          return (
            <path
              key={arc.slice.label}
              d={arc.d}
              fill={arc.slice.color}
              transform={`translate(${dx} ${dy})`}
              className="cursor-pointer transition-transform duration-150"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            />
          )
        })}
      </svg>
      {hover !== null ? (
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-[#2c3237] px-3 py-2 text-xs text-white shadow-lg">
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="size-2 rounded-full" style={{ backgroundColor: slices[hover].color }} />
            <span className="text-white/70">{slices[hover].label}</span>
            <span className="ml-2 font-medium">{slices[hover].value}</span>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export function SkillBars({ rows }: { rows: { label: string; value: number; pct: number }[] }) {
  return (
    <div className="flex flex-col gap-4">
      {rows.map((row) => (
        <div key={row.label} className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-sm leading-[22px]">
            <span className="text-text-events-strong">{row.label}</span>
            <span className="text-text-table-header">{row.value}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full" style={{ backgroundColor: CHART_TRACK }}>
            <div className="h-full rounded-full bg-button-primary" style={{ width: `${row.pct}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Nigeria demographic dot map ───────────────────────────────────────────────
// Rough normalised outline of Nigeria; dots inside are heat-shaded by proximity
// to a few population hotspots.
const NIGERIA: [number, number][] = [
  [0.12, 0.3],
  [0.24, 0.22],
  [0.4, 0.24],
  [0.52, 0.16],
  [0.7, 0.2],
  [0.86, 0.16],
  [0.92, 0.32],
  [0.84, 0.46],
  [0.88, 0.6],
  [0.82, 0.74],
  [0.7, 0.8],
  [0.58, 0.82],
  [0.44, 0.78],
  [0.3, 0.74],
  [0.18, 0.6],
  [0.12, 0.46],
]

const HOTSPOTS: { x: number; y: number; strength: number }[] = [
  { x: 0.5, y: 0.5, strength: 0.16 },
  { x: 0.24, y: 0.68, strength: 0.12 },
  { x: 0.78, y: 0.72, strength: 0.11 },
  { x: 0.6, y: 0.78, strength: 0.1 },
  { x: 0.44, y: 0.6, strength: 0.1 },
]

function pointInPolygon(x: number, y: number, poly: [number, number][]) {
  let inside = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i]
    const [xj, yj] = poly[j]
    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi
    if (intersect) inside = !inside
  }
  return inside
}

function mix(a: number, b: number, t: number) {
  return Math.round(a + (b - a) * t)
}

function heatColor(t: number) {
  if (t < 0.12) return "#e1e5ea"
  // light peach → strong orange
  const k = Math.min(1, (t - 0.12) / 0.88)
  const r = mix(255, 255, k)
  const g = mix(220, 116, k)
  const b = mix(180, 21, k)
  return `rgb(${r}, ${g}, ${b})`
}

export function NigeriaDotMap({ height = 340 }: { height?: number }) {
  const [ref, width] = useMeasuredWidth()
  const w = Math.max(width, 1)
  // Keep Nigeria's proportions (~1.1 wide : 1 tall) inside a centred box.
  const boxW = Math.min(w, height * 1.4)
  const boxX = (w - boxW) / 2
  const cols = 30
  const cell = boxW / cols
  const rows = Math.max(1, Math.round(height / cell))
  const radius = Math.max(2, cell * 0.3)

  const dots: { cx: number; cy: number; color: string }[] = []
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const offset = row % 2 === 0 ? 0 : cell / 2
      const px = boxX + col * cell + cell / 2 + offset
      const py = row * cell + cell / 2
      const nx = (px - boxX) / boxW
      const ny = py / height
      if (!pointInPolygon(nx, ny, NIGERIA)) continue
      let intensity = 0
      for (const h of HOTSPOTS) {
        const dist = Math.hypot(nx - h.x, ny - h.y)
        intensity += Math.exp(-(dist * dist) / (2 * h.strength * h.strength))
      }
      dots.push({ cx: px, cy: py, color: heatColor(Math.min(1, intensity)) })
    }
  }

  return (
    <div ref={ref} className="w-full" style={{ height }}>
      {width > 0 ? (
        <svg width={w} height={height}>
          {dots.map((d, i) => (
            <circle key={i} cx={d.cx} cy={d.cy} r={radius} fill={d.color} />
          ))}
        </svg>
      ) : null}
    </div>
  )
}

export function ChartCard({
  title,
  action,
  children,
  className,
  legend,
}: {
  title: string
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
  legend?: React.ReactNode
}) {
  return (
    <div className={cn("flex flex-col gap-4 rounded-2xl border border-border-default-100 bg-bg-canvas p-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-lg font-semibold leading-6 text-text-events-strong">{title}</h3>
        <div className="flex items-center gap-3">
          {legend}
          {action}
        </div>
      </div>
      {children}
    </div>
  )
}
