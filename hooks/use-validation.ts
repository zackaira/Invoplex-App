/**
 * Form Validation Hook
 *
 * React hook for managing form validation state.
 * Uses the validation adapter pattern for library independence.
 */

import { useState, useCallback } from "react";
import { zodAdapter } from "@/lib/validation";
import type { ValidationError } from "@/lib/validation";
import type { z } from "zod";

export function useValidation<T extends z.ZodSchema>(schema: T) {
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isValidating, setIsValidating] = useState(false);

  /**
   * Validate the entire form
   */
  const validateForm = useCallback(
    async (data: unknown) => {
      setIsValidating(true);
      try {
        const result = await zodAdapter.validateAsync(schema, data);

        if (result.success) {
          setErrors([]);
          return { isValid: true, data: result.data };
        } else {
          setErrors(result.errors || []);
          return { isValid: false, errors: result.errors };
        }
      } catch (error) {
        console.error("Validation error:", error);
        return { isValid: false, errors: [] };
      } finally {
        setIsValidating(false);
      }
    },
    [schema]
  );

  /**
   * Validate a single field
   */
  const validateField = useCallback(
    (fieldName: string, value: unknown) => {
      const result = zodAdapter.validateField(schema, fieldName, value);

      if (result.isValid) {
        // Remove error for this field if it exists
        setErrors((prev) =>
          prev.filter((err) => !zodAdapter.hasFieldError([err], fieldName))
        );
      } else if (result.error) {
        // Add or update error for this field
        setErrors((prev) => {
          const filtered = prev.filter(
            (err) => !zodAdapter.hasFieldError([err], fieldName)
          );
          return [...filtered, { path: [fieldName], message: result.error! }];
        });
      }

      return result;
    },
    [schema]
  );

  /**
   * Get error message for a specific field
   */
  const getFieldError = useCallback(
    (fieldName: string): string | undefined => {
      return zodAdapter.getFieldError(errors, fieldName);
    },
    [errors]
  );

  /**
   * Check if a field has an error
   */
  const hasFieldError = useCallback(
    (fieldName: string): boolean => {
      return zodAdapter.hasFieldError(errors, fieldName);
    },
    [errors]
  );

  /**
   * Clear all validation errors
   */
  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  /**
   * Clear error for a specific field
   */
  const clearFieldError = useCallback((fieldName: string) => {
    setErrors((prev) =>
      prev.filter((err) => !zodAdapter.hasFieldError([err], fieldName))
    );
  }, []);

  /**
   * Format errors into field-name to message object
   */
  const formattedErrors = zodAdapter.formatErrors(errors);

  return {
    errors,
    formattedErrors,
    isValidating,
    validateForm,
    validateField,
    getFieldError,
    hasFieldError,
    clearErrors,
    clearFieldError,
  };
}
