/**
 * ============================================================================
 * TEMPLATE REGISTRY
 * ============================================================================
 *
 * This file is the central registry for all document templates.
 *
 * HOW TO ADD A NEW TEMPLATE:
 * 1. Create a new folder in /templates/ (e.g., /templates/elegant/)
 * 2. Create your template components (ElegantTemplate.tsx, ElegantHeader.tsx, etc.)
 * 3. Import your template component here
 * 4. Add it to the templateRegistry object with metadata
 * 5. Your template will automatically appear in the template selector!
 *
 * Location: /app/components/documents/registry.ts
 * Used by: TemplateRenderer, template selection UI
 */

import { Template } from "./types";
import { ClassicTemplate } from "./templates/classic/ClassicTemplate";
import { ModernTemplate } from "./templates/modern/ModernTemplate";

/**
 * Template Registry
 *
 * This is where all available templates are registered.
 * Each template is identified by a unique string key.
 */
export const templateRegistry: Record<string, Template> = {
  // Classic Template - Traditional professional layout
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

  // Modern Template - Contemporary design with gradients
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

  // TO ADD A NEW TEMPLATE:
  // Uncomment and customize the following example:
  //
  // elegant: {
  //   metadata: {
  //     id: "elegant",
  //     name: "Elegant",
  //     description: "Sophisticated design with serif fonts and gold accents",
  //     preview: "/templates/elegant-preview.png",
  //     isPremium: true,
  //     tier: "PRO",
  //   },
  //   component: ElegantTemplate,
  // },
};

/**
 * Get a specific template by ID
 * Falls back to Classic template if the requested template doesn't exist
 *
 * @param templateId - The unique template identifier
 * @returns The requested template or the default Classic template
 */
export const getTemplate = (templateId: string): Template => {
  return templateRegistry[templateId] || templateRegistry.classic;
};

/**
 * Get all available templates
 *
 * @returns Array of all registered templates
 */
export const getAllTemplates = (): Template[] => {
  return Object.values(templateRegistry);
};

/**
 * Get only free templates
 *
 * @returns Array of templates that don't require a premium subscription
 */
export const getFreeTemplates = (): Template[] => {
  return Object.values(templateRegistry).filter((t) => !t.metadata.isPremium);
};

/**
 * Get only premium templates
 *
 * @returns Array of templates that require a premium subscription
 */
export const getPremiumTemplates = (): Template[] => {
  return Object.values(templateRegistry).filter((t) => t.metadata.isPremium);
};
