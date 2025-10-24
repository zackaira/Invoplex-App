/**
 * Validation Adapter Interface
 *
 * This file defines the contract (interface) that any validation library must implement.
 * It's the foundation of the Adapter Pattern used in this validation system.
 *
 * WHY THIS EXISTS:
 * - Decouples the app from specific validation libraries (currently Zod)
 * - Provides a consistent API regardless of underlying library
 * - Makes it possible to switch libraries without rewriting app code
 *
 * HOW IT WORKS:
 * 1. This file defines WHAT methods a validation adapter must have
 * 2. zod-adapter.ts implements these methods using Zod
 * 3. Application code uses the adapter interface, not Zod directly
 *
 * IMPLEMENTATION:
 * See zod-adapter.ts for the Zod implementation of this interface
 */

// ============================================
// TYPE DEFINITIONS
// ============================================

/**
 * Represents a single validation error for a field
 */
export type ValidationError = {
  path: string[]; // Field path (e.g., ["address", "city"])
  message: string; // Human-readable error message
};

/**
 * Result of validating an entire form/object
 */
export type ValidationResult<T = unknown> = {
  success: boolean; // True if validation passed
  data?: T; // The validated and transformed data (if success)
  errors?: ValidationError[]; // Array of errors (if failed)
};

/**
 * Result of validating a single field
 * Used for real-time field validation in forms
 */
export type FieldValidationResult = {
  isValid: boolean; // True if field is valid
  error?: string; // Error message (if invalid)
};

// ============================================
// ADAPTER INTERFACE
// ============================================

/**
 * ValidationAdapter Interface
 *
 * Any validation library adapter must implement these methods.
 * This ensures consistent validation behavior across the application.
 */
export interface ValidationAdapter<TSchema = unknown> {
  /**
   * Validate data against a schema
   * @param schema - The validation schema
   * @param data - The data to validate
   * @returns ValidationResult with success status, validated data, or errors
   */
  validate<T>(schema: TSchema, data: unknown): ValidationResult<T>;

  /**
   * Validate data against a schema asynchronously
   * @param schema - The validation schema
   * @param data - The data to validate
   * @returns Promise with ValidationResult
   */
  validateAsync<T>(
    schema: TSchema,
    data: unknown
  ): Promise<ValidationResult<T>>;

  /**
   * Validate a single field
   * @param schema - The validation schema
   * @param fieldName - The name of the field to validate
   * @param value - The value to validate
   * @returns FieldValidationResult with validity status and error message
   */
  validateField(
    schema: TSchema,
    fieldName: string,
    value: unknown
  ): FieldValidationResult;

  /**
   * Get error message for a specific field from validation errors
   * @param errors - Array of validation errors
   * @param fieldName - The field name to get error for
   * @returns Error message string or undefined
   */
  getFieldError(
    errors: ValidationError[],
    fieldName: string
  ): string | undefined;

  /**
   * Check if a field has an error in the errors array
   * @param errors - Array of validation errors
   * @param fieldName - The field name to check
   * @returns True if field has error, false otherwise
   */
  hasFieldError(errors: ValidationError[], fieldName: string): boolean;

  /**
   * Format validation errors into a more readable structure
   * @param errors - Array of validation errors
   * @returns Record of field names to error messages
   */
  formatErrors(errors: ValidationError[]): Record<string, string>;
}
