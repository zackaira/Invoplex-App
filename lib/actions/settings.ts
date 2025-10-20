"use server";

/**
 * Server Actions for Settings
 *
 * Handle saving settings with server-side validation.
 * All actions validate data before persisting to database.
 */

import { prisma } from "@/lib/prisma";
import { zodAdapter } from "@/lib/validation";
import {
  businessProfileSchema,
  brandSettingsSchema,
  getFinancialSettingsSchema,
  quoteSettingsSchema,
  getInvoiceSettingsSchema,
  templateSettingsSchema,
  type BusinessProfileFormData,
  type BrandSettingsFormData,
  type FinancialSettingsFormData,
  type QuoteSettingsFormData,
  type InvoiceSettingsFormData,
  type TemplateSettingsFormData,
} from "@/lib/validation";

// Generic action result type
export type ActionResult<T = void> = {
  success: boolean;
  message?: string;
  errors?: Array<{ path: string[]; message: string }>;
  data?: T;
};

/**
 * Get the first user from the database (for testing with dummy data)
 */
export async function getFirstUser() {
  try {
    const user = await prisma.user.findFirst({
      orderBy: { createdAt: "asc" },
    });
    return user;
  } catch (error) {
    console.error("Error fetching first user:", error);
    return null;
  }
}

/**
 * Fetch all settings for a user
 */
export async function getUserSettings(userId: string) {
  try {
    const [businessProfile, userSettings] = await Promise.all([
      prisma.businessProfile.findUnique({
        where: { userId },
      }),
      prisma.userSettings.findUnique({
        where: { userId },
      }),
    ]);

    // Convert Decimal and Date fields to plain types for client compatibility
    const serializedBusinessProfile = businessProfile
      ? {
          ...businessProfile,
          createdAt: businessProfile.createdAt.toISOString(),
          updatedAt: businessProfile.updatedAt.toISOString(),
        }
      : null;

    const serializedUserSettings = userSettings
      ? {
          ...userSettings,
          defaultTaxRate: userSettings.defaultTaxRate.toNumber(),
          createdAt: userSettings.createdAt.toISOString(),
          updatedAt: userSettings.updatedAt.toISOString(),
        }
      : null;

    return {
      success: true,
      data: {
        businessProfile: serializedBusinessProfile,
        userSettings: serializedUserSettings,
      },
    };
  } catch (error) {
    console.error("Error fetching user settings:", error);
    return {
      success: false,
      message: "Failed to fetch user settings",
    };
  }
}

/**
 * Save Business Profile Settings
 */
export async function saveBusinessProfile(
  userId: string,
  formData: FormData
): Promise<ActionResult> {
  try {
    // Extract form data
    const data = {
      personalName: formData.get("personalName") as string,
      businessName: formData.get("businessName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      website: formData.get("website") as string,
      address: formData.get("address") as string,
      address2: formData.get("address2") as string,
      address3: formData.get("address3") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      zipCode: formData.get("zipCode") as string,
      country: formData.get("country") as string,
    };

    // Validate
    const validation = zodAdapter.validate(businessProfileSchema, data);
    if (!validation.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: validation.errors,
      };
    }

    // Save to database
    const validData = validation.data as BusinessProfileFormData;

    await prisma.businessProfile.upsert({
      where: { userId },
      update: {
        personalName: validData.personalName || null,
        businessName: validData.businessName,
        email: validData.email || null,
        phone: validData.phone || null,
        website: validData.website || null,
        address: validData.address || null,
        city: validData.city || null,
        state: validData.state || null,
        zipCode: validData.zipCode || null,
        country: validData.country,
      },
      create: {
        userId,
        personalName: validData.personalName || null,
        businessName: validData.businessName,
        email: validData.email || null,
        phone: validData.phone || null,
        website: validData.website || null,
        address: validData.address || null,
        city: validData.city || null,
        state: validData.state || null,
        zipCode: validData.zipCode || null,
        country: validData.country,
      },
    });

    return {
      success: true,
      message: "Business profile saved successfully",
    };
  } catch (error) {
    console.error("Error saving business profile:", error);
    return {
      success: false,
      message: "Failed to save business profile",
    };
  }
}

/**
 * Save Brand Settings
 */
export async function saveBrandSettings(
  userId: string,
  formData: FormData
): Promise<ActionResult> {
  try {
    const brandColor = formData.get("brandColor") as string;
    const logoFile = formData.get("logo") as File | null;

    // For now, we'll just validate the brand color
    // TODO: Implement logo upload to cloud storage
    const data = {
      brandColor,
      logo: logoFile || undefined,
    };

    const validation = zodAdapter.validate(brandSettingsSchema, data);
    if (!validation.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: validation.errors,
      };
    }

    // Save to database
    const validData = validation.data as BrandSettingsFormData;
    await prisma.businessProfile.upsert({
      where: { userId },
      update: {
        brandColor: validData.brandColor,
        // TODO: Add logo URL after implementing upload
      },
      create: {
        userId,
        businessName: "Your Business", // Default, should be updated
        brandColor: validData.brandColor,
      },
    });

    return {
      success: true,
      message: "Brand settings saved successfully",
    };
  } catch (error) {
    console.error("Error saving brand settings:", error);
    return {
      success: false,
      message: "Failed to save brand settings",
    };
  }
}

/**
 * Save Financial Settings
 */
export async function saveFinancialSettings(
  userId: string,
  formData: FormData,
  showTaxSettings: boolean
): Promise<ActionResult> {
  try {
    console.log("🔧 saveFinancialSettings called");
    console.log("  userId:", userId);
    console.log("  showTaxSettings:", showTaxSettings);

    const data = {
      defaultCurrency: formData.get("defaultCurrency") as string,
      currencyDisplayFormat: formData.get("currencyDisplayFormat") as string,
      fiscalYearStartMonth: formData.get("fiscalYearStartMonth") as string,
      fiscalYearStartDay: formData.get("fiscalYearStartDay") as string,
      taxId: formData.get("taxId") as string,
      ...(showTaxSettings && {
        taxName: formData.get("taxName") as string,
        defaultTaxRate: formData.get("defaultTaxRate") as string,
      }),
    };

    console.log("  Extracted data:", data);

    const schema = getFinancialSettingsSchema(showTaxSettings);
    const validation = zodAdapter.validate(schema, data);
    if (!validation.success) {
      console.error("Financial settings validation failed:", validation.errors);
      console.error("Data received:", data);
      console.error("Show tax settings:", showTaxSettings);
      return {
        success: false,
        message: "Validation failed",
        errors: validation.errors,
      };
    }

    // Update business profile for tax ID
    const validData = validation.data as FinancialSettingsFormData;
    await prisma.businessProfile.upsert({
      where: { userId },
      update: {
        taxId: validData.taxId,
      },
      create: {
        userId,
        businessName: "Your Business",
        taxId: validData.taxId,
      },
    });

    // Update user settings for currency and fiscal year
    await prisma.userSettings.upsert({
      where: { userId },
      update: {
        defaultCurrency: validData.defaultCurrency,
        currencyDisplayFormat:
          validData.currencyDisplayFormat || "symbol_before",
        fiscalYearStartMonth: parseInt(validData.fiscalYearStartMonth, 10),
        fiscalYearStartDay: parseInt(validData.fiscalYearStartDay, 10),
        showTaxSettings: showTaxSettings,
        ...(showTaxSettings && {
          taxName: validData.taxName,
          defaultTaxRate: parseFloat(validData.defaultTaxRate),
        }),
      },
      create: {
        userId,
        defaultCurrency: validData.defaultCurrency,
        currencyDisplayFormat:
          validData.currencyDisplayFormat || "symbol_before",
        fiscalYearStartMonth: parseInt(validData.fiscalYearStartMonth, 10),
        fiscalYearStartDay: parseInt(validData.fiscalYearStartDay, 10),
        showTaxSettings: showTaxSettings,
        ...(showTaxSettings && {
          taxName: validData.taxName,
          defaultTaxRate: parseFloat(validData.defaultTaxRate),
        }),
      },
    });

    return {
      success: true,
      message: "Financial settings saved successfully",
    };
  } catch (error) {
    console.error("❌ Error saving financial settings:", error);
    console.error(
      "Error details:",
      error instanceof Error ? error.message : error
    );
    console.error(
      "Stack trace:",
      error instanceof Error ? error.stack : "No stack trace"
    );
    return {
      success: false,
      message: `Failed to save financial settings: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      errors: [
        {
          path: ["_error"],
          message:
            error instanceof Error ? error.message : "Unknown error occurred",
        },
      ],
    };
  }
}

/**
 * Save Quote Settings
 */
export async function saveQuoteSettings(
  userId: string,
  formData: FormData
): Promise<ActionResult> {
  try {
    const data = {
      quoteTitle: formData.get("quoteTitle") as string,
      quotePrefix: formData.get("quotePrefix") as string,
      quoteNextNumber: formData.get("quoteNextNumber") as string,
      quoteValidityDays: formData.get("quoteValidityDays") as string,
      quoteDefaultTerms: formData.get("quoteDefaultTerms") as string,
      quoteDefaultNotes: formData.get("quoteDefaultNotes") as string,
    };

    const validation = zodAdapter.validate(quoteSettingsSchema, data);
    if (!validation.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: validation.errors,
      };
    }

    const validData = validation.data as QuoteSettingsFormData;
    await prisma.userSettings.upsert({
      where: { userId },
      update: {
        quoteTitle: validData.quoteTitle || "QUOTE",
        quotePrefix: validData.quotePrefix || "Q",
        quoteNextNumber: parseInt(validData.quoteNextNumber, 10),
        quoteValidityDays: parseInt(validData.quoteValidityDays, 10),
        quoteDefaultTerms: validData.quoteDefaultTerms || null,
        quoteDefaultNotes: validData.quoteDefaultNotes || null,
      },
      create: {
        userId,
        quoteTitle: validData.quoteTitle || "QUOTE",
        quotePrefix: validData.quotePrefix || "Q",
        quoteNextNumber: parseInt(validData.quoteNextNumber, 10),
        quoteValidityDays: parseInt(validData.quoteValidityDays, 10),
        quoteDefaultTerms: validData.quoteDefaultTerms || null,
        quoteDefaultNotes: validData.quoteDefaultNotes || null,
      },
    });

    return {
      success: true,
      message: "Quote settings saved successfully",
    };
  } catch (error) {
    console.error("Error saving quote settings:", error);
    return {
      success: false,
      message: "Failed to save quote settings",
    };
  }
}

/**
 * Save Invoice Settings
 */
export async function saveInvoiceSettings(
  userId: string,
  formData: FormData,
  showBankDetails: boolean
): Promise<ActionResult> {
  try {
    const data = {
      invoiceTitle: formData.get("invoiceTitle") as string,
      invoicePrefix: formData.get("invoicePrefix") as string,
      invoiceNextNumber: formData.get("invoiceNextNumber") as string,
      invoiceDefaultDueDays: formData.get("invoiceDefaultDueDays") as string,
      invoiceDefaultTerms: formData.get("invoiceDefaultTerms") as string,
      invoiceDefaultNotes: formData.get("invoiceDefaultNotes") as string,
      ...(showBankDetails && {
        bankName: formData.get("bankName") as string,
        accountName: formData.get("accountName") as string,
        accountNumber: formData.get("accountNumber") as string,
        routingNumber: formData.get("routingNumber") as string,
        iban: formData.get("iban") as string,
        swiftCode: formData.get("swiftCode") as string,
      }),
    };

    const schema = getInvoiceSettingsSchema(showBankDetails);
    const validation = zodAdapter.validate(schema, data);
    if (!validation.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: validation.errors,
      };
    }

    const validData = validation.data as InvoiceSettingsFormData;
    await prisma.userSettings.upsert({
      where: { userId },
      update: {
        invoiceTitle: validData.invoiceTitle || "INVOICE",
        invoicePrefix: validData.invoicePrefix || "INV",
        invoiceNextNumber: parseInt(validData.invoiceNextNumber, 10),
        invoiceDefaultDueDays: parseInt(validData.invoiceDefaultDueDays, 10),
        invoiceDefaultTerms: validData.invoiceDefaultTerms || null,
        invoiceDefaultNotes: validData.invoiceDefaultNotes || null,
        showBankDetails: showBankDetails,
        ...(showBankDetails && {
          bankName: validData.bankName || null,
          accountName: validData.accountName || null,
          accountNumber: validData.accountNumber || null,
          routingNumber: validData.routingNumber || null,
          iban: validData.iban || null,
          swiftCode: validData.swiftCode || null,
        }),
      },
      create: {
        userId,
        invoiceTitle: validData.invoiceTitle || "INVOICE",
        invoicePrefix: validData.invoicePrefix || "INV",
        invoiceNextNumber: parseInt(validData.invoiceNextNumber, 10),
        invoiceDefaultDueDays: parseInt(validData.invoiceDefaultDueDays, 10),
        invoiceDefaultTerms: validData.invoiceDefaultTerms || null,
        invoiceDefaultNotes: validData.invoiceDefaultNotes || null,
        showBankDetails: showBankDetails,
        ...(showBankDetails && {
          bankName: validData.bankName || null,
          accountName: validData.accountName || null,
          accountNumber: validData.accountNumber || null,
          routingNumber: validData.routingNumber || null,
          iban: validData.iban || null,
          swiftCode: validData.swiftCode || null,
        }),
      },
    });

    return {
      success: true,
      message: "Invoice settings saved successfully",
    };
  } catch (error) {
    console.error("Error saving invoice settings:", error);
    return {
      success: false,
      message: "Failed to save invoice settings",
    };
  }
}

/**
 * Save Template Settings
 */
export async function saveTemplateSettings(
  userId: string,
  formData: FormData
): Promise<ActionResult> {
  try {
    const data = {
      selectedTemplateId: formData.get("selectedTemplateId") as string,
    };

    const validation = zodAdapter.validate(templateSettingsSchema, data);
    if (!validation.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: validation.errors,
      };
    }

    const validData = validation.data as TemplateSettingsFormData;
    await prisma.userSettings.upsert({
      where: { userId },
      update: {
        selectedTemplateId: validData.selectedTemplateId,
      },
      create: {
        userId,
        selectedTemplateId: validData.selectedTemplateId,
      },
    });

    return {
      success: true,
      message: "Template settings saved successfully",
    };
  } catch (error) {
    console.error("Error saving template settings:", error);
    return {
      success: false,
      message: "Failed to save template settings",
    };
  }
}
