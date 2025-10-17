/**
 * Shared components and utilities for document templates
 *
 * These components handle the business logic for documents (quotes/invoices)
 * while allowing templates to provide their own styling and presentation.
 */

export { DocumentItemsTable } from "./ItemsTable";
export type { DocumentItemsTableProps, ItemRowRenderProps } from "./ItemsTable";

export { DocumentTotals } from "./Totals";
export type { DocumentTotalsProps, TotalsRenderProps } from "./Totals";

export { ConfirmationDialog } from "./ConfirmationDialog";

export { useDocumentCalculations } from "./hooks/useCalculations";
export { useDocumentItems } from "./hooks/useDocumentItems";

export {
  getStatusColor,
  formatDate,
  formatCurrency,
} from "./document-items.utils";
