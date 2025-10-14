"use client";

import { use, useEffect, useState } from "react";
import { TemplateRenderer } from "@/app/components/documents/TemplateRenderer";
import { DocumentWithRelations } from "@/app/components/documents/templates/types";
import { useRouter } from "next/navigation";
import { getDocumentById } from "@/lib/actions";

// Helper function to create an empty new quote
function createEmptyQuote(): DocumentWithRelations {
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
      currency: "USD",
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
    currency: "USD",
    subtotal: "0.00",
    taxRate: "0.00",
    taxAmount: "0.00",
    discount: "0.00",
    total: "0.00",
    amountPaid: "0.00",
    amountDue: "0.00",
    notes: null,
    terms: null,
    internalNotes: null,
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

  useEffect(() => {
    async function fetchDocument() {
      try {
        if (id === "new") {
          // Create a new empty quote
          setDocument(createEmptyQuote());
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

  const handleUpdate = (updates: Partial<DocumentWithRelations>) => {
    setDocument((prev) => {
      if (!prev) return prev;
      return { ...prev, ...updates };
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (id === "new") {
        // TODO: Implement create new document in database
        // const newDoc = await createDocument(document);
        // router.push(`/quote/${newDoc.id}`);
        console.log("Creating new quote:", document);
      } else {
        // TODO: Implement update existing document
        // await updateDocument(document);
        router.push(`/quote/${id}`);
      }
    } catch (error) {
      console.error("Failed to save:", error);
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
      />
    </div>
  );
}
