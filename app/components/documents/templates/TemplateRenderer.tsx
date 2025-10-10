import { getTemplate } from "./registry";
import { TemplateProps } from "./types";

interface TemplateRendererProps extends TemplateProps {
  templateId?: string;
}

export function TemplateRenderer({
  templateId = "classic",
  document,
  type,
  isEditable = false,
  onUpdate,
}: TemplateRendererProps) {
  const template = getTemplate(templateId);
  const TemplateComponent = template.component;

  return (
    <div className="bg-accent py-12">
      <TemplateComponent
        document={document}
        type={type}
        isEditable={isEditable}
        onUpdate={onUpdate}
      />
    </div>
  );
}
