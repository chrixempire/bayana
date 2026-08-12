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

/**
 * Shared wrapper for event/volunteer detail pages.
 * At 1440px: max-width 1152 + centered → 144px side margins.
 * Below 1440px: responsive horizontal padding.
 */
export const dashboardDetailContentClassName =
  "mx-auto w-full max-w-[1152px] px-4 sm:px-6 min-[1440px]:px-0"

/** Settings sidebar column (Figma Settings content). */
export const SETTINGS_SIDEBAR_WIDTH_PX = 200

/** Gap between settings sidebar and main panel (368 − 104 − 200). */
export const SETTINGS_SIDEBAR_GAP_PX = 64

/** Narrow settings forms (Profile, Notifications, Privacy, NGO profile). */
export const SETTINGS_NARROW_CONTENT_PX = 592

/** Wide settings panels (Team, Billing, Payouts, Audit). */
export const SETTINGS_WIDE_CONTENT_PX = 968

/**
 * Settings content band at 1440px: 200 + 64 + 968 = 1232 → 104px side margins.
 * On larger desktops the band stays fixed (same pattern as detail pages).
 */
export const SETTINGS_CONTENT_MAX_WIDTH_PX = 1232

/** Top inset below the nav for settings content. */
export const SETTINGS_CONTENT_TOP_PX = 64

/**
 * Shared wrapper for the settings page.
 * At 1440px: max-width 1232 + centered → 104px side margins (feedback doc).
 * Below 1440px: responsive horizontal padding.
 */
export const dashboardSettingsContentClassName =
  "mx-auto w-full max-w-[1232px] px-4 sm:px-6 min-[1440px]:px-0"

/** Create event: form area inset from the left edge. */
export const CREATE_EVENT_CONTENT_LEFT_PX = 144

/** Create event: space below the Back / breadcrumb sub-header. */
export const CREATE_EVENT_CONTENT_TOP_PX = 64

/** Create event form column — inputs, buttons, and uploader share this width. */
export const CREATE_EVENT_FORM_MAX_WIDTH_PX = 452

/** Create event summary card (step 3 sidebar) — Figma 18290:41007. */
export const CREATE_EVENT_SUMMARY_MAX_WIDTH_PX = 398

/** Create event image drop zone height (Figma). */
export const CREATE_EVENT_IMAGE_UPLOADER_HEIGHT_PX = 130
