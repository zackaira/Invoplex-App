import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DocumentWithRelations } from "../types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface ClassicItemsProps {
  document: DocumentWithRelations;
  isEditable?: boolean;
  onUpdate?: (updates: Partial<DocumentWithRelations>) => void;
}

export function ClassicItems({
  document,
  isEditable = false,
  onUpdate,
}: ClassicItemsProps) {
  const { items, currency } = document;

  const updateItem = (itemId: string, field: string, value: string) => {
    const updatedItems = items.map((item) => {
      if (item.id === itemId) {
        const updates: any = { ...item, [field]: value };

        // Recalculate amount if quantity or unitPrice changes
        if (field === "quantity" || field === "unitPrice") {
          const qty =
            field === "quantity"
              ? parseFloat(value)
              : parseFloat(item.quantity.toString());
          const price =
            field === "unitPrice"
              ? parseFloat(value)
              : parseFloat(item.unitPrice.toString());
          updates.amount = (qty * price).toString();
        }

        return updates;
      }
      return item;
    });

    // Recalculate totals
    const subtotal = updatedItems.reduce(
      (sum, item) => sum + parseFloat(item.amount.toString()),
      0
    );
    const taxAmount =
      subtotal * (parseFloat(document.taxRate.toString()) / 100);
    const total =
      subtotal + taxAmount - parseFloat(document.discount.toString());

    onUpdate?.({
      items: updatedItems,
      subtotal: subtotal.toString(),
      taxAmount: taxAmount.toString(),
      total: total.toString(),
      amountDue: (
        total - parseFloat(document.amountPaid.toString())
      ).toString(),
    } as any);
  };

  const addItem = () => {
    const newItem = {
      id: `temp-${Date.now()}`,
      documentId: document.id,
      description: "New Item",
      quantity: "1",
      unitPrice: "0",
      amount: "0",
      order: items.length,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    onUpdate?.({ items: [...items, newItem] } as any);
  };

  const removeItem = (itemId: string) => {
    const updatedItems = items.filter((item) => item.id !== itemId);
    const subtotal = updatedItems.reduce(
      (sum, item) => sum + parseFloat(item.amount.toString()),
      0
    );
    const taxAmount =
      subtotal * (parseFloat(document.taxRate.toString()) / 100);
    const total =
      subtotal + taxAmount - parseFloat(document.discount.toString());

    onUpdate?.({
      items: updatedItems,
      subtotal: subtotal.toString(),
      taxAmount: taxAmount.toString(),
      total: total.toString(),
      amountDue: (
        total - parseFloat(document.amountPaid.toString())
      ).toString(),
    } as any);
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50%]">Description</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead className="text-right">Unit Price</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            {isEditable && <TableHead className="w-[50px]"></TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">
                {isEditable ? (
                  <Input
                    value={item.description}
                    onChange={(e) =>
                      updateItem(item.id, "description", e.target.value)
                    }
                    className="w-full"
                  />
                ) : (
                  item.description
                )}
              </TableCell>
              <TableCell className="text-right">
                {isEditable ? (
                  <Input
                    type="number"
                    step="1"
                    value={item.quantity.toString()}
                    onChange={(e) =>
                      updateItem(item.id, "quantity", e.target.value)
                    }
                    className="w-20 ml-auto text-right"
                  />
                ) : (
                  item.quantity.toString()
                )}
              </TableCell>
              <TableCell className="text-right">
                {isEditable ? (
                  <div className="flex items-center justify-end gap-1">
                    <span className="text-sm">{currency}</span>
                    <Input
                      type="number"
                      step="1"
                      value={item.unitPrice.toString()}
                      onChange={(e) =>
                        updateItem(item.id, "unitPrice", e.target.value)
                      }
                      className="w-24 text-right"
                    />
                  </div>
                ) : (
                  `${currency} ${item.unitPrice.toString()}`
                )}
              </TableCell>
              <TableCell className="text-right font-medium">
                {currency} {item.amount.toString()}
              </TableCell>
              {isEditable && (
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                    className="h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {isEditable && (
        <Button variant="outline" size="sm" onClick={addItem} className="mt-4">
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      )}
    </div>
  );
}
