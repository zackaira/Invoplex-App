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
import { ClientInfoVisibility } from "../types";

export interface ClientInfoVisibilityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  visibility: ClientInfoVisibility;
  onVisibilityChange: (visibility: ClientInfoVisibility) => void;
}

export function ClientInfoVisibilityModal({
  open,
  onOpenChange,
  visibility,
  onVisibilityChange,
}: ClientInfoVisibilityModalProps) {
  const [localVisibility, setLocalVisibility] =
    React.useState<ClientInfoVisibility>(visibility);

  // Update local state when visibility prop changes
  React.useEffect(() => {
    setLocalVisibility(visibility);
  }, [visibility]);

  const handleToggle = (field: keyof ClientInfoVisibility) => {
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
          <DialogTitle>Client Information Display</DialogTitle>
          <DialogDescription>
            Choose which client information to display on your documents.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <SettingsSwitch
            label="Client Name"
            checked={localVisibility.name}
            onCheckedChange={() => handleToggle("name")}
          />

          <SettingsSwitch
            label="Contact Person"
            checked={localVisibility.contact}
            onCheckedChange={() => handleToggle("contact")}
          />

          <SettingsSwitch
            label="Address"
            checked={localVisibility.address}
            onCheckedChange={() => handleToggle("address")}
          />

          <SettingsSwitch
            label="Email"
            checked={localVisibility.email}
            onCheckedChange={() => handleToggle("email")}
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
