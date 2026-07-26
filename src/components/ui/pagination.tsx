import * as React from "react"

import { cn } from "../../lib/utils"
import { EventIcon } from "../events/icons/EventIcon"
import { EVENT_ICON_SIZE } from "../events/icons/event-icon-sizes"

/** Figma table pagination — 28px icon-only nav buttons with small shadow. */
const paginationNavButtonClassName =
  "inline-flex size-7 cursor-pointer items-center justify-center rounded-lg bg-button-neutral text-text-events-strong shadow-button-neutral transition-colors outline-none hover:bg-button-neutral-clicked disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-border-input-active focus-visible:ring-offset-2"

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  )
}

function PaginationContent({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-2", className)}
      {...props}
    />
  )
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
} & React.ComponentProps<"button">

function PaginationLink({ className, isActive, ...props }: PaginationLinkProps) {
  return (
    <button
      type="button"
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        "type-pagination inline-flex size-7 min-w-7 cursor-pointer items-center justify-center rounded-lg transition-colors outline-none",
        "focus-visible:ring-2 focus-visible:ring-border-input-active focus-visible:ring-offset-2",
        isActive
          ? "pointer-events-none bg-bg-nav-tab-active text-text-nav-tab-active"
          : "hover:bg-bg-default-100",
        className,
      )}
      {...props}
    />
  )
}

function PaginationPrevious({ className, disabled, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      aria-label="Go to previous page"
      disabled={disabled}
      className={cn(paginationNavButtonClassName, className)}
      {...props}
    >
      <EventIcon name="left-fill" size={EVENT_ICON_SIZE.pagination} />
    </button>
  )
}

function PaginationNext({ className, disabled, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      aria-label="Go to next page"
      disabled={disabled}
      className={cn(paginationNavButtonClassName, className)}
      {...props}
    >
      <EventIcon name="right-fill" size={EVENT_ICON_SIZE.pagination} />
    </button>
  )
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("type-pagination inline-flex size-7 items-center justify-center", className)}
      {...props}
    >
      …
      <span className="sr-only">More pages</span>
    </span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
