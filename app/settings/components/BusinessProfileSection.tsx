import { Building2, InfoIcon } from "lucide-react";
import {
  SettingsSection,
  SettingsInput,
  SettingsGrid,
} from "@/app/components/settings";
import { InputGroupButton } from "@/components/ui/input-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BusinessProfileSectionProps {
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  onSave: (e: React.FormEvent<HTMLFormElement>) => void;
  onMarkChanged: () => void;
}

export function BusinessProfileSection({
  isSaving,
  hasUnsavedChanges,
  onSave,
  onMarkChanged,
}: BusinessProfileSectionProps) {
  return (
    <SettingsSection
      id="business-profile"
      icon={Building2}
      title="Business Profile"
      description="Your business information that appears on quotes and invoices."
      onSubmit={onSave}
      isSaving={isSaving}
      hasUnsavedChanges={hasUnsavedChanges}
      saveButtonText="Save Business Profile"
    >
      <SettingsInput
        label="Personal Name"
        name="personalName"
        placeholder="John Doe"
        onChange={onMarkChanged}
      />

      <SettingsGrid columns={2}>
        <SettingsInput
          label="Business Name"
          name="businessName"
          placeholder="Acme Corporation"
          required
          onChange={onMarkChanged}
        />
        <SettingsInput
          label="Email"
          name="email"
          type="email"
          placeholder="contact@acme.com"
          onChange={onMarkChanged}
        />
      </SettingsGrid>

      <SettingsGrid columns={2}>
        <SettingsInput
          label="Phone"
          name="phone"
          type="tel"
          placeholder="+1 (555) 123-4567"
          onChange={onMarkChanged}
        />
        <SettingsInput
          label="Website"
          name="website"
          type="url"
          placeholder="acme.com"
          onChange={onMarkChanged}
          startAddon="https://"
          endAddons={[
            <Tooltip key="website-info">
              <TooltipTrigger asChild>
                <InputGroupButton
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Website info"
                  type="button"
                >
                  <InfoIcon className="size-4" />
                </InputGroupButton>
              </TooltipTrigger>
              <TooltipContent>
                <p>Enter your business website URL</p>
              </TooltipContent>
            </Tooltip>,
          ]}
        />
      </SettingsGrid>

      <SettingsInput
        label="Address"
        name="address"
        placeholder="123 Main Street"
        onChange={onMarkChanged}
      />

      <SettingsGrid columns={2}>
        <SettingsInput
          label="City"
          name="city"
          placeholder="San Francisco"
          onChange={onMarkChanged}
        />
        <SettingsInput
          label="State / Province"
          name="state"
          placeholder="CA"
          onChange={onMarkChanged}
        />
      </SettingsGrid>

      <SettingsGrid columns={2}>
        <SettingsInput
          label="ZIP / Postal Code"
          name="zipCode"
          placeholder="94102"
          onChange={onMarkChanged}
        />
        <SettingsInput
          label="Country"
          name="country"
          placeholder="United States"
          onChange={onMarkChanged}
        />
      </SettingsGrid>
    </SettingsSection>
  );
}
