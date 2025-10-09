import { Template } from "./types";
import { ClassicTemplate } from "./classic/ClassicTemplate";

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
  // Add more templates here as you create them
  // modern: { ... },
  // elegant: { ... },
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
