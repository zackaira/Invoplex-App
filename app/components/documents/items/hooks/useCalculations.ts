import { DocumentWithRelations } from "../../types";

export function useDocumentCalculations() {
  const calculateTotals = (
    items: DocumentWithRelations["items"],
    taxRate: string | number,
    discount: string | number,
    amountPaid: string | number = 0
  ) => {
    const subtotal = items.reduce(
      (sum, item) => sum + parseFloat(item.amount.toString()),
      0
    );
    const taxAmount = subtotal * (parseFloat(taxRate.toString()) / 100);
    const total = subtotal + taxAmount - parseFloat(discount.toString());
    const amountDue = total - parseFloat(amountPaid.toString());

    return {
      subtotal: subtotal.toString(),
      taxAmount: taxAmount.toString(),
      total: total.toString(),
      amountDue: amountDue.toString(),
    };
  };

  const calculateItemAmount = (
    quantity: string | number,
    unitPrice: string | number
  ) => {
    const qty = parseFloat(quantity.toString());
    const price = parseFloat(unitPrice.toString());
    return (qty * price).toString();
  };

  return {
    calculateTotals,
    calculateItemAmount,
  };
}
