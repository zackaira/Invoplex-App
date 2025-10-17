"use client";

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
import { Plus, Trash2, Save } from "lucide-react";
import { DocumentItemsTable } from "./ItemsTable";
import { ProductSelect } from "./ProductSelect";
import { SaveItemModal } from "./SaveItemModal";
import { ConfirmationDialog } from "./ConfirmationDialog";
import { useItemsManager } from "./hooks/useItemsManager";

/**
 * Styling configuration for the items table
 * Templates provide these to customize appearance while reusing all logic
 */
export interface ItemsTableStyles {
  // Container
  containerClassName?: string;

  // Header
  headerClassName?: string;
  headerGridCols: string; // e.g., "grid-cols-[1fr_5fr_1.4fr_1.5fr_1.1fr_auto]"
  headerGridColsWithQty: string; // Grid with quantity column

  // Row
  rowClassName?: string;
  rowGridCols: string;
  rowGridColsWithQty: string;

  // Footer (add item section)
  footerClassName?: string;

  // Add button
  addButtonClassName?: string;
}

interface BaseItemsTableProps {
  document: DocumentWithRelations;
  isEditable?: boolean;
  onUpdate?: (updates: Partial<DocumentWithRelations>) => void;
  styles: ItemsTableStyles;
}

/**
 * Base component that handles ALL items functionality
 * Templates only need to provide styling configuration
 */
export function BaseItemsTable({
  document,
  isEditable = false,
  onUpdate,
  styles,
}: BaseItemsTableProps) {
  const {
    saveModalOpen,
    setSaveModalOpen,
    modalMode,
    selectedItem,
    hasAnyQuantityColumn,
    saveConfirmOpen,
    setSaveConfirmOpen,
    handleSelectProduct,
    handleOpenSaveModal,
    handleConfirmSave,
    handleHasQuantityColumnChange,
    handleOpenAddModal,
    handleSaveItem,
    handleDeleteItem,
  } = useItemsManager(document, onUpdate);

  const gridCols = hasAnyQuantityColumn
    ? styles.headerGridColsWithQty
    : styles.headerGridCols;
  const rowGridCols = hasAnyQuantityColumn
    ? styles.rowGridColsWithQty
    : styles.rowGridCols;

  return (
    <>
      <div className={styles.containerClassName}>
        {/* Header */}
        <div className={`grid ${gridCols} ${styles.headerClassName}`}>
          <div>Type</div>
          <div>Description</div>
          {hasAnyQuantityColumn && <div className="text-right">Quantity</div>}
          <div className="text-right">Unit Price</div>
          <div className="text-right">Amount</div>
          {isEditable && <div className="w-9"></div>}
        </div>

        {/* Items */}
        <div className="divide-y divide-gray-200">
          <DocumentItemsTable
            document={document}
            isEditable={isEditable}
            onUpdate={onUpdate}
            renderRow={({ item, isEditable, currency, onUpdate, onRemove }) => {
              const showQuantity =
                hasAnyQuantityColumn && item.hasQuantityColumn !== false;
              return (
                <div
                  key={item.id}
                  className={`grid ${rowGridCols} ${styles.rowClassName}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">
                      {item.itemType || "Product"}
                    </span>
                    {isEditable && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleOpenSaveModal(
                            item.id,
                            item.itemType || "Product",
                            item.hasQuantityColumn ?? false
                          )
                        }
                        className="h-6 w-6 text-gray-900 bg-transparent! hover:text-green-600"
                      >
                        <Save className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center">
                    {isEditable ? (
                      <Textarea
                        value={item.description}
                        onChange={(e) =>
                          onUpdate("description", e.target.value)
                        }
                        className="w-full min-h-[60px] resize-y !bg-white !border-gray-300 !text-gray-900 placeholder:!text-gray-400"
                        placeholder="Item description"
                      />
                    ) : (
                      <span className="font-medium text-gray-900 whitespace-pre-wrap">
                        {item.description}
                      </span>
                    )}
                  </div>
                  {hasAnyQuantityColumn && (
                    <div className="text-right flex items-center justify-end">
                      {showQuantity ? (
                        isEditable ? (
                          <Input
                            type="number"
                            step="1"
                            value={item.quantity.toString()}
                            onChange={(e) =>
                              onUpdate("quantity", e.target.value)
                            }
                            className="w-20 text-right h-9 !bg-white !border-gray-300 !text-gray-900"
                          />
                        ) : (
                          <span className="text-gray-700">
                            {item.quantity.toString()}
                          </span>
                        )
                      ) : (
                        <span className="text-gray-400"></span>
                      )}
                    </div>
                  )}
                  <div className="text-right flex items-center justify-end">
                    {isEditable ? (
                      <InputGroup className="w-28">
                        <InputGroupAddon align="inline-start">
                          <InputGroupText className="text-xs text-gray-600">
                            {currency}
                          </InputGroupText>
                        </InputGroupAddon>
                        <InputGroupInput
                          type="number"
                          step="0.01"
                          value={item.unitPrice.toString()}
                          onChange={(e) =>
                            onUpdate("unitPrice", e.target.value)
                          }
                          className="ps-10 text-right h-9 !bg-white !border-gray-300 !text-gray-900"
                        />
                      </InputGroup>
                    ) : (
                      <span className="text-gray-700">
                        {currency} {item.unitPrice.toString()}
                      </span>
                    )}
                  </div>
                  <div className="text-right flex items-center justify-end">
                    <span className="font-semibold text-gray-900">
                      {currency} {item.amount.toString()}
                    </span>
                  </div>
                  {isEditable && (
                    <div className="flex items-center justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteItem(item.id)}
                        className="h-8 w-8 text-gray-900 bg-transparent! hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              );
            }}
          />
        </div>

        {/* Add Item Button */}
        {isEditable && (
          <div className={styles.footerClassName}>
            <ProductSelect
              onSelect={handleSelectProduct}
              onOpenAddModal={handleOpenAddModal}
              trigger={
                <Button
                  variant="outline"
                  size="sm"
                  className={styles.addButtonClassName}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              }
            />
          </div>
        )}
      </div>

      {/* Save Item Modal */}
      <SaveItemModal
        isOpen={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        onSave={handleSaveItem}
        mode={modalMode}
        onHasQuantityColumnChange={handleHasQuantityColumnChange}
        initialType={selectedItem?.type || ""}
        initialHasQuantityColumn={selectedItem?.hasQuantityColumn ?? false}
      />

      {/* Save Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={saveConfirmOpen}
        onClose={() => setSaveConfirmOpen(false)}
        onConfirm={handleConfirmSave}
        title="Save Item to Database"
        description="Do you want to save this item to the database for future use?"
        confirmText="Save Item"
        cancelText="Cancel"
      />
    </>
  );
}
