/**
 * Validation Module - Central Export Point
 *
 * This module provides a flexible validation system using the Adapter Pattern.
 *
 * ARCHITECTURE:
 * - adapter.ts: Defines the ValidationAdapter interface (the contract)
 * - zod-adapter.ts: Implements the interface using Zod library
 * - Application code uses the adapter, NOT Zod directly
 *
 * BENEFITS:
 * - Decouples validation logic from specific library (Zod)
 * - Makes it easy to swap validation libraries if needed
 * - Provides consistent validation API across the app
 * - Centralizes error handling and formatting
 *
 * USAGE:
 * Import { zodAdapter } from "@/lib/validation"
 * const result = zodAdapter.validate(schema, data)
 */

// ============================================
// ADAPTER TYPES & INTERFACE
// ============================================
// Type definitions for validation results and errors
// These are library-agnostic and used throughout the app
export type {
  ValidationAdapter,
  ValidationError,
  ValidationResult,
  FieldValidationResult,
} from "./adapter";

// ============================================
// ZOD ADAPTER IMPLEMENTATION
// ============================================
// The concrete implementation using Zod library
// Use 'zodAdapter' instance for all validation operations
export { ZodAdapter, zodAdapter } from "./zod-adapter";

// ============================================
// VALIDATION SCHEMAS
// ============================================
// All settings-related validation schemas and types
export {
  // Schemas
  businessProfileSchema,
  brandSettingsSchema,
  getFinancialSettingsSchema,
  quoteSettingsSchema,
  getInvoiceSettingsSchema,
  templateSettingsSchema,

  // TypeScript types inferred from schemas
  type BusinessProfileFormData,
  type BrandSettingsFormData,
  type FinancialSettingsFormData,
  type QuoteSettingsFormData,
  type InvoiceSettingsFormData,
  type TemplateSettingsFormData,
} from "./schemas/settings";
