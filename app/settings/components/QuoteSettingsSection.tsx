import { FilePlus } from "lucide-react";
import {
  SettingsSection,
  SettingsInput,
  SettingsTextarea,
  SettingsGrid,
} from "@/app/components/settings";

interface QuoteSettingsSectionProps {
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  onSave: (e: React.FormEvent<HTMLFormElement>) => void;
  onMarkChanged: () => void;
}

export function QuoteSettingsSection({
  isSaving,
  hasUnsavedChanges,
  onSave,
  onMarkChanged,
}: QuoteSettingsSectionProps) {
  return (
    <SettingsSection
      id="quote-settings"
      icon={FilePlus}
      title="Quote Settings"
      description="Configure settings that are unique to quotes only."
      onSubmit={onSave}
      isSaving={isSaving}
      hasUnsavedChanges={hasUnsavedChanges}
      saveButtonText="Save Quote Settings"
    >
      <SettingsInput
        label="Quote Title"
        name="quoteTitle"
        placeholder="QUOTE"
        defaultValue="QUOTE"
        helperText="The title text that appears at the top of quotes"
        onChange={onMarkChanged}
      />

      <SettingsGrid columns={2}>
        <SettingsInput
          label="Quote Prefix"
          name="quotePrefix"
          placeholder="Q"
          defaultValue="Q"
          helperText="Example: Q-001, Q-002"
          onChange={onMarkChanged}
        />
        <SettingsInput
          label="Next Quote Number"
          name="quoteNextNumber"
          type="number"
          placeholder="1"
          defaultValue="1"
          min="1"
          helperText="Auto-increments with each quote"
          onChange={onMarkChanged}
        />
      </SettingsGrid>

      <SettingsInput
        label="Default Validity Period (Days)"
        name="quoteValidityDays"
        type="number"
        placeholder="30"
        defaultValue="30"
        min="1"
        helperText="How long quotes remain valid by default"
        onChange={onMarkChanged}
      />

      <SettingsTextarea
        label="Quote Terms & Conditions"
        name="quoteDefaultTerms"
        placeholder="Enter default terms and conditions for quotes..."
        rows={4}
        onChange={onMarkChanged}
      />

      <SettingsTextarea
        label="Quote Notes (Optional)"
        name="quoteDefaultNotes"
        placeholder="Enter additional notes for quotes..."
        rows={4}
        onChange={onMarkChanged}
      />
    </SettingsSection>
  );
}
