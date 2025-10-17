import { useState } from "react";
import { DocumentWithRelations } from "../../types";
import { Decimal } from "@/app/generated/prisma/runtime/library";

type DocumentItem = DocumentWithRelations["items"][number];

interface Product {
  id: string;
  name: string;
  description?: string;
  unitPrice: string;
  type: string;
}

/**
 * Manages all business logic for document items (add, edit, delete, modal state)
 * Templates only need to provide styling - this hook handles all functionality
 */
export function useItemsManager(
  document: DocumentWithRelations,
  onUpdate?: (updates: Partial<DocumentWithRelations>) => void
) {
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "save">("add");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<{
    type: string;
    hasQuantityColumn: boolean;
  } | null>(null);

  // Confirmation dialog states
  const [saveConfirmOpen, setSaveConfirmOpen] = useState(false);
  const [pendingSaveData, setPendingSaveData] = useState<{
    itemId: string;
    itemType: string;
    hasQuantityColumn: boolean;
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

  const handleSelectProduct = (product: Product) => {
    const newItem = createNewItem({
      itemType: product.type,
      description:
        product.name + (product.description ? `\n${product.description}` : ""),
      unitPrice: product.unitPrice as unknown as Decimal,
      amount: product.unitPrice as unknown as Decimal,
    });
    onUpdate?.({ items: [...document.items, newItem] });
  };

  const handleOpenSaveModal = (
    itemId: string,
    itemType: string,
    hasQuantityColumn: boolean
  ) => {
    // Store the data and show confirmation dialog
    setPendingSaveData({
      itemId,
      itemType,
      hasQuantityColumn,
    });
    setSaveConfirmOpen(true);
  };

  const handleConfirmSave = () => {
    if (!pendingSaveData) return;

    setModalMode("save");
    setSelectedItemId(pendingSaveData.itemId);
    setSelectedItem({
      type: pendingSaveData.itemType,
      hasQuantityColumn: pendingSaveData.hasQuantityColumn,
    });
    setSaveModalOpen(true);
  };

  const handleHasQuantityColumnChange = (value: boolean) => {
    if (!selectedItemId) return;

    const updatedItems = document.items.map((item) =>
      item.id === selectedItemId ? { ...item, hasQuantityColumn: value } : item
    );

    onUpdate?.({ items: updatedItems });
  };

  const handleOpenAddModal = () => {
    setModalMode("add");
    setSelectedItem({
      type: "Product",
      hasQuantityColumn: false,
    });
    setSaveModalOpen(true);
  };

  const handleSaveItem = (data: {
    itemType: string;
    hasQuantityColumn: boolean;
  }) => {
    if (modalMode === "add") {
      // Add new item to the document
      const newItem = createNewItem({
        itemType: data.itemType,
        hasQuantityColumn: data.hasQuantityColumn,
      });
      onUpdate?.({ items: [...document.items, newItem] });
    } else {
      // Save mode - save to database (not implemented yet)
      console.log("Saving item to database:", data);
      // TODO: Implement actual database save functionality
    }
  };

  const handleDeleteItem = (itemId: string) => {
    const updatedItems = document.items.filter((item) => item.id !== itemId);
    onUpdate?.({ items: updatedItems });
  };

  return {
    // State
    saveModalOpen,
    setSaveModalOpen,
    modalMode,
    selectedItem,
    hasAnyQuantityColumn,
    saveConfirmOpen,
    setSaveConfirmOpen,

    // Handlers
    handleSelectProduct,
    handleOpenSaveModal,
    handleConfirmSave,
    handleHasQuantityColumnChange,
    handleOpenAddModal,
    handleSaveItem,
    handleDeleteItem,
  };
}
