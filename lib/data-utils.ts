import currencyCodes from "currency-codes";
import countries from "world-countries";

/**
 * Get all available currencies with their codes and names
 */
export function getCurrencyOptions() {
  const allCurrencies = currencyCodes.data;

  return allCurrencies
    .map((currency) => ({
      value: currency.code,
      label: `${currency.code} - ${currency.currency}`,
      keywords: [
        currency.code.toLowerCase(),
        currency.currency.toLowerCase(),
        ...(currency.countries || []).map((c: string) => c.toLowerCase()),
      ],
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

/**
 * Get all countries with their names and codes
 */
export function getCountryOptions() {
  return countries
    .map((country) => ({
      value: country.cca2, // ISO 3166-1 alpha-2 code
      label: country.name.common,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

/**
 * Get currency name from code
 */
export function getCurrencyName(code: string): string {
  const currency = currencyCodes.code(code);
  return currency ? currency.currency : code;
}

/**
 * Get country name from code
 */
export function getCountryName(code: string): string {
  const country = countries.find((c) => c.cca2 === code);
  return country ? country.name.common : code;
}

/**
 * Get month options for fiscal year selection with common presets
 */
export function getFiscalYearMonthOptions() {
  return [
    { value: "1", label: "January (Calendar Year - Standard)", preset: true },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April (UK, India)", preset: true },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July (Australia)", preset: true },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October (US Government)", preset: true },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];
}

/**
 * Get day options (1-31) for fiscal year start day
 */
export function getFiscalYearDayOptions() {
  return Array.from({ length: 31 }, (_, i) => ({
    value: String(i + 1),
    label: String(i + 1),
  }));
}
