import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Template } from "@/app/components/documents/templates/types";

interface TemplateCarouselItemProps {
  template: Template;
  isSelected: boolean;
  onSelect: (templateId: string) => void;
}

export function TemplateCarouselItem({
  template,
  isSelected,
  onSelect,
}: TemplateCarouselItemProps) {
  const getPreviewStyle = () => {
    switch (template.metadata.id) {
      case "classic":
        return "bg-muted";
      case "modern":
        return "bg-gradient-to-br from-muted to-muted/50";
      default:
        return "bg-background border";
    }
  };

  const renderPreviewContent = () => {
    return (
      <>
        <div className="h-8 bg-background rounded" />
        <div className="h-3 bg-background/70 rounded w-3/4" />
        <div className="h-3 bg-background/70 rounded w-1/2" />
        <div className="mt-6 space-y-2">
          <div className="h-2 bg-background/50 rounded" />
          <div className="h-2 bg-background/50 rounded" />
          <div className="h-2 bg-background/50 rounded w-4/5" />
        </div>
      </>
    );
  };

  return (
    <div className="p-2">
      <div
        onClick={() => onSelect(template.metadata.id)}
        className={`relative cursor-pointer rounded-lg border-2 transition-all ${
          isSelected
            ? "border-primary shadow-lg"
            : "border-border hover:border-primary/50"
        }`}
      >
        {/* Selected Check Mark */}
        {isSelected && (
          <div className="absolute -top-2 -right-2 z-10 bg-primary text-primary-foreground rounded-full p-1">
            <Check className="h-4 w-4" />
          </div>
        )}

        {/* Tier Badge */}
        <div className="absolute top-2 left-2 z-10">
          <Badge
            variant={template.metadata.isPremium ? "default" : "secondary"}
            className="text-xs font-semibold"
          >
            {template.metadata.tier || "FREE"}
          </Badge>
        </div>

        {/* Template Preview */}
        <div
          className={`aspect-[3/4] rounded-md overflow-hidden ${getPreviewStyle()}`}
        >
          <div className="p-4 space-y-3">{renderPreviewContent()}</div>
        </div>

        {/* Template Info */}
        <div className="p-3 text-center border-t">
          <p className="font-semibold text-sm">{template.metadata.name}</p>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {template.metadata.description}
          </p>
        </div>
      </div>
    </div>
  );
}
