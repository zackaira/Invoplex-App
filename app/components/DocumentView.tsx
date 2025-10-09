import { TemplateRenderer } from "@/app/components/templates/TemplateRenderer";
import { DocumentWithRelations } from "@/app/components/templates/types";
import { DocumentViewBar } from "./DocumentViewBar";
import { DocumentEditBar } from "./DocumentEditBar";

export function DocumentView({
  document,
  type,
  templateId = "classic",
  isEditable = false,
  onUpdate,
}: {
  document: DocumentWithRelations;
  type: "QUOTE" | "INVOICE";
  templateId?: string;
  isEditable?: boolean;
  onUpdate?: (updates: Partial<DocumentWithRelations>) => void;
}) {
  return (
    <>
      {isEditable ? (
        <DocumentEditBar document={document} />
      ) : (
        <DocumentViewBar document={document} />
      )}

      <TemplateRenderer
        templateId={templateId}
        document={document}
        type={type}
        isEditable={isEditable}
        onUpdate={onUpdate}
      />
    </>
  );
}
