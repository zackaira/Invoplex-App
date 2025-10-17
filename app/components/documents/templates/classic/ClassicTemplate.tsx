"use client";

import { TemplateProps } from "../../types";
import { ClassicHeader } from "./ClassicHeader";
import { ClassicItems } from "./ClassicItems";
import { ClassicFooter } from "./ClassicFooter";

export function ClassicTemplate({
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
      <ClassicHeader
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

      <ClassicItems
        document={document}
        isEditable={isEditable}
        onUpdate={onUpdate}
      />

      <ClassicFooter
        document={document}
        type={type}
        isEditable={isEditable}
        onUpdate={onUpdate}
      />
    </>
  );
}
