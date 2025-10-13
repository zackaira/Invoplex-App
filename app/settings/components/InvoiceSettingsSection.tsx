import { FileInput } from "lucide-react";
import {
  SettingsSection,
  SettingsInput,
  SettingsTextarea,
  SettingsSwitch,
  SettingsGrid,
} from "@/app/components/settings";

interface InvoiceSettingsSectionProps {
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  onSave: (e: React.FormEvent<HTMLFormElement>) => void;
  onMarkChanged: () => void;
  showBankDetails: boolean;
  setShowBankDetails: (value: boolean) => void;
  removeInvoicePoweredBy: boolean;
  setRemoveInvoicePoweredBy: (value: boolean) => void;
}

export function InvoiceSettingsSection({
  isSaving,
  hasUnsavedChanges,
  onSave,
  onMarkChanged,
  showBankDetails,
  setShowBankDetails,
  removeInvoicePoweredBy,
  setRemoveInvoicePoweredBy,
}: InvoiceSettingsSectionProps) {
  return (
    <SettingsSection
      id="invoice-settings"
      icon={FileInput}
      title="Invoice Settings"
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
        rows={4}
        onChange={onMarkChanged}
      />

      <SettingsSwitch
        label="Remove Powered by Invoplex"
        helperText="Remove the Powered by Invoplex text from the invoice footer"
        checked={removeInvoicePoweredBy}
        onCheckedChange={setRemoveInvoicePoweredBy}
        name="removeInvoicePoweredBy"
      />

      {/* Bank Details Section */}
      <div id="bank-details" className="space-y-4 pt-8 mt-8 border-t">
        <div className="flex items-start justify-between gap-4 pb-4">
          <div className="flex-1">
            <h4 className="text-sm font-semibold mb-1">Bank Details</h4>
            <p className="text-xs text-muted-foreground">
              These details will appear on invoices for payment instructions
            </p>
          </div>
          <SettingsSwitch
            label="Enable Bank Details"
            checked={showBankDetails}
            onCheckedChange={setShowBankDetails}
            name="showBankDetails"
          />
        </div>

        {showBankDetails && (
          <>
            <SettingsGrid columns={2}>
              <SettingsInput
                label="Bank Name"
                name="bankName"
                placeholder="Chase Bank"
                onChange={onMarkChanged}
                required
              />
              <SettingsInput
                label="Account Name"
                name="accountName"
                placeholder="Business Account Name"
                onChange={onMarkChanged}
                required
              />
            </SettingsGrid>

            <SettingsGrid columns={2}>
              <SettingsInput
                label="Account Number"
                name="accountNumber"
                placeholder="123456789"
                onChange={onMarkChanged}
                required
              />
              <SettingsInput
                label="Routing Number / Sort Code"
                name="routingNumber"
                placeholder="021000021"
                onChange={onMarkChanged}
                required
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
          </>
        )}
      </div>
    </SettingsSection>
  );
}
