import { FileCheck } from "lucide-react";
import {
  SettingsSection,
  SettingsColorPicker,
  SettingsLogoUpload,
} from "@/app/components/settings";

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
}: BrandSettingsSectionProps) {
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
      />

      <SettingsColorPicker
        label="Brand Color"
        value={brandColor}
        onChange={(value) => {
          setBrandColor(value);
          onMarkChanged();
        }}
        helperText="This color will be used for accents in your documents"
      />
    </SettingsSection>
  );
}
