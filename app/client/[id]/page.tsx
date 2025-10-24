import { notFound } from "next/navigation";
import { getClientById, getFirstUser } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ClientDetailsCard, ContactsCard, DocumentsTabs } from "./components";

export default async function ClientPage({
  params,
}: {
  params: { id: string };
}) {
  const client = await getClientById(params.id);
  const user = await getFirstUser();

  if (!client || !user) {
    notFound();
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: client.currency || "USD",
    }).format(amount);
  };

  // Separate quotes and invoices
  const quotes = client.documents.filter((doc) => doc.type === "QUOTE");
  const invoices = client.documents.filter((doc) => doc.type === "INVOICE");

  return (
    <div className="p-6 space-y-6">
      {/* Header with Paid to Date and Outstanding */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div>
            <p className="text-sm text-muted-foreground">Paid to Date</p>
            <p className="text-2xl font-semibold">
              {formatCurrency(client.paidToDate)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Outstanding</p>
            <p className="text-2xl font-semibold text-orange-600 dark:text-orange-400">
              {formatCurrency(client.outstanding)}
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/client/${client.id}/edit`}>Edit Client</Link>
        </Button>
      </div>

      {/* Client Details and Contacts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ClientDetailsCard client={client} />
        <ContactsCard contacts={client.contacts} clientId={client.id} />
      </div>

      {/* Quotes / Invoices / Payments Section */}
      <DocumentsTabs
        quotes={quotes}
        invoices={invoices}
        currency={client.currency}
        clientId={client.id}
        userId={user.id}
        client={client}
      />
    </div>
  );
}
