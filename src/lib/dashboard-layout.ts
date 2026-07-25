/** Narrow centered column (Getting started, etc.). */
export const DASHBOARD_CONTENT_WIDTH_PX = 576

/** Horizontal inset for dashboard pages and top nav (Figma: 104px on settings / main admin). */
export const DASHBOARD_PAGE_GUTTER_PX = 104

/** Detail pages (event, volunteer): 144px side margin at 1440px viewport. */
export const DASHBOARD_DETAIL_GUTTER_PX = 144

/** Fixed detail content width on large desktops (1440 − 2×144). */
export const DASHBOARD_DETAIL_MAX_WIDTH_PX = 1152

/** Event detail overview — left “About” column (Figma 18290:4937). */
export const EVENT_DETAIL_LEFT_COLUMN_PX = 728

/** Event detail overview — right stats column (Figma 18290:4967). */
export const EVENT_DETAIL_RIGHT_COLUMN_PX = 400

/** Gap between overview columns (896 − 144 − 728). */
export const EVENT_DETAIL_COLUMN_GAP_PX = 24

/** Shared wrapper for event/volunteer detail pages — full 1152px at ≥1440px viewport. */
export const dashboardDetailContentClassName =
  "mx-auto w-full max-w-[1152px] px-4 sm:px-6 min-[1440px]:px-0"

/** Create event: form area inset from the left edge. */
export const CREATE_EVENT_CONTENT_LEFT_PX = 144

/** Create event: space below the Back / breadcrumb sub-header. */
export const CREATE_EVENT_CONTENT_TOP_PX = 64

/** Create event form column — inputs, buttons, and uploader share this width. */
export const CREATE_EVENT_FORM_MAX_WIDTH_PX = 452

/** Create event summary card (step 3 sidebar). */
export const CREATE_EVENT_SUMMARY_MAX_WIDTH_PX = 400

/** Create event image drop zone height (Figma). */
export const CREATE_EVENT_IMAGE_UPLOADER_HEIGHT_PX = 130
