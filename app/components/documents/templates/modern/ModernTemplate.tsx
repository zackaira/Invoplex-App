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
  onOpenClientInfoModal,
  businessInfoVisibility,
  clientInfoVisibility,
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
        onOpenClientInfoModal={onOpenClientInfoModal}
        businessInfoVisibility={businessInfoVisibility}
        clientInfoVisibility={clientInfoVisibility}
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
