"use client";

import { use, useEffect, useState } from "react";
import { TemplateRenderer } from "@/app/components/documents/TemplateRenderer";
import {
  DocumentWithRelations,
  BusinessSettings,
} from "@/app/components/documents/types";
import { useRouter } from "next/navigation";
import {
  getDocumentById,
  createDocument,
  updateDocument,
  getUserSettings,
} from "@/lib/actions";
import { toast } from "sonner";

// Helper function to create an empty new quote with default settings
function createEmptyQuote(
  defaultNotes?: string | null,
  defaultTerms?: string | null,
  defaultCurrency?: string,
  defaultTaxRate?: number,
  defaultBusinessFieldsToShow?: string | null,
  defaultClientFieldsToShow?: string | null
): DocumentWithRelations {
  const now = new Date();
  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + 30); // 30 days validity

  return {
    id: "new",
    documentNumber: "DRAFT",
    type: "QUOTE",
    status: "DRAFT",
    userId: "cmgexy4630002r7qfecfve8hq", // TODO: Replace with actual user ID from authentication
    clientId: "",
    client: {
      id: "",
      userId: "",
      name: "",
      email: null,
      phone: null,
      website: null,
      address: null,
      city: null,
      state: null,
      zipCode: null,
      country: null,
      currency: defaultCurrency || "USD",
      taxId: null,
      createdAt: now,
      updatedAt: now,
    },
    contactId: null,
    contact: null,
    issueDate: now,
    dueDate: null,
    validUntil: validUntil,
    convertedAt: null,
    convertedToId: null,
    convertedFromId: null,
    currency: defaultCurrency || "USD",
    subtotal: "0.00",
    taxRate: String(defaultTaxRate || 0),
    taxAmount: "0.00",
    discount: "0.00",
    total: "0.00",
    amountPaid: "0.00",
    amountDue: "0.00",
    notes: defaultNotes,
    terms: defaultTerms,
    internalNotes: null,
    showDiscount: false,
    showTax: true,
    showNotes: true,
    showTerms: true,
    businessFieldsToShow:
      defaultBusinessFieldsToShow ||
      JSON.stringify({
        businessName: true,
        personalName: false,
        email: true,
        phone: true,
        website: true,
        taxId: false,
        address: false,
      }),
    clientFieldsToShow:
      defaultClientFieldsToShow ||
      JSON.stringify({
        name: true,
        contact: true,
        address: true,
        email: true,
      }),
    items: [],
    payments: [],
    createdAt: now,
    updatedAt: now,
  } as unknown as DocumentWithRelations;
}

export default function EditQuotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [document, setDocument] = useState<DocumentWithRelations | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [templateId, setTemplateId] = useState("classic");
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings>();

  useEffect(() => {
    async function fetchDocument() {
      try {
        if (id === "new") {
          // Fetch user settings to get defaults for new quote
          const userId = "cmgexy4630002r7qfecfve8hq";
          const settingsResult = await getUserSettings(userId);
          const userSettings = settingsResult?.data?.userSettings;

          // Create a new empty quote with default settings
          setDocument(
            createEmptyQuote(
              userSettings?.quoteDefaultNotes,
              userSettings?.quoteDefaultTerms,
              userSettings?.defaultCurrency,
              userSettings?.defaultTaxRate
                ? Number(userSettings.defaultTaxRate)
                : undefined,
              userSettings?.defaultBusinessFieldsToShow,
              userSettings?.defaultClientFieldsToShow
            )
          );
        } else {
          // Fetch existing quote
          const doc = await getDocumentById(id, "QUOTE");
          setDocument(doc);
        }
      } catch (error) {
        console.error("Failed to fetch document:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDocument();
  }, [id]);

  useEffect(() => {
    async function fetchBusinessSettings() {
      try {
        // TODO: Replace with actual user ID from authentication
        const userId = "cmgexy4630002r7qfecfve8hq";
        const settingsResult = await getUserSettings(userId);
        const businessProfile = settingsResult?.data?.businessProfile;
        const userSettings = settingsResult?.data?.userSettings;

        if (businessProfile && userSettings) {
          setBusinessSettings({
            // Business Profile fields
            personalName: businessProfile.personalName,
            businessName: businessProfile.businessName,
            email: businessProfile.email,
            phone: businessProfile.phone,
            website: businessProfile.website,
            logo: businessProfile.logo,
            address: businessProfile.address,
            city: businessProfile.city,
            state: businessProfile.state,
            zipCode: businessProfile.zipCode,
            country: businessProfile.country,
            taxId: businessProfile.taxId,
            registrationNumber: businessProfile.registrationNumber,
            brandColor: businessProfile.brandColor,

            // User Settings fields
            quoteTitle: userSettings.quoteTitle,
            invoiceTitle: userSettings.invoiceTitle,
            defaultCurrency: userSettings.defaultCurrency,
            currencyDisplayFormat: userSettings.currencyDisplayFormat,
            taxName: userSettings.taxName,
            defaultTaxRate: Number(userSettings.defaultTaxRate),
            quoteDefaultNotes: userSettings.quoteDefaultNotes,
            quoteDefaultTerms: userSettings.quoteDefaultTerms,
            invoiceDefaultNotes: userSettings.invoiceDefaultNotes,
            invoiceDefaultTerms: userSettings.invoiceDefaultTerms,
          });
        }
      } catch (error) {
        console.error("Failed to fetch business settings:", error);
      }
    }
    fetchBusinessSettings();
  }, []);

  const handleUpdate = (updates: Partial<DocumentWithRelations>) => {
    setDocument((prev) => {
      if (!prev) return prev;
      return { ...prev, ...updates };
    });
  };

  const handleSave = async () => {
    if (!document) return;

    // Validate required fields
    if (!document.clientId || document.clientId === "") {
      toast.error("Please select a client");
      return;
    }

    if (!document.items || document.items.length === 0) {
      toast.error("Please add at least one item");
      return;
    }

    setIsSaving(true);
    try {
      if (id === "new") {
        // Create new quote
        const newDoc = await createDocument({
          userId: document.userId,
          documentNumber: document.documentNumber,
          type: "QUOTE",
          status: document.status,
          clientId: document.clientId,
          contactId: document.contactId,
          issueDate: new Date(document.issueDate),
          dueDate: document.dueDate ? new Date(document.dueDate) : null,
          validUntil: document.validUntil
            ? new Date(document.validUntil)
            : null,
          currency: document.currency,
          subtotal: document.subtotal.toString(),
          taxRate: document.taxRate.toString(),
          taxAmount: document.taxAmount.toString(),
          discount: document.discount.toString(),
          total: document.total.toString(),
          amountPaid: document.amountPaid?.toString(),
          amountDue: document.amountDue?.toString(),
          notes: document.notes,
          terms: document.terms,
          internalNotes: document.internalNotes,
          showDiscount: (document as any).showDiscount,
          showTax: (document as any).showTax,
          showNotes: (document as any).showNotes,
          showTerms: (document as any).showTerms,
          businessFieldsToShow: (document as any).businessFieldsToShow,
          clientFieldsToShow: (document as any).clientFieldsToShow,
          items: document.items.map((item, index) => ({
            itemType: item.itemType || "Product",
            description: item.description,
            quantity: item.quantity.toString(),
            unitPrice: item.unitPrice.toString(),
            amount: item.amount.toString(),
            hasQuantityColumn: item.hasQuantityColumn ?? false,
            order: index,
          })),
        });
        toast.success("Quote created successfully!");
        router.push(`/quote/${newDoc.id}`);
      } else {
        // Update existing quote
        await updateDocument(id, {
          documentNumber: document.documentNumber,
          status: document.status,
          clientId: document.clientId,
          contactId: document.contactId,
          issueDate: new Date(document.issueDate),
          dueDate: document.dueDate ? new Date(document.dueDate) : null,
          validUntil: document.validUntil
            ? new Date(document.validUntil)
            : null,
          currency: document.currency,
          subtotal: document.subtotal.toString(),
          taxRate: document.taxRate.toString(),
          taxAmount: document.taxAmount.toString(),
          discount: document.discount.toString(),
          total: document.total.toString(),
          amountPaid: document.amountPaid?.toString(),
          amountDue: document.amountDue?.toString(),
          notes: document.notes,
          terms: document.terms,
          internalNotes: document.internalNotes,
          showDiscount: (document as any).showDiscount,
          showTax: (document as any).showTax,
          showNotes: (document as any).showNotes,
          showTerms: (document as any).showTerms,
          businessFieldsToShow: (document as any).businessFieldsToShow,
          clientFieldsToShow: (document as any).clientFieldsToShow,
          items: document.items.map((item, index) => ({
            itemType: item.itemType || "Product",
            description: item.description,
            quantity: item.quantity.toString(),
            unitPrice: item.unitPrice.toString(),
            amount: item.amount.toString(),
            hasQuantityColumn: item.hasQuantityColumn ?? false,
            order: index,
          })),
        });
        toast.success("Quote updated successfully!");
        router.push(`/quote/${id}`);
      }
    } catch (error) {
      console.error("Failed to save:", error);
      toast.error("Failed to save quote. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!document) {
    return <div className="p-8">Document not found</div>;
  }

  return (
    <div className="min-h-screen">
      <TemplateRenderer
        document={document}
        type="QUOTE"
        templateId={templateId}
        isEditable={true}
        onUpdate={handleUpdate}
        onTemplateChange={setTemplateId}
        onSave={handleSave}
        isSaving={isSaving}
        businessSettings={businessSettings}
      />
    </div>
  );
}
