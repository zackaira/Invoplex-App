/**
 * Shared components and utilities for document templates
 *
 * These components handle the business logic for documents (quotes/invoices)
 * while allowing templates to provide their own styling and presentation.
 */

export { DocumentItemsTable } from "./DocumentItemsTable";
export type {
  DocumentItemsTableProps,
  ItemRowRenderProps,
} from "./DocumentItemsTable";

export { DocumentTotals } from "./DocumentTotals";
export type { DocumentTotalsProps, TotalsRenderProps } from "./DocumentTotals";

export { useDocumentCalculations } from "./hooks/useDocumentCalculations";
export { useDocumentItems } from "./hooks/useDocumentItems";

export { getStatusColor, formatDate, formatCurrency } from "./utils";
