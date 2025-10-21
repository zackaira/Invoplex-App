"use client";

import { useState } from "react";
import { DocumentWithRelations, BusinessSettings } from "../types";
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
import { formatCurrency, formatCurrencyInput } from "@/lib/currency-utils";

interface TotalsSectionProps {
  document: DocumentWithRelations;
  type: "QUOTE" | "INVOICE";
  isEditable?: boolean;
  onUpdate?: (updates: Partial<DocumentWithRelations>) => void;
  businessSettings?: BusinessSettings;
}

export function TotalsSection({
  document,
  type,
  isEditable = false,
  onUpdate,
  businessSettings,
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

  // Get tax name from settings or use default
  const taxName = businessSettings?.taxName || "Tax";

  // Get currency display preferences
  const currencyCode = document.currency;
  const displayFormat =
    businessSettings?.currencyDisplayFormat || "symbol_before";
  const currencySymbol = formatCurrencyInput(currencyCode, displayFormat);

  return (
    <DocumentTotals
      document={document}
      type={type}
      isEditable={isEditable}
      onUpdate={onUpdate}
      render={({ document, isEditable, onTaxUpdate, onDiscountUpdate }) => (
        <div
          className={`w-full space-y-2 text-gray-600 ${
            !isEditable ? "max-w-[300px]" : "max-w-[388px]"
          }`}
        >
          <div className="flex justify-between text-sm items-center">
            <div className="flex items-center gap-2">
              {isEditable && (
                <div className="flex items-center gap-2 w-[80px] min-h-[5px]"></div>
              )}
              <span>SubTotal</span>
            </div>

            <span className="font-medium">
              {formatCurrency(
                document.subtotal.toString(),
                currencyCode,
                displayFormat
              )}
            </span>
          </div>

          {(isEditable || (showDiscount && Number(document.discount) > 0)) && (
            <div className="flex justify-between text-sm items-center">
              <div className="flex items-center gap-2">
                {isEditable && (
                  <div className="flex items-center gap-1 w-[80px]">
                    <span
                      className={`text-xs ${
                        showDiscount ? "text-black" : "text-gray-500"
                      }`}
                    >
                      {showDiscount ? "On" : "Off"}
                    </span>
                    <Switch
                      checked={showDiscount}
                      onCheckedChange={setShowDiscount}
                      className="data-[state=checked]:!bg-black scale-75 !bg-gray-200 data-[state=unchecked]:!bg-gray-200 [&>span]:!bg-white"
                    />
                  </div>
                )}
                <span className={`${showDiscount ? "" : "text-gray-400"}`}>
                  Discount
                </span>
              </div>

              {showDiscount && (
                <>
                  {isEditable ? (
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-900">
                        {discountType === "fixed" ? currencySymbol : ""}
                      </span>
                      <Input
                        id="document-discount"
                        name="document-discount"
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
                      -
                      {discountType === "fixed"
                        ? formatCurrency(
                            document.discount.toString(),
                            currencyCode,
                            displayFormat
                          )
                        : `${document.discount.toString()}%`}
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
                    <span
                      className={`text-xs ${
                        showTax ? "text-black" : "text-gray-500"
                      }`}
                    >
                      {showTax ? "On" : "Off"}
                    </span>
                    <Switch
                      checked={showTax}
                      onCheckedChange={setShowTax}
                      className="data-[state=checked]:!bg-black scale-75 !bg-gray-200 data-[state=unchecked]:!bg-gray-200 [&>span]:!bg-white"
                    />
                  </div>
                )}

                <span className={`${showTax ? "" : "text-gray-400"}`}>
                  {taxName}
                </span>

                {isEditable && showTax && (
                  <>
                    <Input
                      id="document-tax-rate"
                      name="document-tax-rate"
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
                  <span>({document.taxRate.toString()}%)</span>
                )}
              </div>

              {showTax && (
                <span className="font-medium text-gray-900">
                  {formatCurrency(
                    document.taxAmount.toString(),
                    currencyCode,
                    displayFormat
                  )}
                </span>
              )}
            </div>
          )}

          <Separator className="bg-gray-200" />

          <div className="flex justify-between text-lg font-bold text-gray-900">
            {isEditable && (
              <div className="flex items-center gap-1 w-[90px]"></div>
            )}
            <span>Total</span>
            <span className="flex-1 text-right">
              {formatCurrency(
                document.total.toString(),
                currencyCode,
                displayFormat
              )}
            </span>
          </div>
        </div>
      )}
    />
  );
}
