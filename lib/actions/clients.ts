"use server";

import { prisma } from "@/lib/prisma";

/**
 * Client Actions
 *
 * Server actions for managing clients and their data
 */

/**
 * Creates a new client along with a primary contact
 * This ensures the client always has at least one contact
 */
export const createClientWithContact = async (data: {
  userId: string;
  clientName: string;
  contactName: string;
  email: string;
  phone?: string;
}) => {
  // Create the client first
  const client = await prisma.client.create({
    data: {
      userId: data.userId,
      name: data.clientName,
      email: data.email,
      phone: data.phone || null,
    },
  });

  // Create the primary contact
  const contact = await prisma.contact.create({
    data: {
      clientId: client.id,
      name: data.contactName,
      email: data.email,
      phone: data.phone || null,
      isPrimary: true,
    },
  });

  return {
    client,
    contact,
  };
};

export const getClientsByUserId = async (userId: string) => {
  const clients = await prisma.client.findMany({
    where: {
      userId,
    },
    include: {
      contacts: {
        where: {
          isPrimary: true,
        },
        take: 1,
      },
    },
  });

  if (!clients) return null;

  return clients;
};

export const getClientsWithOutstanding = async (userId: string) => {
  const clients = await prisma.client.findMany({
    where: {
      userId,
    },
    include: {
      documents: {
        where: {
          type: "INVOICE",
          status: {
            in: ["SENT", "OVERDUE", "PARTIAL"],
          },
        },
        select: {
          amountDue: true,
          currency: true,
        },
      },
    },
  });

  if (!clients) return null;

  // Calculate outstanding amount for each client
  return clients.map((client) => {
    const outstanding = client.documents.reduce((sum, doc) => {
      return sum + Number(doc.amountDue);
    }, 0);

    return {
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      currency: client.currency,
      outstanding,
      createdAt: client.createdAt,
    };
  });
};

export const getClientById = async (clientId: string) => {
  const client = await prisma.client.findUnique({
    where: {
      id: clientId,
    },
    include: {
      contacts: {
        orderBy: {
          isPrimary: "desc",
        },
      },
      documents: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          contact: true,
        },
      },
    },
  });

  if (!client) return null;

  // Calculate paid to date and outstanding
  const invoices = client.documents.filter((doc) => doc.type === "INVOICE");
  const paidToDate = invoices.reduce((sum, invoice) => {
    return sum + Number(invoice.amountPaid);
  }, 0);
  const outstanding = invoices.reduce((sum, invoice) => {
    return sum + Number(invoice.amountDue);
  }, 0);

  return {
    ...client,
    documents: client.documents.map((doc) => ({
      ...doc,
      subtotal: doc.subtotal.toString(),
      taxRate: doc.taxRate.toString(),
      taxAmount: doc.taxAmount.toString(),
      discount: doc.discount.toString(),
      total: doc.total.toString(),
      amountPaid: doc.amountPaid.toString(),
      amountDue: doc.amountDue.toString(),
    })),
    paidToDate,
    outstanding,
  };
};

// ============================================
// CONTACT MANAGEMENT
// ============================================

export const createContact = async (data: {
  clientId: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  position?: string | null;
  isPrimary?: boolean;
}) => {
  // If setting as primary, unset other primary contacts for this client
  if (data.isPrimary) {
    await prisma.contact.updateMany({
      where: {
        clientId: data.clientId,
        isPrimary: true,
      },
      data: {
        isPrimary: false,
      },
    });
  }

  const contact = await prisma.contact.create({
    data: {
      clientId: data.clientId,
      name: data.name,
      email: data.email || null,
      phone: data.phone || null,
      position: data.position || null,
      isPrimary: data.isPrimary ?? false,
    },
  });

  // If this is the primary contact, sync its email/phone to the client
  if (data.isPrimary) {
    await prisma.client.update({
      where: { id: data.clientId },
      data: {
        email: data.email || null,
        phone: data.phone || null,
      },
    });
  }

  return contact;
};

export const updateContact = async (
  contactId: string,
  data: {
    name?: string;
    email?: string | null;
    phone?: string | null;
    position?: string | null;
    isPrimary?: boolean;
  }
) => {
  // Get the contact to find its clientId
  const existingContact = await prisma.contact.findUnique({
    where: { id: contactId },
    select: { clientId: true },
  });

  if (!existingContact) {
    throw new Error("Contact not found");
  }

  // If setting as primary, unset other primary contacts for this client
  if (data.isPrimary) {
    await prisma.contact.updateMany({
      where: {
        clientId: existingContact.clientId,
        isPrimary: true,
        NOT: {
          id: contactId,
        },
      },
      data: {
        isPrimary: false,
      },
    });
  }

  const contact = await prisma.contact.update({
    where: {
      id: contactId,
    },
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      position: data.position,
      isPrimary: data.isPrimary,
    },
  });

  // If this contact is being set as primary, sync its email/phone to the client
  if (data.isPrimary) {
    await prisma.client.update({
      where: { id: existingContact.clientId },
      data: {
        email: contact.email,
        phone: contact.phone,
      },
    });
  }

  return contact;
};

export const deleteContact = async (contactId: string) => {
  // Get the contact to check if it's primary and get clientId
  const contact = await prisma.contact.findUnique({
    where: { id: contactId },
    select: { clientId: true, isPrimary: true },
  });

  if (!contact) {
    throw new Error("Contact not found");
  }

  // Delete the contact
  await prisma.contact.delete({
    where: {
      id: contactId,
    },
  });

  // If the deleted contact was primary, find another contact to make primary
  // or clear the client's email/phone if no other contacts exist
  if (contact.isPrimary) {
    const remainingContacts = await prisma.contact.findMany({
      where: {
        clientId: contact.clientId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (remainingContacts.length > 0) {
      // Make the oldest remaining contact primary
      const newPrimaryContact = remainingContacts[0];
      await prisma.contact.update({
        where: { id: newPrimaryContact.id },
        data: { isPrimary: true },
      });

      // Sync the new primary contact's email/phone to the client
      await prisma.client.update({
        where: { id: contact.clientId },
        data: {
          email: newPrimaryContact.email,
          phone: newPrimaryContact.phone,
        },
      });
    } else {
      // No remaining contacts, clear the client's email/phone
      await prisma.client.update({
        where: { id: contact.clientId },
        data: {
          email: null,
          phone: null,
        },
      });
    }
  }

  return { success: true };
};

export const setPrimaryContact = async (contactId: string) => {
  // Get the contact to find its clientId
  const contact = await prisma.contact.findUnique({
    where: { id: contactId },
    select: { clientId: true, email: true, phone: true },
  });

  if (!contact) {
    throw new Error("Contact not found");
  }

  // Unset all primary contacts for this client
  await prisma.contact.updateMany({
    where: {
      clientId: contact.clientId,
      isPrimary: true,
    },
    data: {
      isPrimary: false,
    },
  });

  // Set this contact as primary
  const updatedContact = await prisma.contact.update({
    where: {
      id: contactId,
    },
    data: {
      isPrimary: true,
    },
  });

  // Sync the primary contact's email/phone to the client
  await prisma.client.update({
    where: { id: contact.clientId },
    data: {
      email: contact.email,
      phone: contact.phone,
    },
  });

  return updatedContact;
};

// ============================================
// CLIENT MANAGEMENT
// ============================================

/**
 * Updates a client and its primary contact
 */
export const updateClient = async (
  clientId: string,
  data: {
    // Client details
    name: string;
    website?: string | null;
    currency?: string;
    taxId?: string | null;

    // Address
    address?: string | null;
    city?: string | null;
    state?: string | null;
    zipCode?: string | null;
    country?: string | null;

    // Primary contact details
    primaryContactName: string;
    primaryContactEmail: string;
    primaryContactPhone?: string | null;
    primaryContactPosition?: string | null;
  }
) => {
  // Get the primary contact for this client
  const primaryContact = await prisma.contact.findFirst({
    where: {
      clientId,
      isPrimary: true,
    },
  });

  if (!primaryContact) {
    throw new Error("Primary contact not found");
  }

  // Update the client
  const client = await prisma.client.update({
    where: { id: clientId },
    data: {
      name: data.name,
      email: data.primaryContactEmail,
      phone: data.primaryContactPhone || null,
      website: data.website || null,
      currency: data.currency,
      taxId: data.taxId || null,
      address: data.address || null,
      city: data.city || null,
      state: data.state || null,
      zipCode: data.zipCode || null,
      country: data.country || null,
    },
  });

  // Update the primary contact
  const contact = await prisma.contact.update({
    where: { id: primaryContact.id },
    data: {
      name: data.primaryContactName,
      email: data.primaryContactEmail,
      phone: data.primaryContactPhone || null,
      position: data.primaryContactPosition || null,
    },
  });

  return {
    client,
    contact,
  };
};
