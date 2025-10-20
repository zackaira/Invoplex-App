import { FilePlus } from "lucide-react";
import {
  SettingsSection,
  SettingsInput,
  SettingsTextarea,
  SettingsGrid,
  SettingsSwitch,
} from "@/app/components/settings";
import type { ValidationError } from "@/lib/validation";

interface QuoteSettingsSectionProps {
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  onSave: (e: React.FormEvent<HTMLFormElement>) => void;
  onMarkChanged: () => void;
  removeQuotePoweredBy: boolean;
  setRemoveQuotePoweredBy: (value: boolean) => void;
  validationErrors?: ValidationError[];
  initialData?: any;
}

export function QuoteSettingsSection({
  isSaving,
  hasUnsavedChanges,
  onSave,
  onMarkChanged,
  removeQuotePoweredBy,
  setRemoveQuotePoweredBy,
  validationErrors,
  initialData,
}: QuoteSettingsSectionProps) {
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
        defaultValue={initialData?.quoteTitle || "QUOTE"}
        helperText="The title text that appears at the top of quotes"
        onChange={onMarkChanged}
        error={getFieldError("quoteTitle")}
      />

      <SettingsGrid columns={2}>
        <SettingsInput
          label="Quote Prefix"
          name="quotePrefix"
          placeholder="Q"
          defaultValue={initialData?.quotePrefix || "Q"}
          helperText="Example: Q-001, Q-002"
          onChange={onMarkChanged}
          error={getFieldError("quotePrefix")}
        />
        <SettingsInput
          label="Next Quote Number"
          name="quoteNextNumber"
          type="number"
          placeholder="1"
          defaultValue={initialData?.quoteNextNumber?.toString() || "1"}
          min="1"
          helperText="Auto-increments with each quote"
          onChange={onMarkChanged}
          error={getFieldError("quoteNextNumber")}
        />
      </SettingsGrid>

      <SettingsInput
        label="Default Validity Period (Days)"
        name="quoteValidityDays"
        type="number"
        placeholder="30"
        defaultValue={initialData?.quoteValidityDays?.toString() || "30"}
        min="1"
        helperText="How long quotes remain valid by default"
        onChange={onMarkChanged}
        error={getFieldError("quoteValidityDays")}
      />

      <SettingsTextarea
        label="Quote Terms & Conditions"
        name="quoteDefaultTerms"
        placeholder="Enter default terms and conditions for quotes..."
        rows={4}
        onChange={onMarkChanged}
        error={getFieldError("quoteDefaultTerms")}
        defaultValue={initialData?.quoteDefaultTerms || ""}
      />

      <SettingsTextarea
        label="Quote Notes (Optional)"
        name="quoteDefaultNotes"
        placeholder="Enter additional notes for quotes..."
        rows={4}
        onChange={onMarkChanged}
        error={getFieldError("quoteDefaultNotes")}
        defaultValue={initialData?.quoteDefaultNotes || ""}
      />

      <SettingsSwitch
        label="Remove Powered by Invoplex"
        helperText="Remove the Powered by Invoplex text from the quote footer"
        checked={removeQuotePoweredBy}
        onCheckedChange={(checked) => {
          setRemoveQuotePoweredBy(checked);
          onMarkChanged();
        }}
        name="removeQuotePoweredBy"
      />
    </SettingsSection>
  );
}
