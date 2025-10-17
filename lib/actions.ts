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
  const settings = await prisma.userSettings.findUnique({
    where: {
      userId,
    },
    select: {
      fiscalYearStartMonth: true,
      fiscalYearStartDay: true,
    },
  });

  return settings;
};
