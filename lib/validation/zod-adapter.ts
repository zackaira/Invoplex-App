/**
 * Zod Validation Adapter
 *
 * This is the concrete implementation of the ValidationAdapter interface using Zod.
 *
 * WHY THIS EXISTS:
 * - Implements the ValidationAdapter interface specifically for Zod
 * - Converts Zod errors to our generic ValidationError format
 * - Provides helper methods for working with validation errors
 *
 * USAGE IN THE APP:
 * Import the singleton instance 'zodAdapter' and use it for all validation:
 *
 * // Server actions (lib/actions/settings.ts)
 * const result = zodAdapter.validate(businessProfileSchema, formData)
 *
 * // React hooks (hooks/use-validation.ts)
 * const result = await zodAdapter.validateAsync(schema, data)
 *
 * METHODS OVERVIEW:
 * - validate(): Sync validation of entire object
 * - validateAsync(): Async validation (for refinements with async checks)
 * - validateField(): Validate single field (for real-time form feedback)
 * - getFieldError(): Extract error message for specific field
 * - hasFieldError(): Check if field has validation error
 * - formatErrors(): Convert error array to field-name => message map
 */

import { z } from "zod";
import type {
  ValidationAdapter,
  ValidationResult,
  ValidationError,
  FieldValidationResult,
} from "./adapter";

/**
 * ZodAdapter Class
 *
 * Implements all methods defined in the ValidationAdapter interface.
 * Each method wraps Zod functionality and converts results to our generic format.
 */
export class ZodAdapter implements ValidationAdapter {
  /**
   * Validate data synchronously
   *
   * @param schema - Zod schema to validate against
   * @param data - The data to validate
   * @returns ValidationResult with success flag, validated data, or errors
   */
  validate<T>(schema: z.ZodType<T>, data: unknown): ValidationResult<T> {
    const result = schema.safeParse(data);

    if (result.success) {
      return {
        success: true,
        data: result.data,
      };
    }

    return {
      success: false,
      errors: this.convertZodErrors(result.error),
    };
  }

  /**
   * Validate data asynchronously
   *
   * Use this for schemas with async refinements (e.g., database checks)
   *
   * @param schema - Zod schema to validate against
   * @param data - The data to validate
   * @returns Promise resolving to ValidationResult
   */
  async validateAsync<T>(
    schema: z.ZodType<T>,
    data: unknown
  ): Promise<ValidationResult<T>> {
    const result = await schema.safeParseAsync(data);

    if (result.success) {
      return {
        success: true,
        data: result.data,
      };
    }

    return {
      success: false,
      errors: this.convertZodErrors(result.error),
    };
  }

  /**
   * Validate a single field in isolation
   *
   * Used for real-time validation as users type in forms.
   * Creates a partial object with just the field being validated.
   *
   * @param schema - The full schema (we'll validate just one field from it)
   * @param fieldName - Name of the field to validate
   * @param value - The field's value
   * @returns FieldValidationResult with validity status and error message
   */
  validateField(
    schema: z.ZodType,
    fieldName: string,
    value: unknown
  ): FieldValidationResult {
    // Create a partial object containing only this field
    // Then validate it against the full schema
    try {
      const fieldData = { [fieldName]: value };
      const result = schema.safeParse(fieldData);

      if (result.success) {
        return { isValid: true };
      }

      const fieldError = result.error.issues.find((issue: z.ZodIssue) =>
        issue.path.includes(fieldName)
      );

      return {
        isValid: false,
        error: fieldError?.message || "Invalid value",
      };
    } catch (error) {
      return {
        isValid: false,
        error: "Validation error",
      };
    }
  }

  /**
   * Get error message for a specific field
   *
   * Searches through errors array to find the error for a given field.
   * Handles both simple fields ("email") and nested fields ("address.city")
   *
   * @param errors - Array of validation errors
   * @param fieldName - Name of field (can be dot-notation for nested)
   * @returns Error message string, or undefined if no error
   */
  getFieldError(
    errors: ValidationError[],
    fieldName: string
  ): string | undefined {
    const error = errors.find((err) => {
      // Match either the full path or just the last segment
      // This handles both "address.city" and "city" lookups
      return (
        err.path.join(".") === fieldName ||
        err.path[err.path.length - 1] === fieldName
      );
    });

    return error?.message;
  }

  /**
   * Check if a field has any validation error
   *
   * @param errors - Array of validation errors
   * @param fieldName - Name of field to check
   * @returns True if field has error, false otherwise
   */
  hasFieldError(errors: ValidationError[], fieldName: string): boolean {
    return errors.some((err) => {
      return (
        err.path.join(".") === fieldName ||
        err.path[err.path.length - 1] === fieldName
      );
    });
  }

  /**
   * Format errors into a field-to-message map
   *
   * Converts array of errors into an object for easier lookup:
   * [{ path: ["email"], message: "Invalid" }] => { "email": "Invalid" }
   *
   * @param errors - Array of validation errors
   * @returns Object mapping field names to error messages
   */
  formatErrors(errors: ValidationError[]): Record<string, string> {
    const formatted: Record<string, string> = {};

    for (const error of errors) {
      const fieldName = error.path.join(".");
      if (fieldName) {
        formatted[fieldName] = error.message;
      }
    }

    return formatted;
  }

  /**
   * Convert Zod-specific errors to our generic format
   *
   * This is the key method that decouples our app from Zod's error format.
   * It transforms Zod errors into our ValidationError type.
   *
   * @param zodError - The error object from Zod
   * @returns Array of generic ValidationError objects
   */
  private convertZodErrors(zodError: z.ZodError): ValidationError[] {
    return zodError.issues.map((issue) => ({
      path: issue.path.map(String), // Convert path segments to strings
      message: issue.message, // Human-readable error message
    }));
  }
}

/**
 * Singleton Instance - Use This!
 *
 * This is the pre-instantiated adapter you should import and use everywhere.
 *
 * USAGE EXAMPLES:
 *
 * // In server actions
 * const result = zodAdapter.validate(schema, formData)
 * if (!result.success) {
 *   return { errors: result.errors }
 * }
 *
 * // In React hooks
 * const fieldError = zodAdapter.getFieldError(errors, "email")
 * const hasError = zodAdapter.hasFieldError(errors, "phone")
 */
export const zodAdapter = new ZodAdapter();
