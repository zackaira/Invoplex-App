"use server";

import { prisma } from "@/lib/prisma";

/**
 * Product Actions
 *
 * Server actions for managing the product/service catalog
 */

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
