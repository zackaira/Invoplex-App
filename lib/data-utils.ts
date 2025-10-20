import countries from "world-countries";

/**
 * Manual currency list with codes, names, and symbols
 */
const SUPPORTED_CURRENCIES = [
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$" },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp" },
  { code: "NAD", name: "Namibian Dollar", symbol: "N$" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$" },
  { code: "PHP", name: "Philippine Peso", symbol: "₱" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
  { code: "THB", name: "Thai Baht", symbol: "฿" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "ZAR", name: "South African Rand", symbol: "R" },
  { code: "ZWG", name: "Zimbabwe Gold", symbol: "ZiG" },
];

/**
 * Get currency symbol from code
 */
function getCurrencySymbol(code: string): string {
  const currency = SUPPORTED_CURRENCIES.find((c) => c.code === code);
  return currency?.symbol || "$";
}

/**
 * Get all available currencies with their codes and names
 */
export function getCurrencyOptions() {
  return SUPPORTED_CURRENCIES.map((currency) => ({
    value: currency.code,
    label: `${currency.code} - ${currency.name}`,
    keywords: [currency.code.toLowerCase(), currency.name.toLowerCase()],
  }));
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
  const currency = SUPPORTED_CURRENCIES.find((c) => c.code === code);
  return currency?.name || code;
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

/**
 * Get currency display format options with examples based on selected currency
 */
export function getCurrencyDisplayFormatOptions(currencyCode: string = "USD") {
  const symbol = getCurrencySymbol(currencyCode);
  const amount = "100";

  return [
    {
      value: "symbol_before",
      label: `Symbol Before - ${symbol}${amount}`,
    },
    {
      value: "symbol_after",
      label: `Symbol After - ${amount}${symbol}`,
    },
    {
      value: "symbol_before_space",
      label: `Symbol Before with Space - ${symbol} ${amount}`,
    },
    {
      value: "symbol_after_space",
      label: `Symbol After with Space - ${amount} ${symbol}`,
    },
    {
      value: "code_before",
      label: `Code Before - ${currencyCode} ${amount}`,
    },
    {
      value: "code_after",
      label: `Code After - ${amount} ${currencyCode}`,
    },
  ];
}
