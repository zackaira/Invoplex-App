import { useState } from "react";
import { DocumentWithRelations } from "../../templates/types";
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
    description: string;
    unitPrice: string;
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
    description: string,
    unitPrice: string,
    hasQuantityColumn: boolean
  ) => {
    setModalMode("save");
    setSelectedItemId(itemId);
    setSelectedItem({
      type: itemType,
      description,
      unitPrice,
      hasQuantityColumn,
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

  const handleOpenNewTypeModal = () => {
    setModalMode("add");
    setSelectedItem({
      type: "",
      description: "",
      unitPrice: "0",
      hasQuantityColumn: false,
    });
    setSaveModalOpen(true);
  };

  const handleSaveItem = (data: {
    itemType: string;
    description: string;
    unitPrice: string;
    hasQuantityColumn: boolean;
  }) => {
    if (modalMode === "add") {
      // Add new item to the document
      const newItem = createNewItem({
        itemType: data.itemType,
        description: data.description,
        unitPrice: data.unitPrice as unknown as Decimal,
        amount: data.unitPrice as unknown as Decimal,
        hasQuantityColumn: data.hasQuantityColumn,
      });
      onUpdate?.({ items: [...document.items, newItem] });
    } else {
      // Save mode - save to database (not implemented yet)
      console.log("Saving item to database:", data);
      // TODO: Implement actual database save functionality
    }
  };

  const handleCreateBlankProduct = () => {
    const newItem = createNewItem({ itemType: "Product" });
    onUpdate?.({ items: [...document.items, newItem] });
  };

  const handleCreateBlankService = () => {
    const newItem = createNewItem({ itemType: "Service" });
    onUpdate?.({ items: [...document.items, newItem] });
  };

  return {
    // State
    saveModalOpen,
    setSaveModalOpen,
    modalMode,
    selectedItem,
    hasAnyQuantityColumn,

    // Handlers
    handleSelectProduct,
    handleOpenSaveModal,
    handleHasQuantityColumnChange,
    handleOpenNewTypeModal,
    handleSaveItem,
    handleCreateBlankProduct,
    handleCreateBlankService,
  };
}
