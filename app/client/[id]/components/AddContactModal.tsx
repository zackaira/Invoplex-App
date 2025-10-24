"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { SettingsInput } from "@/app/components/settings/Input";
import { SettingsPhoneInput } from "@/app/components/settings/PhoneInput";
import { SettingsLabel } from "@/app/components/settings/Label";
import { zodAdapter, contactSchema } from "@/lib/validation";

type Contact = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  position: string | null;
  isPrimary: boolean;
};

type ContactModalProps = {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  contact?: Contact | null; // If provided, we're editing
  hasNoContacts?: boolean; // Auto-set as primary if true
  onSubmit: (contact: {
    id?: string;
    name: string;
    email: string;
    phone: string;
    position: string;
    isPrimary: boolean;
  }) => void;
};

export function AddContactModal({
  isOpen,
  onClose,
  clientId,
  contact,
  hasNoContacts = false,
  onSubmit,
}: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    isPrimary: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate form when editing
  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name,
        email: contact.email || "",
        phone: contact.phone || "",
        position: contact.position || "",
        isPrimary: contact.isPrimary,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        position: "",
        isPrimary: hasNoContacts, // Auto-set as primary if first contact
      });
    }
    // Reset errors when modal opens/closes
    setErrors({});
  }, [contact, isOpen, hasNoContacts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate using Zod schema
    const validation = zodAdapter.validate(contactSchema, formData);

    if (!validation.success) {
      // Convert validation errors to error map
      setErrors(zodAdapter.formatErrors(validation.errors || []));
      return;
    }

    onSubmit({
      ...(contact && { id: contact.id }),
      ...formData,
    });
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      position: "",
      isPrimary: false,
    });
    setErrors({});
    onClose();
  };

  const handleClose = () => {
    // Reset form on close
    setFormData({
      name: "",
      email: "",
      phone: "",
      position: "",
      isPrimary: false,
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{contact ? "Edit Contact" : "Add Contact"}</DialogTitle>
          <DialogDescription>
            {contact
              ? "Update the contact information. Click save when you're done."
              : "Add a new contact for this client. Click save when you're done."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <SettingsInput
              id="name"
              label="Name"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                // Clear error for this field when user types
                if (errors.name) {
                  const { name, ...rest } = errors;
                  setErrors(rest);
                }
              }}
              placeholder="John Doe"
              required
              error={errors.name}
            />

            <SettingsInput
              id="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                // Clear error for this field when user types
                if (errors.email) {
                  const { email, ...rest } = errors;
                  setErrors(rest);
                }
              }}
              placeholder="john@example.com"
              required
              error={errors.email}
            />

            <SettingsPhoneInput
              id="phone"
              label="Phone"
              value={formData.phone}
              onChange={(value) => {
                setFormData({ ...formData, phone: value });
                // Clear error for this field when user types
                if (errors.phone) {
                  const { phone, ...rest } = errors;
                  setErrors(rest);
                }
              }}
              placeholder="+1 (555) 123-4567"
              error={errors.phone}
            />

            <SettingsInput
              id="position"
              label="Position"
              value={formData.position}
              onChange={(e) => {
                setFormData({ ...formData, position: e.target.value });
                // Clear error for this field when user types
                if (errors.position) {
                  const { position, ...rest } = errors;
                  setErrors(rest);
                }
              }}
              placeholder="CEO, Manager, etc."
              error={errors.position}
            />

            <div className="flex items-center justify-between pt-2">
              <div className="space-y-0.5">
                <SettingsLabel label="Primary Contact" htmlFor="isPrimary" />
                <p className="text-sm text-muted-foreground pl-1">
                  Set as the main contact for this client
                </p>
              </div>
              <Switch
                id="isPrimary"
                checked={formData.isPrimary}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isPrimary: checked })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Save Contact</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
