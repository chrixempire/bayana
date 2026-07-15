import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { KeyboardEvent } from "react"
import { Search } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { ListScrollFadeHint } from "../ui/list-scroll-fade-hint"
import { useAnchorWidth } from "../../hooks/use-anchor-width"
import { ChipPlusCircleIcon, ChipPlusOnAccentIcon } from "../icons/ChipCircleIcons"
import { SELECTABLE_CHIP_SHADOW, SelectableChip } from "../ui/selectable-chip"
import { CREATE_EVENT_CATEGORY_OPTIONS } from "../../data/create-event-options"
import { cn } from "../../lib/utils"
import {
  CREATE_EVENT_DROPDOWN_PANEL_CLASS,
  CREATE_EVENT_DROPDOWN_SHADOW,
} from "./create-event-dropdown-styles"

const DEFAULT_SUGGESTED_CATEGORIES = [
  "Arts, Culture & Technology",
  "Events",
  "Youth Development",
] as const

export function CategoryTagPicker({
  value,
  onChange,
}: {
  value: string[]
  onChange: (categories: string[]) => void
}) {
  const [showPicker, setShowPicker] = useState(false)
  const [query, setQuery] = useState("")
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const anchorRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([])
  const panelWidth = useAnchorWidth(showPicker, anchorRef)

  const chipLabels = useMemo(() => {
    const labels = new Set<string>([...DEFAULT_SUGGESTED_CATEGORIES, ...value])
    return Array.from(labels)
  }, [value])

  const visibleOptions = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return CREATE_EVENT_CATEGORY_OPTIONS
    return CREATE_EVENT_CATEGORY_OPTIONS.filter((option) =>
      option.toLowerCase().includes(normalized),
    )
  }, [query])

  const toggleCategory = useCallback(
    (category: string) => {
      if (value.includes(category)) {
        onChange(value.filter((item) => item !== category))
        return
      }
      onChange([...value, category])
    },
    [onChange, value],
  )

  const handleOpenChange = (open: boolean) => {
    setShowPicker(open)
    setHighlightedIndex(-1)
    if (!open) {
      setQuery("")
    }
  }

  const handleQueryChange = (next: string) => {
    setQuery(next)
    setHighlightedIndex(-1)
    optionRefs.current = []
  }

  const handleDropdownKeyDown = (event: KeyboardEvent) => {
    const count = visibleOptions.length
    if (count === 0) {
      if (event.key === "Escape") {
        event.preventDefault()
        handleOpenChange(false)
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
      if (option) toggleCategory(option)
      return
    }

    if (event.key === "Escape") {
      event.preventDefault()
      handleOpenChange(false)
    }
  }

  useEffect(() => {
    if (highlightedIndex < 0) return
    optionRefs.current[highlightedIndex]?.scrollIntoView({ block: "nearest" })
  }, [highlightedIndex])

  const activeOptionId =
    highlightedIndex >= 0 && visibleOptions[highlightedIndex]
      ? `category-option-${highlightedIndex}`
      : undefined

  return (
    <div ref={anchorRef} className="w-full">
      <Popover open={showPicker} onOpenChange={handleOpenChange} modal={false}>
        <div className="flex flex-wrap items-center gap-2">
          {chipLabels.map((category) => (
            <SelectableChip
              key={category}
              label={category}
              selected={value.includes(category)}
              onClick={() => toggleCategory(category)}
            />
          ))}

          <PopoverTrigger asChild>
            <button
              type="button"
              aria-expanded={showPicker}
              aria-haspopup="listbox"
              className={cn(
                "type-events-tab inline-flex h-7 shrink-0 cursor-pointer items-center gap-1 rounded-[40px] py-1.5 pr-2 pl-2 transition-colors",
                showPicker
                  ? "border border-bg-accent bg-bg-nav-tab-active text-text-nav-tab-active"
                  : cn(
                      "border border-border-default-100 bg-bg-canvas text-text-events-strong hover:bg-bg-on-canvas",
                      SELECTABLE_CHIP_SHADOW,
                    ),
              )}
            >
              {showPicker ? <ChipPlusOnAccentIcon /> : <ChipPlusCircleIcon />}
              Add more
            </button>
          </PopoverTrigger>
        </div>

        <PopoverContent
          style={panelWidth ? { width: panelWidth } : undefined}
          className={cn(CREATE_EVENT_DROPDOWN_PANEL_CLASS, CREATE_EVENT_DROPDOWN_SHADOW)}
          role="dialog"
          aria-label="Search categories"
          onOpenAutoFocus={(event) => {
            event.preventDefault()
            searchRef.current?.focus()
          }}
          onKeyDown={handleDropdownKeyDown}
        >
          <div className="flex h-8 w-full items-center gap-2 rounded-[10px] bg-[#EDF0F2] py-1 pr-3 pl-3">
            <Search className="size-4 shrink-0 text-icon-neutral" aria-hidden />
            <input
              ref={searchRef}
              type="search"
              role="combobox"
              aria-expanded
              aria-controls="category-listbox"
              aria-activedescendant={activeOptionId}
              autoComplete="off"
              value={query}
              onChange={(event) => handleQueryChange(event.target.value)}
              placeholder="Search category"
              className="min-w-0 flex-1 bg-transparent text-sm font-normal leading-[22px] tracking-[-0.1px] text-text-events-strong outline-none placeholder:text-[#A0ACB6]"
            />
          </div>

          <div className="relative">
            <ul
              ref={listRef}
              id="category-listbox"
              role="listbox"
              aria-label="Categories"
              aria-multiselectable
              className="flex max-h-[min(220px,var(--radix-popover-content-available-height))] flex-col gap-1 overflow-y-auto p-0.5 pb-8 pt-0.5"
            >
              {visibleOptions.map((option, index) => {
                const selected = value.includes(option)
                const highlighted = highlightedIndex === index

                return (
                  <li key={option} role="presentation">
                    <button
                      ref={(node) => {
                        optionRefs.current[index] = node
                      }}
                      id={`category-option-${index}`}
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      onClick={() => toggleCategory(option)}
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
              })}
            </ul>

            <ListScrollFadeHint
              listRef={listRef}
              deps={[showPicker, visibleOptions.length, query]}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
