"use client";

import { DocumentWithRelations } from "../types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DocumentTotals } from "../../shared/DocumentTotals";

interface ModernFooterProps {
  document: DocumentWithRelations;
  type: "QUOTE" | "INVOICE";
  isEditable?: boolean;
  onUpdate?: (updates: Partial<DocumentWithRelations>) => void;
}

export function ModernFooter({
  document,
  type,
  isEditable = false,
  onUpdate,
}: ModernFooterProps) {
  return (
    <div>
      {/* Totals Section */}
      <DocumentTotals
        document={document}
        type={type}
        isEditable={isEditable}
        onUpdate={onUpdate}
        render={({ document, isEditable, onTaxUpdate, onDiscountUpdate }) => (
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 p-8 rounded-lg mb-8">
            <div className="max-w-md ml-auto space-y-3">
              <div className="flex justify-between text-base">
                <span className="text-gray-700 dark:text-gray-300">
                  Subtotal
                </span>
                <span className="font-semibold">
                  {document.currency} {document.subtotal.toString()}
                </span>
              </div>

              {(isEditable || Number(document.discount) > 0) && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">
                    Discount
                  </span>
                  {isEditable ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{document.currency}</span>
                      <Input
                        type="number"
                        step="0.01"
                        value={document.discount.toString()}
                        onChange={(e) => onDiscountUpdate(e.target.value)}
                        className="w-28 h-9"
                      />
                    </div>
                  ) : (
                    <span className="font-semibold text-red-600">
                      -{document.currency} {document.discount.toString()}
                    </span>
                  )}
                </div>
              )}

              {(isEditable || Number(document.taxRate) > 0) && (
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700 dark:text-gray-300">
                      Tax
                    </span>
                    {isEditable && (
                      <Input
                        type="number"
                        step="0.01"
                        value={document.taxRate.toString()}
                        onChange={(e) => onTaxUpdate(e.target.value)}
                        className="w-20 h-9"
                        placeholder="%"
                      />
                    )}
                    {!isEditable && (
                      <span className="text-gray-600 dark:text-gray-400">
                        ({document.taxRate.toString()}%)
                      </span>
                    )}
                  </div>
                  <span className="font-semibold">
                    {document.currency} {document.taxAmount.toString()}
                  </span>
                </div>
              )}

              <div className="h-px bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-800 dark:to-purple-800 my-4"></div>

              <div className="flex justify-between text-2xl font-bold text-blue-600 dark:text-blue-400">
                <span>Total</span>
                <span>
                  {document.currency} {document.total.toString()}
                </span>
              </div>

              {/* Invoice specific totals */}
              {type === "INVOICE" && (
                <>
                  {Number(document.amountPaid) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-300">
                        Amount Paid
                      </span>
                      <span className="font-semibold text-green-600">
                        {document.currency} {document.amountPaid.toString()}
                      </span>
                    </div>
                  )}

                  {Number(document.amountDue) > 0 && (
                    <div className="flex justify-between text-xl font-bold text-purple-600 dark:text-purple-400">
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
        )}
      />

      {/* Notes and Terms */}
      <div className="grid grid-cols-2 gap-6">
        {(isEditable || document.notes) && (
          <div className="bg-yellow-50 dark:bg-yellow-950/20 p-6 rounded-lg">
            <h3 className="text-sm font-bold text-yellow-800 dark:text-yellow-200 uppercase mb-3">
              📝 Notes
            </h3>
            {isEditable ? (
              <Textarea
                value={document.notes || ""}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  onUpdate?.({ notes: e.target.value })
                }
                placeholder="Add notes for your client..."
                className="bg-white dark:bg-gray-800"
                rows={4}
              />
            ) : (
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {document.notes}
              </p>
            )}
          </div>
        )}

        {(isEditable || document.terms) && (
          <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-lg">
            <h3 className="text-sm font-bold text-blue-800 dark:text-blue-200 uppercase mb-3">
              📋 Terms & Conditions
            </h3>
            {isEditable ? (
              <Textarea
                value={document.terms || ""}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  onUpdate?.({ terms: e.target.value })
                }
                placeholder="Add terms and conditions..."
                className="bg-white dark:bg-gray-800"
                rows={4}
              />
            ) : (
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {document.terms}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Footer message */}
      <div className="mt-8 pt-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          ✨ Thank you for your business! ✨
          {type === "INVOICE" && (
            <span className="block mt-1">
              Payment is due by the due date listed above.
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
