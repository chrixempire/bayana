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
  middleScrollOnly = false,
}: {
  frameStart?: ReactNode
  titleBlock: ReactNode
  children: ReactNode
  showCallout?: boolean
  callout?: ReactNode
  combineTitleAndContent?: boolean
  wide?: boolean
  /** Large screens: back/title and right callout stay fixed; only the form column scrolls. */
  middleScrollOnly?: boolean
}) {
  if (middleScrollOnly) {
    return (
      <div className="mx-auto flex w-full max-w-[560px] flex-col gap-y-10 min-[900px]:mx-0 min-[900px]:max-w-none min-[1200px]:min-h-0 min-[1200px]:max-w-none min-[1200px]:flex-1 min-[1200px]:gap-y-10 min-[1200px]:overflow-hidden">
        {frameStart ? <div className="shrink-0">{frameStart}</div> : null}

        <div className="flex min-h-0 flex-col gap-y-10 min-[1200px]:min-h-0 min-[1200px]:flex-1 min-[1200px]:flex-row min-[1200px]:items-stretch min-[1200px]:gap-x-16 min-[1200px]:overflow-hidden">
          <div className="flex min-h-0 w-full min-w-0 flex-col min-[1200px]:max-h-full min-[1200px]:max-w-[420px] min-[1200px]:flex-1 min-[1200px]:overflow-hidden">
            <div className="shrink-0">{titleBlock}</div>
            <div className="mt-10 min-h-0 flex-1 overflow-y-auto min-[1200px]:pr-1">{children}</div>
          </div>

          {showCallout ? (
            <div className="w-full min-w-0 shrink-0 min-[1200px]:w-[368px] min-[1200px]:self-start">{callout}</div>
          ) : null}
        </div>
      </div>
    )
  }

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
      {frameStart ? <div className="col-span-full min-w-0 shrink-0">{frameStart}</div> : null}

      {showCallout ? (
        <div
          className={cn(
            "col-span-full min-w-0",
            "min-[1200px]:col-span-1 min-[1200px]:col-start-2 min-[1200px]:row-start-2",
          )}
        >
          {callout ?? (
            <OnboardingInfoCallout className="w-full max-w-[368px] min-[1200px]:sticky min-[1200px]:top-8 min-[1200px]:justify-self-end" />
          )}
        </div>
      ) : null}

      <div
        className={cn(
          "col-span-full min-w-0",
          wide ? "max-w-none" : "max-w-none min-[1200px]:max-w-[420px]",
          "min-[1200px]:col-span-1 min-[1200px]:col-start-1 min-[1200px]:row-start-2",
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
