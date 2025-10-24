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
import { TooltipWrapper } from "@/app/components/ui/TooltipWrapper";

export interface ClientInfoVisibilityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  visibility: ClientInfoVisibility;
  onVisibilityChange: (visibility: ClientInfoVisibility) => void;
  onSaveAsDefault?: (visibility: ClientInfoVisibility) => void;
  client?: {
    name?: string;
    email?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    zipCode?: string | null;
    country?: string | null;
  };
  contactName?: string | null;
}

export function ClientInfoVisibilityModal({
  open,
  onOpenChange,
  visibility,
  onVisibilityChange,
  onSaveAsDefault,
  client,
  contactName,
}: ClientInfoVisibilityModalProps) {
  const [localVisibility, setLocalVisibility] =
    React.useState<ClientInfoVisibility>(visibility);

  // Update local state when visibility prop changes
  React.useEffect(() => {
    setLocalVisibility(visibility);
  }, [visibility]);

  // Check if any client fields are available
  const hasAnyFields =
    client?.name ||
    contactName ||
    client?.address ||
    client?.city ||
    client?.state ||
    client?.zipCode ||
    client?.country ||
    client?.email;

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

  const handleSaveAsDefault = () => {
    if (onSaveAsDefault) {
      onSaveAsDefault(localVisibility);
    }
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
          {!hasAnyFields && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No client information is available. Select a client to customize
              what information appears on your documents.
            </p>
          )}

          {client?.name && (
            <SettingsSwitch
              label="Client Name"
              checked={localVisibility.name}
              onCheckedChange={() => handleToggle("name")}
            />
          )}

          {contactName && (
            <SettingsSwitch
              label="Contact Person"
              checked={localVisibility.contact}
              onCheckedChange={() => handleToggle("contact")}
            />
          )}

          {(client?.address ||
            client?.city ||
            client?.state ||
            client?.zipCode ||
            client?.country) && (
            <SettingsSwitch
              label="Address"
              checked={localVisibility.address}
              onCheckedChange={() => handleToggle("address")}
            />
          )}

          {client?.email && (
            <SettingsSwitch
              label="Email"
              checked={localVisibility.email}
              onCheckedChange={() => handleToggle("email")}
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
