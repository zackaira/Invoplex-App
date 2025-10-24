"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ProjectsTab } from "./ProjectsTab";

type Document = {
  id: string;
  documentNumber: string;
  type: string;
  status: string;
  total: string;
  amountDue: string;
  createdAt: Date;
};

type ClientInfo = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  country?: string | null;
  currency?: string;
  taxId?: string | null;
  website?: string | null;
};

type DocumentsTabsProps = {
  quotes: Document[];
  invoices: Document[];
  currency: string;
  clientId: string;
  userId: string;
  client: ClientInfo;
};

export function DocumentsTabs({
  quotes,
  invoices,
  currency,
  clientId,
  userId,
  client,
}: DocumentsTabsProps) {
  const [activeTab, setActiveTab] = useState("quotes");

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount);
  };
  const handleNewQuote = () => {
    console.log("Creating new quote for client:", clientId);
    // TODO: Navigate to new quote page with client pre-selected
  };

  const handleNewInvoice = () => {
    console.log("Creating new invoice for client:", clientId);
    // TODO: Navigate to new invoice page with client pre-selected
  };

  const handleRecordPayment = () => {
    console.log("Recording payment for client:", clientId);
    // TODO: Open payment recording modal
  };

  return (
    <Card>
      <CardContent>
        <Tabs
          defaultValue="quotes"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="quotes">Quotes ({quotes.length})</TabsTrigger>
              <TabsTrigger value="invoices">
                Invoices ({invoices.length})
              </TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              {activeTab === "quotes" && (
                <Button size="sm" variant="outline" onClick={handleNewQuote}>
                  <Plus className="h-4 w-4 mr-1" />
                  New Quote
                </Button>
              )}
              {activeTab === "invoices" && (
                <Button size="sm" variant="outline" onClick={handleNewInvoice}>
                  <Plus className="h-4 w-4 mr-1" />
                  New Invoice
                </Button>
              )}
              {activeTab === "payments" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleRecordPayment}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Record Payment
                </Button>
              )}
            </div>
          </div>

          {/* Quotes Tab */}
          <TabsContent value="quotes" className="mt-0">
            {quotes.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No quotes yet
              </p>
            ) : (
              <div className="space-y-2">
                {quotes.map((quote) => (
                  <Link
                    key={quote.id}
                    href={`/quote/${quote.id}`}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="font-medium">
                          {quote.documentNumber}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Intl.DateTimeFormat("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }).format(new Date(quote.createdAt))}
                        </div>
                      </div>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-sm font-medium ${
                          quote.status === "DRAFT"
                            ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                            : quote.status === "SENT"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                            : quote.status === "APPROVED"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                            : quote.status === "REJECTED"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                        }`}
                      >
                        {quote.status}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {formatCurrency(Number(quote.total))}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Invoices Tab */}
          <TabsContent value="invoices" className="mt-0">
            {invoices.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No invoices yet
              </p>
            ) : (
              <div className="space-y-2">
                {invoices.map((invoice) => (
                  <Link
                    key={invoice.id}
                    href={`/invoice/${invoice.id}`}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="font-medium">
                          {invoice.documentNumber}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Intl.DateTimeFormat("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }).format(new Date(invoice.createdAt))}
                        </div>
                      </div>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-sm font-medium ${
                          invoice.status === "DRAFT"
                            ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                            : invoice.status === "SENT"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                            : invoice.status === "PAID"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                            : invoice.status === "OVERDUE"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                            : invoice.status === "PARTIAL"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {formatCurrency(Number(invoice.total))}
                      </div>
                      {Number(invoice.amountDue) > 0 && (
                        <div className="text-sm text-orange-600 dark:text-orange-400">
                          Due: {formatCurrency(Number(invoice.amountDue))}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="mt-0">
            <p className="text-sm text-muted-foreground text-center py-8">
              No payments recorded yet
            </p>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="mt-0">
            <ProjectsTab userId={userId} client={client} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
