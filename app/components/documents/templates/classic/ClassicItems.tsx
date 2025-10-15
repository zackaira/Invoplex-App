"use client";

import { TemplateItemsProps } from "../types";
import { BaseItemsTable, ItemsTableStyles } from "../../items/BaseTable";

/**
 * Classic template styling configuration
 * All functionality is handled by BaseItemsTable - this only defines appearance
 */
const classicStyles: ItemsTableStyles = {
  // Container with border
  containerClassName:
    "border border-gray-200 dark:border-gray-700 rounded-md my-8",

  // Header styling
  headerClassName:
    "gap-4 px-4 py-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 font-semibold text-sm",
  headerGridCols: "grid-cols-[1fr_5fr_1.4fr_1.5fr_auto]",
  headerGridColsWithQty: "grid-cols-[1fr_5fr_1.4fr_1.5fr_1.1fr_auto]",

  // Row styling
  rowClassName:
    "gap-4 px-4 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors",
  rowGridCols: "grid-cols-[1fr_5fr_1.4fr_1.5fr_auto]",
  rowGridColsWithQty: "grid-cols-[1fr_5fr_1.4fr_1.5fr_1.1fr_auto]",

  // Footer (add button section)
  footerClassName:
    "p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700",

  // Add button
  addButtonClassName: "w-full border-dashed",
};

/**
 * Classic template items table
 * Just 40 lines vs 350 lines - all logic is reused!
 */
export function ClassicItems({
  document,
  isEditable = false,
  onUpdate,
}: TemplateItemsProps) {
  return (
    <BaseItemsTable
      document={document}
      isEditable={isEditable}
      onUpdate={onUpdate}
      styles={classicStyles}
    />
  );
}
