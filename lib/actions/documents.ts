"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

/**
 * Document Actions
 *
 * Server actions for managing quotes and invoices
 */

// Helper to serialize Decimal objects to strings for client components
function serializeDocument(
  document: {
    subtotal: { toString: () => string };
    taxRate: { toString: () => string };
    taxAmount: { toString: () => string };
    discount: { toString: () => string };
    total: { toString: () => string };
    amountPaid: { toString: () => string } | null;
    amountDue: { toString: () => string } | null;
    items?: Array<{
      quantity: { toString: () => string };
      unitPrice: { toString: () => string };
      amount: { toString: () => string };
      [key: string]: unknown;
    }>;
    payments?: Array<{
      amount: { toString: () => string };
      [key: string]: unknown;
    }>;
    [key: string]: unknown;
  } | null
) {
  if (!document) return null;

  return {
    ...document,
    subtotal: document.subtotal.toString(),
    taxRate: document.taxRate.toString(),
    taxAmount: document.taxAmount.toString(),
    discount: document.discount.toString(),
    total: document.total.toString(),
    amountPaid: document.amountPaid?.toString() ?? "0",
    amountDue: document.amountDue?.toString() ?? "0",
    items: document.items?.map((item) => ({
      ...item,
      quantity: item.quantity.toString(),
      unitPrice: item.unitPrice.toString(),
      amount: item.amount.toString(),
    })),
    payments: document.payments?.map((payment) => ({
      ...payment,
      amount: payment.amount.toString(),
    })),
  };
}

export const getQuotesByUserId = async (userId: string) => {
  const quotes = await prisma.document.findMany({
    where: {
      userId,
      type: "QUOTE",
      status: {
        not: "CONVERTED",
      },
    },
    include: {
      client: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return quotes;
};

export const getInvoicesByUserId = async (userId: string) => {
  const invoices = await prisma.document.findMany({
    where: {
      userId,
      type: "INVOICE",
    },
    include: {
      client: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return invoices;
};

export const getDocumentById = async (
  id: string,
  type: "QUOTE" | "INVOICE"
) => {
  const document = await prisma.document.findUnique({
    where: {
      id,
      type,
    },
    include: {
      client: true,
      contact: true,
      project: true,
      items: {
        orderBy: {
          order: "asc",
        },
      },
      payments: {
        orderBy: {
          paymentDate: "desc",
        },
      },
    },
  });

  return serializeDocument(document);
};

export const createDocument = async (data: {
  userId: string;
  documentNumber?: string; // Optional - will be auto-generated if not provided
  type: "QUOTE" | "INVOICE";
  status: string;
  clientId: string;
  contactId?: string | null;
  projectId?: string | null;
  issueDate: Date;
  dueDate?: Date | null;
  validUntil?: Date | null;
  currency: string;
  subtotal: string;
  taxRate: string;
  taxAmount: string;
  discount: string;
  total: string;
  amountPaid?: string;
  amountDue?: string;
  notes?: string | null;
  terms?: string | null;
  internalNotes?: string | null;
  showDiscount?: boolean;
  showTax?: boolean;
  showNotes?: boolean;
  showTerms?: boolean;
  businessFieldsToShow?: string | null;
  clientFieldsToShow?: string | null;
  items: Array<{
    itemType?: string;
    description: string;
    quantity: string;
    unitPrice: string;
    amount: string;
    hasQuantityColumn?: boolean;
    sourceProductId?: string;
    order: number;
  }>;
}) => {
  // Generate document number if not provided
  let documentNumber = data.documentNumber;

  if (!documentNumber || documentNumber === "DRAFT") {
    // Get user settings to generate the document number
    const userSettings = await prisma.userSettings.findUnique({
      where: { userId: data.userId },
    });

    if (!userSettings) {
      throw new Error("User settings not found");
    }

    if (data.type === "QUOTE") {
      const nextNumber = userSettings.quoteNextNumber;
      const prefix = userSettings.quotePrefix;
      documentNumber = `${prefix}-${String(nextNumber).padStart(3, "0")}`;

      // Increment the next number for future quotes
      await prisma.userSettings.update({
        where: { userId: data.userId },
        data: { quoteNextNumber: nextNumber + 1 },
      });
    } else {
      // INVOICE
      const nextNumber = userSettings.invoiceNextNumber;
      const prefix = userSettings.invoicePrefix;
      documentNumber = `${prefix}-${String(nextNumber).padStart(3, "0")}`;

      // Increment the next number for future invoices
      await prisma.userSettings.update({
        where: { userId: data.userId },
        data: { invoiceNextNumber: nextNumber + 1 },
      });
    }
  }

  const document = await prisma.document.create({
    data: {
      userId: data.userId,
      documentNumber: documentNumber,
      type: data.type,
      status: data.status as
        | "DRAFT"
        | "SENT"
        | "APPROVED"
        | "REJECTED"
        | "PAID"
        | "PARTIAL"
        | "OVERDUE",
      clientId: data.clientId,
      contactId: data.contactId,
      projectId: data.projectId,
      issueDate: data.issueDate,
      dueDate: data.dueDate,
      validUntil: data.validUntil,
      currency: data.currency,
      subtotal: data.subtotal,
      taxRate: data.taxRate,
      taxAmount: data.taxAmount,
      discount: data.discount,
      total: data.total,
      amountPaid: data.amountPaid || "0",
      amountDue: data.amountDue || data.total,
      notes: data.notes,
      terms: data.terms,
      internalNotes: data.internalNotes,
      showDiscount: data.showDiscount ?? false,
      showTax: data.showTax ?? true,
      showNotes: data.showNotes ?? true,
      showTerms: data.showTerms ?? true,
      businessFieldsToShow: data.businessFieldsToShow,
      clientFieldsToShow: data.clientFieldsToShow,
      items: {
        create: data.items.map((item) => ({
          itemType: item.itemType || "Product",
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          amount: item.amount,
          hasQuantityColumn: item.hasQuantityColumn ?? false,
          sourceProductId: item.sourceProductId,
          order: item.order,
        })),
      },
    },
    include: {
      client: true,
      contact: true,
      project: true,
      items: {
        orderBy: {
          order: "asc",
        },
      },
      payments: true,
    },
  });

  return serializeDocument(document);
};

export const updateDocument = async (
  id: string,
  data: {
    documentNumber?: string;
    status?: string;
    clientId?: string;
    contactId?: string | null;
    projectId?: string | null;
    issueDate?: Date;
    dueDate?: Date | null;
    validUntil?: Date | null;
    currency?: string;
    subtotal?: string;
    taxRate?: string;
    taxAmount?: string;
    discount?: string;
    total?: string;
    amountPaid?: string;
    amountDue?: string;
    notes?: string | null;
    terms?: string | null;
    internalNotes?: string | null;
    showDiscount?: boolean;
    showTax?: boolean;
    showNotes?: boolean;
    showTerms?: boolean;
    businessFieldsToShow?: string | null;
    clientFieldsToShow?: string | null;
    items?: Array<{
      id?: string;
      itemType?: string;
      description: string;
      quantity: string;
      unitPrice: string;
      amount: string;
      hasQuantityColumn?: boolean;
      sourceProductId?: string;
      order: number;
    }>;
  }
) => {
  // If items are provided, delete old items and create new ones
  if (data.items) {
    await prisma.documentItem.deleteMany({
      where: {
        documentId: id,
      },
    });
  }

  const document = await prisma.document.update({
    where: {
      id,
    },
    data: {
      documentNumber: data.documentNumber,
      status: data.status as
        | "DRAFT"
        | "SENT"
        | "APPROVED"
        | "REJECTED"
        | "PAID"
        | "PARTIAL"
        | "OVERDUE",
      clientId: data.clientId,
      contactId: data.contactId,
      projectId: data.projectId,
      issueDate: data.issueDate,
      dueDate: data.dueDate,
      validUntil: data.validUntil,
      currency: data.currency,
      subtotal: data.subtotal,
      taxRate: data.taxRate,
      taxAmount: data.taxAmount,
      discount: data.discount,
      total: data.total,
      amountPaid: data.amountPaid,
      amountDue: data.amountDue,
      notes: data.notes,
      terms: data.terms,
      internalNotes: data.internalNotes,
      showDiscount: data.showDiscount,
      showTax: data.showTax,
      showNotes: data.showNotes,
      showTerms: data.showTerms,
      businessFieldsToShow: data.businessFieldsToShow,
      clientFieldsToShow: data.clientFieldsToShow,
      items: data.items
        ? {
            create: data.items.map((item) => ({
              itemType: item.itemType || "Product",
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              amount: item.amount,
              hasQuantityColumn: item.hasQuantityColumn ?? false,
              sourceProductId: item.sourceProductId,
              order: item.order,
            })),
          }
        : undefined,
    },
    include: {
      client: true,
      contact: true,
      project: true,
      items: {
        orderBy: {
          order: "asc",
        },
      },
      payments: true,
    },
  });

  return serializeDocument(document);
};

export const deleteDocument = async (id: string) => {
  await prisma.document.delete({
    where: {
      id,
    },
  });

  return { success: true };
};

export const deleteDocuments = async (ids: string[]) => {
  await prisma.document.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });

  // Revalidate the quotes and invoices pages
  revalidatePath("/quotes");
  revalidatePath("/invoices");

  return { success: true, count: ids.length };
};

// ============================================
// USER SETTINGS - DISPLAY DEFAULTS
// ============================================

export const saveDefaultBusinessFieldsVisibility = async (
  userId: string,
  visibility: string
) => {
  await prisma.userSettings.update({
    where: {
      userId,
    },
    data: {
      defaultBusinessFieldsToShow: visibility,
    },
  });

  return { success: true };
};

export const saveDefaultClientFieldsVisibility = async (
  userId: string,
  visibility: string
) => {
  await prisma.userSettings.update({
    where: {
      userId,
    },
    data: {
      defaultClientFieldsToShow: visibility,
    },
  });

  return { success: true };
};
