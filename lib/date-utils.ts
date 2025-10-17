/**
 * Date range utilities for filtering quotes and invoices
 */

export interface FiscalYearSettings {
  fiscalYearStartMonth: number; // 1-12
  fiscalYearStartDay: number; // 1-31
}

export interface DateRange {
  from: Date;
  to: Date;
}

export type DateFilterValue =
  | "last_3_months"
  | "last_6_months"
  | "this_fiscal_year"
  | "last_fiscal_year";

export interface DateFilterOption {
  value: DateFilterValue;
  label: string;
}

/**
 * Format a date as "Mon DD" (e.g., "Mar 1")
 */
function formatFiscalDate(date: Date): string {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[date.getMonth()]} ${date.getDate()}`;
}

/**
 * Generate date filter options with dynamic fiscal year dates
 */
export function getDateFilterOptions(
  settings: FiscalYearSettings
): DateFilterOption[] {
  const currentFYStart = getCurrentFiscalYearStart(settings);
  const lastFYStart = new Date(currentFYStart);
  lastFYStart.setFullYear(lastFYStart.getFullYear() - 1);

  return [
    { value: "last_3_months", label: "Last 3 months" },
    { value: "last_6_months", label: "Last 6 months" },
    {
      value: "this_fiscal_year",
      label: `Current Year (from ${formatFiscalDate(currentFYStart)})`,
    },
    {
      value: "last_fiscal_year",
      label: `Last Year (from ${formatFiscalDate(lastFYStart)})`,
    },
  ];
}

/**
 * Calculate the start date of the current fiscal year
 */
export function getCurrentFiscalYearStart(settings: FiscalYearSettings): Date {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // getMonth() returns 0-11

  // Create a date for the fiscal year start in the current calendar year
  let fiscalYearStart = new Date(
    currentYear,
    settings.fiscalYearStartMonth - 1,
    settings.fiscalYearStartDay
  );

  // If we haven't reached the fiscal year start date yet this calendar year,
  // the current fiscal year actually started last calendar year
  if (now < fiscalYearStart) {
    fiscalYearStart = new Date(
      currentYear - 1,
      settings.fiscalYearStartMonth - 1,
      settings.fiscalYearStartDay
    );
  }

  // Set time to start of day
  fiscalYearStart.setHours(0, 0, 0, 0);

  return fiscalYearStart;
}

/**
 * Calculate the end date of the current fiscal year
 */
export function getCurrentFiscalYearEnd(settings: FiscalYearSettings): Date {
  const fiscalYearStart = getCurrentFiscalYearStart(settings);

  // Add one year to get the end date
  const fiscalYearEnd = new Date(fiscalYearStart);
  fiscalYearEnd.setFullYear(fiscalYearEnd.getFullYear() + 1);
  fiscalYearEnd.setDate(fiscalYearEnd.getDate() - 1); // Go back one day

  // Set time to end of day
  fiscalYearEnd.setHours(23, 59, 59, 999);

  return fiscalYearEnd;
}

/**
 * Calculate the start and end dates for the previous fiscal year
 */
export function getLastFiscalYearRange(
  settings: FiscalYearSettings
): DateRange {
  const currentFiscalYearStart = getCurrentFiscalYearStart(settings);

  // Last fiscal year starts one year before the current fiscal year
  const lastFiscalYearStart = new Date(currentFiscalYearStart);
  lastFiscalYearStart.setFullYear(lastFiscalYearStart.getFullYear() - 1);
  lastFiscalYearStart.setHours(0, 0, 0, 0);

  // Last fiscal year ends one day before the current fiscal year starts
  const lastFiscalYearEnd = new Date(currentFiscalYearStart);
  lastFiscalYearEnd.setDate(lastFiscalYearEnd.getDate() - 1);
  lastFiscalYearEnd.setHours(23, 59, 59, 999);

  return {
    from: lastFiscalYearStart,
    to: lastFiscalYearEnd,
  };
}

/**
 * Get the date range based on the selected filter
 */
export function getDateRangeForFilter(
  filter: DateFilterValue,
  settings: FiscalYearSettings
): DateRange | null {
  const now = new Date();
  now.setHours(23, 59, 59, 999); // End of today

  switch (filter) {
    case "last_3_months": {
      const from = new Date(now);
      from.setMonth(from.getMonth() - 3);
      from.setHours(0, 0, 0, 0);
      return { from, to: now };
    }

    case "last_6_months": {
      const from = new Date(now);
      from.setMonth(from.getMonth() - 6);
      from.setHours(0, 0, 0, 0);
      return { from, to: now };
    }

    case "this_fiscal_year": {
      const from = getCurrentFiscalYearStart(settings);
      const to = getCurrentFiscalYearEnd(settings);
      return { from, to };
    }

    case "last_fiscal_year": {
      return getLastFiscalYearRange(settings);
    }

    default:
      return null; // No filtering
  }
}

/**
 * Check if a date falls within a date range
 */
export function isDateInRange(
  date: Date | string,
  range: DateRange | null
): boolean {
  if (!range) return true; // No range means show all

  const dateObj = typeof date === "string" ? new Date(date) : date;

  return dateObj >= range.from && dateObj <= range.to;
}
