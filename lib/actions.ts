"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma";

// Helper to serialize Decimal objects to strings for client components
function serializeDocument(document: any) {
  if (!document) return null;

  return {
    ...document,
    subtotal: document.subtotal.toString(),
    taxRate: document.taxRate.toString(),
    taxAmount: document.taxAmount.toString(),
    discount: document.discount.toString(),
    total: document.total.toString(),
    amountPaid: document.amountPaid.toString(),
    amountDue: document.amountDue.toString(),
    items: document.items?.map((item: any) => ({
      ...item,
      quantity: item.quantity.toString(),
      unitPrice: item.unitPrice.toString(),
      amount: item.amount.toString(),
    })),
    payments: document.payments?.map((payment: any) => ({
      ...payment,
      amount: payment.amount.toString(),
    })),
  };
}

export const getClientsByUserId = async (userId: string) => {
  const clients = await prisma.client.findMany({
    where: {
      userId,
    },
  });

  if (!clients) return null;

  return clients;
};

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

export const getUserSettings = async (userId: string) => {
  const userSettings = await prisma.userSettings.findUnique({
    where: {
      userId,
    },
  });

  const businessProfile = await prisma.businessProfile.findUnique({
    where: {
      userId,
    },
  });

  // Serialize Decimal values
  const serializedSettings = userSettings
    ? {
        ...userSettings,
        defaultTaxRate: userSettings.defaultTaxRate.toString(),
      }
    : null;

  return {
    success: true,
    data: {
      userSettings: serializedSettings,
      businessProfile,
    },
  };
};

// ============================================
// DOCUMENT MANAGEMENT (QUOTES & INVOICES)
// ============================================

export const createDocument = async (data: {
  userId: string;
  documentNumber: string;
  type: "QUOTE" | "INVOICE";
  status: string;
  clientId: string;
  contactId?: string | null;
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
  const document = await prisma.document.create({
    data: {
      userId: data.userId,
      documentNumber: data.documentNumber,
      type: data.type,
      status: data.status as any,
      clientId: data.clientId,
      contactId: data.contactId,
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
      status: data.status as any,
      clientId: data.clientId,
      contactId: data.contactId,
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

// ============================================
// SAVED PRODUCTS/SERVICES
// ============================================

/**
 * Get saved products for a user
 */
export const getSavedProducts = async (userId: string) => {
  const products = await prisma.product.findMany({
    where: {
      userId,
      isActive: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Serialize Decimal values
  return products.map((product) => ({
    ...product,
    unitPrice: product.unitPrice.toString(),
  }));
};

/**
 * Save a product to the user's catalog
 * If productId is provided, update that specific product
 * Otherwise, if a product with the same name and type exists, update it
 * Otherwise, create a new product
 */
export const saveProduct = async (data: {
  userId: string;
  productId?: string; // Optional: specific product ID to update
  name: string;
  description?: string;
  unitPrice: string;
  type: string;
  hasQuantityColumn: boolean;
}) => {
  let product;

  // If productId is provided, update that specific product
  if (data.productId) {
    try {
      product = await prisma.product.update({
        where: {
          id: data.productId,
          userId: data.userId, // Security: ensure user owns this product
        },
        data: {
          name: data.name,
          description: data.description || "",
          unitPrice: data.unitPrice,
          type: data.type,
          hasQuantityColumn: data.hasQuantityColumn,
        },
      });
    } catch (error) {
      // If product not found or doesn't belong to user, create new one
      product = await prisma.product.create({
        data: {
          userId: data.userId,
          name: data.name,
          description: data.description || "",
          unitPrice: data.unitPrice,
          type: data.type,
          hasQuantityColumn: data.hasQuantityColumn,
          isActive: true,
        },
      });
    }
  } else {
    // Check if product with same name and type already exists
    const existingProduct = await prisma.product.findFirst({
      where: {
        userId: data.userId,
        name: data.name,
        type: data.type,
        isActive: true,
      },
    });

    if (existingProduct) {
      // Update existing product
      product = await prisma.product.update({
        where: {
          id: existingProduct.id,
        },
        data: {
          description: data.description || "",
          unitPrice: data.unitPrice,
          hasQuantityColumn: data.hasQuantityColumn,
        },
      });
    } else {
      // Create new product
      product = await prisma.product.create({
        data: {
          userId: data.userId,
          name: data.name,
          description: data.description || "",
          unitPrice: data.unitPrice,
          type: data.type,
          hasQuantityColumn: data.hasQuantityColumn,
          isActive: true,
        },
      });
    }
  }

  return {
    ...product,
    unitPrice: product.unitPrice.toString(),
  };
};

/**
 * Delete a product from the user's catalog
 */
export const deleteProduct = async (productId: string) => {
  await prisma.product.delete({
    where: {
      id: productId,
    },
  });

  return { success: true };
};
