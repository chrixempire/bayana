import { cn } from "./utils"

/** Bordered table card — overflow clips header bg to rounded top corners. */
export const tableSurfaceClassName =
  "overflow-hidden rounded-xl border border-border-default-100 bg-bg-canvas"

/** Figma Events table — header row (48px, full-width bottom border). */
export const tableHeaderRowClassName =
  "h-12 bg-bg-table-header hover:bg-bg-table-header [&_th:first-child]:rounded-tl-xl [&_th:last-child]:rounded-tr-xl [&_th]:border-b [&_th]:border-border-default-100"

/** Figma Events table — header cell (48px, #f9fafa). */
export const tableHeadCellClassName =
  "h-12 bg-bg-table-header px-5 py-2 align-middle type-events-table-head"

/** Figma Events table — checkbox column in header (48px, centered). */
export const tableHeadSelectClassName =
  "w-12 min-w-12 max-w-12 px-0 py-2 text-center align-middle"

/** Figma Events table — row actions column in header (48px). */
export const tableHeadActionsClassName = "w-12 min-w-12 max-w-12 px-0 py-2"

/** Figma Events table — body row (80px, white). */
export const tableRowClassName =
  "h-20 border-b border-border-default-100 bg-bg-canvas transition-colors hover:bg-bg-table-header data-[state=selected]:bg-bg-accent-soft/40"

/** Figma Events table — body cell (80px, 20px horizontal padding). */
export const tableCellClassName = "h-20 px-5 py-3 align-middle bg-bg-canvas"

/** Figma Events table — checkbox column in body (48px, centered). */
export const tableCellSelectClassName = "w-12 min-w-12 max-w-12 px-0 py-3 text-center align-middle"

/** Figma Events table — row actions column in body (48px). */
export const tableCellActionsClassName = "w-12 min-w-12 max-w-12 px-0 py-3 text-center align-middle"

/** Centers checkbox / action controls inside 48px select columns. */
export const tableSelectControlClassName = "flex items-center justify-center"

/** Figma Events table — pagination footer bar. */
export const tablePaginationClassName =
  "flex flex-col gap-4 border-t border-border-default-100 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between"

export function tableHeadClassName(className?: string) {
  return cn(tableHeadCellClassName, className)
}

export function tableCellClassNames(className?: string) {
  return cn(tableCellClassName, className)
}
