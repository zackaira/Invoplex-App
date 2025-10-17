"use client";

import { useState } from "react";
import { DocumentWithRelations } from "../types";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DocumentTotals } from "../items/Totals";

interface TotalsSectionProps {
  document: DocumentWithRelations;
  type: "QUOTE" | "INVOICE";
  isEditable?: boolean;
  onUpdate?: (updates: Partial<DocumentWithRelations>) => void;
}

export function TotalsSection({
  document,
  type,
  isEditable = false,
  onUpdate,
}: TotalsSectionProps) {
  // Track whether to show discount and tax
  const [showDiscount, setShowDiscount] = useState(
    Number(document.discount) > 0
  );
  const [showTax, setShowTax] = useState(Number(document.taxRate) > 0);
  // Track discount type (fixed or percentage)
  const [discountType, setDiscountType] = useState<"fixed" | "percentage">(
    "fixed"
  );

  return (
    <DocumentTotals
      document={document}
      type={type}
      isEditable={isEditable}
      onUpdate={onUpdate}
      render={({ document, isEditable, onTaxUpdate, onDiscountUpdate }) => (
        <div className="w-full max-w-sm space-y-2">
          <div className="flex justify-between text-sm items-center">
            <div className="flex items-center gap-2">
              {isEditable && (
                <div className="flex items-center gap-2 w-[80px] min-h-[5px]"></div>
              )}
              <span>SubTotal</span>
            </div>

            <span className="font-medium">
              {document.currency} {document.subtotal.toString()}
            </span>
          </div>

          {(isEditable || (showDiscount && Number(document.discount) > 0)) && (
            <div className="flex justify-between text-sm items-center">
              <div className="flex items-center gap-2">
                {isEditable && (
                  <div className="flex items-center gap-1 w-[80px]">
                    <span className="text-xs text-gray-500">
                      {showDiscount ? "On" : "Off"}
                    </span>
                    <Switch
                      checked={showDiscount}
                      onCheckedChange={setShowDiscount}
                      className="data-[state=checked]:bg-invoplex scale-75"
                    />
                  </div>
                )}
                <span className={showDiscount ? "" : "text-gray-300"}>
                  Discount
                </span>
              </div>
              {showDiscount && (
                <>
                  {isEditable ? (
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-900">
                        {discountType === "fixed" ? document.currency : ""}
                      </span>
                      <Input
                        type="number"
                        step="0.01"
                        value={document.discount.toString()}
                        onChange={(e) => onDiscountUpdate(e.target.value)}
                        className="w-19 h-8 text-right !bg-white !border-gray-300 !text-gray-900"
                      />

                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 !border-gray-300"
                          >
                            {discountType === "fixed" ? (
                              <span>$</span>
                            ) : (
                              <span>%</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-48 p-2" align="end">
                          <div className="space-y-1">
                            <Button
                              variant={
                                discountType === "fixed" ? "default" : "ghost"
                              }
                              size="sm"
                              className="w-full justify-start"
                              onClick={() => setDiscountType("fixed")}
                            >
                              Fixed Amount
                            </Button>
                            <Button
                              variant={
                                discountType === "percentage"
                                  ? "default"
                                  : "ghost"
                              }
                              size="sm"
                              className="w-full justify-start"
                              onClick={() => setDiscountType("percentage")}
                            >
                              % Percentage
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  ) : (
                    <span className="font-medium text-red-600">
                      -{discountType === "fixed" ? document.currency : ""}{" "}
                      {document.discount.toString()}
                      {discountType === "percentage" ? "%" : ""}
                    </span>
                  )}
                </>
              )}
            </div>
          )}

          {(isEditable || (showTax && Number(document.taxRate) > 0)) && (
            <div className="flex justify-between text-sm items-center">
              <div className="flex items-center gap-2">
                {isEditable && (
                  <div className="flex items-center gap-1 w-[80px]">
                    <span className="text-xs text-gray-500">
                      {showTax ? "On" : "Off"}
                    </span>
                    <Switch
                      checked={showTax}
                      onCheckedChange={setShowTax}
                      className="data-[state=checked]:bg-invoplex scale-75"
                    />
                  </div>
                )}
                <span className={showTax ? "" : "text-gray-300"}>Tax</span>
                {isEditable && showTax && (
                  <>
                    <Input
                      type="number"
                      step="0.01"
                      value={document.taxRate.toString()}
                      onChange={(e) => onTaxUpdate(e.target.value)}
                      className="w-20 h-8 text-right !bg-white !border-gray-300 !text-gray-900 placeholder:!text-gray-400"
                      placeholder="%"
                    />
                    <span>%</span>
                  </>
                )}
                {!isEditable && showTax && (
                  <span className="text-gray-600">
                    ({document.taxRate.toString()}%)
                  </span>
                )}
              </div>
              {showTax && (
                <span className="font-medium text-gray-900">
                  {document.currency} {document.taxAmount.toString()}
                </span>
              )}
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
      )}
    />
  );
}
