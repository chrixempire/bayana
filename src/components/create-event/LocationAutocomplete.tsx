import { useMemo, useRef, useState } from "react"
import { Popover, PopoverAnchor, PopoverContent } from "../ui/popover"
import { GoogleGIcon } from "../auth/icons/GoogleGIcon"
import { Input } from "../ui/input"
import { useAnchorWidth } from "../../hooks/use-anchor-width"
import { CREATE_EVENT_LOCATION_SUGGESTIONS } from "../../data/create-event-settings"
import { cn } from "../../lib/utils"

export function LocationAutocomplete({
  value,
  onChange,
  invalid,
}: {
  value: string
  onChange: (value: string) => void
  invalid?: boolean
}) {
  const [focused, setFocused] = useState(false)
  const anchorRef = useRef<HTMLDivElement>(null)

  const suggestions = useMemo(() => {
    const query = value.trim().toLowerCase()
    if (!query) return []
    return CREATE_EVENT_LOCATION_SUGGESTIONS.filter((item) => item.toLowerCase().includes(query))
  }, [value])

  const open = focused && suggestions.length > 0
  const panelWidth = useAnchorWidth(open, anchorRef)

  return (
    <Popover open={open} onOpenChange={(next) => setFocused(next)} modal={false}>
      <PopoverAnchor asChild>
        <div ref={anchorRef} className="w-full">
          <Input
            density="compact"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onFocus={() => setFocused(true)}
            placeholder="Enter location"
            invalid={invalid}
            rightIcon={<GoogleGIcon />}
          />
        </div>
      </PopoverAnchor>

      <PopoverContent
        style={panelWidth ? { width: panelWidth } : undefined}
        className="overflow-hidden rounded-xl border border-border-default-100 bg-bg-canvas p-1 shadow-[0_8px_24px_rgba(44,50,55,0.12)]"
        onOpenAutoFocus={(event) => event.preventDefault()}
        onInteractOutside={(event) => {
          if (anchorRef.current?.contains(event.target as Node)) {
            event.preventDefault()
          }
        }}
      >
        <ul role="listbox" aria-label="Location suggestions">
          {suggestions.map((suggestion) => (
            <li key={suggestion} role="presentation">
              <button
                type="button"
                className={cn(
                  "flex w-full cursor-pointer rounded-lg px-4 py-2.5 text-left text-sm leading-[22px] text-text-events-strong hover:bg-bg-default-100",
                )}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  onChange(suggestion)
                  setFocused(false)
                }}
              >
                {suggestion}
              </button>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  )
}
