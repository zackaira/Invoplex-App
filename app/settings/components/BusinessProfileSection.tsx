import { Building2, InfoIcon, Lock, LockOpen } from "lucide-react";
import { useState } from "react";
import {
  SettingsSection,
  SettingsInput,
  SettingsPhoneInput,
  SettingsCombobox,
  SettingsGrid,
} from "@/app/components/settings";
import { InputGroupButton } from "@/components/ui/input-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getCountryOptions } from "@/lib/data-utils";

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
  const [isEmailLocked, setIsEmailLocked] = useState(true);
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
        required
        onChange={onMarkChanged}
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
              <p>Enter your personal name to be added to Quotes and Invoices</p>
            </TooltipContent>
          </Tooltip>,
        ]}
        helperText="Enter your name to be added to Quotes and Invoices"
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
          required
          disabled={isEmailLocked}
          onChange={onMarkChanged}
          autoComplete="email"
          endAddons={[
            <Tooltip key="email-lock">
              <TooltipTrigger asChild>
                <InputGroupButton
                  variant="ghost"
                  size="icon-xs"
                  aria-label={isEmailLocked ? "Unlock email" : "Lock email"}
                  type="button"
                  onClick={() => setIsEmailLocked(!isEmailLocked)}
                >
                  {isEmailLocked ? (
                    <Lock className="size-4" />
                  ) : (
                    <LockOpen className="size-4" />
                  )}
                </InputGroupButton>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {isEmailLocked
                    ? "Click to unlock and edit email"
                    : "Click to lock email"}
                </p>
              </TooltipContent>
            </Tooltip>,
          ]}
        />
      </SettingsGrid>

      <SettingsGrid columns={2}>
        <SettingsPhoneInput
          label="Phone"
          name="phone"
          placeholder="+1 (555) 123-4567"
          onChange={(value, isValid) => {
            onMarkChanged();
            // You can add additional validation logic here if needed
            console.log("Phone value:", value, "Is valid:", isValid);
          }}
          required
          autoComplete="tel"
          helperText="Enter phone number with country code (e.g., +1 for US)"
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
        label="Address Line 1"
        name="address"
        placeholder="123 Main Street"
        onChange={onMarkChanged}
        autoComplete="address-line1"
      />

      <SettingsInput
        label="Address Line 2"
        name="address2"
        placeholder="Suite 100"
        onChange={onMarkChanged}
        autoComplete="address-line2"
      />

      <SettingsInput
        label="Address Line 3"
        name="address3"
        placeholder="Building B"
        onChange={onMarkChanged}
        autoComplete="address-line3"
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
        <SettingsCombobox
          label="Country"
          name="country"
          options={getCountryOptions()}
          onValueChange={onMarkChanged}
          placeholder="Select country..."
          searchPlaceholder="Search country..."
          required
        />
      </SettingsGrid>
    </SettingsSection>
  );
}
