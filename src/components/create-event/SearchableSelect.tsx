import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react"
import { useAnchorWidth } from "../../hooks/use-anchor-width"
import type { KeyboardEvent } from "react"
import { EventIcon } from "../events/icons/EventIcon"
import { EVENT_ICON_SIZE } from "../events/icons/event-icon-sizes"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { ListScrollFadeHint } from "../ui/list-scroll-fade-hint"
import { cn } from "../../lib/utils"
import {
  CREATE_EVENT_DROPDOWN_PANEL_CLASS,
  CREATE_EVENT_DROPDOWN_SHADOW,
} from "./create-event-dropdown-styles"

export function SearchableSelect({
  value,
  onChange,
  options,
  placeholder = "Select",
  searchPlaceholder = "Search",
  ariaLabel,
}: {
  value: string
  onChange: (value: string) => void
  options: readonly string[]
  placeholder?: string
  searchPlaceholder?: string
  ariaLabel?: string
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const anchorRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const panelWidth = useAnchorWidth(open, anchorRef)
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([])
  const listboxId = useId()

  const visibleOptions = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return [...options]
    return options.filter((option) => option.toLowerCase().includes(normalized))
  }, [options, query])

  const close = useCallback(() => {
    setOpen(false)
    setQuery("")
    setHighlightedIndex(-1)
  }, [])

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    setHighlightedIndex(-1)
    if (!nextOpen) {
      setQuery("")
    }
  }

  const handleQueryChange = (next: string) => {
    setQuery(next)
    setHighlightedIndex(-1)
    optionRefs.current = []
  }

  const selectOption = useCallback(
    (option: string) => {
      onChange(option)
      close()
    },
    [close, onChange],
  )

  const handleDropdownKeyDown = (event: KeyboardEvent) => {
    const count = visibleOptions.length
    if (count === 0) {
      if (event.key === "Escape") {
        event.preventDefault()
        close()
      }
      return
    }

    if (event.key === "ArrowDown") {
      event.preventDefault()
      setHighlightedIndex((index) => Math.min(index + 1, count - 1))
      return
    }

    if (event.key === "ArrowUp") {
      event.preventDefault()
      setHighlightedIndex((index) => Math.max(index - 1, -1))
      return
    }

    if (event.key === "Enter" && highlightedIndex >= 0) {
      event.preventDefault()
      const option = visibleOptions[highlightedIndex]
      if (option) selectOption(option)
      return
    }

    if (event.key === "Escape") {
      event.preventDefault()
      close()
    }
  }

  useEffect(() => {
    if (highlightedIndex < 0) return
    optionRefs.current[highlightedIndex]?.scrollIntoView({ block: "nearest" })
  }, [highlightedIndex])

  const activeOptionId =
    highlightedIndex >= 0 && visibleOptions[highlightedIndex]
      ? `${listboxId}-option-${highlightedIndex}`
      : undefined

  return (
    <Popover open={open} onOpenChange={handleOpenChange} modal={false}>
      <div ref={anchorRef} className="w-full">
        <PopoverTrigger asChild>
          <button
          type="button"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={open ? listboxId : undefined}
          aria-label={ariaLabel}
          className={cn(
            "flex h-10 w-full cursor-pointer items-center justify-between rounded-xl border border-border-input-default-200 bg-input-surface px-4 text-left text-sm leading-[22px] shadow-input-default outline-none focus-visible:border-border-input-active focus-visible:ring-2 focus-visible:ring-[rgb(255,122,26,0.12)]",
            value ? "text-text-events-strong" : "text-input-placeholder",
          )}
        >
          <span className="min-w-0 truncate">{value || placeholder}</span>
          <EventIcon
            name="down-fill"
            size={EVENT_ICON_SIZE.meta}
            className={cn("shrink-0 transition-transform", open && "rotate-180")}
            aria-hidden
          />
          </button>
        </PopoverTrigger>
      </div>

      <PopoverContent
        style={panelWidth ? { width: panelWidth } : undefined}
        className={cn(
          CREATE_EVENT_DROPDOWN_PANEL_CLASS,
          CREATE_EVENT_DROPDOWN_SHADOW,
        )}
        role="dialog"
        aria-label={ariaLabel ?? searchPlaceholder}
        onOpenAutoFocus={(event) => {
          event.preventDefault()
          searchRef.current?.focus()
        }}
        onKeyDown={handleDropdownKeyDown}
      >
        <div className="flex h-8 w-full items-center gap-2 rounded-[10px] bg-[#EDF0F2] py-1 pr-3 pl-3">
          <EventIcon name="search-line" size={EVENT_ICON_SIZE.search} className="shrink-0" aria-hidden />
          <input
            ref={searchRef}
            type="search"
            role="combobox"
            aria-expanded
            aria-controls={listboxId}
            aria-activedescendant={activeOptionId}
            autoComplete="off"
            value={query}
            onChange={(event) => handleQueryChange(event.target.value)}
            placeholder={searchPlaceholder}
            className="min-w-0 flex-1 bg-transparent text-sm font-normal leading-[22px] tracking-[-0.1px] text-text-events-strong outline-none placeholder:text-[#A0ACB6]"
          />
        </div>

        <div className="relative">
          <ul
            ref={listRef}
            id={listboxId}
            role="listbox"
            aria-label={ariaLabel}
            className="flex max-h-[min(220px,var(--radix-popover-content-available-height))] flex-col gap-1 overflow-y-auto p-0.5 pb-8 pt-0.5"
          >
            {visibleOptions.length === 0 ? (
              <li className="px-2 py-2 text-sm leading-[22px] text-text-table-header">No results</li>
            ) : (
              visibleOptions.map((option, index) => {
                const selected = value === option
                const highlighted = highlightedIndex === index

                return (
                  <li key={option} role="presentation">
                    <button
                      ref={(node) => {
                        optionRefs.current[index] = node
                      }}
                      id={`${listboxId}-option-${index}`}
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => selectOption(option)}
                      className={cn(
                        "type-events-tab flex w-full cursor-pointer rounded-lg p-2 text-left text-text-events-strong transition-colors",
                        (highlighted || selected) && "bg-[#EDF0F2]",
                        !highlighted && !selected && "hover:bg-[#EDF0F2]",
                      )}
                    >
                      {option}
                    </button>
                  </li>
                )
              })
            )}
          </ul>

          <ListScrollFadeHint listRef={listRef} deps={[open, visibleOptions.length, query]} />
        </div>
      </PopoverContent>
    </Popover>
  )
}
