import { useState } from "react"
import { Input } from "../ui/input"
import {
  formatDonationAmountEditingValue,
  formatDonationAmountInputValue,
  parseDonationAmountInput,
} from "../../lib/create-event-donations"

export function DonationAmountField({
  value,
  onChange,
  invalid,
}: {
  value: number
  onChange: (value: number) => void
  invalid?: boolean
}) {
  const [focused, setFocused] = useState(false)
  const displayValue = focused
    ? formatDonationAmountEditingValue(value)
    : formatDonationAmountInputValue(value)

  return (
    <Input
      density="compact"
      type="text"
      inputMode="decimal"
      autoComplete="off"
      placeholder="₦ 0.00"
      value={displayValue}
      invalid={invalid}
      onFocus={() => setFocused(true)}
      onBlur={() => {
        setFocused(false)
        onChange(parseDonationAmountInput(displayValue))
      }}
      onChange={(event) => onChange(parseDonationAmountInput(event.target.value))}
    />
  )
}
