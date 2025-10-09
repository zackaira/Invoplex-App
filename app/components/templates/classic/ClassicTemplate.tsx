import { TemplateProps } from "../types";
import { ClassicHeader } from "./ClassicHeader";
import { ClassicItems } from "./ClassicItems";
import { ClassicFooter } from "./ClassicFooter";

export function ClassicTemplate({
  document,
  type,
  isEditable = false,
  onUpdate,
}: TemplateProps) {
  return (
    <div className="bg-white border border-border p-8 mx-auto max-w-[960px] shadow-xl/30 rounded-xs">
      <ClassicHeader
        document={document}
        type={type}
        isEditable={isEditable}
        onUpdate={onUpdate}
      />

      <div className="my-8">
        <ClassicItems
          document={document}
          isEditable={isEditable}
          onUpdate={onUpdate}
        />
      </div>

      <ClassicFooter
        document={document}
        type={type}
        isEditable={isEditable}
        onUpdate={onUpdate}
      />
    </div>
  );
}
