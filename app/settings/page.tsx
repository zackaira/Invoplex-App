"use client";

import { useState } from "react";
import { getAllTemplates } from "@/app/components/documents/templates/registry";
import { BusinessProfileSection } from "./components/BusinessProfileSection";
import { BrandSettingsSection } from "./components/BrandSettingsSection";
import { TaxSettingsSection } from "./components/TaxSettingsSection";
import { QuoteSettingsSection } from "./components/QuoteSettingsSection";
import { InvoiceSettingsSection } from "./components/InvoiceSettingsSection";
import { TemplateSelectionSection } from "./components/TemplateSelectionSection";
import { SettingsNavigationSidebar } from "./components/SettingsNavigationSidebar";

export default function Settings() {
  const [brandColor, setBrandColor] = useState("#000000");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState("classic");

  // Track unsaved changes for each section
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState({
    businessProfile: false,
    brandSettings: false,
    taxSettings: false,
    quoteSettings: false,
    invoiceSettings: false,
    templateSettings: false,
  });

  // Track saving state for each section
  const [isSaving, setIsSaving] = useState({
    businessProfile: false,
    brandSettings: false,
    taxSettings: false,
    quoteSettings: false,
    invoiceSettings: false,
    templateSettings: false,
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

  const handleSaveDocumentSettings = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setIsSaving((prev) => ({ ...prev, taxSettings: true }));
    try {
      // TODO: Implement save logic
      // await saveTaxSettings(formData);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      clearSectionChanges("taxSettings");
      alert("Tax Settings saved successfully!");
    } catch (error) {
      alert("Failed to save Tax Settings");
    } finally {
      setIsSaving((prev) => ({ ...prev, taxSettings: false }));
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
    <div className="bg-accent">
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your business profile, default settings, and preferences.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="flex gap-8">
          {/* Settings Cards - Left Side */}
          <div className="flex-1 space-y-8 max-w-[820px]">
            <BusinessProfileSection
              isSaving={isSaving.businessProfile}
              hasUnsavedChanges={hasUnsavedChanges.businessProfile}
              onSave={handleSaveBusinessProfile}
              onMarkChanged={() => markSectionChanged("businessProfile")}
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

            <TaxSettingsSection
              isSaving={isSaving.taxSettings}
              hasUnsavedChanges={hasUnsavedChanges.taxSettings}
              onSave={handleSaveDocumentSettings}
              onMarkChanged={() => markSectionChanged("taxSettings")}
            />

            <QuoteSettingsSection
              isSaving={isSaving.quoteSettings}
              hasUnsavedChanges={hasUnsavedChanges.quoteSettings}
              onSave={handleSaveQuoteSettings}
              onMarkChanged={() => markSectionChanged("quoteSettings")}
            />

            <InvoiceSettingsSection
              isSaving={isSaving.invoiceSettings}
              hasUnsavedChanges={hasUnsavedChanges.invoiceSettings}
              onSave={handleSaveInvoiceSettings}
              onMarkChanged={() => markSectionChanged("invoiceSettings")}
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

          <SettingsNavigationSidebar />
        </div>
      </div>
    </div>
  );
}
