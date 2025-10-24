/**
 * ============================================================================
 * DOCUMENT EDIT BAR
 * ============================================================================
 *
 * Action bar displayed when editing a document.
 *
 * Features:
 * - Back navigation
 * - Template selector (switch between different template designs)
 * - Save button
 *
 * Location: /app/components/documents/bars/EditBar.tsx
 * Used by: TemplateRenderer (when isEditable = true)
 */

"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { DocumentWithRelations } from "../types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllTemplates } from "../registry";
import { getCurrencyOptions } from "@/lib/data-utils";

/**
 * DocumentEditBar Component
 *
 * Displays controls for editing a document, including template selection
 * and save functionality.
 *
 * @param document - The document being edited
 * @param templateId - Currently selected template ID
 * @param onTemplateChange - Callback when template is changed
 * @param onCurrencyChange - Callback when currency is changed
 * @param onSave - Callback when save button is clicked
 * @param isSaving - Whether the document is currently being saved
 */
export function DocumentEditBar({
  document,
  templateId = "classic",
  onTemplateChange,
  onCurrencyChange,
  onSave,
  isSaving = false,
}: {
  document: DocumentWithRelations;
  templateId?: string;
  onTemplateChange?: (templateId: string) => void;
  onCurrencyChange?: (currency: string) => void;
  onSave?: () => void;
  isSaving?: boolean;
}) {
  const router = useRouter();
  const templates = getAllTemplates();
  const currencyOptions = getCurrencyOptions();

  return (
    <>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back</span>
        </Button>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            Template:
          </span>
          <Select value={templateId} onValueChange={onTemplateChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select template" />
            </SelectTrigger>
            <SelectContent>
              {templates.map((template) => (
                <SelectItem
                  key={template.metadata.id}
                  value={template.metadata.id}
                >
                  {template.metadata.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            Currency:
          </span>
          <Select value={document.currency} onValueChange={onCurrencyChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {currencyOptions.map((currency) => (
                <SelectItem key={currency.value} value={currency.value}>
                  {currency.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button onClick={onSave} disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </>
  );
}
