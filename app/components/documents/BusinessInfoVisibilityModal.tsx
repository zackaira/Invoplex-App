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
}

export function BusinessInfoVisibilityModal({
  open,
  onOpenChange,
  visibility,
  onVisibilityChange,
}: BusinessInfoVisibilityModalProps) {
  const [localVisibility, setLocalVisibility] =
    React.useState<BusinessInfoVisibility>(visibility);

  // Update local state when visibility prop changes
  React.useEffect(() => {
    setLocalVisibility(visibility);
  }, [visibility]);

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Business Information Display</DialogTitle>
          <DialogDescription>
            Choose which information to display on your documents.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <SettingsSwitch
            label="Business Name"
            checked={localVisibility.businessName}
            onCheckedChange={() => handleToggle("businessName")}
          />

          <SettingsSwitch
            label="Personal Name"
            checked={localVisibility.personalName}
            onCheckedChange={() => handleToggle("personalName")}
          />

          <SettingsSwitch
            label="Email"
            checked={localVisibility.email}
            onCheckedChange={() => handleToggle("email")}
          />

          <SettingsSwitch
            label="Phone"
            checked={localVisibility.phone}
            onCheckedChange={() => handleToggle("phone")}
          />

          <SettingsSwitch
            label="Website"
            checked={localVisibility.website}
            onCheckedChange={() => handleToggle("website")}
          />

          <SettingsSwitch
            label="Tax ID / VAT Number"
            checked={localVisibility.taxId}
            onCheckedChange={() => handleToggle("taxId")}
          />

          <SettingsSwitch
            label="Full Address"
            checked={localVisibility.address}
            onCheckedChange={() => handleToggle("address")}
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={handleApply}>
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
