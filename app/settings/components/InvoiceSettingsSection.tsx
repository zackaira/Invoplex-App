import { Receipt } from "lucide-react";
import {
  SettingsSection,
  SettingsInput,
  SettingsTextarea,
  SettingsGrid,
} from "@/app/components/settings";

interface InvoiceSettingsSectionProps {
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  onSave: (e: React.FormEvent<HTMLFormElement>) => void;
  onMarkChanged: () => void;
}

export function InvoiceSettingsSection({
  isSaving,
  hasUnsavedChanges,
  onSave,
  onMarkChanged,
}: InvoiceSettingsSectionProps) {
  return (
    <SettingsSection
      id="invoice-settings"
      icon={Receipt}
      title="Invoice-Specific Settings"
      description="Configure settings that are unique to invoices only."
      onSubmit={onSave}
      isSaving={isSaving}
      hasUnsavedChanges={hasUnsavedChanges}
      saveButtonText="Save Invoice Settings"
    >
      <SettingsInput
        label="Invoice Title"
        name="invoiceTitle"
        placeholder="INVOICE"
        defaultValue="INVOICE"
        helperText="The title text that appears at the top of invoices"
        onChange={onMarkChanged}
      />

      <SettingsGrid columns={2}>
        <SettingsInput
          label="Invoice Prefix"
          name="invoicePrefix"
          placeholder="INV"
          defaultValue="INV"
          helperText="Example: INV-001, INV-002"
          onChange={onMarkChanged}
        />
        <SettingsInput
          label="Next Invoice Number"
          name="invoiceNextNumber"
          type="number"
          placeholder="1"
          defaultValue="1"
          min="1"
          helperText="Auto-increments with each invoice"
          onChange={onMarkChanged}
        />
      </SettingsGrid>

      <SettingsInput
        label="Default Payment Terms (Days)"
        name="invoiceDefaultDueDays"
        type="number"
        placeholder="30"
        defaultValue="30"
        min="1"
        helperText="Default days until invoice payment is due"
        onChange={onMarkChanged}
      />

      <SettingsTextarea
        label="Invoice Terms & Conditions"
        name="invoiceDefaultTerms"
        placeholder="Enter default terms and conditions for invoices..."
        rows={4}
        onChange={onMarkChanged}
      />

      <SettingsTextarea
        label="Invoice Notes (Optional)"
        name="invoiceDefaultNotes"
        placeholder="Enter additional notes for invoices..."
        rows={3}
        onChange={onMarkChanged}
      />

      {/* Bank Details Section */}
      <div className="space-y-4 pt-4 border-t">
        <div>
          <h4 className="text-sm font-semibold mb-1">Bank Details</h4>
          <p className="text-xs text-muted-foreground">
            These details will appear on invoices for payment instructions
          </p>
        </div>

        <SettingsGrid columns={2}>
          <SettingsInput
            label="Bank Name"
            name="bankName"
            placeholder="Chase Bank"
            onChange={onMarkChanged}
          />
          <SettingsInput
            label="Account Name"
            name="accountName"
            placeholder="Business Account Name"
            onChange={onMarkChanged}
          />
        </SettingsGrid>

        <SettingsGrid columns={2}>
          <SettingsInput
            label="Account Number"
            name="accountNumber"
            placeholder="123456789"
            onChange={onMarkChanged}
          />
          <SettingsInput
            label="Routing Number / Sort Code"
            name="routingNumber"
            placeholder="021000021"
            onChange={onMarkChanged}
          />
        </SettingsGrid>

        <SettingsGrid columns={2}>
          <SettingsInput
            label="IBAN (International)"
            name="iban"
            placeholder="GB29 NWBK 6016 1331 9268 19"
            onChange={onMarkChanged}
          />
          <SettingsInput
            label="SWIFT / BIC Code"
            name="swiftCode"
            placeholder="CHASUS33"
            onChange={onMarkChanged}
          />
        </SettingsGrid>
      </div>
    </SettingsSection>
  );
}
