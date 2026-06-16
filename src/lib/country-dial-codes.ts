import countryDialCodesJson from "../data/country-dial-codes.json"

export type CountryDialCode = {
  code: string
  name: string
  dialCode: string
  flag: string
}

export const COUNTRY_DIAL_CODES = countryDialCodesJson as CountryDialCode[]

export const DEFAULT_COUNTRY_CODE = "NG"
export const DEFAULT_DIAL_CODE = "+234"

export function getCountryByCode(code: string): CountryDialCode | undefined {
  return COUNTRY_DIAL_CODES.find((country) => country.code === code)
}

export function getCountryByDialCode(dialCode: string): CountryDialCode | undefined {
  return COUNTRY_DIAL_CODES.find((country) => country.dialCode === dialCode)
}

export function filterCountries(query: string): CountryDialCode[] {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return COUNTRY_DIAL_CODES

  const dialDigits = normalized.replace(/\D/g, "")

  return COUNTRY_DIAL_CODES.filter((country) => {
    if (country.name.toLowerCase().includes(normalized)) return true
    if (country.code.toLowerCase().includes(normalized)) return true
    if (country.dialCode.toLowerCase().includes(normalized)) return true
    if (dialDigits && country.dialCode.replace(/\D/g, "").includes(dialDigits)) return true
    return false
  })
}
