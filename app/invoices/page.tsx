import { getInvoicesByUserId, getUserSettings } from "@/lib/actions";
import type { StatusFilterOption } from "@/components/ui/data-table";
import { DataTableWrapper } from "@/app/components/data-table/DataTableWrapper";
import { columns } from "./columns";

const invoiceStatusOptions: StatusFilterOption[] = [
  { value: "DRAFT", label: "Draft" },
  { value: "SENT", label: "Sent" },
  { value: "PARTIAL", label: "Partial" },
  { value: "PAID", label: "Paid" },
  { value: "OVERDUE", label: "Overdue" },
  { value: "CANCELLED", label: "Cancelled" },
];

export default async function Invoices() {
  // TODO: Replace with actual user ID from authentication
  const userId = "cmgexy4630002r7qfecfve8hq";

  const [invoices, settingsResult] = await Promise.all([
    getInvoicesByUserId(userId),
    getUserSettings(userId),
  ]);

  const userSettings =
    settingsResult?.success && settingsResult?.data
      ? settingsResult.data.userSettings
      : null;

  // Transform the data to match our Invoice type
  const transformedInvoices = invoices.map((invoice) => ({
    id: invoice.id,
    documentNumber: invoice.documentNumber,
    status: invoice.status,
    createdAt: invoice.createdAt.toISOString(),
    total: Number(invoice.total),
    currency: invoice.currency,
    client: {
      name: invoice.client.name,
    },
  }));

  return (
    <div className="group document-list invoices">
      <DataTableWrapper
        columns={columns}
        data={transformedInvoices}
        filterColumn="client.name"
        filterPlaceholder="Filter by client name..."
        statusFilterColumn="status"
        statusFilterOptions={invoiceStatusOptions}
        dateFilterColumn="createdAt"
        fiscalYearSettings={
          userSettings
            ? {
                fiscalYearStartMonth: userSettings.fiscalYearStartMonth,
                fiscalYearStartDay: userSettings.fiscalYearStartDay,
              }
            : undefined
        }
        documentType="invoice"
      />
    </div>
  );
}
