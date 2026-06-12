import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, type DayPickerProps } from "react-day-picker"
import { cn } from "../../lib/utils"

import "react-day-picker/style.css"

export type CalendarProps = DayPickerProps

export function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("event-calendar p-0", className)}
      classNames={{
        months: "flex flex-row gap-6",
        month: "flex flex-col gap-3",
        month_caption: "relative flex h-9 items-center justify-center",
        caption_label: "sr-only",
        dropdowns: "flex items-center gap-2",
        dropdown:
          "h-8 appearance-none rounded-lg border border-border-input-default-200 bg-input-surface px-2 pr-7 text-sm font-medium leading-[22px] text-text-events-strong outline-none focus-visible:border-border-input-active",
        dropdown_root: "relative inline-flex",
        nav: "absolute inset-x-0 top-0 flex items-center justify-between",
        button_previous:
          "inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-icon-neutral hover:bg-bg-default-100",
        button_next:
          "inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-icon-neutral hover:bg-bg-default-100",
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday:
          "w-9 text-center text-xs font-normal leading-5 text-text-table-header",
        week: "mt-1 flex w-full",
        day: "relative p-0 text-center text-sm",
        day_button: cn(
          "inline-flex size-9 cursor-pointer items-center justify-center rounded-lg text-sm font-normal leading-[22px] text-text-events-strong transition-colors hover:bg-bg-default-100",
          "aria-selected:opacity-100",
        ),
        selected:
          "rounded-lg bg-bg-accent text-text-on-solid-bg hover:bg-bg-accent hover:text-text-on-solid-bg focus:bg-bg-accent focus:text-text-on-solid-bg",
        range_start: "rounded-lg bg-bg-accent text-text-on-solid-bg",
        range_end: "rounded-lg bg-bg-accent text-text-on-solid-bg",
        range_middle:
          "rounded-none bg-bg-nav-tab-active text-text-nav-tab-active hover:bg-bg-nav-tab-active hover:text-text-nav-tab-active",
        today: "font-semibold text-text-events-strong",
        outside: "text-text-disabled-300 opacity-60",
        disabled: "pointer-events-none opacity-40",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: chevronClassName, ...chevronProps }) => {
          const Icon = orientation === "left" ? ChevronLeft : ChevronRight
          return <Icon className={cn("size-4", chevronClassName)} {...chevronProps} />
        },
      }}
      {...props}
    />
  )
}
