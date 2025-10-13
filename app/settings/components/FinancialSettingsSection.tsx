import { Receipt } from "lucide-react";
import {
  SettingsSection,
  SettingsInput,
  SettingsCombobox,
  SettingsGrid,
  SettingsSwitch,
} from "@/app/components/settings";
import {
  getCurrencyOptions,
  getFiscalYearMonthOptions,
  getFiscalYearDayOptions,
} from "@/lib/data-utils";

interface FinancialSettingsSectionProps {
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  onSave: (e: React.FormEvent<HTMLFormElement>) => void;
  onMarkChanged: () => void;
  showFinancialSettings: boolean;
  setShowFinancialSettings: (value: boolean) => void;
}

export function FinancialSettingsSection({
  isSaving,
  hasUnsavedChanges,
  onSave,
  onMarkChanged,
  showFinancialSettings,
  setShowFinancialSettings,
}: FinancialSettingsSectionProps) {
  return (
    <SettingsSection
      id="financial-settings"
      icon={Receipt}
      title="Financial Settings"
      description="Configure your currency and fiscal year start date preferences."
      onSubmit={onSave}
      isSaving={isSaving}
      hasUnsavedChanges={hasUnsavedChanges}
      saveButtonText="Save Financial Settings"
    >
      <SettingsCombobox
        label="Default Currency"
        name="defaultCurrency"
        defaultValue="USD"
        options={getCurrencyOptions()}
        onValueChange={onMarkChanged}
        placeholder="Select currency..."
        searchPlaceholder="Search currency..."
        required
      />

      <SettingsGrid columns={2}>
        <SettingsCombobox
          label="Fiscal Year Start Month"
          name="fiscalYearStartMonth"
          defaultValue="3"
          options={getFiscalYearMonthOptions()}
          onValueChange={onMarkChanged}
          placeholder="Select month..."
          searchPlaceholder="Search month..."
          helperText="Month when your fiscal/tax year begins"
        />
        <SettingsCombobox
          label="Fiscal Year Start Day"
          name="fiscalYearStartDay"
          defaultValue="1"
          options={getFiscalYearDayOptions()}
          onValueChange={onMarkChanged}
          placeholder="Select day..."
          searchPlaceholder="Search day..."
          helperText="Day when your fiscal/tax year begins"
        />
      </SettingsGrid>

      <SettingsInput
        label="Tax ID / VAT Number"
        name="taxId"
        placeholder="12-3456789"
        onChange={onMarkChanged}
        required
      />

      <div className="flex items-start justify-between gap-4 pb-4 pt-8 mt-8 border-t">
        <div className="flex-1">
          <h4 className="text-sm font-semibold mb-1">Taxes</h4>
          <p className="text-xs text-muted-foreground">
            {showFinancialSettings
              ? "Configure tax ID and default tax rates for Quotes and Invoices"
              : "Enable and configure tax for Quotes and Invoices"}
          </p>
        </div>
        <SettingsSwitch
          label="Enable Tax Settings"
          checked={showFinancialSettings}
          onCheckedChange={setShowFinancialSettings}
          name="showTaxSettings"
        />
      </div>

      {showFinancialSettings && (
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
      )}
    </SettingsSection>
  );
}
