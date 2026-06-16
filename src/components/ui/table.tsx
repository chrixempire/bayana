import * as React from "react"

import { cn } from "../../lib/utils"

type TableProps = React.ComponentProps<"table"> & {
  /** When false, table is not wrapped in an overflow scroll container (for page-level scroll + sticky thead). */
  contained?: boolean
}

function Table({ className, contained = true, ...props }: TableProps) {
  const table = (
    <table
      data-slot="table"
      className={cn("w-full border-separate border-spacing-0 caption-bottom text-sm", className)}
      {...props}
    />
  )

  if (!contained) return table

  return (
    <div data-slot="table-container" className="relative w-full overflow-auto">
      {table}
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return <thead data-slot="table-header" className={cn("[&_tr]:border-b", className)} {...props} />
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn("border-t bg-bg-default-100/50 font-medium [&>tr]:last:border-b-0", className)}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b border-border-default-100 transition-colors hover:bg-bg-on-canvas data-[state=selected]:bg-bg-accent-soft/40",
        className,
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-10 whitespace-nowrap bg-bg-on-canvas px-3 text-left align-middle text-xs font-medium leading-[18px] text-text-neutral-400 [&:has([role=checkbox])]:pr-0",
        className,
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "px-3 py-3 align-middle text-sm leading-[22px] text-text-default-500 [&:has([role=checkbox])]:pr-0",
        className,
      )}
      {...props}
    />
  )
}

function TableCaption({ className, ...props }: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-4 text-sm text-text-neutral-400", className)}
      {...props}
    />
  )
}

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption }
