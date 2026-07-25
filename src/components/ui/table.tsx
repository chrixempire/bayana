import * as React from "react"

import {
  tableCellActionsClassName,
  tableCellClassName,
  tableCellSelectClassName,
  tableHeadActionsClassName,
  tableHeadCellClassName,
  tableHeadSelectClassName,
  tableHeaderRowClassName,
  tableRowClassName,
  tableSelectControlClassName,
} from "../../lib/table-styles"
import { cn } from "../../lib/utils"

type TableProps = React.ComponentProps<"table"> & {
  /** When false, table is not wrapped in an overflow scroll container (for page-level scroll + sticky thead). */
  contained?: boolean
}

function Table({ className, contained = true, ...props }: TableProps) {
  const table = (
    <table
      data-slot="table"
      className={cn("w-full border-collapse caption-bottom text-sm", className)}
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
  return (
    <thead
      data-slot="table-header"
      className={cn("bg-bg-table-header", className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return <tbody data-slot="table-body" className={className} {...props} />
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
  return <tr data-slot="table-row" className={cn(tableRowClassName, className)} {...props} />
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        tableHeadCellClassName,
        "whitespace-nowrap text-left",
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
      className={cn(tableCellClassName, className)}
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

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  tableHeadSelectClassName,
  tableHeadActionsClassName,
  tableCellSelectClassName,
  tableCellActionsClassName,
  tableHeaderRowClassName,
  tableSelectControlClassName,
}
