"use client";

import { TemplateItemsProps } from "../types";
import { BaseItemsTable, ItemsTableStyles } from "../../items/BaseTable";

/**
 * Modern template styling configuration
 * All functionality is handled by BaseItemsTable - this only defines appearance
 */
const modernStyles: ItemsTableStyles = {
  // Container with spacing
  containerClassName: "space-y-4",

  // Header styling - rounded with background
  headerClassName:
    "gap-4 px-6 py-3 bg-gray-50 rounded-lg font-semibold text-sm",
  headerGridCols: "grid-cols-[1.5fr_2.5fr_1.5fr_1.5fr_auto]",
  headerGridColsWithQty: "grid-cols-[1.5fr_2.5fr_1.5fr_1.5fr_1.5fr_auto]",

  // Row styling - cards with shadows
  rowClassName:
    "gap-4 px-6 py-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow",
  rowGridCols: "grid-cols-[1.5fr_2.5fr_1.5fr_1.5fr_auto]",
  rowGridColsWithQty: "grid-cols-[1.5fr_2.5fr_1.5fr_1.5fr_1.5fr_auto]",

  // Footer - no special styling for modern
  footerClassName: "",

  // Add button - larger with dashed border
  addButtonClassName:
    "w-full py-6 border-dashed border-2 hover:border-solid !bg-white !border-gray-300 !text-gray-900 hover:!bg-gray-50 hover:!border-gray-400",
};

/**
 * Modern template items table
 * Just 40 lines vs 330 lines - all logic is reused!
 */
export function ModernItems({
  document,
  isEditable = false,
  onUpdate,
}: TemplateItemsProps) {
  return (
    <BaseItemsTable
      document={document}
      isEditable={isEditable}
      onUpdate={onUpdate}
      styles={modernStyles}
    />
  );
}
