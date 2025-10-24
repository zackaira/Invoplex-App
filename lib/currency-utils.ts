/**
 * Currency formatting utilities
 *
 * Handles formatting currency values according to user preferences
 */

// Currency symbol mapping
const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CNY: "¥",
  INR: "₹",
  AUD: "A$",
  CAD: "C$",
  CHF: "CHF",
  SEK: "kr",
  NZD: "NZ$",
  ZAR: "R",
  BRL: "R$",
  MXN: "$",
  SGD: "S$",
  HKD: "HK$",
  NOK: "kr",
  KRW: "₩",
  TRY: "₺",
  RUB: "₽",
  PLN: "zł",
  THB: "฿",
  IDR: "Rp",
  MYR: "RM",
  PHP: "₱",
  DKK: "kr",
  CZK: "Kč",
  ILS: "₪",
  AED: "د.إ",
  SAR: "﷼",
};

/**
 * Get the currency symbol for a currency code
 * Falls back to the currency code if no symbol is found
 */
export function getCurrencySymbol(currencyCode: string): string {
  return CURRENCY_SYMBOLS[currencyCode] || currencyCode;
}

/**
 * Format a currency amount according to display preferences
 *
 * @param amount - The amount to format (can be string, number, or Decimal)
 * @param currencyCode - The currency code (e.g., "USD", "EUR")
 * @param displayFormat - How to display the currency ("symbol_before", "symbol_after", "symbol_before_space", "symbol_after_space", "code_before", "code_after")
 * @returns Formatted currency string
 *
 * Examples:
 * - formatCurrency(100, "USD", "symbol_before") => "$100.00"
 * - formatCurrency(100, "USD", "symbol_after") => "100.00$"
 * - formatCurrency(100, "USD", "symbol_before_space") => "$ 100.00"
 * - formatCurrency(100, "USD", "symbol_after_space") => "100.00 $"
 * - formatCurrency(100, "USD", "code_before") => "USD 100.00"
 * - formatCurrency(100, "USD", "code_after") => "100.00 USD"
 */
export function formatCurrency(
  amount: string | number,
  currencyCode: string = "USD",
  displayFormat: string = "symbol_before"
): string {
  // Convert amount to string and ensure it has 2 decimal places
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  const formattedAmount = isNaN(numAmount) ? "0.00" : numAmount.toFixed(2);

  const symbol = getCurrencySymbol(currencyCode);

  switch (displayFormat) {
    case "symbol_after":
      return `${formattedAmount}${symbol}`;

    case "symbol_after_space":
      return `${formattedAmount} ${symbol}`;

    case "symbol_before_space":
      return `${symbol} ${formattedAmount}`;

    case "code_before":
      return `${currencyCode} ${formattedAmount}`;

    case "code_after":
      return `${formattedAmount} ${currencyCode}`;

    case "symbol_before":
    default:
      return `${symbol}${formattedAmount}`;
  }
}

/**
 * Format currency for display in input fields (just the symbol)
 *
 * @param currencyCode - The currency code
 * @param displayFormat - How to display the currency
 * @returns The currency symbol or code to show in inputs
 */
export function formatCurrencyInput(
  currencyCode: string = "USD",
  displayFormat: string = "symbol_before"
): string {
  if (displayFormat.startsWith("code_")) {
    return currencyCode;
  }
  return getCurrencySymbol(currencyCode);
}
