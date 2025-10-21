import { TemplateRenderer } from "@/app/components/documents/TemplateRenderer";
import { getDocumentById } from "@/lib/actions";
import { getUserSettings } from "@/lib/actions/settings";
import { notFound, redirect } from "next/navigation";

export default async function QuotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Redirect to quotes page if ID is missing or invalid
  if (!id || id.trim() === "") {
    redirect("/quotes");
  }

  const document = await getDocumentById(id, "QUOTE");

  if (!document) {
    return notFound();
  }

  // Fetch business settings for the user
  // TODO: Replace with actual user ID from authentication
  const userId = "cmgexy4630002r7qfecfve8hq";
  const settingsResult = await getUserSettings(userId);
  const businessProfile = settingsResult?.data?.businessProfile;
  const userSettings = settingsResult?.data?.userSettings;

  const businessSettings =
    businessProfile && userSettings
      ? {
          // Business Profile fields
          personalName: businessProfile.personalName,
          businessName: businessProfile.businessName,
          email: businessProfile.email,
          phone: businessProfile.phone,
          website: businessProfile.website,
          logo: businessProfile.logo,
          address: businessProfile.address,
          city: businessProfile.city,
          state: businessProfile.state,
          zipCode: businessProfile.zipCode,
          country: businessProfile.country,
          taxId: businessProfile.taxId,
          registrationNumber: businessProfile.registrationNumber,
          brandColor: businessProfile.brandColor,

          // User Settings fields
          quoteTitle: userSettings.quoteTitle,
          invoiceTitle: userSettings.invoiceTitle,
          defaultCurrency: userSettings.defaultCurrency,
          currencyDisplayFormat: userSettings.currencyDisplayFormat,
          taxName: userSettings.taxName,
          defaultTaxRate: userSettings.defaultTaxRate,
          quoteDefaultNotes: userSettings.quoteDefaultNotes,
          quoteDefaultTerms: userSettings.quoteDefaultTerms,
          invoiceDefaultNotes: userSettings.invoiceDefaultNotes,
          invoiceDefaultTerms: userSettings.invoiceDefaultTerms,
        }
      : undefined;

  return (
    <div className="relative">
      <TemplateRenderer
        document={document}
        type="QUOTE"
        businessSettings={businessSettings}
      />
    </div>
  );
}
