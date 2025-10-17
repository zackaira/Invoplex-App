"use client";

import { TemplateItemsProps } from "../../types";
import { BaseItemsTable, ItemsTableStyles } from "../../items/BaseTable";

/**
 * Classic template styling configuration
 * All functionality is handled by BaseItemsTable - this only defines appearance
 */
const classicStyles: ItemsTableStyles = {
  // Container with border
  containerClassName: "border border-gray-200 rounded-md my-8",

  // Header styling
  headerClassName:
    "gap-4 px-4 py-3 bg-gray-50 text-black border-b border-gray-200 font-semibold text-sm",
  headerGridCols: "grid-cols-[1fr_5fr_1.4fr_1.5fr_auto]",
  headerGridColsWithQty: "grid-cols-[1fr_5fr_1.4fr_1.5fr_1.1fr_auto]",

  // Row styling
  rowClassName: "gap-4 px-4 py-3 bg-white hover:bg-gray-50 transition-colors",
  rowGridCols: "grid-cols-[1fr_5fr_1.4fr_1.5fr_auto]",
  rowGridColsWithQty: "grid-cols-[1fr_5fr_1.4fr_1.5fr_1.1fr_auto]",

  // Footer (add button section)
  footerClassName: "p-4 bg-gray-50 border-t border-gray-200",

  // Add button
  addButtonClassName:
    "w-full border-dashed !bg-white !border-gray-300 !text-gray-900 hover:!bg-gray-50 hover:!border-gray-400 hover:!text-gray-900",
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
