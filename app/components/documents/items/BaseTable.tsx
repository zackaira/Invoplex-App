"use client";

import { DocumentWithRelations, BusinessSettings } from "../types";
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
import { ConfirmModal } from "./ConfirmModal";
import { useItemsManager } from "./hooks/useItemsManager";
import { formatCurrency, formatCurrencyInput } from "@/lib/currency-utils";
import { TooltipWrapper } from "../../ui/TooltipWrapper";

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
  businessSettings?: BusinessSettings;
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
  businessSettings,
}: BaseItemsTableProps) {
  // Get currency display preferences
  const currencyCode = document.currency;
  const displayFormat =
    businessSettings?.currencyDisplayFormat || "symbol_before";
  const currencySymbol = formatCurrencyInput(currencyCode, displayFormat);
  const {
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
    handleOpenAddModal,
    handleAddItem,
    handleSelectProduct,
    handleOpenConfirmSaveModal,
    handleConfirmSaveItem,
    handleOpenDeleteModal,
    handleConfirmDeleteItem,
  } = useItemsManager(document, document.userId, onUpdate);

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
          <div className="w-18">Type</div>
          <div className="flex-1">Description</div>
          {hasAnyQuantityColumn && (
            <div className="w-20 text-right">Quantity</div>
          )}
          <div className="w-27 text-right">Unit Price</div>
          <div className="w-24 text-right">Amount</div>
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
                  className={`text-sm grid ${rowGridCols} ${styles.rowClassName}`}
                >
                  <div className="w-18 flex items-center gap-2">
                    <span className="text-gray-700">
                      {item.itemType || "Product"}
                    </span>
                    {isEditable && (
                      <TooltipWrapper tooltip="Save this item" side="top">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenConfirmSaveModal(item.id)}
                          className="h-6 w-6 text-gray-900 bg-transparent! hover:text-green-600"
                        >
                          <Save className="h-3 w-3" />
                          <span className="sr-only">Save this item</span>
                        </Button>
                      </TooltipWrapper>
                    )}
                  </div>
                  <div className="flex-1 flex items-center">
                    {isEditable ? (
                      <Textarea
                        id={`item-description-${item.id}`}
                        name={`item-description-${item.id}`}
                        value={item.description}
                        onChange={(e) =>
                          onUpdate("description", e.target.value)
                        }
                        autoResize
                        className="w-full min-h-[60px] !bg-white !border-gray-300 !text-gray-900 placeholder:!text-gray-400"
                        placeholder="Item description"
                      />
                    ) : (
                      <span className="font-medium text-gray-900 whitespace-pre-wrap">
                        {item.description}
                      </span>
                    )}
                  </div>
                  {hasAnyQuantityColumn && (
                    <div className="w-20 text-right flex items-center justify-end">
                      {showQuantity ? (
                        isEditable ? (
                          <Input
                            id={`item-quantity-${item.id}`}
                            name={`item-quantity-${item.id}`}
                            type="number"
                            step="1"
                            value={item.quantity.toString()}
                            onChange={(e) =>
                              onUpdate("quantity", e.target.value)
                            }
                            className="w-18 text-right h-9 !bg-white !border-gray-300 !text-gray-900"
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
                  <div className="w-27 text-right flex items-center justify-end">
                    {isEditable ? (
                      <InputGroup className="w-28">
                        <InputGroupAddon align="inline-start">
                          <InputGroupText className="text-xs text-gray-600">
                            {currencySymbol}
                          </InputGroupText>
                        </InputGroupAddon>
                        <InputGroupInput
                          id={`item-unitPrice-${item.id}`}
                          name={`item-unitPrice-${item.id}`}
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
                        {formatCurrency(
                          item.unitPrice.toString(),
                          currencyCode,
                          displayFormat
                        )}
                      </span>
                    )}
                  </div>
                  <div className="w-24 text-right flex items-center justify-end">
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(
                        item.amount.toString(),
                        currencyCode,
                        displayFormat
                      )}
                    </span>
                  </div>
                  {isEditable && (
                    <div className="w-6 flex items-center justify-end">
                      <TooltipWrapper tooltip="Delete this item" side="top">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDeleteModal(item.id)}
                          className="h-6 w-6 text-gray-900 bg-transparent! hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete this item</span>
                        </Button>
                      </TooltipWrapper>
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
              userId={document.userId}
              onSelectProduct={handleSelectProduct}
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

      {/* Add Item Modal */}
      <SaveItemModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAddItem}
        userId={document.userId}
      />

      {/* Confirm Save Item Modal */}
      <ConfirmModal
        isOpen={confirmSaveModalOpen}
        onClose={() => setConfirmSaveModalOpen(false)}
        onConfirm={handleConfirmSaveItem}
        title={isUpdatingExistingProduct ? "Update Item" : "Save Item"}
        description={
          isUpdatingExistingProduct
            ? "Are you sure you want to update this item in your Saved Items? The changes will be reflected in future uses."
            : "Are you sure you want to save this item to your Saved Items? It will be available for use in future documents."
        }
        confirmButtonText={
          isUpdatingExistingProduct ? "Update Item" : "Save Item"
        }
      />

      {/* Delete Item Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDeleteItem}
        title="Delete Item"
        description="Are you sure you want to delete this item?"
        confirmButtonText="Delete Item"
        confirmButtonVariant="destructive"
      />
    </>
  );
}
