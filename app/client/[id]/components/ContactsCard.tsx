"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Plus, Star, Pencil, Trash2, Copy } from "lucide-react";
import { AddContactModal } from "./AddContactModal";
import { toast } from "sonner";
import {
  createContact,
  updateContact,
  deleteContact,
  setPrimaryContact,
} from "@/lib/actions";
import { useRouter } from "next/navigation";
import { TooltipWrapper } from "@/app/components/ui/TooltipWrapper";
import { CopyIcon } from "@/app/components/ui/CopyIcon";
import { ScrollArea } from "@/components/ui/scroll-area";

type Contact = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  position: string | null;
  isPrimary: boolean;
};

type ContactsCardProps = {
  contacts: Contact[];
  clientId: string;
};

export function ContactsCard({ contacts, clientId }: ContactsCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleAddContact = () => {
    setEditingContact(null);
    setIsModalOpen(true);
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setIsModalOpen(true);
  };

  const handleSubmitContact = async (contactData: {
    id?: string;
    name: string;
    email: string;
    phone: string;
    position: string;
    isPrimary: boolean;
  }) => {
    startTransition(async () => {
      try {
        if (contactData.id) {
          // Update existing contact
          await updateContact(contactData.id, {
            name: contactData.name,
            email: contactData.email || null,
            phone: contactData.phone || null,
            position: contactData.position || null,
            isPrimary: contactData.isPrimary,
          });
          toast.success("Contact updated successfully");
        } else {
          // Create new contact
          await createContact({
            clientId,
            name: contactData.name,
            email: contactData.email || null,
            phone: contactData.phone || null,
            position: contactData.position || null,
            isPrimary: contactData.isPrimary,
          });
          toast.success("Contact added successfully");
        }
        router.refresh();
      } catch (error) {
        toast.error(
          contactData.id ? "Failed to update contact" : "Failed to add contact"
        );
        console.error("Error submitting contact:", error);
      }
    });
  };

  const handleDeleteContact = async (
    contactId: string,
    contactName: string
  ) => {
    if (!confirm(`Are you sure you want to delete ${contactName}?`)) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteContact(contactId);
        toast.success("Contact deleted successfully");
        router.refresh();
      } catch (error) {
        toast.error("Failed to delete contact");
        console.error("Error deleting contact:", error);
      }
    });
  };

  const handleSetPrimary = async (contactId: string) => {
    startTransition(async () => {
      try {
        await setPrimaryContact(contactId);
        toast.success("Primary contact updated");
        router.refresh();
      } catch (error) {
        toast.error("Failed to set primary contact");
        console.error("Error setting primary contact:", error);
      }
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Contacts</CardTitle>
            <Button size="sm" variant="outline" onClick={handleAddContact}>
              <Plus className="h-4 w-4 mr-1" />
              Add Contact
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {contacts.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No contacts added yet
            </p>
          ) : (
            <ScrollArea className="h-[338px] w-full rounded-md">
              <div className="pr-2 space-y-2">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="pb-4 border-b last:border-b-0 last:pb-0 group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="mt-2 flex-1">
                        <div className="font-medium flex items-center gap-2">
                          {contact.name}

                          {contact.position && (
                            <span className="text-sm text-muted-foreground">
                              ({contact.position})
                            </span>
                          )}

                          {contact.isPrimary && (
                            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full dark:bg-blue-900 dark:text-blue-100">
                              Primary
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!contact.isPrimary && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleSetPrimary(contact.id)}
                            className="h-8 px-2"
                            title="Set as primary contact"
                            disabled={isPending}
                          >
                            <Star className="h-4 w-4 text-gray-400 hover:text-yellow-500" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditContact(contact)}
                          className="h-8 px-2"
                          title="Edit contact"
                          disabled={isPending}
                        >
                          <Pencil className="h-4 w-4 text-gray-400 hover:text-blue-500" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            handleDeleteContact(contact.id, contact.name)
                          }
                          className="h-8 px-2"
                          title="Delete contact"
                          disabled={isPending}
                        >
                          <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      {contact.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                          <a
                            href={`mailto:${contact.email}`}
                            className="text-blue-600 hover:underline"
                          >
                            {contact.email}
                          </a>

                          <CopyIcon value={contact.email || ""} />
                        </div>
                      )}
                      {contact.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                          <a
                            href={`tel:${contact.phone}`}
                            className="text-blue-600 hover:underline"
                          >
                            {contact.phone}
                          </a>

                          <CopyIcon value={contact.phone || ""} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      <AddContactModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingContact(null);
        }}
        clientId={clientId}
        contact={editingContact}
        hasNoContacts={contacts.length === 0}
        onSubmit={handleSubmitContact}
      />
    </>
  );
}
