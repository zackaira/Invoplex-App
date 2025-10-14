import { DocumentWithRelations } from "../../templates/types";
import { useDocumentCalculations } from "./useCalculations";

export function useDocumentItems(
  document: DocumentWithRelations,
  onUpdate?: (updates: Partial<DocumentWithRelations>) => void
) {
  const { calculateTotals, calculateItemAmount } = useDocumentCalculations();

  const updateItem = (itemId: string, field: string, value: string) => {
    const updatedItems = document.items.map((item) => {
      if (item.id === itemId) {
        const updates: any = { ...item, [field]: value };

        // Recalculate amount if quantity or unitPrice changes
        if (field === "quantity" || field === "unitPrice") {
          const qty = field === "quantity" ? value : item.quantity.toString();
          const price =
            field === "unitPrice" ? value : item.unitPrice.toString();
          updates.amount = calculateItemAmount(qty, price);
        }

        return updates;
      }
      return item;
    });

    const totals = calculateTotals(
      updatedItems,
      document.taxRate.toString(),
      document.discount.toString(),
      document.amountPaid.toString()
    );

    onUpdate?.({
      items: updatedItems,
      ...totals,
    } as any);
  };

  const addItem = () => {
    const newItem = {
      id: `temp-${Date.now()}`,
      documentId: document.id,
      itemType: "Product",
      description: "New Item",
      quantity: "1",
      unitPrice: "0",
      amount: "0",
      hasQuantityColumn: false,
      order: document.items.length,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    onUpdate?.({ items: [...document.items, newItem] } as any);
  };

  const removeItem = (itemId: string) => {
    const updatedItems = document.items.filter((item) => item.id !== itemId);
    const totals = calculateTotals(
      updatedItems,
      document.taxRate.toString(),
      document.discount.toString(),
      document.amountPaid.toString()
    );

    onUpdate?.({
      items: updatedItems,
      ...totals,
    } as any);
  };

  return {
    updateItem,
    addItem,
    removeItem,
  };
}
