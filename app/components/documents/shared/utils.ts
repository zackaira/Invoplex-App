/**
 * Shared utility functions for document templates
 */

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    DRAFT: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
    SENT: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
    APPROVED:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    REJECTED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
    CONVERTED:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
    PARTIAL:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
    PAID: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    OVERDUE: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
    CANCELLED: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString();
}

export function formatCurrency(
  amount: string | number,
  currency: string
): string {
  return `${currency} ${parseFloat(amount.toString()).toFixed(2)}`;
}
