"use client";

import { TemplateProps } from "../types";
import { ModernHeader } from "./ModernHeader";
import { ModernItems } from "./ModernItems";
import { ModernFooter } from "./ModernFooter";

export function ModernTemplate({
  document,
  type,
  isEditable = false,
  onUpdate,
}: TemplateProps) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 mx-auto max-w-[960px] shadow-2xl rounded-lg overflow-hidden">
      <ModernHeader
        document={document}
        type={type}
        isEditable={isEditable}
        onUpdate={onUpdate}
      />

      <div className="p-8">
        <div className="mb-8">
          <ModernItems
            document={document}
            isEditable={isEditable}
            onUpdate={onUpdate}
          />
        </div>

        <ModernFooter
          document={document}
          type={type}
          isEditable={isEditable}
          onUpdate={onUpdate}
        />
      </div>
    </div>
  );
}
