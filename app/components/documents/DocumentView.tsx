"use client";

import { TemplateRenderer } from "@/app/components/documents/templates/TemplateRenderer";
import { DocumentWithRelations } from "@/app/components/documents/templates/types";
import { DocumentViewBar } from "./DocumentViewBar";
import { DocumentEditBar } from "./DocumentEditBar";

export function DocumentView({
  document,
  type,
  templateId = "classic",
  isEditable = false,
  onUpdate,
  onTemplateChange,
}: {
  document: DocumentWithRelations;
  type: "QUOTE" | "INVOICE";
  templateId?: string;
  isEditable?: boolean;
  onUpdate?: (updates: Partial<DocumentWithRelations>) => void;
  onTemplateChange?: (templateId: string) => void;
}) {
  return (
    <>
      {isEditable ? (
        <DocumentEditBar
          document={document}
          templateId={templateId}
          onTemplateChange={onTemplateChange}
        />
      ) : (
        <DocumentViewBar document={document} />
      )}

      <TemplateRenderer
        templateId={templateId}
        document={document}
        type={type}
        isEditable={isEditable}
        onUpdate={isEditable ? onUpdate : undefined}
      />
    </>
  );
}
