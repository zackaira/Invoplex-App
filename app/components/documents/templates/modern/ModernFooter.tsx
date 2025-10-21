"use client";

import { useState } from "react";
import { TemplateFooterProps } from "../../types";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { BrandingSection, TotalsSection } from "../../shared";

export function ModernFooter({
  document,
  type,
  isEditable = false,
  onUpdate,
  businessSettings,
}: TemplateFooterProps) {
  // Track whether to show notes and terms sections
  const [showNotes, setShowNotes] = useState(
    (document as any).showNotes ?? !!document.notes
  );
  const [showTerms, setShowTerms] = useState(
    (document as any).showTerms ?? !!document.terms
  );
  return (
    <div>
      {/* Totals Section with Modern Gradient Background */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-lg mb-10">
        <div className="flex justify-between items-end">
          <BrandingSection />
          <TotalsSection
            document={document}
            type={type}
            isEditable={isEditable}
            onUpdate={onUpdate}
            businessSettings={businessSettings}
          />
        </div>
      </div>

      {/* Notes and Terms */}
      <div className="grid grid-cols-2 gap-6">
        {(isEditable || (showNotes && document.notes)) && (
          <div className="bg-yellow-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3
                className={`text-sm font-bold uppercase ${
                  showNotes ? "text-yellow-800" : "text-yellow-500"
                }`}
              >
                📝 Notes
              </h3>
              {isEditable && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-yellow-700">
                    {showNotes ? "On" : "Off"}
                  </span>
                  <Switch
                    checked={showNotes}
                    onCheckedChange={(checked) => {
                      setShowNotes(checked);
                      onUpdate?.({ showNotes: checked } as any);
                    }}
                    className="data-[state=checked]:bg-yellow-600 scale-75"
                  />
                </div>
              )}
            </div>
            {showNotes && (
              <>
                {isEditable ? (
                  <Textarea
                    id="document-notes"
                    name="document-notes"
                    value={document.notes || ""}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      onUpdate?.({ notes: e.target.value })
                    }
                    autoResize
                    placeholder="Add notes for your client..."
                    className="!bg-white !border-gray-300 !text-gray-900 placeholder:!text-gray-400"
                    rows={4}
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
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3
                className={`text-sm font-bold uppercase ${
                  showTerms ? "text-blue-800" : "text-blue-400"
                }`}
              >
                📋 Terms & Conditions
              </h3>
              {isEditable && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-blue-700">
                    {showTerms ? "On" : "Off"}
                  </span>
                  <Switch
                    checked={showTerms}
                    onCheckedChange={(checked) => {
                      setShowTerms(checked);
                      onUpdate?.({ showTerms: checked } as any);
                    }}
                    className="data-[state=checked]:bg-blue-600 scale-75"
                  />
                </div>
              )}
            </div>
            {showTerms && (
              <>
                {isEditable ? (
                  <Textarea
                    id="document-terms"
                    name="document-terms"
                    value={document.terms || ""}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      onUpdate?.({ terms: e.target.value })
                    }
                    autoResize
                    placeholder="Add terms and conditions..."
                    className="!bg-white !border-gray-300 !text-gray-900 placeholder:!text-gray-400"
                    rows={4}
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
