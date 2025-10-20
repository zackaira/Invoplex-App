"use client";

import { useState } from "react";
import { TemplateFooterProps } from "../../types";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { BrandingSection, TotalsSection } from "../../shared";

export function ClassicFooter({
  document,
  type,
  isEditable = false,
  onUpdate,
}: TemplateFooterProps) {
  // Track whether to show notes and terms sections
  const [showNotes, setShowNotes] = useState(!!document.notes);
  const [showTerms, setShowTerms] = useState(!!document.terms);

  return (
    <div>
      {/* Totals Section */}
      <div className="flex justify-between items-end mb-10">
        <BrandingSection />
        <TotalsSection
          document={document}
          type={type}
          isEditable={isEditable}
          onUpdate={onUpdate}
        />
      </div>

      {/* Notes and Terms */}
      <div className="space-y-6">
        {(isEditable || (showNotes && document.notes)) && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3
                className={`text-sm font-semibold uppercase ${
                  showNotes ? "text-gray-500" : "text-gray-300"
                }`}
              >
                Notes
              </h3>
              {isEditable && (
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs ${
                      showNotes ? "text-black" : "text-gray-500"
                    }`}
                  >
                    {showNotes ? "On" : "Off"}
                  </span>
                  <Switch
                    checked={showNotes}
                    onCheckedChange={setShowNotes}
                    className="data-[state=checked]:!bg-black scale-75 !bg-gray-200 data-[state=unchecked]:!bg-gray-200 [&>span]:!bg-white"
                  />
                </div>
              )}
            </div>
            {showNotes && (
              <>
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
              </>
            )}
          </div>
        )}

        {(isEditable || (showTerms && document.terms)) && (
          <div className="mt-10">
            <div className="flex items-center justify-between mb-2">
              <h3
                className={`text-sm font-semibold uppercase ${
                  showTerms ? "text-gray-500" : "text-gray-300"
                }`}
              >
                Terms & Conditions
              </h3>
              {isEditable && (
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs ${
                      showTerms ? "text-black" : "text-gray-500"
                    }`}
                  >
                    {showTerms ? "On" : "Off"}
                  </span>
                  <Switch
                    checked={showTerms}
                    onCheckedChange={setShowTerms}
                    className="data-[state=checked]:!bg-black scale-75 !bg-gray-200 data-[state=unchecked]:!bg-gray-200 [&>span]:!bg-white"
                  />
                </div>
              )}
            </div>
            {showTerms && (
              <>
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
              </>
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
