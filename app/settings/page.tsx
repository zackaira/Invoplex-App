"use client";

import { useState } from "react";
import { getAllTemplates } from "@/app/components/documents/templates/registry";
import { BusinessProfileSection } from "./components/BusinessProfileSection";
import { BrandSettingsSection } from "./components/BrandSettingsSection";
import { FinancialSettingsSection } from "./components/FinancialSettingsSection";
import { QuoteSettingsSection } from "./components/QuoteSettingsSection";
import { InvoiceSettingsSection } from "./components/InvoiceSettingsSection";
import { TemplateSelectionSection } from "./components/TemplateSelectionSection";
import { SettingsNavigationSidebar } from "./components/SettingsNavigationSidebar";

export default function Settings() {
  const [brandColor, setBrandColor] = useState("#000000");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState("classic");
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [showFinancialSettings, setShowFinancialSettings] = useState(false);
  const [removeQuotePoweredBy, setRemoveQuotePoweredBy] = useState(false);
  const [removeInvoicePoweredBy, setRemoveInvoicePoweredBy] = useState(false);

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
    setIsSaving((prev) => ({ ...prev, businessProfile: true }));
    try {
      // TODO: Implement save logic
      // await saveBusinessProfile(formData);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      clearSectionChanges("businessProfile");
      alert("Business Profile saved successfully!");
    } catch (error) {
      alert("Failed to save Business Profile");
    } finally {
      setIsSaving((prev) => ({ ...prev, businessProfile: false }));
    }
  };

  const handleSaveBrandSettings = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setIsSaving((prev) => ({ ...prev, brandSettings: true }));
    try {
      // TODO: Implement save logic
      // await saveBrandSettings({ logo, brandColor });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      clearSectionChanges("brandSettings");
      alert("Brand Settings saved successfully!");
    } catch (error) {
      alert("Failed to save Brand Settings");
    } finally {
      setIsSaving((prev) => ({ ...prev, brandSettings: false }));
    }
  };

  const handleSaveFinancialSettings = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setIsSaving((prev) => ({ ...prev, financialSettings: true }));
    try {
      // TODO: Implement save logic
      // await saveFinancialSettings(formData);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      clearSectionChanges("financialSettings");
      alert("Financial Settings saved successfully!");
    } catch (error) {
      alert("Failed to save Financial Settings");
    } finally {
      setIsSaving((prev) => ({ ...prev, financialSettings: false }));
    }
  };

  const handleSaveQuoteSettings = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setIsSaving((prev) => ({ ...prev, quoteSettings: true }));
    try {
      // TODO: Implement save logic
      // await saveQuoteSettings(formData);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      clearSectionChanges("quoteSettings");
      alert("Quote Settings saved successfully!");
    } catch (error) {
      alert("Failed to save Quote Settings");
    } finally {
      setIsSaving((prev) => ({ ...prev, quoteSettings: false }));
    }
  };

  const handleSaveInvoiceSettings = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setIsSaving((prev) => ({ ...prev, invoiceSettings: true }));
    try {
      // TODO: Implement save logic
      // await saveInvoiceSettings(formData);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      clearSectionChanges("invoiceSettings");
      alert("Invoice Settings saved successfully!");
    } catch (error) {
      alert("Failed to save Invoice Settings");
    } finally {
      setIsSaving((prev) => ({ ...prev, invoiceSettings: false }));
    }
  };

  const handleSaveTemplateSettings = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setIsSaving((prev) => ({ ...prev, templateSettings: true }));
    try {
      // TODO: Implement save logic
      // await saveTemplateSettings({ selectedTemplateId: selectedTemplate });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      clearSectionChanges("templateSettings");
      alert("Template Selection saved successfully!");
    } catch (error) {
      alert("Failed to save Template Selection");
    } finally {
      setIsSaving((prev) => ({ ...prev, templateSettings: false }));
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Two Column Layout */}
      <div className="flex flex-col gap-6 md:flex-row">
        {/* Settings Cards - Left Side */}
        <div className="flex-1 space-y-8 max-w-[820px] order-2 md:order-1">
          <BusinessProfileSection
            isSaving={isSaving.businessProfile}
            hasUnsavedChanges={hasUnsavedChanges.businessProfile}
            onSave={handleSaveBusinessProfile}
            onMarkChanged={() => markSectionChanged("businessProfile")}
          />

          <FinancialSettingsSection
            isSaving={isSaving.financialSettings}
            hasUnsavedChanges={hasUnsavedChanges.financialSettings}
            onSave={handleSaveFinancialSettings}
            onMarkChanged={() => markSectionChanged("financialSettings")}
            showFinancialSettings={showFinancialSettings}
            setShowFinancialSettings={setShowFinancialSettings}
          />

          <BrandSettingsSection
            isSaving={isSaving.brandSettings}
            hasUnsavedChanges={hasUnsavedChanges.brandSettings}
            onSave={handleSaveBrandSettings}
            onMarkChanged={() => markSectionChanged("brandSettings")}
            brandColor={brandColor}
            setBrandColor={setBrandColor}
            logoPreview={logoPreview}
            onLogoSelect={handleLogoSelect}
            onLogoRemove={handleRemoveLogo}
          />

          <QuoteSettingsSection
            isSaving={isSaving.quoteSettings}
            hasUnsavedChanges={hasUnsavedChanges.quoteSettings}
            onSave={handleSaveQuoteSettings}
            onMarkChanged={() => markSectionChanged("quoteSettings")}
            removeQuotePoweredBy={removeQuotePoweredBy}
            setRemoveQuotePoweredBy={setRemoveQuotePoweredBy}
          />

          <InvoiceSettingsSection
            isSaving={isSaving.invoiceSettings}
            hasUnsavedChanges={hasUnsavedChanges.invoiceSettings}
            onSave={handleSaveInvoiceSettings}
            onMarkChanged={() => markSectionChanged("invoiceSettings")}
            showBankDetails={showBankDetails}
            setShowBankDetails={setShowBankDetails}
            removeInvoicePoweredBy={removeInvoicePoweredBy}
            setRemoveInvoicePoweredBy={setRemoveInvoicePoweredBy}
          />

          <TemplateSelectionSection
            isSaving={isSaving.templateSettings}
            hasUnsavedChanges={hasUnsavedChanges.templateSettings}
            onSave={handleSaveTemplateSettings}
            onMarkChanged={() => markSectionChanged("templateSettings")}
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
            templates={templates}
          />
        </div>

        <SettingsNavigationSidebar showBankDetails={showBankDetails} />
      </div>
    </div>
  );
}
