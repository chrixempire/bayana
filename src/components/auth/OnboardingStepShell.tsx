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
        "grid w-full grid-cols-1 gap-y-8",
        wide
          ? "lg:grid-cols-[minmax(0,1fr)_minmax(260px,368px)]"
          : "lg:grid-cols-[minmax(0,368px)_minmax(260px,368px)] lg:justify-between",
        "lg:items-start lg:gap-x-16 lg:gap-y-10",
      )}
    >
      {frameStart ? <div className="col-span-full min-w-0">{frameStart}</div> : null}

      <div className={cn("col-span-full min-w-0 lg:col-span-1", wide ? "max-w-none" : "max-w-[368px]")}>
        {combineTitleAndContent ? (
          <div className="flex flex-col gap-8">
            {titleBlock}
            {children}
          </div>
        ) : (
          titleBlock
        )}
      </div>

      {showCallout ? (
        <div className="col-span-full min-w-0 lg:col-span-1">
          {callout ?? <OnboardingInfoCallout className="w-full max-w-[368px] lg:sticky lg:top-8 lg:justify-self-end" />}
        </div>
      ) : null}

      {!combineTitleAndContent ? (
        <div
          className={cn(
            "min-w-0 w-full",
            wide
              ? "col-span-full max-w-none lg:col-span-2"
              : "col-span-full max-w-[368px] lg:col-span-1 lg:max-w-[368px]",
          )}
        >
          {children}
        </div>
      ) : null}
    </div>
  )
}
