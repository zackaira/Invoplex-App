/**
 * Settings Validation Schemas
 *
 * Zod schemas for validating all settings sections.
 * Includes dynamic schema builders for conditional fields.
 */

import { z } from "zod";
import { parsePhoneNumber } from "libphonenumber-js";

// ============================================
// REUSABLE FIELD VALIDATORS
// ============================================

/**
 * Brand color - no validation, accepts any value
 */
const hexColorSchema = z
  .union([z.string(), z.null()])
  .transform((val) => val || "#000000");

/**
 * Validates email format
 */
const emailSchema = z
  .union([z.string(), z.null()]) // ← Accept string or null
  .transform((val) => val || "") // ← Convert null/undefined to empty string
  .pipe(z.string().min(1, "Email is required").email("Invalid email address"));

/**
 * Validates URL format (without protocol)
 */
const websiteSchema = z
  .union([z.string(), z.null()])
  .transform((val) => val || "")
  .refine((val) => val.trim().length > 0, { message: "Website is required" })
  .refine(
    (val) => {
      const urlPattern =
        /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
      return urlPattern.test(val);
    },
    {
      message: "Invalid format. Example: example.com",
    }
  );

/**
 * Validates phone number using libphonenumber-js
 */
const phoneSchema = z
  .union([z.string(), z.null()])
  .transform((val) => val || "")
  .pipe(
    z
      .string()
      .min(1, "Phone number is required")
      .refine(
        (val) => {
          try {
            const phoneNumber = parsePhoneNumber(val);
            return phoneNumber.isValid();
          } catch {
            return false;
          }
        },
        { message: "Invalid phone number format" }
      )
  );

/**
 * Optional phone number validation
 */
const optionalPhoneSchema = z
  .string()
  .optional()
  .refine(
    (val) => {
      if (!val) return true;
      try {
        const phoneNumber = parsePhoneNumber(val);
        return phoneNumber.isValid();
      } catch {
        return false;
      }
    },
    { message: "Invalid phone number format" }
  );

// ============================================
// BUSINESS PROFILE SCHEMA
// ============================================

export const businessProfileSchema = z.object({
  personalName: z
    .union([z.string(), z.null()])
    .transform((val) => val || "")
    .optional(),
  businessName: z
    .union([z.string(), z.null()])
    .transform((val) => val || "")
    .pipe(z.string().min(1, "Business name is required")),
  email: emailSchema,
  phone: phoneSchema,
  website: websiteSchema,
  address: z
    .union([z.string(), z.null()])
    .transform((val) => val || "")
    .optional(),
  address2: z
    .union([z.string(), z.null()])
    .transform((val) => val || "")
    .optional(),
  address3: z
    .union([z.string(), z.null()])
    .transform((val) => val || "")
    .optional(),
  city: z
    .union([z.string(), z.null()])
    .transform((val) => val || "")
    .optional(),
  state: z
    .union([z.string(), z.null()])
    .transform((val) => val || "")
    .optional(),
  zipCode: z
    .union([z.string(), z.null()])
    .transform((val) => val || "")
    .optional(),
  country: z
    .union([z.string(), z.null()])
    .transform((val) => val || "")
    .pipe(z.string().min(1, "Country is required")),
});

export type BusinessProfileFormData = z.infer<typeof businessProfileSchema>;

// ============================================
// BRAND SETTINGS SCHEMA
// ============================================

export const brandSettingsSchema = z.object({
  brandColor: hexColorSchema,
  logo: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => {
        if (!file) return true;
        // Max 5MB
        return file.size <= 5 * 1024 * 1024;
      },
      { message: "Logo must be less than 5MB" }
    )
    .refine(
      (file) => {
        if (!file) return true;
        const validTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/webp",
        ];
        return validTypes.includes(file.type);
      },
      { message: "Logo must be a JPEG, PNG, or WebP image" }
    ),
});

export type BrandSettingsFormData = z.infer<typeof brandSettingsSchema>;

// ============================================
// FINANCIAL SETTINGS SCHEMA
// ============================================

/**
 * Base financial settings schema
 */
const baseFinancialSettingsSchema = z.object({
  defaultCurrency: z
    .union([z.string(), z.null()])
    .transform((val) => val || "")
    .pipe(z.string().min(1, "Currency is required")),
  currencyDisplayFormat: z
    .union([z.string(), z.null()])
    .transform((val) => val || "symbol_before")
    .optional(),
  fiscalYearStartMonth: z
    .union([z.string(), z.null()])
    .transform((val) => val || "3")
    .refine(
      (val) => {
        const num = parseInt(val, 10);
        return !isNaN(num) && num >= 1 && num <= 12;
      },
      { message: "Month must be between 1 and 12" }
    ),
  fiscalYearStartDay: z
    .union([z.string(), z.null()])
    .transform((val) => val || "1")
    .refine(
      (val) => {
        const num = parseInt(val, 10);
        return !isNaN(num) && num >= 1 && num <= 31;
      },
      { message: "Day must be between 1 and 31" }
    ),
  taxId: z
    .union([z.string(), z.null()])
    .transform((val) => val || "")
    .pipe(z.string().min(1, "Tax ID is required")),
});

/**
 * Financial settings with required tax fields
 */
const financialSettingsWithTaxSchema = baseFinancialSettingsSchema.extend({
  taxName: z
    .union([z.string(), z.null()])
    .transform((val) => val || "")
    .pipe(
      z.string().min(1, "Tax name is required when tax settings are enabled")
    ),
  defaultTaxRate: z
    .union([z.string(), z.null()])
    .transform((val) => val || "")
    .pipe(
      z.string().min(1, "Tax rate is required when tax settings are enabled")
    )
    .refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num >= 0 && num <= 100;
      },
      { message: "Tax rate must be between 0 and 100" }
    ),
});

/**
 * Returns the appropriate financial settings schema based on whether tax is enabled
 */
export function getFinancialSettingsSchema(showTaxSettings: boolean) {
  if (showTaxSettings) {
    return financialSettingsWithTaxSchema;
  }
  return baseFinancialSettingsSchema;
}

export type FinancialSettingsFormData = z.infer<
  typeof financialSettingsWithTaxSchema
>;

// ============================================
// QUOTE SETTINGS SCHEMA
// ============================================

export const quoteSettingsSchema = z.object({
  quoteTitle: z
    .union([z.string(), z.null()])
    .transform((val) => val || "")
    .optional(),
  quotePrefix: z
    .union([z.string(), z.null()])
    .transform((val) => val || "")
    .optional(),
  quoteNextNumber: z
    .union([z.string(), z.null()])
    .transform((val) => val || "1")
    .refine(
      (val) => {
        const num = parseInt(val, 10);
        return num >= 1;
      },
      { message: "Quote number must be at least 1" }
    ),
  quoteValidityDays: z
    .union([z.string(), z.null()])
    .transform((val) => val || "30")
    .refine(
      (val) => {
        const num = parseInt(val, 10);
        return num >= 1;
      },
      { message: "Validity period must be at least 1 day" }
    ),
  quoteDefaultTerms: z
    .union([z.string(), z.null()])
    .transform((val) => val || "")
    .optional(),
  quoteDefaultNotes: z
    .union([z.string(), z.null()])
    .transform((val) => val || "")
    .optional(),
});

export type QuoteSettingsFormData = z.infer<typeof quoteSettingsSchema>;

// ============================================
// INVOICE SETTINGS SCHEMA
// ============================================

/**
 * Base invoice settings schema (without bank details)
 */
const baseInvoiceSettingsSchema = z.object({
  invoiceTitle: z
    .union([z.string(), z.null()])
    .transform((val) => val || "")
    .optional(),
  invoicePrefix: z
    .union([z.string(), z.null()])
    .transform((val) => val || "")
    .optional(),
  invoiceNextNumber: z
    .union([z.string(), z.null()])
    .transform((val) => val || "1")
    .refine(
      (val) => {
        const num = parseInt(val, 10);
        return num >= 1;
      },
      { message: "Invoice number must be at least 1" }
    ),
  invoiceDefaultDueDays: z
    .union([z.string(), z.null()])
    .transform((val) => val || "30")
    .refine(
      (val) => {
        const num = parseInt(val, 10);
        return num >= 1;
      },
      { message: "Payment terms must be at least 1 day" }
    ),
  invoiceDefaultTerms: z
    .union([z.string(), z.null()])
    .transform((val) => val || "")
    .optional(),
  invoiceDefaultNotes: z
    .union([z.string(), z.null()])
    .transform((val) => val || "")
    .optional(),
});

/**
 * Invoice settings with required bank details
 */
const invoiceSettingsWithBankSchema = baseInvoiceSettingsSchema.extend({
  bankName: z
    .union([z.string(), z.null()])
    .transform((val) => val || "")
    .pipe(z.string().min(1, "Bank name is required")),
  accountName: z
    .union([z.string(), z.null()])
    .transform((val) => val || "")
    .pipe(z.string().min(1, "Account name is required")),
  accountNumber: z
    .union([z.string(), z.null()])
    .transform((val) => val || "")
    .pipe(z.string().min(1, "Account number is required")),
  routingNumber: z
    .union([z.string(), z.null()])
    .transform((val) => val || "")
    .pipe(z.string().min(1, "Routing number is required")),
  iban: z
    .union([z.string(), z.null()])
    .transform((val) => val || "")
    .optional(),
  swiftCode: z
    .union([z.string(), z.null()])
    .transform((val) => val || "")
    .optional(),
});

/**
 * Returns the appropriate invoice settings schema based on whether bank details are enabled
 */
export function getInvoiceSettingsSchema(showBankDetails: boolean) {
  if (showBankDetails) {
    return invoiceSettingsWithBankSchema;
  }
  return baseInvoiceSettingsSchema;
}

export type InvoiceSettingsFormData = z.infer<
  typeof invoiceSettingsWithBankSchema
>;

// ============================================
// TEMPLATE SETTINGS SCHEMA
// ============================================

export const templateSettingsSchema = z.object({
  selectedTemplateId: z
    .union([z.string(), z.null()])
    .transform((val) => val || "classic"), // Default to "classic" template
});

export type TemplateSettingsFormData = z.infer<typeof templateSettingsSchema>;

// ============================================
// CONTACT SCHEMA
// ============================================

export const contactSchema = z.object({
  name: z
    .union([z.string(), z.null()])
    .transform((val) => val || "")
    .pipe(z.string().min(1, "Name is required")),
  email: emailSchema,
  phone: optionalPhoneSchema,
  position: z
    .union([z.string(), z.null()])
    .transform((val) => val || "")
    .optional(),
  isPrimary: z.boolean().default(false),
});

export type ContactFormData = z.infer<typeof contactSchema>;
