"use client";

import Image from "next/image";
import { TemplateFooterProps } from "../types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DocumentTotals } from "../../items/Totals";
import Link from "next/link";

export function ModernFooter({
  document,
  type,
  isEditable = false,
  onUpdate,
}: TemplateFooterProps) {
  return (
    <div>
      {/* Totals Section */}
      <DocumentTotals
        document={document}
        type={type}
        isEditable={isEditable}
        onUpdate={onUpdate}
        render={({ document, isEditable, onTaxUpdate, onDiscountUpdate }) => (
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-lg mb-10">
            <div className="flex justify-between items-end">
              {/* Powered By / Branding Logo */}
              <div className="flex-shrink-0">
                <div className="text-xs text-gray-400 mb-1">Powered by</div>
                <Link href="https://kaira.co/" target="_blank">
                  <Image
                    src="/invoplex-logo.png"
                    alt="Invoplex Logo"
                    width={160}
                    height={45}
                    className="object-contain"
                  />
                </Link>
              </div>

              <div className="max-w-md space-y-3">
                <div className="flex justify-between text-base">
                  <span className="text-gray-700">Subtotal</span>
                  <span className="font-semibold">
                    {document.currency} {document.subtotal.toString()}
                  </span>
                </div>

                {(isEditable || Number(document.discount) > 0) && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Discount</span>
                    {isEditable ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-900">
                          {document.currency}
                        </span>
                        <Input
                          type="number"
                          step="0.01"
                          value={document.discount.toString()}
                          onChange={(e) => onDiscountUpdate(e.target.value)}
                          className="w-28 h-9 !bg-white !border-gray-300 !text-gray-900"
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
                      <span className="text-gray-700">Tax</span>
                      {isEditable && (
                        <Input
                          type="number"
                          step="0.01"
                          value={document.taxRate.toString()}
                          onChange={(e) => onTaxUpdate(e.target.value)}
                          className="w-20 h-9 !bg-white !border-gray-300 !text-gray-900 placeholder:!text-gray-400"
                          placeholder="%"
                        />
                      )}
                      {!isEditable && (
                        <span className="text-gray-600">
                          ({document.taxRate.toString()}%)
                        </span>
                      )}
                    </div>
                    <span className="font-semibold">
                      {document.currency} {document.taxAmount.toString()}
                    </span>
                  </div>
                )}

                <div className="h-px bg-gradient-to-r from-blue-200 to-purple-200 my-4"></div>

                <div className="flex justify-between text-2xl font-bold text-blue-600">
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
                        <span className="text-gray-700">Amount Paid</span>
                        <span className="font-semibold text-green-600">
                          {document.currency} {document.amountPaid.toString()}
                        </span>
                      </div>
                    )}

                    {Number(document.amountDue) > 0 && (
                      <div className="flex justify-between text-xl font-bold text-purple-600">
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
          </div>
        )}
      />

      {/* Notes and Terms */}
      <div className="grid grid-cols-2 gap-6">
        {(isEditable || document.notes) && (
          <div className="bg-yellow-50 p-6 rounded-lg">
            <h3 className="text-sm font-bold text-yellow-800 uppercase mb-3">
              📝 Notes
            </h3>
            {isEditable ? (
              <Textarea
                value={document.notes || ""}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  onUpdate?.({ notes: e.target.value })
                }
                placeholder="Add notes for your client..."
                className="!bg-white !border-gray-300 !text-gray-900 placeholder:!text-gray-400"
                rows={4}
              />
            ) : (
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {document.notes}
              </p>
            )}
          </div>
        )}

        {(isEditable || document.terms) && (
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-sm font-bold text-blue-800 uppercase mb-3">
              📋 Terms & Conditions
            </h3>
            {isEditable ? (
              <Textarea
                value={document.terms || ""}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  onUpdate?.({ terms: e.target.value })
                }
                placeholder="Add terms and conditions..."
                className="!bg-white !border-gray-300 !text-gray-900 placeholder:!text-gray-400"
                rows={4}
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
      <div className="mt-8 pt-6 text-center">
        <p className="text-gray-600">
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
