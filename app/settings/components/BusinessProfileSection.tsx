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
import type { ValidationError } from "@/lib/validation";

interface BusinessProfileSectionProps {
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  onSave: (e: React.FormEvent<HTMLFormElement>) => void;
  onMarkChanged: () => void;
  validationErrors?: ValidationError[];
  initialData?: {
    businessName?: string;
    personalName?: string;
    email?: string;
    phone?: string;
    website?: string;
    taxId?: string;
    address?: string;
    address2?: string;
    address3?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
}

export function BusinessProfileSection({
  isSaving,
  hasUnsavedChanges,
  onSave,
  onMarkChanged,
  validationErrors,
  initialData,
}: BusinessProfileSectionProps) {
  const [isEmailLocked, setIsEmailLocked] = useState(true);

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
        error={getFieldError("personalName")}
        defaultValue={initialData?.personalName || ""}
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
          error={getFieldError("businessName")}
          defaultValue={initialData?.businessName || ""}
        />
        <SettingsInput
          label="Email"
          name="email"
          type="email"
          placeholder="contact@acme.com"
          required
          readOnly={isEmailLocked}
          onChange={onMarkChanged}
          autoComplete="email"
          error={getFieldError("email")}
          defaultValue={initialData?.email || ""}
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
          error={getFieldError("phone")}
          defaultValue={initialData?.phone || ""}
        />
        <SettingsInput
          label="Website"
          name="website"
          placeholder="acme.com"
          onChange={onMarkChanged}
          startAddon="https://"
          error={getFieldError("website")}
          defaultValue={initialData?.website?.replace("https://www.", "") || ""}
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
        error={getFieldError("address")}
        defaultValue={initialData?.address || ""}
      />

      <SettingsInput
        label="Address Line 2"
        name="address2"
        placeholder="Suite 100"
        onChange={onMarkChanged}
        autoComplete="address-line2"
        error={getFieldError("address2")}
        defaultValue={initialData?.address2 || ""}
      />

      <SettingsInput
        label="Address Line 3"
        name="address3"
        placeholder="Building B"
        onChange={onMarkChanged}
        autoComplete="address-line3"
        error={getFieldError("address3")}
        defaultValue={initialData?.address3 || ""}
      />

      <SettingsGrid columns={2}>
        <SettingsInput
          label="City"
          name="city"
          placeholder="San Francisco"
          onChange={onMarkChanged}
          error={getFieldError("city")}
          defaultValue={initialData?.city || ""}
        />
        <SettingsInput
          label="State / Province"
          name="state"
          placeholder="CA"
          onChange={onMarkChanged}
          error={getFieldError("state")}
          defaultValue={initialData?.state || ""}
        />
      </SettingsGrid>

      <SettingsGrid columns={2}>
        <SettingsInput
          label="ZIP / Postal Code"
          name="zipCode"
          placeholder="94102"
          onChange={onMarkChanged}
          error={getFieldError("zipCode")}
          defaultValue={initialData?.zipCode || ""}
        />
        <SettingsCombobox
          label="Country"
          name="country"
          options={getCountryOptions()}
          onValueChange={onMarkChanged}
          placeholder="Select country..."
          searchPlaceholder="Search country..."
          required
          error={getFieldError("country")}
          defaultValue={initialData?.country || ""}
        />
      </SettingsGrid>
    </SettingsSection>
  );
}
