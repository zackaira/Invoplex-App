import { FileCheck } from "lucide-react";
import {
  SettingsSection,
  SettingsInput,
  SettingsSelect,
  SettingsGrid,
} from "@/app/components/settings";

interface TaxSettingsSectionProps {
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  onSave: (e: React.FormEvent<HTMLFormElement>) => void;
  onMarkChanged: () => void;
}

export function TaxSettingsSection({
  isSaving,
  hasUnsavedChanges,
  onSave,
  onMarkChanged,
}: TaxSettingsSectionProps) {
  return (
    <SettingsSection
      id="tax-settings"
      icon={FileCheck}
      title="Tax Settings"
      description="Configure your tax and currency preferences."
      onSubmit={onSave}
      isSaving={isSaving}
      hasUnsavedChanges={hasUnsavedChanges}
      saveButtonText="Save Tax Settings"
    >
      <SettingsGrid columns={3}>
        <SettingsSelect
          label="Default Currency"
          name="defaultCurrency"
          defaultValue="USD"
          options={[
            { value: "USD", label: "USD - US Dollar" },
            { value: "EUR", label: "EUR - Euro" },
            { value: "GBP", label: "GBP - British Pound" },
            { value: "CAD", label: "CAD - Canadian Dollar" },
            { value: "AUD", label: "AUD - Australian Dollar" },
            { value: "JPY", label: "JPY - Japanese Yen" },
            { value: "INR", label: "INR - Indian Rupee" },
            { value: "CNY", label: "CNY - Chinese Yuan" },
          ]}
          onValueChange={onMarkChanged}
        />
        <SettingsInput
          label="Tax ID / VAT Number"
          name="taxId"
          placeholder="12-3456789"
          onChange={onMarkChanged}
        />
        <SettingsInput
          label="Default Tax Rate (%)"
          name="defaultTaxRate"
          type="number"
          step="0.01"
          placeholder="0.00"
          defaultValue="0.00"
          min="0"
          max="100"
          onChange={onMarkChanged}
        />
      </SettingsGrid>
    </SettingsSection>
  );
}
