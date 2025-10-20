"use client";

import { useState, useEffect } from "react";
import { getAllTemplates } from "@/app/components/documents/registry";
import { BusinessProfileSection } from "./components/BusinessProfileSection";
import { BrandSettingsSection } from "./components/BrandSettingsSection";
import { FinancialSettingsSection } from "./components/FinancialSettingsSection";
import { QuoteSettingsSection } from "./components/QuoteSettingsSection";
import { InvoiceSettingsSection } from "./components/InvoiceSettingsSection";
import { TemplateSelectionSection } from "./components/TemplateSelectionSection";
import { SettingsNavigationSidebar } from "./components/SettingsNavigationSidebar";
import { SettingsLoading } from "./loading";
import { toast } from "@/lib/toast";
import {
  getUserSettings,
  saveBusinessProfile,
  saveBrandSettings,
  saveFinancialSettings,
  saveQuoteSettings,
  saveInvoiceSettings,
  saveTemplateSettings,
} from "@/lib/actions/settings";
import type { ValidationError } from "@/lib/validation";

export default function Settings() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [brandColor, setBrandColor] = useState("#000000");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState("classic");
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [showFinancialSettings, setShowFinancialSettings] = useState(false);
  const [removeQuotePoweredBy, setRemoveQuotePoweredBy] = useState(false);
  const [removeInvoicePoweredBy, setRemoveInvoicePoweredBy] = useState(false);

  // Store loaded data for form initialization
  const [initialData, setInitialData] = useState<{
    businessProfile?: any;
    userSettings?: any;
  }>({});

  console.log("userId", userId);
  console.log("initialData", initialData);

  // Validation errors state for each section
  // Edit Validation errors in lib/validation/schemas/settings.ts
  const [validationErrors, setValidationErrors] = useState<{
    businessProfile?: ValidationError[];
    brandSettings?: ValidationError[];
    financialSettings?: ValidationError[];
    quoteSettings?: ValidationError[];
    invoiceSettings?: ValidationError[];
    templateSettings?: ValidationError[];
  }>({});

  // Track unsaved changes for each section
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState({
    businessProfile: false,
    brandSettings: false,
    financialSettings: false,
    quoteSettings: false,
    invoiceSettings: false,
    templateSettings: false,
    removeQuotePoweredBy: false,
    removeInvoicePoweredBy: false,
  });

  // Track saving state for each section
  const [isSaving, setIsSaving] = useState({
    businessProfile: false,
    brandSettings: false,
    financialSettings: false,
    quoteSettings: false,
    invoiceSettings: false,
    templateSettings: false,
    removeQuotePoweredBy: false,
    removeInvoicePoweredBy: false,
  });

  const templates = getAllTemplates();

  // Load user data on mount
  useEffect(() => {
    async function loadUserData() {
      try {
        // TODO: Replace with actual user session from authentication
        // Hardcoded user ID for development (Zack Viljoen)
        const hardcodedUserId = "cmgexy4630002r7qfecfve8hq";
        setUserId(hardcodedUserId);

        // Fetch user settings
        const result = await getUserSettings(hardcodedUserId);

        if (result.success && result.data) {
          const { businessProfile, userSettings } = result.data;
          setInitialData({ businessProfile, userSettings });

          // Populate form fields with loaded data
          if (businessProfile) {
            if (businessProfile.logo) {
              setLogoPreview(businessProfile.logo);
            }
            if (businessProfile.brandColor) {
              setBrandColor(businessProfile.brandColor);
            }
          }

          if (userSettings) {
            if (userSettings.selectedTemplateId) {
              setSelectedTemplate(userSettings.selectedTemplateId);
            }
            // Load switch states from database
            if (userSettings.showBankDetails !== undefined) {
              setShowBankDetails(userSettings.showBankDetails);
            }
            if (userSettings.showTaxSettings !== undefined) {
              setShowFinancialSettings(userSettings.showTaxSettings);
            }
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        toast.error("Failed to load settings");
      } finally {
        setIsLoading(false);
      }
    }

    loadUserData();
  }, []);

  // Mark section as having unsaved changes
  const markSectionChanged = (section: keyof typeof hasUnsavedChanges) => {
    setHasUnsavedChanges((prev) => ({ ...prev, [section]: true }));
  };

  // Clear unsaved changes for a section
  const clearSectionChanges = (section: keyof typeof hasUnsavedChanges) => {
    setHasUnsavedChanges((prev) => ({ ...prev, [section]: false }));
  };

  const handleLogoSelect = (file: File) => {
    setLogoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    markSectionChanged("brandSettings");
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    markSectionChanged("brandSettings");
  };

  const handleSaveBusinessProfile = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!userId) {
      toast.error("User not loaded");
      return;
    }
    setIsSaving((prev) => ({ ...prev, businessProfile: true }));
    setValidationErrors((prev) => ({ ...prev, businessProfile: undefined }));

    try {
      const formData = new FormData(e.currentTarget);
      const result = await saveBusinessProfile(userId, formData);

      if (result.success) {
        clearSectionChanges("businessProfile");
        toast.success("Business Profile saved successfully!");
      } else {
        if (result.errors) {
          setValidationErrors((prev) => ({
            ...prev,
            businessProfile: result.errors,
          }));
        }
        toast.error("Validation failed");
      }
    } catch (error) {
      console.error("Error saving business profile:", error);
      toast.error("Failed to save Business Profile");
    } finally {
      setIsSaving((prev) => ({ ...prev, businessProfile: false }));
    }
  };

  const handleSaveBrandSettings = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!userId) {
      toast.error("User not loaded");
      return;
    }
    setIsSaving((prev) => ({ ...prev, brandSettings: true }));
    setValidationErrors((prev) => ({ ...prev, brandSettings: undefined }));

    try {
      const formData = new FormData(e.currentTarget);
      if (logoFile) {
        formData.set("logo", logoFile);
      }
      const result = await saveBrandSettings(userId, formData);

      if (result.success) {
        clearSectionChanges("brandSettings");
        toast.success("Brand Settings saved successfully!");
      } else {
        if (result.errors) {
          setValidationErrors((prev) => ({
            ...prev,
            brandSettings: result.errors,
          }));
        }
        toast.error("Validation failed");
      }
    } catch (error) {
      console.error("Error saving brand settings:", error);
      toast.error("Failed to save Brand Settings");
    } finally {
      setIsSaving((prev) => ({ ...prev, brandSettings: false }));
    }
  };

  const handleSaveFinancialSettings = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!userId) {
      toast.error("User not loaded");
      return;
    }
    setIsSaving((prev) => ({ ...prev, financialSettings: true }));
    setValidationErrors((prev) => ({ ...prev, financialSettings: undefined }));

    try {
      const formData = new FormData(e.currentTarget);

      // Debug: Log form data in browser console
      console.log("=== FINANCIAL SETTINGS FORM DATA ===");
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      console.log("showFinancialSettings:", showFinancialSettings);
      console.log("====================================");

      const result = await saveFinancialSettings(
        userId,
        formData,
        showFinancialSettings
      );

      console.log("=== SAVE RESULT ===");
      console.log("Result:", result);
      console.log("===================");

      if (result.success) {
        clearSectionChanges("financialSettings");
        toast.success("Financial Settings saved successfully!");
      } else {
        if (result.errors) {
          console.error("❌ VALIDATION ERRORS:", result.errors);
          setValidationErrors((prev) => ({
            ...prev,
            financialSettings: result.errors,
          }));
          // Show first error in toast
          const firstError = result.errors[0];
          toast.error(
            `Validation failed: ${firstError?.message || "Unknown error"}`
          );
        } else {
          console.error("❌ Validation failed with no error details");
          toast.error("Validation failed");
        }
      }
    } catch (error) {
      console.error("Error saving financial settings:", error);
      toast.error("Failed to save Financial Settings");
    } finally {
      setIsSaving((prev) => ({ ...prev, financialSettings: false }));
    }
  };

  const handleSaveQuoteSettings = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!userId) {
      toast.error("User not loaded");
      return;
    }
    setIsSaving((prev) => ({ ...prev, quoteSettings: true }));
    setValidationErrors((prev) => ({ ...prev, quoteSettings: undefined }));

    try {
      const formData = new FormData(e.currentTarget);
      const result = await saveQuoteSettings(userId, formData);

      if (result.success) {
        clearSectionChanges("quoteSettings");
        toast.success("Quote Settings saved successfully!");
      } else {
        if (result.errors) {
          setValidationErrors((prev) => ({
            ...prev,
            quoteSettings: result.errors,
          }));
        }
        toast.error("Validation failed");
      }
    } catch (error) {
      console.error("Error saving quote settings:", error);
      toast.error("Failed to save Quote Settings");
    } finally {
      setIsSaving((prev) => ({ ...prev, quoteSettings: false }));
    }
  };

  const handleSaveInvoiceSettings = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!userId) {
      toast.error("User not loaded");
      return;
    }
    setIsSaving((prev) => ({ ...prev, invoiceSettings: true }));
    setValidationErrors((prev) => ({ ...prev, invoiceSettings: undefined }));

    try {
      const formData = new FormData(e.currentTarget);
      const result = await saveInvoiceSettings(
        userId,
        formData,
        showBankDetails
      );

      if (result.success) {
        clearSectionChanges("invoiceSettings");
        toast.success("Invoice Settings saved successfully!");
      } else {
        if (result.errors) {
          setValidationErrors((prev) => ({
            ...prev,
            invoiceSettings: result.errors,
          }));
        }
        toast.error("Validation failed");
      }
    } catch (error) {
      console.error("Error saving invoice settings:", error);
      toast.error("Failed to save Invoice Settings");
    } finally {
      setIsSaving((prev) => ({ ...prev, invoiceSettings: false }));
    }
  };

  const handleSaveTemplateSettings = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!userId) {
      toast.error("User not loaded");
      return;
    }
    setIsSaving((prev) => ({ ...prev, templateSettings: true }));
    setValidationErrors((prev) => ({ ...prev, templateSettings: undefined }));

    try {
      const formData = new FormData(e.currentTarget);
      formData.set("selectedTemplateId", selectedTemplate);
      const result = await saveTemplateSettings(userId, formData);

      if (result.success) {
        clearSectionChanges("templateSettings");
        toast.success("Template Selection saved successfully!");
      } else {
        if (result.errors) {
          setValidationErrors((prev) => ({
            ...prev,
            templateSettings: result.errors,
          }));
        }
        toast.error("Validation failed");
      }
    } catch (error) {
      console.error("Error saving template settings:", error);
      toast.error("Failed to save Template Selection");
    } finally {
      setIsSaving((prev) => ({ ...prev, templateSettings: false }));
    }
  };

  // Show loading state while data is being fetched
  if (isLoading) {
    return <SettingsLoading />;
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Two Column Layout */}
      <div className="flex flex-col gap-6 md:flex-row">
        {/* Settings Cards - Left Side */}
        <div className="flex-1 space-y-8 max-w-[820px] order-2 md:order-1">
          <BusinessProfileSection
            key={`business-${initialData.businessProfile?.id || "empty"}`}
            isSaving={isSaving.businessProfile}
            hasUnsavedChanges={hasUnsavedChanges.businessProfile}
            onSave={handleSaveBusinessProfile}
            onMarkChanged={() => markSectionChanged("businessProfile")}
            validationErrors={validationErrors.businessProfile}
            initialData={initialData.businessProfile}
          />

          <FinancialSettingsSection
            key={`financial-${initialData.userSettings?.id || "empty"}`}
            isSaving={isSaving.financialSettings}
            hasUnsavedChanges={hasUnsavedChanges.financialSettings}
            onSave={handleSaveFinancialSettings}
            onMarkChanged={() => markSectionChanged("financialSettings")}
            showFinancialSettings={showFinancialSettings}
            setShowFinancialSettings={setShowFinancialSettings}
            validationErrors={validationErrors.financialSettings}
            initialData={{
              businessProfile: initialData.businessProfile,
              userSettings: initialData.userSettings,
            }}
          />

          <BrandSettingsSection
            key={`brand-${initialData.userSettings?.id || "empty"}`}
            isSaving={isSaving.brandSettings}
            hasUnsavedChanges={hasUnsavedChanges.brandSettings}
            onSave={handleSaveBrandSettings}
            onMarkChanged={() => markSectionChanged("brandSettings")}
            brandColor={brandColor}
            setBrandColor={setBrandColor}
            logoPreview={logoPreview}
            onLogoSelect={handleLogoSelect}
            onLogoRemove={handleRemoveLogo}
            validationErrors={validationErrors.brandSettings}
            initialData={initialData.userSettings}
          />

          <QuoteSettingsSection
            key={`quote-${initialData.userSettings?.id || "empty"}`}
            isSaving={isSaving.quoteSettings}
            hasUnsavedChanges={hasUnsavedChanges.quoteSettings}
            onSave={handleSaveQuoteSettings}
            onMarkChanged={() => markSectionChanged("quoteSettings")}
            removeQuotePoweredBy={removeQuotePoweredBy}
            setRemoveQuotePoweredBy={setRemoveQuotePoweredBy}
            validationErrors={validationErrors.quoteSettings}
            initialData={initialData.userSettings}
          />

          <InvoiceSettingsSection
            key={`invoice-${initialData.userSettings?.id || "empty"}`}
            isSaving={isSaving.invoiceSettings}
            hasUnsavedChanges={hasUnsavedChanges.invoiceSettings}
            onSave={handleSaveInvoiceSettings}
            onMarkChanged={() => markSectionChanged("invoiceSettings")}
            showBankDetails={showBankDetails}
            setShowBankDetails={setShowBankDetails}
            removeInvoicePoweredBy={removeInvoicePoweredBy}
            setRemoveInvoicePoweredBy={setRemoveInvoicePoweredBy}
            validationErrors={validationErrors.invoiceSettings}
            initialData={{
              businessProfile: initialData.businessProfile,
              userSettings: initialData.userSettings,
            }}
          />

          <TemplateSelectionSection
            key={`template-${initialData.userSettings?.id || "empty"}`}
            isSaving={isSaving.templateSettings}
            hasUnsavedChanges={hasUnsavedChanges.templateSettings}
            onSave={handleSaveTemplateSettings}
            onMarkChanged={() => markSectionChanged("templateSettings")}
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
            templates={templates}
            validationErrors={validationErrors.templateSettings}
            initialData={initialData.userSettings}
          />
        </div>

        <SettingsNavigationSidebar showBankDetails={showBankDetails} />
      </div>
    </div>
  );
}
