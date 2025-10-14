"use client";

import { TemplateProps } from "../types";
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
