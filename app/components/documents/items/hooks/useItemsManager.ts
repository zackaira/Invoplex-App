import { useState } from "react";
import { DocumentWithRelations } from "../../types";
import { Decimal } from "@/app/generated/prisma/runtime/library";
import { saveProduct } from "@/lib/actions";
import { toast } from "sonner";

type DocumentItem = DocumentWithRelations["items"][number];

/**
 * Manages all business logic for document items (add, edit, delete, modal state)
 * Templates only need to provide styling - this hook handles all functionality
 */
export function useItemsManager(
  document: DocumentWithRelations,
  userId: string,
  onUpdate?: (updates: Partial<DocumentWithRelations>) => void
) {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [confirmSaveModalOpen, setConfirmSaveModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedItemForSave, setSelectedItemForSave] = useState<string | null>(
    null
  );
  const [isUpdatingExistingProduct, setIsUpdatingExistingProduct] =
    useState(false);
  const [selectedItemForDelete, setSelectedItemForDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Check if any item has quantity column
  const hasAnyQuantityColumn = document.items.some(
    (item) => item.hasQuantityColumn !== false
  );

  const createNewItem = (
    overrides: Partial<DocumentItem> = {}
  ): DocumentItem => {
    return {
      id: `temp-${Date.now()}`,
      documentId: document.id,
      itemType: "Product",
      description: "",
      quantity: "1",
      unitPrice: "0",
      amount: "0",
      hasQuantityColumn: false,
      order: document.items.length,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    } as DocumentItem;
  };

  const handleOpenAddModal = () => {
    setAddModalOpen(true);
  };

  const handleAddItem = (data: {
    itemType: string;
    hasQuantityColumn: boolean;
  }) => {
    // Add new item to the document
    const newItem = createNewItem({
      itemType: data.itemType,
      hasQuantityColumn: data.hasQuantityColumn,
    });
    onUpdate?.({ items: [...document.items, newItem] });
  };

  const handleSelectProduct = (product: {
    id: string;
    name: string;
    description: string | null;
    unitPrice: string;
    type: string;
    hasQuantityColumn: boolean;
  }) => {
    // Combine name and description back into a single description field
    const fullDescription = product.description
      ? `${product.name}\n${product.description}`
      : product.name;

    // Add the saved product to the document with sourceProductId
    const newItem = createNewItem({
      itemType: product.type,
      description: fullDescription,
      unitPrice: product.unitPrice,
      hasQuantityColumn: product.hasQuantityColumn,
      quantity: product.hasQuantityColumn ? "1" : "0",
      amount: product.unitPrice,
      sourceProductId: product.id, // Track which product this came from
    } as any);

    onUpdate?.({ items: [...document.items, newItem] });
  };

  const handleOpenConfirmSaveModal = (itemId: string) => {
    const item = document.items.find((i) => i.id === itemId);
    if (!item) return;

    // Extract name from description (first line)
    const descriptionLines = item.description.split("\n");
    const name = descriptionLines[0]?.trim() || "";

    // Check if name exists
    if (!name) {
      toast.error("Please add a name (first line) to this item before saving.");
      return;
    }

    // Check if this item has a sourceProductId (meaning it came from a saved product)
    const isUpdating = !!(item as any).sourceProductId;

    setSelectedItemId(itemId);
    setSelectedItemForSave(name);
    setIsUpdatingExistingProduct(isUpdating);
    setConfirmSaveModalOpen(true);
  };

  const handleConfirmSaveItem = async () => {
    if (!selectedItemId) return;

    const item = document.items.find((i) => i.id === selectedItemId);
    if (!item) return;

    // Extract name from description (first line) and rest as description
    const descriptionLines = item.description.split("\n");
    const name = descriptionLines[0] || "";
    const description = descriptionLines.slice(1).join("\n");

    try {
      const savedProduct = await saveProduct({
        userId,
        productId: (item as any).sourceProductId, // Pass the sourceProductId if it exists
        name,
        description,
        unitPrice: item.unitPrice.toString(),
        type: item.itemType || "Product",
        hasQuantityColumn: item.hasQuantityColumn,
      });

      // Link the saved product back to this document item
      // This ensures future saves will update the same product
      const updatedItems = document.items.map((i) =>
        i.id === selectedItemId
          ? ({ ...i, sourceProductId: savedProduct.id } as any)
          : i
      );
      onUpdate?.({ items: updatedItems });

      // Show appropriate success message
      const successMessage = isUpdatingExistingProduct
        ? "Item updated in your Saved Items!"
        : "Item saved to your Saved Items!";
      toast.success(successMessage);
    } catch (error) {
      console.error("Error saving product:", error);
      const errorMessage = isUpdatingExistingProduct
        ? "Failed to update item"
        : "Failed to save item";
      toast.error(errorMessage);
    }
  };

  const handleOpenDeleteModal = (itemId: string) => {
    const item = document.items.find((i) => i.id === itemId);
    if (!item) return;

    const descriptionLines = item.description.split("\n");
    const name = descriptionLines[0] || "this item";

    setSelectedItemForDelete({ id: itemId, name });
    setDeleteModalOpen(true);
  };

  const handleConfirmDeleteItem = () => {
    if (!selectedItemForDelete) return;

    const updatedItems = document.items.filter(
      (item) => item.id !== selectedItemForDelete.id
    );
    onUpdate?.({ items: updatedItems });
  };

  return {
    // State
    addModalOpen,
    setAddModalOpen,
    confirmSaveModalOpen,
    setConfirmSaveModalOpen,
    deleteModalOpen,
    setDeleteModalOpen,
    selectedItemForDelete,
    selectedItemForSave,
    isUpdatingExistingProduct,
    hasAnyQuantityColumn,

    // Handlers
    handleOpenAddModal,
    handleAddItem,
    handleSelectProduct,
    handleOpenConfirmSaveModal,
    handleConfirmSaveItem,
    handleOpenDeleteModal,
    handleConfirmDeleteItem,
  };
}
