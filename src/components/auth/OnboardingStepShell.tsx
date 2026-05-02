import type { ReactNode } from "react"
import { cn } from "../../lib/utils"
import { OnboardingInfoCallout } from "./OnboardingInfoCallout"

/**
 * Layout (large screens):
 * - Row 1: `frameStart` spans full width (e.g. Back).
 * - Row 2: `titleBlock` | callout — two grid columns, `items-start`.
 * - Row 3: `children` spans **both** columns so the form uses the full width under the header
 *   (no empty strip under the callout).
 *
 * Small screens: single column — frameStart, title, callout, then form (full width).
 */
export function OnboardingStepShell({
  frameStart,
  titleBlock,
  children,
  showCallout = true,
  callout,
  combineTitleAndContent = false,
  wide = false,
}: {
  frameStart?: ReactNode
  titleBlock: ReactNode
  children: ReactNode
  showCallout?: boolean
  callout?: ReactNode
  combineTitleAndContent?: boolean
  wide?: boolean
}) {
  return (
    <div
      className={cn(
        "mx-auto grid w-full max-w-[560px] grid-cols-1 gap-y-[40px]",
        wide
          ? "min-[1200px]:grid-cols-[minmax(0,1fr)_minmax(260px,368px)]"
          : "min-[1200px]:grid-cols-[minmax(0,420px)_minmax(260px,368px)] min-[1200px]:justify-between",
        "min-[900px]:mx-0 min-[900px]:max-w-none min-[1200px]:items-start min-[1200px]:gap-x-16",
      )}
    >
      {frameStart ? <div className="col-span-full min-w-0">{frameStart}</div> : null}

      {showCallout ? (
        <div className="col-span-full min-w-0 min-[1200px]:col-start-2 min-[1200px]:row-start-2">
          {callout ?? (
            <OnboardingInfoCallout className="w-full max-w-[368px] min-[1200px]:sticky min-[1200px]:top-8 min-[1200px]:justify-self-end" />
          )}
        </div>
      ) : null}

      <div
        className={cn(
          "col-span-full min-w-0",
          wide ? "max-w-none" : "max-w-none min-[1200px]:max-w-[420px]",
          "min-[1200px]:col-start-1 min-[1200px]:row-start-2",
        )}
      >
        {combineTitleAndContent ? (
          <div className="flex flex-col gap-[40px]">
            {titleBlock}
            {children}
          </div>
        ) : (
          titleBlock
        )}
      </div>

      {!combineTitleAndContent ? (
        <div
          className={cn(
            "col-span-full min-w-0 w-full",
            wide
              ? "max-w-none min-[1200px]:col-span-2"
              : "max-w-none min-[1200px]:col-span-1 min-[1200px]:max-w-[420px]",
            "min-[1200px]:col-start-1 min-[1200px]:row-start-3",
          )}
        >
          {children}
        </div>
      ) : null}
    </div>
  )
}
