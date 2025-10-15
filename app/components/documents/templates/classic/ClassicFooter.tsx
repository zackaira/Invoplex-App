"use client";

import Image from "next/image";
import { TemplateFooterProps } from "../types";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DocumentTotals } from "../../items/Totals";
import Link from "next/link";

export function ClassicFooter({
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
          <div className="flex justify-between items-end mb-10">
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

            <div className="w-full max-w-xs space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">
                  {document.currency} {document.subtotal.toString()}
                </span>
              </div>

              {(isEditable || Number(document.discount) > 0) && (
                <div className="flex justify-between text-sm items-center">
                  <span className="text-gray-600">Discount</span>
                  {isEditable ? (
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-900">
                        {document.currency}
                      </span>
                      <Input
                        type="number"
                        step="0.01"
                        value={document.discount.toString()}
                        onChange={(e) => onDiscountUpdate(e.target.value)}
                        className="w-24 h-8 text-right !bg-white !border-gray-300 !text-gray-900"
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
                        onChange={(e) => onTaxUpdate(e.target.value)}
                        className="w-16 h-8 text-right !bg-white !border-gray-300 !text-gray-900 placeholder:!text-gray-400"
                        placeholder="%"
                      />
                    )}
                    {!isEditable && (
                      <span className="text-gray-600">
                        ({document.taxRate.toString()}%)
                      </span>
                    )}
                  </div>
                  <span className="font-medium text-gray-900">
                    {document.currency} {document.taxAmount.toString()}
                  </span>
                </div>
              )}

              <Separator className="bg-gray-200" />

              <div className="flex justify-between text-lg font-bold text-gray-900">
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
        )}
      />

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
                className="text-sm !bg-white !border-gray-300 !text-gray-900 placeholder:!text-gray-400"
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
          <div className="mt-10">
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
                className="text-sm !bg-white !border-gray-300 !text-gray-900 placeholder:!text-gray-400"
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
      <div className="mt-10 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
        <p>
          Thank you for your business!
          {type === "INVOICE" &&
            " Payment is due by the due date listed above."}
        </p>
      </div>
    </div>
  );
}
