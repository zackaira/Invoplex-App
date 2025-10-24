"use client";

import { ReactNode } from "react";
import { DocumentWithRelations } from "../types";
import { useDocumentCalculations } from "./hooks/useCalculations";

export interface TotalsRenderProps {
  document: DocumentWithRelations;
  isEditable: boolean;
  onTaxUpdate: (taxRate: string) => void;
  onDiscountUpdate: (discount: string) => void;
}

export interface DocumentTotalsProps {
  document: DocumentWithRelations;
  type: "QUOTE" | "INVOICE";
  isEditable?: boolean;
  onUpdate?: (updates: Partial<DocumentWithRelations>) => void;
  render: (props: TotalsRenderProps) => ReactNode;
}

/**
 * Base component for rendering document totals section.
 * Handles calculation logic for tax, discount, and totals.
 * Templates provide the presentation via render prop.
 */
export function DocumentTotals({
  document,
  type,
  isEditable = false,
  onUpdate,
  render,
}: DocumentTotalsProps) {
  const { calculateTotals } = useDocumentCalculations();

  const updateTax = (taxRate: string) => {
    const totals = calculateTotals(
      document.items,
      taxRate,
      document.discount.toString(),
      document.amountPaid.toString()
    );

    onUpdate?.({
      taxRate,
      ...totals,
    } as Partial<DocumentWithRelations>);
  };

  const updateDiscount = (discount: string) => {
    const totals = calculateTotals(
      document.items,
      document.taxRate.toString(),
      discount,
      document.amountPaid.toString()
    );

    onUpdate?.({
      discount,
      ...totals,
    } as Partial<DocumentWithRelations>);
  };

  return (
    <>
      {render({
        document,
        isEditable,
        onTaxUpdate: updateTax,
        onDiscountUpdate: updateDiscount,
      })}
    </>
  );
}
