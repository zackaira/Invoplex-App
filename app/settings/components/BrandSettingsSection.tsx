import { FileCheck } from "lucide-react";
import {
  SettingsSection,
  SettingsColorPicker,
  SettingsLogoUpload,
} from "@/app/components/settings";
import type { ValidationError } from "@/lib/validation";

interface BrandSettingsSectionProps {
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  onSave: (e: React.FormEvent<HTMLFormElement>) => void;
  onMarkChanged: () => void;
  brandColor: string;
  setBrandColor: (color: string) => void;
  logoPreview: string | null;
  onLogoSelect: (file: File) => void;
  onLogoRemove: () => void;
  validationErrors?: ValidationError[];
  initialData?: {
    dashboardPrimaryColor?: string;
    logoUrl?: string | null;
  };
}

export function BrandSettingsSection({
  isSaving,
  hasUnsavedChanges,
  onSave,
  onMarkChanged,
  brandColor,
  setBrandColor,
  logoPreview,
  onLogoSelect,
  onLogoRemove,
  validationErrors,
}: BrandSettingsSectionProps) {
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
      id="brand-settings"
      icon={FileCheck}
      title="Brand"
      description="Upload your logo and customize your brand colors."
      onSubmit={onSave}
      isSaving={isSaving}
      hasUnsavedChanges={hasUnsavedChanges}
      saveButtonText="Save Brand Settings"
    >
      <SettingsLogoUpload
        label="Logo"
        preview={logoPreview}
        onFileSelect={onLogoSelect}
        onRemove={onLogoRemove}
        helperText="Recommended size: 300 x 200 pixels."
        error={getFieldError("logo")}
      />

      <SettingsColorPicker
        label="Brand Color"
        name="brandColor"
        value={brandColor}
        onChange={(value) => {
          setBrandColor(value);
          onMarkChanged();
        }}
        helperText="This color will be used for accents in your documents"
        error={getFieldError("brandColor")}
      />
    </SettingsSection>
  );
}
