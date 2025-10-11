import { Palette } from "lucide-react";
import { SettingsSection } from "@/app/components/settings";
import { TemplateCarousel } from "./TemplateCarousel";
import type { Template } from "@/app/components/documents/templates/types";

interface TemplateSelectionSectionProps {
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  onSave: (e: React.FormEvent<HTMLFormElement>) => void;
  onMarkChanged: () => void;
  selectedTemplate: string;
  setSelectedTemplate: (id: string) => void;
  templates: Template[];
}

export function TemplateSelectionSection({
  isSaving,
  hasUnsavedChanges,
  onSave,
  onMarkChanged,
  selectedTemplate,
  setSelectedTemplate,
  templates,
}: TemplateSelectionSectionProps) {
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
