"use client";

import { TemplateProps } from "../../types";
import { ModernHeader } from "./ModernHeader";
import { ModernItems } from "./ModernItems";
import { ModernFooter } from "./ModernFooter";

export function ModernTemplate({
  document,
  type,
  isEditable = false,
  onUpdate,
  onOpenProjectModal,
  onOpenClientModal,
  onOpenBusinessInfoModal,
  businessInfoVisibility,
  businessSettings,
}: TemplateProps) {
  return (
    <>
      <ModernHeader
        document={document}
        type={type}
        isEditable={isEditable}
        onUpdate={onUpdate}
        onOpenProjectModal={onOpenProjectModal}
        onOpenClientModal={onOpenClientModal}
        onOpenBusinessInfoModal={onOpenBusinessInfoModal}
        businessInfoVisibility={businessInfoVisibility}
        businessSettings={businessSettings}
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
    </>
  );
}
