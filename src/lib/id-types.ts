export const ID_TYPE_OPTIONS = [
  { label: "National ID card", value: "nin" },
  { label: "Driver's license", value: "drivers_license" },
  { label: "International passport", value: "passport" },
] as const

export type ApiIdType = (typeof ID_TYPE_OPTIONS)[number]["value"]

export const DEFAULT_ID_TYPE: ApiIdType = "nin"

export function getIdTypeLabel(value: string): string {
  return ID_TYPE_OPTIONS.find((option) => option.value === value)?.label ?? value
}
