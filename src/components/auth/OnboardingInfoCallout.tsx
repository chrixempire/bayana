import { cn } from "../../lib/utils"

/** Copy aligned with Figma “Changes are automatically saved” card. */
export const autosaveCalloutCopy = {
  title: "Changes are automatically saved",
  description:
    "Don't worry about manually saving the changes you've made by clicking a button. We've taken care of that for you",
} as const

export function OnboardingInfoCallout({
  title = autosaveCalloutCopy.title,
  description = autosaveCalloutCopy.description,
  className,
}: {
  title?: string
  description?: string
  className?: string
}) {
  return (
    <aside
      className={cn(
        "flex w-full max-w-[368px] shrink-0 gap-3 rounded-lg bg-bg-active-200 px-4 py-3",
        className,
      )}
    >
      <div className="flex h-[22px] shrink-0 items-center py-2">
        <span className="inline-flex size-4 items-center justify-center rounded-full border border-text-disabled-300 text-[10px] font-semibold text-text-neutral-400">
          i
        </span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium leading-[22px] text-text-default-500">{title}</p>
          <p className="text-xs font-normal leading-5 text-text-neutral-400">{description}</p>
        </div>
      </div>
    </aside>
  )
}
