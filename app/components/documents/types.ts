/**
 * ============================================================================
 * DOCUMENT TYPES & INTERFACES
 * ============================================================================
 *
 * This file contains all TypeScript types and interfaces used throughout the
 * document system, including templates, components, and modals.
 *
 * Organization:
 * 1. Core Document Types - Database-related types
 * 2. Template Component Props - Shared props for template components
 * 3. Template Registry Types - Metadata and registration types
 *
 * Location: /app/components/documents/types.ts
 * Used by: All template components, TemplateRenderer, modals, and bars
 */

import { Prisma } from "@/app/generated/prisma";

/**
 * ============================================================================
 * CORE DOCUMENT TYPES
 * ============================================================================
 */

/**
 * Document with all related data from the database
 *
 * This is the primary document type used throughout the application.
 * It includes all relations (client, contact, items, payments) for convenience.
 *
 * Used by:
 * - TemplateRenderer
 * - All template components (ClassicTemplate, ModernTemplate, etc.)
 * - Document bars (EditBar, ViewBar)
 * - Document modals
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
 *
 * This interface allows users to customize which business details appear
 * in the document header (e.g., show email but hide tax ID).
 *
 * Used by:
 * - TemplateHeaderProps
 * - BusinessInfoVisibilityModal
 * - TemplateRenderer (manages state)
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
 * Controls which client information fields are visible in templates
 *
 * This interface allows users to customize which client details appear
 * in the document header (e.g., show email but hide contact).
 *
 * Used by:
 * - TemplateHeaderProps
 * - ClientInfoVisibilityModal
 * - ClientInfoDisplay component
 */
export interface ClientInfoVisibility {
  name: boolean;
  contact: boolean;
  address: boolean;
  email: boolean;
}

/**
 * Business settings from the database
 *
 * This interface contains the actual business profile data including
 * branding elements like logo and brand color, plus user settings for
 * document defaults.
 *
 * Used by:
 * - TemplateProps
 * - TemplateHeaderProps
 */
export interface BusinessSettings {
  // Business Profile fields
  personalName?: string | null;
  businessName: string;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  logo?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  country?: string | null;
  taxId?: string | null;
  registrationNumber?: string | null;
  brandColor?: string | null;

  // User Settings fields for documents
  quoteTitle?: string;
  invoiceTitle?: string;
  defaultCurrency?: string;
  currencyDisplayFormat?: string;
  taxName?: string;
  defaultTaxRate?: number;
  quoteDefaultNotes?: string | null;
  quoteDefaultTerms?: string | null;
  invoiceDefaultNotes?: string | null;
  invoiceDefaultTerms?: string | null;
}

/**
 * ============================================================================
 * TEMPLATE COMPONENT PROPS
 * ============================================================================
 *
 * These interfaces define the props for all template components.
 * When creating a new template, your components MUST use these interfaces
 * to ensure consistency and compatibility with the document system.
 */

/**
 * Props for the main template component wrapper
 *
 * This is the top-level props interface for entire templates.
 * Every template (e.g., ClassicTemplate, ModernTemplate) must accept these props.
 *
 * Used by:
 * - ClassicTemplate
 * - ModernTemplate
 * - Any new templates you create
 */
export interface TemplateProps {
  document: DocumentWithRelations;
  type: "QUOTE" | "INVOICE";
  isEditable?: boolean;
  onUpdate?: (updates: Partial<DocumentWithRelations>) => void;
  onOpenProjectModal?: () => void;
  onOpenClientModal?: () => void;
  onOpenBusinessInfoModal?: () => void;
  onOpenClientInfoModal?: () => void;
  businessInfoVisibility?: BusinessInfoVisibility;
  clientInfoVisibility?: ClientInfoVisibility;
  businessSettings?: BusinessSettings;
}

/**
 * Props for template header components
 *
 * Headers display the document title, dates, client info, and business info.
 * All template headers should use this interface for consistency.
 *
 * Used by:
 * - ClassicHeader
 * - ModernHeader
 * - Future template headers
 */
export interface TemplateHeaderProps {
  document: DocumentWithRelations;
  type: "QUOTE" | "INVOICE";
  isEditable?: boolean;
  onUpdate?: (updates: Partial<DocumentWithRelations>) => void;
  onOpenProjectModal?: () => void;
  onOpenClientModal?: () => void;
  onOpenBusinessInfoModal?: () => void;
  onOpenClientInfoModal?: () => void;
  businessInfoVisibility?: BusinessInfoVisibility;
  clientInfoVisibility?: ClientInfoVisibility;
  businessSettings?: BusinessSettings;
}

/**
 * Props for template items/table components
 *
 * Items components display the line items table with products/services,
 * quantities, prices, and totals.
 *
 * Used by:
 * - ClassicItems
 * - ModernItems
 * - Future template item components
 */
export interface TemplateItemsProps {
  document: DocumentWithRelations;
  isEditable?: boolean;
  onUpdate?: (updates: Partial<DocumentWithRelations>) => void;
  businessSettings?: BusinessSettings;
}

/**
 * Props for template footer components
 *
 * Footers display payment terms, notes, and other document footer information.
 *
 * Used by:
 * - ClassicFooter
 * - ModernFooter
 * - Future template footers
 */
export interface TemplateFooterProps {
  document: DocumentWithRelations;
  type: "QUOTE" | "INVOICE";
  isEditable?: boolean;
  onUpdate?: (updates: Partial<DocumentWithRelations>) => void;
  businessSettings?: BusinessSettings;
}

/**
 * ============================================================================
 * TEMPLATE REGISTRY TYPES
 * ============================================================================
 *
 * These types are used by the template registry system to register and
 * manage different template designs.
 */

/**
 * Metadata about a template
 *
 * This interface defines the information shown in the template selector UI.
 * When creating a new template, you'll need to provide this metadata.
 *
 * Used by:
 * - Template registry (registry.ts)
 * - Template selection UI in settings
 */
export interface TemplateMetadata {
  id: string; // Unique identifier (e.g., "classic", "modern")
  name: string; // Display name (e.g., "Classic")
  description: string; // Short description shown in template selector
  preview: string; // Path to preview image
  category?: string; // Optional category for grouping
  isPremium: boolean; // Whether this template requires a premium subscription
  price?: number; // Price if applicable
  features?: string[]; // List of template features
  tier?: "FREE" | "PRO" | "PREMIUM"; // Template tier/pricing level
}

/**
 * Full template definition
 *
 * This interface combines metadata with the actual React component.
 * Every template in the registry must conform to this interface.
 *
 * Used by:
 * - Template registry (registry.ts)
 * - TemplateRenderer (to load and render templates)
 */
export interface Template {
  metadata: TemplateMetadata;
  component: React.ComponentType<TemplateProps>; // The main template component
  pdfComponent?: React.ComponentType<TemplateProps>; // Optional PDF-specific version
  containerClassName?: string; // Optional custom container styling
}
