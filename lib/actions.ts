"use server";

import { prisma } from "@/lib/prisma";

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
