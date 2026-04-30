import type { ReactNode } from "react"

export function FormField({
  label,
  optional,
  children,
  hint,
  error,
}: {
  label: string
  optional?: boolean
  children: ReactNode
  hint?: ReactNode
  error?: string
}) {
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex flex-wrap items-center gap-0.5 text-sm leading-[22px]">
        <span className="font-medium text-text-default-500">{label}</span>
        {optional ? (
          <span className="font-normal tracking-[-0.1px] text-input-placeholder"> (optional)</span>
        ) : null}
      </div>
      {children}
      {hint ? (
        <div className="flex items-start gap-1.5 text-xs leading-5 text-text-neutral-400">
          <span
            className="mt-0.5 inline-flex size-3.5 shrink-0 items-center justify-center rounded-full border border-text-disabled-300 text-[8px] font-semibold text-text-neutral-400"
            aria-hidden
          >
            i
          </span>
          <span className="min-w-0">{hint}</span>
        </div>
      ) : null}
      {error ? <p className="text-xs text-text-negative">{error}</p> : null}
    </div>
  )
}
