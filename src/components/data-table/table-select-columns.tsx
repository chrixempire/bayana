import type { ComponentProps, ReactNode } from "react"
import { cn } from "../../lib/utils"
import {
  TableCell,
  TableHead,
  tableCellActionsClassName,
  tableCellSelectClassName,
  tableHeadActionsClassName,
  tableHeadSelectClassName,
  tableSelectControlClassName,
} from "../ui/table"

export function TableSelectHead({ children }: { children: ReactNode }) {
  return (
    <TableHead className={tableHeadSelectClassName}>
      <div className={tableSelectControlClassName}>{children}</div>
    </TableHead>
  )
}

export function TableSelectCell({
  children,
  className,
  ...props
}: ComponentProps<typeof TableCell>) {
  return (
    <TableCell className={cn(tableCellSelectClassName, className)} {...props}>
      <div className={tableSelectControlClassName}>{children}</div>
    </TableCell>
  )
}

export function TableActionsHead({ className }: { className?: string }) {
  return <TableHead className={cn(tableHeadActionsClassName, className)} />
}

export function TableActionsCell({
  children,
  className,
  ...props
}: ComponentProps<typeof TableCell>) {
  return (
    <TableCell className={cn(tableCellActionsClassName, className)} {...props}>
      <div className={tableSelectControlClassName}>{children}</div>
    </TableCell>
  )
}

/** Row nav chevron — centered in the 48px column, inset from the card edge. */
export function TableNavCell({
  children,
  className,
  ...props
}: ComponentProps<typeof TableCell>) {
  return (
    <TableActionsCell className={className} {...props}>
      {children}
    </TableActionsCell>
  )
}
