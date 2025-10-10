"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  FileText,
  Receipt,
  FileCheck,
  CloudUpload,
  X,
} from "lucide-react";

export default function Settings() {
  const [isSaving, setIsSaving] = useState(false);
  const [brandColor, setBrandColor] = useState("#000000");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const processLogoFile = (file: File) => {
    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (JPG, PNG, or GIF)");
      return;
    }

    setLogoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processLogoFile(file);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processLogoFile(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
  };

  const handleSaveBusinessProfile = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setIsSaving(true);
    // TODO: Implement save logic
    setTimeout(() => setIsSaving(false), 1000);
  };

  const handleSaveBrandSettings = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setIsSaving(true);
    // TODO: Implement save logic
    setTimeout(() => setIsSaving(false), 1000);
  };

  const handleSaveDocumentSettings = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setIsSaving(true);
    // TODO: Implement save logic
    setTimeout(() => setIsSaving(false), 1000);
  };

  const handleSaveQuoteSettings = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setIsSaving(true);
    // TODO: Implement save logic
    setTimeout(() => setIsSaving(false), 1000);
  };

  const handleSaveInvoiceSettings = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setIsSaving(true);
    // TODO: Implement save logic
    setTimeout(() => setIsSaving(false), 1000);
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
          <div className="flex-1 space-y-8">
            {/* Business Profile Card */}
            <Card id="business-profile" className="pb-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Business Profile
                </CardTitle>
                <CardDescription>
                  Your business information that appears on quotes and invoices.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSaveBusinessProfile}>
                <CardContent className="space-y-4 mb-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="personalName"
                      className="text-sm font-medium"
                    >
                      Personal Name
                    </label>
                    <Input
                      id="personalName"
                      name="personalName"
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="businessName"
                        className="text-sm font-medium"
                      >
                        Business Name{" "}
                        <span className="text-destructive">*</span>
                      </label>
                      <Input
                        id="businessName"
                        name="businessName"
                        placeholder="Acme Corporation"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="contact@acme.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium">
                        Phone
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="website" className="text-sm font-medium">
                        Website
                      </label>
                      <Input
                        id="website"
                        name="website"
                        type="url"
                        placeholder="https://acme.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="address" className="text-sm font-medium">
                      Address
                    </label>
                    <Input
                      id="address"
                      name="address"
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="city" className="text-sm font-medium">
                        City
                      </label>
                      <Input
                        id="city"
                        name="city"
                        placeholder="San Francisco"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="state" className="text-sm font-medium">
                        State / Province
                      </label>
                      <Input id="state" name="state" placeholder="CA" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="zipCode" className="text-sm font-medium">
                        ZIP / Postal Code
                      </label>
                      <Input id="zipCode" name="zipCode" placeholder="94102" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="country" className="text-sm font-medium">
                        Country
                      </label>
                      <Input
                        id="country"
                        name="country"
                        placeholder="United States"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-accent/50 border-t pb-6 justify-end">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Business Profile"}
                  </Button>
                </CardFooter>
              </form>
            </Card>

            {/* Brand Settings Card */}
            <Card id="brand-settings" className="pb-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="h-5 w-5" />
                  Brand
                </CardTitle>
                <CardDescription>
                  Upload your logo and customize your brand colors.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSaveBrandSettings}>
                <CardContent className="space-y-4 mb-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Logo</label>

                    {!logoPreview ? (
                      <label
                        htmlFor="logo"
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                          isDragging
                            ? "border-primary bg-primary/10"
                            : "border-primary/30 bg-muted/10 hover:bg-muted/30"
                        }`}
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <CloudUpload className="w-16 h-16 mb-4 text-primary" />
                          <p className="mb-2 text-base">
                            <span className="font-semibold text-primary">
                              Browse
                            </span>{" "}
                            <span className="text-muted-foreground">
                              or drop your logo here
                            </span>
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Maximum 5MB in size.
                          </p>
                          <p className="text-sm text-muted-foreground">
                            JPG, PNG, or GIF formats.
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Recommended size: 300 x 200 pixels.
                          </p>
                        </div>
                        <Input
                          id="logo"
                          name="logo"
                          type="file"
                          accept="image/jpeg,image/png,image/gif"
                          className="hidden"
                          onChange={handleLogoChange}
                        />
                      </label>
                    ) : (
                      <div className="relative w-full border-2 border-dashed border-primary/30 rounded-lg p-4 bg-muted/10">
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon-sm"
                          className="absolute top-2 right-2 z-10"
                          onClick={handleRemoveLogo}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center justify-center">
                          <img
                            src={logoPreview}
                            alt="Logo preview"
                            className="max-h-48 max-w-full object-contain"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="brandColor" className="text-sm font-medium">
                      Brand Color
                    </label>

                    <div className="space-y-3">
                      <label
                        htmlFor="brandColor"
                        className="inline-flex items-center gap-0 cursor-pointer rounded-lg overflow-hidden border border-input shadow-sm hover:border-primary/50 transition-colors bg-background"
                      >
                        <div
                          className="w-14 h-12 flex-shrink-0"
                          style={{ backgroundColor: brandColor }}
                        />
                        <Input
                          type="text"
                          value={brandColor}
                          disabled
                          className="font-mono text-sm w-32 border-0 shadow-none"
                        />
                        <Input
                          id="brandColor"
                          name="brandColor"
                          type="color"
                          value={brandColor}
                          onChange={(e) =>
                            setBrandColor(e.target.value.toUpperCase())
                          }
                          className="sr-only"
                        />
                      </label>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      This color will be used for accents in your documents
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="bg-accent/50 border-t pb-6 justify-end">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Brand Settings"}
                  </Button>
                </CardFooter>
              </form>
            </Card>

            {/* Tax Settings Card */}
            <Card id="tax-settings" className="pb-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="h-5 w-5" />
                  Tax Settings
                </CardTitle>
                <CardDescription>
                  Configure your tax and currency preferences.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSaveDocumentSettings}>
                <CardContent className="space-y-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="defaultCurrency"
                        className="text-sm font-medium"
                      >
                        Default Currency
                      </label>
                      <Select name="defaultCurrency" defaultValue="USD">
                        <SelectTrigger id="defaultCurrency">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD - US Dollar</SelectItem>
                          <SelectItem value="EUR">EUR - Euro</SelectItem>
                          <SelectItem value="GBP">
                            GBP - British Pound
                          </SelectItem>
                          <SelectItem value="CAD">
                            CAD - Canadian Dollar
                          </SelectItem>
                          <SelectItem value="AUD">
                            AUD - Australian Dollar
                          </SelectItem>
                          <SelectItem value="JPY">
                            JPY - Japanese Yen
                          </SelectItem>
                          <SelectItem value="INR">
                            INR - Indian Rupee
                          </SelectItem>
                          <SelectItem value="CNY">
                            CNY - Chinese Yuan
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="taxId" className="text-sm font-medium">
                        Tax ID / VAT Number
                      </label>
                      <Input id="taxId" name="taxId" placeholder="12-3456789" />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="defaultTaxRate"
                        className="text-sm font-medium"
                      >
                        Default Tax Rate (%)
                      </label>
                      <Input
                        id="defaultTaxRate"
                        name="defaultTaxRate"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        defaultValue="0.00"
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-accent/50 border-t pb-6 justify-end">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Tax Settings"}
                  </Button>
                </CardFooter>
              </form>
            </Card>

            {/* Quote Settings Card */}
            <Card id="quote-settings" className="pb-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Quote-Specific Settings
                </CardTitle>
                <CardDescription>
                  Configure settings that are unique to quotes only.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSaveQuoteSettings}>
                <CardContent className="space-y-4 mb-6">
                  <div className="space-y-2">
                    <label htmlFor="quoteTitle" className="text-sm font-medium">
                      Quote Title
                    </label>
                    <Input
                      id="quoteTitle"
                      name="quoteTitle"
                      placeholder="QUOTE"
                      defaultValue="QUOTE"
                    />
                    <p className="text-xs text-muted-foreground">
                      The title text that appears at the top of quotes
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="quotePrefix"
                        className="text-sm font-medium"
                      >
                        Quote Prefix
                      </label>
                      <Input
                        id="quotePrefix"
                        name="quotePrefix"
                        placeholder="Q"
                        defaultValue="Q"
                      />
                      <p className="text-xs text-muted-foreground">
                        Example: Q-001, Q-002
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="quoteNextNumber"
                        className="text-sm font-medium"
                      >
                        Next Quote Number
                      </label>
                      <Input
                        id="quoteNextNumber"
                        name="quoteNextNumber"
                        type="number"
                        placeholder="1"
                        defaultValue="1"
                        min="1"
                      />
                      <p className="text-xs text-muted-foreground">
                        Auto-increments with each quote
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="quoteValidityDays"
                      className="text-sm font-medium"
                    >
                      Default Validity Period (Days)
                    </label>
                    <Input
                      id="quoteValidityDays"
                      name="quoteValidityDays"
                      type="number"
                      placeholder="30"
                      defaultValue="30"
                      min="1"
                    />
                    <p className="text-xs text-muted-foreground">
                      How long quotes remain valid by default
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="quoteDefaultTerms"
                      className="text-sm font-medium"
                    >
                      Quote Terms & Conditions
                    </label>
                    <Textarea
                      id="quoteDefaultTerms"
                      name="quoteDefaultTerms"
                      placeholder="Enter default terms and conditions for quotes..."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="quoteDefaultNotes"
                      className="text-sm font-medium"
                    >
                      Quote Notes (Optional)
                    </label>
                    <Textarea
                      id="quoteDefaultNotes"
                      name="quoteDefaultNotes"
                      placeholder="Enter additional notes for quotes..."
                      rows={3}
                    />
                  </div>
                </CardContent>
                <CardFooter className="bg-accent/50 border-t pb-6 justify-end">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Quote Settings"}
                  </Button>
                </CardFooter>
              </form>
            </Card>

            {/* Invoice Settings Card */}
            <Card id="invoice-settings" className="pb-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Invoice-Specific Settings
                </CardTitle>
                <CardDescription>
                  Configure settings that are unique to invoices only.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSaveInvoiceSettings}>
                <CardContent className="space-y-4 mb-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="invoiceTitle"
                      className="text-sm font-medium"
                    >
                      Invoice Title
                    </label>
                    <Input
                      id="invoiceTitle"
                      name="invoiceTitle"
                      placeholder="INVOICE"
                      defaultValue="INVOICE"
                    />
                    <p className="text-xs text-muted-foreground">
                      The title text that appears at the top of invoices
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="invoicePrefix"
                        className="text-sm font-medium"
                      >
                        Invoice Prefix
                      </label>
                      <Input
                        id="invoicePrefix"
                        name="invoicePrefix"
                        placeholder="INV"
                        defaultValue="INV"
                      />
                      <p className="text-xs text-muted-foreground">
                        Example: INV-001, INV-002
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="invoiceNextNumber"
                        className="text-sm font-medium"
                      >
                        Next Invoice Number
                      </label>
                      <Input
                        id="invoiceNextNumber"
                        name="invoiceNextNumber"
                        type="number"
                        placeholder="1"
                        defaultValue="1"
                        min="1"
                      />
                      <p className="text-xs text-muted-foreground">
                        Auto-increments with each invoice
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="invoiceDefaultDueDays"
                      className="text-sm font-medium"
                    >
                      Default Payment Terms (Days)
                    </label>
                    <Input
                      id="invoiceDefaultDueDays"
                      name="invoiceDefaultDueDays"
                      type="number"
                      placeholder="30"
                      defaultValue="30"
                      min="1"
                    />
                    <p className="text-xs text-muted-foreground">
                      Default days until invoice payment is due
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="invoiceDefaultTerms"
                      className="text-sm font-medium"
                    >
                      Invoice Terms & Conditions
                    </label>
                    <Textarea
                      id="invoiceDefaultTerms"
                      name="invoiceDefaultTerms"
                      placeholder="Enter default terms and conditions for invoices..."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="invoiceDefaultNotes"
                      className="text-sm font-medium"
                    >
                      Invoice Notes (Optional)
                    </label>
                    <Textarea
                      id="invoiceDefaultNotes"
                      name="invoiceDefaultNotes"
                      placeholder="Enter additional notes for invoices..."
                      rows={3}
                    />
                  </div>

                  {/* Bank Details Section */}
                  <div className="space-y-4 pt-4 border-t">
                    <div>
                      <h4 className="text-sm font-semibold mb-1">
                        Bank Details
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        These details will appear on invoices for payment
                        instructions
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label
                          htmlFor="bankName"
                          className="text-sm font-medium"
                        >
                          Bank Name
                        </label>
                        <Input
                          id="bankName"
                          name="bankName"
                          placeholder="Chase Bank"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="accountName"
                          className="text-sm font-medium"
                        >
                          Account Name
                        </label>
                        <Input
                          id="accountName"
                          name="accountName"
                          placeholder="Business Account Name"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label
                          htmlFor="accountNumber"
                          className="text-sm font-medium"
                        >
                          Account Number
                        </label>
                        <Input
                          id="accountNumber"
                          name="accountNumber"
                          placeholder="123456789"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="routingNumber"
                          className="text-sm font-medium"
                        >
                          Routing Number / Sort Code
                        </label>
                        <Input
                          id="routingNumber"
                          name="routingNumber"
                          placeholder="021000021"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="iban" className="text-sm font-medium">
                          IBAN (International)
                        </label>
                        <Input
                          id="iban"
                          name="iban"
                          placeholder="GB29 NWBK 6016 1331 9268 19"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="swiftCode"
                          className="text-sm font-medium"
                        >
                          SWIFT / BIC Code
                        </label>
                        <Input
                          id="swiftCode"
                          name="swiftCode"
                          placeholder="CHASUS33"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-accent/50 border-t pb-6 justify-end">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Invoice Settings"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>

          {/* Navigation Sidebar - Right Side */}
          <div className="w-64 shrink-0">
            <div className="sticky top-8 space-y-2">
              <p className="text-sm font-semibold text-muted-foreground mb-4 px-3">
                Quick Navigation
              </p>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => scrollToSection("business-profile")}
              >
                <Building2 className="mr-2 h-4 w-4" />
                Business Profile
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => scrollToSection("brand-settings")}
              >
                <FileCheck className="mr-2 h-4 w-4" />
                Company Branding
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => scrollToSection("tax-settings")}
              >
                <FileCheck className="mr-2 h-4 w-4" />
                Tax Settings
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => scrollToSection("quote-settings")}
              >
                <FileText className="mr-2 h-4 w-4" />
                Quote Settings
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => scrollToSection("invoice-settings")}
              >
                <Receipt className="mr-2 h-4 w-4" />
                Invoice Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
