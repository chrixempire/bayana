import { Info } from "lucide-react"

export function CreateEventFieldHint({ children }: { children: string }) {
  return (
    <p className="flex items-start gap-1.5 text-xs leading-5 text-text-table-header">
      <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
      <span>{children}</span>
    </p>
  )
}
