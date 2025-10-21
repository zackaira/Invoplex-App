import { getQuotesByUserId, getUserSettings } from "@/lib/actions";
import { DataTable } from "@/components/ui/data-table";
import type { StatusFilterOption } from "@/components/ui/data-table";
import { columns } from "./columns";

const quoteStatusOptions: StatusFilterOption[] = [
  { value: "DRAFT", label: "Draft" },
  { value: "SENT", label: "Sent" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "CANCELLED", label: "Cancelled" },
];

export default async function Quotes() {
  // TODO: Replace with actual user ID from authentication
  const userId = "cmgexy4630002r7qfecfve8hq";

  const [quotes, userSettings] = await Promise.all([
    getQuotesByUserId(userId),
    getUserSettings(userId),
  ]);

  // Transform the data to match our Quote type
  const transformedQuotes = quotes.map((quote) => ({
    id: quote.id,
    documentNumber: quote.documentNumber,
    status: quote.status,
    createdAt: quote.createdAt.toISOString(),
    total: Number(quote.total),
    currency: quote.currency,
    client: {
      name: quote.client.name,
    },
  }));

  return (
    <div className="group document-list quotes">
      <DataTable
        columns={columns}
        data={transformedQuotes}
        filterColumn="client.name"
        filterPlaceholder="Filter by client name..."
        statusFilterColumn="status"
        statusFilterOptions={quoteStatusOptions}
        dateFilterColumn="createdAt"
        fiscalYearSettings={
          userSettings
            ? {
                fiscalYearStartMonth: userSettings.fiscalYearStartMonth,
                fiscalYearStartDay: userSettings.fiscalYearStartDay,
              }
            : undefined
        }
        documentType="quote"
      />
    </div>
  );
}
