"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SettingsSwitch } from "@/app/components/settings";
import { TooltipWrapper } from "../../ui/TooltipWrapper";

export interface BusinessInfoVisibility {
  businessName: boolean;
  personalName: boolean;
  email: boolean;
  phone: boolean;
  website: boolean;
  taxId: boolean;
  address: boolean;
}

export interface BusinessInfoVisibilityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  visibility: BusinessInfoVisibility;
  onVisibilityChange: (visibility: BusinessInfoVisibility) => void;
  onSaveAsDefault?: (visibility: BusinessInfoVisibility) => void;
  businessSettings?: {
    businessName?: string;
    personalName?: string | null;
    email?: string | null;
    phone?: string | null;
    website?: string | null;
    taxId?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    zipCode?: string | null;
    country?: string | null;
  };
}

export function BusinessInfoVisibilityModal({
  open,
  onOpenChange,
  visibility,
  onVisibilityChange,
  onSaveAsDefault,
  businessSettings,
}: BusinessInfoVisibilityModalProps) {
  const [localVisibility, setLocalVisibility] =
    React.useState<BusinessInfoVisibility>(visibility);

  // Update local state when visibility prop changes
  React.useEffect(() => {
    setLocalVisibility(visibility);
  }, [visibility]);

  // Check if any business fields are available
  const hasAnyFields =
    businessSettings?.businessName ||
    businessSettings?.personalName ||
    businessSettings?.email ||
    businessSettings?.phone ||
    businessSettings?.website ||
    businessSettings?.taxId ||
    businessSettings?.address ||
    businessSettings?.city ||
    businessSettings?.state ||
    businessSettings?.zipCode ||
    businessSettings?.country;

  const handleToggle = (field: keyof BusinessInfoVisibility) => {
    setLocalVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleApply = () => {
    onVisibilityChange(localVisibility);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setLocalVisibility(visibility); // Reset to original values
    onOpenChange(false);
  };

  const handleSaveAsDefault = () => {
    if (onSaveAsDefault) {
      onSaveAsDefault(localVisibility);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Business Information Display</DialogTitle>
          <DialogDescription>
            Choose which information to display on your documents.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-6">
          {!hasAnyFields && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No business information has been added yet. Add your business
              details in Settings to customize what appears on your documents.
            </p>
          )}

          {businessSettings?.businessName && (
            <SettingsSwitch
              label="Business Name"
              checked={localVisibility.businessName}
              onCheckedChange={() => handleToggle("businessName")}
            />
          )}

          {businessSettings?.personalName && (
            <SettingsSwitch
              label="Personal Name"
              checked={localVisibility.personalName}
              onCheckedChange={() => handleToggle("personalName")}
            />
          )}

          {businessSettings?.email && (
            <SettingsSwitch
              label="Email"
              checked={localVisibility.email}
              onCheckedChange={() => handleToggle("email")}
            />
          )}

          {businessSettings?.phone && (
            <SettingsSwitch
              label="Phone"
              checked={localVisibility.phone}
              onCheckedChange={() => handleToggle("phone")}
            />
          )}

          {businessSettings?.website && (
            <SettingsSwitch
              label="Website"
              checked={localVisibility.website}
              onCheckedChange={() => handleToggle("website")}
            />
          )}

          {businessSettings?.taxId && (
            <SettingsSwitch
              label="Tax ID / VAT Number"
              checked={localVisibility.taxId}
              onCheckedChange={() => handleToggle("taxId")}
            />
          )}

          {(businessSettings?.address ||
            businessSettings?.city ||
            businessSettings?.state ||
            businessSettings?.zipCode ||
            businessSettings?.country) && (
            <SettingsSwitch
              label="Full Address"
              checked={localVisibility.address}
              onCheckedChange={() => handleToggle("address")}
            />
          )}
        </div>

        <DialogFooter>
          <div className="flex w-full flex-row justify-between items-center">
            <TooltipWrapper tooltip="Save this display as default for all new quotes">
              <Button
                type="button"
                variant="ghost"
                className="text-xs text-gray-500"
                onClick={handleSaveAsDefault}
              >
                Save Display
              </Button>
            </TooltipWrapper>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="button" onClick={handleApply}>
                Apply
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
