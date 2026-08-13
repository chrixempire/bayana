import { useEffect, useId, useMemo, useRef, useState } from "react"
import type { KeyboardEvent } from "react"
import { useAnchorWidth } from "../../hooks/use-anchor-width"
import { getCauseCollaborators } from "../../lib/api/organisations"
import { cn } from "../../lib/utils"
import { EventIcon } from "../events/icons/EventIcon"
import { EVENT_ICON_SIZE } from "../events/icons/event-icon-sizes"
import { ListScrollFadeHint } from "../ui/list-scroll-fade-hint"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import {
  CREATE_EVENT_DROPDOWN_PANEL_CLASS,
  CREATE_EVENT_DROPDOWN_SHADOW,
} from "./create-event-dropdown-styles"

const SEARCH_DEBOUNCE_MS = 300
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function CollaboratorOrgSelect({
  valueId,
  valueLabel,
  onChange,
  placeholder = "Select organization",
  searchPlaceholder = "Search organization",
  ariaLabel = "Non-governmental organization",
}: {
  valueId: string
  valueLabel: string
  onChange: (next: { id: string; label: string }) => void
  placeholder?: string
  searchPlaceholder?: string
  ariaLabel?: string
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [collaborators, setCollaborators] = useState<Array<{ id: string; label: string }>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const anchorRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([])
  const panelWidth = useAnchorWidth(open, anchorRef)
  const listboxId = useId()

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query.trim()), SEARCH_DEBOUNCE_MS)
    return () => window.clearTimeout(timer)
  }, [query])

  // The collaborators endpoint has no server-side search, so load the verified
  // organisations once per open and filter the list client-side below.
  useEffect(() => {
    if (!open) return

    let cancelled = false

    void (async () => {
      setIsLoading(true)
      setError(null)

      try {
        const results = await getCauseCollaborators()
        if (cancelled) return
        setCollaborators(results.map((org) => ({ id: org.uuid, label: org.name })))
      } catch {
        if (cancelled) return
        setCollaborators([])
        setError("Unable to load organisations. Paste an organisation UUID if you have one.")
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [open])

  const options = useMemo(() => {
    if (UUID_PATTERN.test(debouncedQuery)) {
      const match = collaborators.find((org) => org.id === debouncedQuery)
      return match ? [match] : [{ id: debouncedQuery, label: debouncedQuery }]
    }

    const needle = debouncedQuery.toLowerCase()
    if (!needle) return collaborators
    return collaborators.filter((org) => org.label.toLowerCase().includes(needle))
  }, [collaborators, debouncedQuery])

  const visibleOptions = useMemo(() => {
    if (valueId && valueLabel && !options.some((option) => option.id === valueId)) {
      return [{ id: valueId, label: valueLabel }, ...options]
    }
    return options
  }, [options, valueId, valueLabel])

  const close = () => {
    setOpen(false)
    setQuery("")
    setHighlightedIndex(-1)
  }

  const selectOption = (option: { id: string; label: string }) => {
    onChange(option)
    close()
  }

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
    <div ref={anchorRef} className="w-full">
      <Popover
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen)
          setHighlightedIndex(-1)
          if (!nextOpen) setQuery("")
        }}
        modal={false}
      >
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label={ariaLabel}
            aria-expanded={open}
            aria-haspopup="listbox"
            className={cn(
              "flex h-10 w-full cursor-pointer items-center justify-between rounded-xl border border-border-input-default-200 bg-input-surface px-4 text-left text-sm leading-[22px] shadow-input-default outline-none focus-visible:border-border-input-active focus-visible:ring-2 focus-visible:ring-[rgb(255,122,26,0.12)]",
              valueLabel ? "text-text-events-strong" : "text-input-placeholder",
            )}
          >
            <span className="min-w-0 truncate">{valueLabel || placeholder}</span>
            <EventIcon
              name="down-fill"
              size={EVENT_ICON_SIZE.meta}
              className={cn("shrink-0 transition-transform", open && "rotate-180")}
              aria-hidden
            />
          </button>
        </PopoverTrigger>

        <PopoverContent
          style={panelWidth ? { width: panelWidth } : undefined}
          className={cn(CREATE_EVENT_DROPDOWN_PANEL_CLASS, CREATE_EVENT_DROPDOWN_SHADOW)}
          role="dialog"
          aria-label={ariaLabel}
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
              onChange={(event) => {
                setQuery(event.target.value)
                setHighlightedIndex(-1)
                optionRefs.current = []
              }}
              placeholder={searchPlaceholder}
              className="min-w-0 flex-1 bg-transparent text-sm font-normal leading-[22px] tracking-[-0.1px] text-text-events-strong outline-none placeholder:text-[#A0ACB6]"
            />
          </div>

          <div className="relative">
            {isLoading ? (
              <p className="px-2 py-3 text-sm text-text-table-header">Searching…</p>
            ) : error ? (
              <p className="px-2 py-3 text-sm text-[#D92D20]">{error}</p>
            ) : visibleOptions.length === 0 ? (
              <p className="px-2 py-3 text-sm text-text-table-header">No organisations found</p>
            ) : (
              <ul
                ref={listRef}
                id={listboxId}
                role="listbox"
                aria-label={ariaLabel}
                className="flex max-h-[min(220px,var(--radix-popover-content-available-height))] flex-col gap-1 overflow-y-auto p-0.5 pb-8 pt-0.5"
              >
                {visibleOptions.map((option, index) => {
                  const selected = option.id === valueId
                  const highlighted = highlightedIndex === index

                  return (
                    <li key={option.id} role="presentation">
                      <button
                        ref={(node) => {
                          optionRefs.current[index] = node
                        }}
                        id={`${listboxId}-option-${index}`}
                        type="button"
                        role="option"
                        aria-selected={selected}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        onClick={() => selectOption(option)}
                        className={cn(
                          "type-events-tab flex w-full cursor-pointer rounded-lg p-2 text-left text-text-events-strong transition-colors",
                          (highlighted || selected) && "bg-[#EDF0F2]",
                          !highlighted && !selected && "hover:bg-[#EDF0F2]",
                        )}
                      >
                        {option.label}
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}

            <ListScrollFadeHint
              listRef={listRef}
              deps={[open, visibleOptions.length, query, isLoading]}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
