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
import type { ValidationError } from "@/lib/validation";

interface FinancialSettingsSectionProps {
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  onSave: (e: React.FormEvent<HTMLFormElement>) => void;
  onMarkChanged: () => void;
  showFinancialSettings: boolean;
  setShowFinancialSettings: (value: boolean) => void;
  validationErrors?: ValidationError[];
  initialData?: {
    businessProfile?: any;
    userSettings?: any;
  };
}

export function FinancialSettingsSection({
  isSaving,
  hasUnsavedChanges,
  onSave,
  onMarkChanged,
  showFinancialSettings,
  setShowFinancialSettings,
  validationErrors,
  initialData,
}: FinancialSettingsSectionProps) {
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
        defaultValue={initialData?.userSettings?.defaultCurrency || "USD"}
        options={getCurrencyOptions()}
        onValueChange={onMarkChanged}
        placeholder="Select currency..."
        searchPlaceholder="Search currency..."
        required
        error={getFieldError("defaultCurrency")}
      />

      <SettingsGrid columns={2}>
        <SettingsCombobox
          label="Fiscal Year Start Month"
          name="fiscalYearStartMonth"
          defaultValue={
            initialData?.userSettings?.fiscalYearStartMonth?.toString() || "3"
          }
          options={getFiscalYearMonthOptions()}
          onValueChange={onMarkChanged}
          placeholder="Select month..."
          searchPlaceholder="Search month..."
          helperText="Month when your fiscal/tax year begins"
          error={getFieldError("fiscalYearStartMonth")}
        />
        <SettingsCombobox
          label="Fiscal Year Start Day"
          name="fiscalYearStartDay"
          defaultValue={
            initialData?.userSettings?.fiscalYearStartDay?.toString() || "1"
          }
          options={getFiscalYearDayOptions()}
          onValueChange={onMarkChanged}
          placeholder="Select day..."
          searchPlaceholder="Search day..."
          helperText="Day when your fiscal/tax year begins"
          error={getFieldError("fiscalYearStartDay")}
        />
      </SettingsGrid>

      <SettingsInput
        label="Tax ID / VAT Number"
        name="taxId"
        placeholder="12-3456789"
        onChange={onMarkChanged}
        required
        error={getFieldError("taxId")}
        defaultValue={initialData?.businessProfile?.taxId || ""}
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
          defaultValue={
            initialData?.userSettings?.defaultTaxRate?.toString() || "0.00"
          }
          min="0"
          max="100"
          onChange={onMarkChanged}
          error={getFieldError("defaultTaxRate")}
        />
      )}
    </SettingsSection>
  );
}
