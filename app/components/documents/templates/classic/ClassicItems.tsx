"use client";

import { useState } from "react";
import { DocumentWithRelations } from "../types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Save, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DocumentItemsTable } from "../../shared/DocumentItemsTable";
import { useDocumentItems } from "../../shared/hooks/useDocumentItems";
import { ItemTypeSelect } from "../../shared/ItemTypeSelect";
import { SaveItemModal } from "../../shared/SaveItemModal";

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
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{
    type: string;
    description: string;
    unitPrice: string;
  } | null>(null);

  const handleOpenSaveModal = (
    itemType: string,
    description: string,
    unitPrice: string
  ) => {
    setSelectedItem({ type: itemType, description, unitPrice });
    setSaveModalOpen(true);
  };

  return (
    <>
      <div className="border border-gray-200 dark:border-gray-700 rounded-md">
        {/* Header */}
        <div className="grid grid-cols-[1.5fr_3fr_1.5fr_1.5fr_1.5fr_auto] gap-4 px-4 py-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 font-semibold text-sm">
          <div>Type</div>
          <div>Description</div>
          <div className="text-right">Quantity</div>
          <div className="text-right">Unit Price</div>
          <div className="text-right">Amount</div>
          {isEditable && <div className="w-20"></div>}
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
                className="grid grid-cols-[1.5fr_3fr_1.5fr_1.5fr_1.5fr_auto] gap-4 px-4 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
              >
                <div className="flex items-center">
                  {isEditable ? (
                    <ItemTypeSelect
                      value={item.itemType || "Product"}
                      onChange={(value) => onUpdate("itemType", value)}
                      className="w-full"
                    />
                  ) : (
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {item.itemType || "Product"}
                    </span>
                  )}
                </div>
                <div className="flex items-center">
                  {isEditable ? (
                    <Textarea
                      value={item.description}
                      onChange={(e) => onUpdate("description", e.target.value)}
                      className="w-full min-h-[60px] resize-y"
                      placeholder="Item description"
                    />
                  ) : (
                    <span className="font-medium text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                      {item.description}
                    </span>
                  )}
                </div>
                <div className="text-right flex items-center justify-end">
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
                <div className="text-right flex items-center justify-end">
                  {isEditable ? (
                    <InputGroup className="w-28">
                      <InputGroupAddon align="inline-start">
                        <InputGroupText className="text-xs">
                          {currency}
                        </InputGroupText>
                      </InputGroupAddon>
                      <InputGroupInput
                        type="number"
                        step="0.01"
                        value={item.unitPrice.toString()}
                        onChange={(e) => onUpdate("unitPrice", e.target.value)}
                        className="ps-10 text-right h-9"
                      />
                    </InputGroup>
                  ) : (
                    <span className="text-gray-700 dark:text-gray-300">
                      {currency} {item.unitPrice.toString()}
                    </span>
                  )}
                </div>
                <div className="text-right flex items-center justify-end">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {currency} {item.amount.toString()}
                  </span>
                </div>
                {isEditable && (
                  <div className="flex items-center justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            handleOpenSaveModal(
                              item.itemType || "Product",
                              item.description,
                              item.unitPrice.toString()
                            )
                          }
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save to database
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={onRemove}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete item
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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

      {/* Save Item Modal */}
      {selectedItem && (
        <SaveItemModal
          isOpen={saveModalOpen}
          onClose={() => setSaveModalOpen(false)}
          initialType={selectedItem.type}
          initialDescription={selectedItem.description}
          initialUnitPrice={selectedItem.unitPrice}
          currency={document.currency}
        />
      )}
    </>
  );
}
