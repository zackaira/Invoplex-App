"use client";

import { DocumentWithRelations } from "../types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { DocumentItemsTable } from "../../shared/DocumentItemsTable";
import { useDocumentItems } from "../../shared/hooks/useDocumentItems";

interface ModernItemsProps {
  document: DocumentWithRelations;
  isEditable?: boolean;
  onUpdate?: (updates: Partial<DocumentWithRelations>) => void;
}

export function ModernItems({
  document,
  isEditable = false,
  onUpdate,
}: ModernItemsProps) {
  const { addItem } = useDocumentItems(document, onUpdate);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 dark:bg-gray-900 rounded-lg font-semibold text-sm">
        <div className="col-span-5">Description</div>
        <div className="col-span-2 text-right">Quantity</div>
        <div className="col-span-2 text-right">Unit Price</div>
        <div className="col-span-2 text-right">Amount</div>
        {isEditable && <div className="col-span-1"></div>}
      </div>

      <DocumentItemsTable
        document={document}
        isEditable={isEditable}
        onUpdate={onUpdate}
        renderRow={({ item, isEditable, currency, onUpdate, onRemove }) => (
          <div
            key={item.id}
            className="grid grid-cols-12 gap-4 px-6 py-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="col-span-5">
              {isEditable ? (
                <Input
                  value={item.description}
                  onChange={(e) => onUpdate("description", e.target.value)}
                  className="w-full"
                  placeholder="Item description"
                />
              ) : (
                <p className="font-medium">{item.description}</p>
              )}
            </div>
            <div className="col-span-2 text-right flex items-center justify-end">
              {isEditable ? (
                <Input
                  type="number"
                  step="1"
                  value={item.quantity.toString()}
                  onChange={(e) => onUpdate("quantity", e.target.value)}
                  className="w-20 text-right"
                />
              ) : (
                <span>{item.quantity.toString()}</span>
              )}
            </div>
            <div className="col-span-2 text-right flex items-center justify-end">
              {isEditable ? (
                <div className="flex items-center gap-1">
                  <span className="text-sm text-gray-500">{currency}</span>
                  <Input
                    type="number"
                    step="0.01"
                    value={item.unitPrice.toString()}
                    onChange={(e) => onUpdate("unitPrice", e.target.value)}
                    className="w-24 text-right"
                  />
                </div>
              ) : (
                <span>
                  {currency} {item.unitPrice.toString()}
                </span>
              )}
            </div>
            <div className="col-span-2 text-right flex items-center justify-end font-semibold">
              {currency} {item.amount.toString()}
            </div>
            {isEditable && (
              <div className="col-span-1 flex items-center justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onRemove}
                  className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      />

      {isEditable && (
        <Button
          variant="outline"
          size="sm"
          onClick={addItem}
          className="w-full py-6 border-dashed border-2 hover:border-solid"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      )}
    </div>
  );
}
