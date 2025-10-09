import { DocumentWithRelations } from "../types";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ClassicFooterProps {
  document: DocumentWithRelations;
  type: "QUOTE" | "INVOICE";
  isEditable?: boolean;
  onUpdate?: (updates: Partial<DocumentWithRelations>) => void;
}

export function ClassicFooter({
  document,
  type,
  isEditable = false,
  onUpdate,
}: ClassicFooterProps) {
  const updateTax = (taxRate: string) => {
    const rate = parseFloat(taxRate);
    const subtotal = parseFloat(document.subtotal.toString());
    const taxAmount = subtotal * (rate / 100);
    const total =
      subtotal + taxAmount - parseFloat(document.discount.toString());

    onUpdate?.({
      taxRate: rate.toString(),
      taxAmount: taxAmount.toString(),
      total: total.toString(),
      amountDue: (
        total - parseFloat(document.amountPaid.toString())
      ).toString(),
    } as any);
  };

  const updateDiscount = (discount: string) => {
    const disc = parseFloat(discount);
    const subtotal = parseFloat(document.subtotal.toString());
    const taxAmount = parseFloat(document.taxAmount.toString());
    const total = subtotal + taxAmount - disc;

    onUpdate?.({
      discount: disc.toString(),
      total: total.toString(),
      amountDue: (
        total - parseFloat(document.amountPaid.toString())
      ).toString(),
    } as any);
  };
  return (
    <div>
      {/* Totals Section */}
      <div className="flex justify-end mb-8">
        <div className="w-full max-w-xs space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">
              {document.currency} {document.subtotal.toString()}
            </span>
          </div>

          {(isEditable || Number(document.discount) > 0) && (
            <div className="flex justify-between text-sm items-center">
              <span className="text-gray-600">Discount</span>
              {isEditable ? (
                <div className="flex items-center gap-1">
                  <span className="text-sm">{document.currency}</span>
                  <Input
                    type="number"
                    step="0.01"
                    value={document.discount.toString()}
                    onChange={(e) => updateDiscount(e.target.value)}
                    className="w-24 h-8 text-right"
                  />
                </div>
              ) : (
                <span className="font-medium text-red-600">
                  -{document.currency} {document.discount.toString()}
                </span>
              )}
            </div>
          )}

          {(isEditable || Number(document.taxRate) > 0) && (
            <div className="flex justify-between text-sm items-center">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Tax</span>
                {isEditable && (
                  <Input
                    type="number"
                    step="0.01"
                    value={document.taxRate.toString()}
                    onChange={(e) => updateTax(e.target.value)}
                    className="w-16 h-8 text-right"
                    placeholder="%"
                  />
                )}
                {!isEditable && (
                  <span className="text-gray-600">
                    ({document.taxRate.toString()}%)
                  </span>
                )}
              </div>
              <span className="font-medium">
                {document.currency} {document.taxAmount.toString()}
              </span>
            </div>
          )}

          <Separator />

          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>
              {document.currency} {document.total.toString()}
            </span>
          </div>

          {/* Invoice specific totals */}
          {type === "INVOICE" && (
            <>
              {Number(document.amountPaid) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Amount Paid</span>
                  <span className="font-medium text-green-600">
                    {document.currency} {document.amountPaid.toString()}
                  </span>
                </div>
              )}

              {Number(document.amountDue) > 0 && (
                <div className="flex justify-between text-lg font-bold text-primary">
                  <span>Amount Due</span>
                  <span>
                    {document.currency} {document.amountDue.toString()}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Notes and Terms */}
      <div className="space-y-6">
        {(isEditable || document.notes) && (
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
              Notes
            </h3>
            {isEditable ? (
              <Textarea
                value={document.notes || ""}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  onUpdate?.({ notes: e.target.value })
                }
                placeholder="Add notes for your client..."
                className="text-sm"
                rows={3}
              />
            ) : (
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {document.notes}
              </p>
            )}
          </div>
        )}

        {(isEditable || document.terms) && (
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
              Terms & Conditions
            </h3>
            {isEditable ? (
              <Textarea
                value={document.terms || ""}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  onUpdate?.({ terms: e.target.value })
                }
                placeholder="Add terms and conditions..."
                className="text-sm"
                rows={3}
              />
            ) : (
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {document.terms}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Footer message */}
      <div className="mt-8 pt-6 border-t text-center text-sm text-gray-500">
        <p>
          Thank you for your business!
          {type === "INVOICE" &&
            " Payment is due by the due date listed above."}
        </p>
      </div>
    </div>
  );
}
