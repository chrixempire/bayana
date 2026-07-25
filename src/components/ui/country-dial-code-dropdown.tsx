import { useEffect, useMemo, useRef, useState } from "react"
import {
  COUNTRY_DIAL_CODES,
  DEFAULT_COUNTRY_CODE,
  filterCountries,
  getCountryByCode,
  type CountryDialCode,
} from "../../lib/country-dial-codes"
import { cn } from "../../lib/utils"
import { EventIcon } from "../events/icons/EventIcon"
import { EVENT_ICON_SIZE } from "../events/icons/event-icon-sizes"
import { ChevronDownIcon } from "../auth/icons/ChevronDownIcon"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu"

const dropdownTextClass = "text-sm leading-[22px] tracking-[-0.1px] text-text-default-500"

type CountryDialCodeDropdownProps = {
  countryCode: string
  onValueChange: (country: CountryDialCode) => void
  invalid?: boolean
}

export function CountryDialCodeDropdown({
  countryCode,
  onValueChange,
  invalid = false,
}: CountryDialCodeDropdownProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const searchRef = useRef<HTMLInputElement>(null)

  const selectedCountry = getCountryByCode(countryCode) ?? getCountryByCode(DEFAULT_COUNTRY_CODE) ?? COUNTRY_DIAL_CODES[0]

  const visibleCountries = useMemo(() => filterCountries(query), [query])

  useEffect(() => {
    if (!open) return
    const frameId = requestAnimationFrame(() => searchRef.current?.focus())
    return () => cancelAnimationFrame(frameId)
  }, [open])

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (!nextOpen) setQuery("")
  }

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger
        type="button"
        aria-label="Country calling code"
        className={cn(
          "relative flex h-10 cursor-pointer items-center gap-1 rounded-none border-0 bg-transparent py-2 pl-1 pr-6 outline-none focus-visible:ring-0",
          dropdownTextClass,
          invalid && "text-text-negative",
        )}
      >
        <span className="text-sm leading-none" aria-hidden>
          {selectedCountry.flag}
        </span>
        <span>{selectedCountry.dialCode}</span>
        <ChevronDownIcon className="pointer-events-none absolute right-0 top-1/2 size-4 -translate-y-1/2 text-text-neutral-400" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={4}
        className="w-44 p-0"
        onCloseAutoFocus={(event) => event.preventDefault()}
      >
        <div
          className="border-b border-border-default-100 p-2"
          onKeyDown={(event) => event.stopPropagation()}
        >
          <div className="relative">
            <EventIcon name="search-line" size={EVENT_ICON_SIZE.search} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-text-neutral-400" />
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search country"
              aria-label="Search countries"
              className={cn(
                "h-8 w-full rounded-lg border border-border-input-default-200 bg-white pl-8 pr-2 outline-none focus:border-border-input-active focus:ring-2 focus:ring-[rgb(255,122,26,0.12)]",
                dropdownTextClass,
                "placeholder:text-input-placeholder",
              )}
            />
          </div>
        </div>
        <div className="max-h-52 overflow-y-auto p-1">
          {visibleCountries.length === 0 ? (
            <p className={cn("px-2 py-3 text-center", dropdownTextClass)}>No countries found</p>
          ) : (
            visibleCountries.map((country) => {
              const isSelected = country.code === selectedCountry.code

              return (
                <DropdownMenuItem
                  key={country.code}
                  className={cn(
                    "cursor-pointer gap-1.5 rounded-lg px-2 py-1.5 font-normal",
                    dropdownTextClass,
                    isSelected && "bg-bg-accent-soft text-bg-accent focus:bg-bg-accent-soft focus:text-bg-accent",
                  )}
                  onSelect={() => onValueChange(country)}
                >
                  <span className="flex size-3.5 shrink-0 items-center justify-center">
                    {isSelected ? <EventIcon name="check-fill" size={EVENT_ICON_SIZE.meta} className="text-bg-accent" aria-hidden /> : null}
                  </span>
                  <span className="text-sm leading-none" aria-hidden>
                    {country.flag}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{country.name}</span>
                  <span className="shrink-0">{country.dialCode}</span>
                </DropdownMenuItem>
              )
            })
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
