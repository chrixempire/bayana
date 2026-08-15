/** Shared list-page search field — matches Figma Events / Volunteers / Verification. */
export const FEATURE_SEARCH_MAX_WIDTH_CLASS = "xl:max-w-[400px]" as const

export const featureSearchWrapperClassName = `w-full ${FEATURE_SEARCH_MAX_WIDTH_CLASS}` as const

// Figma search field: 32px tall, 10px radius, #EDF0F2 fill, 4px/12px padding, 8px gap.
export const featureSearchInputClassName =
  "h-8 min-h-8 rounded-[10px] border-0 bg-[#EDF0F2] shadow-none" as const
