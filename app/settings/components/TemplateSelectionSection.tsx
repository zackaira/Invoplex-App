import { Palette } from "lucide-react";
import { SettingsSection } from "@/app/components/settings";
import { TemplateCarousel } from "./TemplateCarousel";
import type { Template } from "@/app/components/documents/types";
import type { ValidationError } from "@/lib/validation";

interface TemplateSelectionSectionProps {
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  onSave: (e: React.FormEvent<HTMLFormElement>) => void;
  onMarkChanged: () => void;
  selectedTemplate: string;
  setSelectedTemplate: (id: string) => void;
  templates: Template[];
  validationErrors?: ValidationError[];
  initialData?: {
    preferredTemplate?: string;
  };
}

export function TemplateSelectionSection({
  isSaving,
  hasUnsavedChanges,
  onSave,
  onMarkChanged,
  selectedTemplate,
  setSelectedTemplate,
  templates,
  validationErrors,
}: TemplateSelectionSectionProps) {
  // Helper to get error for a specific field
  const getFieldError = (fieldName: string): string | undefined => {
    if (!validationErrors) return undefined;
    const error = validationErrors.find(
      (err) =>
        err.path.join(".") === fieldName ||
        err.path[err.path.length - 1] === fieldName
    );
    return error?.message;
  };

  return (
    <SettingsSection
      id="template-settings"
      icon={Palette}
      title="Quotes & Invoices Template"
      description="Choose your preferred template design for quotes and invoices."
      onSubmit={onSave}
      isSaving={isSaving}
      hasUnsavedChanges={hasUnsavedChanges}
      saveButtonText="Save Template Selection"
    >
      <TemplateCarousel
        selectedTemplate={selectedTemplate}
        onTemplateSelect={(templateId) => {
          setSelectedTemplate(templateId);
          onMarkChanged();
        }}
      />

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Selected:{" "}
          <span className="font-medium text-foreground">
            {templates.find((t) => t.metadata.id === selectedTemplate)?.metadata
              .name || selectedTemplate}
          </span>
        </p>
      </div>
    </SettingsSection>
  );
}
