import { Template } from "./types";
import { ClassicTemplate } from "./classic/ClassicTemplate";
import { ModernTemplate } from "./modern/ModernTemplate";

export const templateRegistry: Record<string, Template> = {
  classic: {
    metadata: {
      id: "classic",
      name: "Classic",
      description: "Traditional professional layout with clean design",
      preview: "/templates/classic-preview.png",
      isPremium: false,
      tier: "FREE",
    },
    component: ClassicTemplate,
  },
  modern: {
    metadata: {
      id: "modern",
      name: "Modern",
      description:
        "Contemporary design with gradient accents and card-based layout",
      preview: "/templates/modern-preview.png",
      isPremium: false,
      tier: "FREE",
    },
    component: ModernTemplate,
  },
  // Add more templates here as you create them
  // elegant: { ... },
  // minimal: { ... },
};

export const getTemplate = (templateId: string): Template => {
  return templateRegistry[templateId] || templateRegistry.classic;
};

export const getAllTemplates = (): Template[] => {
  return Object.values(templateRegistry);
};

export const getFreeTemplates = (): Template[] => {
  return Object.values(templateRegistry).filter((t) => !t.metadata.isPremium);
};

export const getPremiumTemplates = (): Template[] => {
  return Object.values(templateRegistry).filter((t) => t.metadata.isPremium);
};
