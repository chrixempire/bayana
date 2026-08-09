export const CREATE_EVENT_FREE_DONATION_MONTHLY_LIMIT = 500_000

export const CREATE_EVENT_DONATION_PLATFORM_FEE_RATE = 0.02

export function formatNaira(amount: number): string {
  return `₦ ${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export function parseDonationAmountInput(raw: string): number {
  const normalized = raw.replace(/[₦,\s]/g, "")
  if (!normalized) return 0
  const parsed = Number.parseFloat(normalized)
  if (Number.isNaN(parsed) || parsed < 0) return 0
  return Math.round(parsed * 100) / 100
}

/** Comma-grouped amount while the field is focused (no currency symbol). */
export function formatDonationAmountEditingValue(amount: number): string {
  if (amount === 0) return ""
  return amount.toLocaleString("en-US", {
    maximumFractionDigits: 2,
  })
}

export function formatDonationAmountInputValue(amount: number): string {
  if (amount === 0) return ""
  return formatNaira(amount)
}

export function getDonationAmountError(amount: number, isPremium: boolean): string | null {
  if (!isPremium && amount > CREATE_EVENT_FREE_DONATION_MONTHLY_LIMIT) {
    return "As a free user, you're only eligible to receiving ₦500,000 donations per month."
  }
  return null
}

export function getDonationUsageLine(
  usedThisMonth: number,
  limit = CREATE_EVENT_FREE_DONATION_MONTHLY_LIMIT,
): string {
  return `${formatNaira(usedThisMonth)} of ${formatNaira(limit)} used so far this month.`
}

export function getDonationSummaryRows(amount: number, receiveDonations: boolean) {
  if (!receiveDonations || amount <= 0) {
    return {
      donations: "NO",
      platformFee: "NO",
      totalToReceive: "NO",
    }
  }

  const fee = amount * CREATE_EVENT_DONATION_PLATFORM_FEE_RATE
  const total = amount - fee

  return {
    donations: formatNaira(amount),
    platformFee: formatNaira(fee),
    totalToReceive: formatNaira(total),
  }
}
