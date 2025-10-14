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
import { SettingsInput, SettingsPhoneInput } from "@/app/components/settings";

export interface AddClientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (client: {
    company: string;
    contactName: string;
    email: string;
    phone: string;
  }) => void;
}

export function AddClientModal({
  open,
  onOpenChange,
  onSubmit,
}: AddClientModalProps) {
  const [company, setCompany] = React.useState("");
  const [contactName, setContactName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");

  // Reset form when modal closes
  React.useEffect(() => {
    if (!open) {
      setCompany("");
      setContactName("");
      setEmail("");
      setPhone("");
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !contactName.trim() || !email.trim()) return;

    onSubmit?.({
      company: company.trim(),
      contactName: contactName.trim(),
      email: email.trim(),
      phone: phone.trim(),
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
            <DialogDescription>
              Add a new client to your database.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <SettingsInput
              label="Company"
              id="client-company"
              placeholder="Enter company name"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
              autoFocus
            />

            <SettingsInput
              label="Contact Name"
              id="client-contact-name"
              placeholder="Enter contact name"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              required
            />

            <SettingsInput
              label="Email"
              id="client-email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <SettingsPhoneInput
              label="Phone"
              id="client-phone"
              placeholder="+1 (555) 123-4567"
              value={phone}
              onChange={(value) => setPhone(value)}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!company.trim() || !contactName.trim() || !email.trim()}
            >
              Add Client
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
