import {
  clampReliabilityScore,
  RELIABILITY_SCORE_MAX,
  RELIABILITY_SCORE_MIN,
} from "../../lib/reliability-score"

const BAR_HEIGHT_PX = 24
const TICK_WIDTH_PX = 3
const TICK_HEIGHT_PX = 32

const RELIABILITY_TRACK = "#FFF1E8"
const RELIABILITY_STRIPE = "#FFD4B8"

const BAR_STRIPE_BACKGROUND = `repeating-linear-gradient(135deg, ${RELIABILITY_STRIPE} 0, ${RELIABILITY_STRIPE} 8px, ${RELIABILITY_TRACK} 8px, ${RELIABILITY_TRACK} 16px)`

function ReliabilityScoreTick({ position }: { position: number }) {
  return (
    <div
      className="pointer-events-none absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${position}%` }}
      aria-hidden
    >
      <div
        className="rounded-full border border-[#EDF0F2] bg-white"
        style={{ width: TICK_WIDTH_PX, height: TICK_HEIGHT_PX }}
      />
    </div>
  )
}

export function ReliabilityScoreSlider({
  value,
  onChange,
}: {
  value: number
  onChange: (value: number) => void
}) {
  const percent = clampReliabilityScore(value)
  const tickPositions = Array.from(
    new Set([RELIABILITY_SCORE_MIN, percent, RELIABILITY_SCORE_MAX]),
  ).sort((a, b) => a - b)

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs leading-5 text-text-table-header">
        Only volunteers with a reliability score{" "}
        <span className="font-semibold text-text-events-strong">{percent}%</span> or higher will
        access the certificate
      </p>

      <div className="flex w-full flex-col">
        <div className="relative mb-1 h-7 w-full">
          <div
            className="pointer-events-none absolute bottom-0 z-20 -translate-x-1/2"
            style={{ left: `${percent}%` }}
          >
            <div className="rounded-lg border border-bg-accent bg-bg-canvas px-2.5 py-1 text-xs font-semibold leading-5 text-bg-accent shadow-[0_1px_2px_rgba(44,50,55,0.06)]">
              {percent}%
            </div>
          </div>
        </div>

        <div className="relative mb-1 h-4 w-full text-xs leading-5 text-text-table-header">
          <span className="absolute left-0 top-0">0%</span>
          <span className="absolute right-0 top-0">100%</span>
        </div>

        <div className="relative w-full" style={{ height: BAR_HEIGHT_PX }}>
          <div
            className="absolute inset-0 overflow-hidden rounded-full"
            style={{ background: BAR_STRIPE_BACKGROUND }}
          />

          {tickPositions.map((position) => (
            <ReliabilityScoreTick key={position} position={position} />
          ))}

          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={percent}
            onChange={(event) => onChange(clampReliabilityScore(Number(event.target.value)))}
            aria-label="Reliability score minimum"
            aria-valuemin={RELIABILITY_SCORE_MIN}
            aria-valuemax={RELIABILITY_SCORE_MAX}
            aria-valuenow={percent}
            className="absolute inset-0 z-30 w-full cursor-pointer opacity-0"
            style={{ height: BAR_HEIGHT_PX }}
          />
        </div>

        <div className="relative mt-1 h-4 w-full text-xs leading-5 text-text-table-header">
          <span
            className="absolute top-0 -translate-x-1/2"
            style={{ left: `${RELIABILITY_SCORE_MIN}%` }}
          >
            Minimum
          </span>
          <span
            className="absolute top-0 -translate-x-1/2"
            style={{ left: `${RELIABILITY_SCORE_MAX}%` }}
          >
            Maximum
          </span>
        </div>
      </div>
    </div>
  )
}
