"use client";

import { ReactNode } from "react";
import { DocumentWithRelations } from "../types";
import { useDocumentItems } from "./hooks/useDocumentItems";

export interface ItemRowRenderProps {
  item: DocumentWithRelations["items"][number];
  isEditable: boolean;
  currency: string;
  onUpdate: (field: string, value: string) => void;
  onRemove: () => void;
}

export interface DocumentItemsTableProps {
  document: DocumentWithRelations;
  isEditable?: boolean;
  onUpdate?: (updates: Partial<DocumentWithRelations>) => void;
  renderRow: (props: ItemRowRenderProps) => ReactNode;
  className?: string;
}

/**
 * Base component for rendering document items (quote/invoice line items).
 * Handles all the logic for editing and removing items and recalculating totals.
 * Templates provide the presentation via render props.
 */
export function DocumentItemsTable({
  document,
  isEditable = false,
  onUpdate,
  renderRow,
  className,
}: DocumentItemsTableProps) {
  const { updateItem, removeItem } = useDocumentItems(document, onUpdate);

  return (
    <>
      {document.items.map((item) =>
        renderRow({
          item,
          isEditable,
          currency: document.currency,
          onUpdate: (field, value) => updateItem(item.id, field, value),
          onRemove: () => removeItem(item.id),
        })
      )}
    </>
  );
}
