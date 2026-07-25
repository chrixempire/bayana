import { cn } from "../../lib/utils"

type SegmentedProgressProps = {
  value: number
  max: number
  segments?: number
  className?: string
}

/** Figma table volunteer loader — 6-segment bar, 6px tall. */
export function SegmentedProgress({
  value,
  max,
  segments = 6,
  className,
}: SegmentedProgressProps) {
  const filled =
    max > 0 ? Math.min(segments, Math.round((value / max) * segments)) : 0

  return (
    <div
      className={cn("flex h-1.5 w-full overflow-hidden rounded-full bg-bg-default-100", className)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      {Array.from({ length: segments }).map((_, index) => (
        <div
          key={index}
          className={cn("min-w-0 flex-1 bg-bg-accent", index >= filled && "opacity-0")}
        />
      ))}
    </div>
  )
}
