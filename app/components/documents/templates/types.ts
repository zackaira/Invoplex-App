import { Prisma } from "@/app/generated/prisma";

/**
 * ============================================================================
 * CORE DOCUMENT TYPES
 * ============================================================================
 */

/**
 * Document with all related data from the database
 * Used throughout the application for document operations
 */
export type DocumentWithRelations = Prisma.DocumentGetPayload<{
  include: {
    client: true;
    contact: true;
    items: true;
    payments: true;
  };
}>;

/**
 * Controls which business information fields are visible in templates
 * Used by: TemplateHeaderProps, BusinessInfoVisibilityModal
 */
export interface BusinessInfoVisibility {
  businessName: boolean;
  personalName: boolean;
  email: boolean;
  phone: boolean;
  website: boolean;
  taxId: boolean;
  address: boolean;
}

/**
 * ============================================================================
 * TEMPLATE COMPONENT PROPS
 * Shared interfaces used by template components to ensure consistency
 * ============================================================================
 */

/**
 * Props for the main template component wrapper
 * Used by: ClassicTemplate, ModernTemplate, etc.
 */
export interface TemplateProps {
  document: DocumentWithRelations;
  type: "QUOTE" | "INVOICE";
  isEditable?: boolean;
  onUpdate?: (updates: Partial<DocumentWithRelations>) => void;
  onOpenProjectModal?: () => void;
  onOpenClientModal?: () => void;
  onOpenBusinessInfoModal?: () => void;
  businessInfoVisibility?: BusinessInfoVisibility;
}

/**
 * Props for template header components
 * Used by: ClassicHeader, ModernHeader, and all future template headers
 */
export interface TemplateHeaderProps {
  document: DocumentWithRelations;
  type: "QUOTE" | "INVOICE";
  isEditable?: boolean;
  onUpdate?: (updates: Partial<DocumentWithRelations>) => void;
  onOpenProjectModal?: () => void;
  onOpenClientModal?: () => void;
  onOpenBusinessInfoModal?: () => void;
  businessInfoVisibility?: BusinessInfoVisibility;
}

/**
 * Props for template items/table components
 * Used by: ClassicItems, ModernItems, and all future template item components
 */
export interface TemplateItemsProps {
  document: DocumentWithRelations;
  isEditable?: boolean;
  onUpdate?: (updates: Partial<DocumentWithRelations>) => void;
}

/**
 * Props for template footer components
 * Used by: ClassicFooter, ModernFooter, and all future template footers
 */
export interface TemplateFooterProps {
  document: DocumentWithRelations;
  type: "QUOTE" | "INVOICE";
  isEditable?: boolean;
  onUpdate?: (updates: Partial<DocumentWithRelations>) => void;
}

/**
 * ============================================================================
 * TEMPLATE REGISTRY TYPES
 * Types for template registration and metadata
 * ============================================================================
 */

/**
 * Metadata about a template (for display in template selector)
 * Used by: Template registry, template selection UI
 */
export interface TemplateMetadata {
  id: string;
  name: string;
  description: string;
  preview: string;
  category?: string;
  isPremium: boolean;
  price?: number;
  features?: string[];
  tier?: "FREE" | "PRO" | "PREMIUM";
}

/**
 * Full template definition including metadata and components
 * Used by: Template registry
 */
export interface Template {
  metadata: TemplateMetadata;
  component: React.ComponentType<TemplateProps>;
  pdfComponent?: React.ComponentType<TemplateProps>;
  containerClassName?: string;
}
