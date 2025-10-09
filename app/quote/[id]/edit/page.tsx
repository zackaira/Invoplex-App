"use client";

import { use, useEffect, useState } from "react";
import { DocumentView } from "@/app/components/DocumentView";
import { DocumentWithRelations } from "@/app/components/templates/types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { getDocumentById } from "@/lib/actions";

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

  useEffect(() => {
    async function fetchDocument() {
      try {
        const doc = await getDocumentById(id, "QUOTE");
        setDocument(doc);
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
      // TODO: Implement save to database
      // await updateDocument(document);
      router.push(`/quote/${id}`);
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
      <DocumentView
        document={document}
        type="QUOTE"
        templateId="classic"
        isEditable={true}
        onUpdate={handleUpdate}
      />
    </div>
  );
}
