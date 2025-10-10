"use client";

import { DocumentWithRelations } from "../types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { DocumentItemsTable } from "../../shared/DocumentItemsTable";
import { useDocumentItems } from "../../shared/hooks/useDocumentItems";

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
  const { addItem } = useDocumentItems(document, onUpdate);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 font-semibold text-sm">
        <div className="col-span-5">Description</div>
        <div className="col-span-2 text-right">Quantity</div>
        <div className="col-span-2 text-right">Unit Price</div>
        <div className="col-span-2 text-right">Amount</div>
        {isEditable && <div className="col-span-1"></div>}
      </div>

      {/* Items */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <DocumentItemsTable
          document={document}
          isEditable={isEditable}
          onUpdate={onUpdate}
          renderRow={({ item, isEditable, currency, onUpdate, onRemove }) => (
            <div
              key={item.id}
              className="grid grid-cols-12 gap-4 px-4 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
            >
              <div className="col-span-5 flex items-center">
                {isEditable ? (
                  <Input
                    value={item.description}
                    onChange={(e) => onUpdate("description", e.target.value)}
                    className="w-full h-9"
                    placeholder="Item description"
                  />
                ) : (
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {item.description}
                  </span>
                )}
              </div>
              <div className="col-span-2 text-right flex items-center justify-end">
                {isEditable ? (
                  <Input
                    type="number"
                    step="1"
                    value={item.quantity.toString()}
                    onChange={(e) => onUpdate("quantity", e.target.value)}
                    className="w-20 text-right h-9"
                  />
                ) : (
                  <span className="text-gray-700 dark:text-gray-300">
                    {item.quantity.toString()}
                  </span>
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
                      className="w-24 text-right h-9"
                    />
                  </div>
                ) : (
                  <span className="text-gray-700 dark:text-gray-300">
                    {currency} {item.unitPrice.toString()}
                  </span>
                )}
              </div>
              <div className="col-span-2 text-right flex items-center justify-end">
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {currency} {item.amount.toString()}
                </span>
              </div>
              {isEditable && (
                <div className="col-span-1 flex items-center justify-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onRemove}
                    className="h-8 w-8 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
        />
      </div>

      {/* Add Item Button */}
      {isEditable && (
        <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            size="sm"
            onClick={addItem}
            className="w-full border-dashed"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      )}
    </div>
  );
}
