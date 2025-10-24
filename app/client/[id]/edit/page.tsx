"use client";

import { use, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SettingsInput } from "@/app/components/settings/Input";
import { SettingsCombobox } from "@/app/components/settings/Combobox";
import { getClientById, updateClient } from "@/lib/actions";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { getCurrencyOptions, getCountryOptions } from "@/lib/data-utils";
import { z } from "zod";

// Validation schema
const clientEditSchema = z.object({
  // Client details
  name: z.string().min(1, "Company name is required"),
  website: z.string().optional(),
  currency: z.string().optional(),
  taxId: z.string().optional(),

  // Address
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
});

type ClientEditFormData = z.infer<typeof clientEditSchema>;

type Client = {
  id: string;
  name: string;
  website: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  country: string | null;
  currency: string | null;
  taxId: string | null;
  createdAt: Date;
};

export default function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form state
  const [formData, setFormData] = useState<ClientEditFormData>({
    name: "",
    website: "",
    currency: "USD",
    taxId: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  // Load client data
  useEffect(() => {
    const loadClient = async () => {
      try {
        const clientData = await getClientById(id);
        if (!clientData) {
          toast.error("Client not found");
          router.push("/clients");
          return;
        }

        setClient(clientData as unknown as Client);

        // Initialize form data
        setFormData({
          name: clientData.name,
          website: clientData.website || "",
          currency: clientData.currency || "USD",
          taxId: clientData.taxId || "",
          address: clientData.address || "",
          city: clientData.city || "",
          state: clientData.state || "",
          zipCode: clientData.zipCode || "",
          country: clientData.country || "",
        });
      } catch (error) {
        console.error("Error loading client:", error);
        toast.error("Failed to load client");
        router.push("/clients");
      } finally {
        setIsLoading(false);
      }
    };

    loadClient();
  }, [id, router]);

  const handleSubmit = async () => {
    setErrors({});

    // Validate form
    const result = clientEditSchema.safeParse(formData);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        newErrors[path] = issue.message;
      });
      setErrors(newErrors);
      toast.error("Please fix the validation errors");
      return;
    }

    startTransition(async () => {
      try {
        // Get primary contact to keep it unchanged
        const primaryContact = await getClientById(id).then((c) =>
          c?.contacts.find(
            (contact: { isPrimary: boolean }) => contact.isPrimary
          )
        );

        if (!primaryContact) {
          toast.error("Primary contact not found");
          return;
        }

        await updateClient(id, {
          name: formData.name,
          website: formData.website || null,
          currency: formData.currency,
          taxId: formData.taxId || null,
          address: formData.address || null,
          city: formData.city || null,
          state: formData.state || null,
          zipCode: formData.zipCode || null,
          country: formData.country || null,
          primaryContactName: primaryContact.name,
          primaryContactEmail: primaryContact.email || "",
          primaryContactPhone: primaryContact.phone || null,
          primaryContactPosition: primaryContact.position || null,
        });

        toast.success("Client updated successfully");
        router.push(`/client/${id}`);
        router.refresh();
      } catch (error) {
        console.error("Error updating client:", error);
        toast.error("Failed to update client");
      }
    });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
          <div className="h-8 w-64 bg-gray-200 animate-pulse rounded" />
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="h-6 w-48 bg-gray-200 animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
                    <div className="h-12 w-full bg-gray-200 animate-pulse rounded" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!client) {
    return null;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/client/${id}`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Edit Client</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/client/${id}`)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? (
              <>
                <div className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Client Details Card - matches view page layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Client Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Company Name */}
            <div>
              <SettingsInput
                label="Company Name"
                name="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                error={errors.name}
                placeholder="Enter company name"
              />
            </div>

            {/* Website */}
            <div className="space-y-2">
              <SettingsInput
                label="Website"
                name="website"
                type="url"
                value={formData.website}
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
                }
                error={errors.website}
                placeholder="https://example.com"
              />
            </div>

            {/* Currency */}
            <div className="space-y-2">
              <SettingsCombobox
                label="Currency"
                name="currency"
                value={formData.currency}
                options={getCurrencyOptions()}
                onValueChange={(value) =>
                  setFormData({ ...formData, currency: value })
                }
                error={errors.currency}
                placeholder="Select currency"
              />
            </div>

            {/* Address Section */}
            <div className="pt-10 mt-10 border-t space-y-4">
              <SettingsInput
                label="Street Address"
                name="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                error={errors.address}
                placeholder="Enter street address"
              />

              <SettingsInput
                label="City"
                name="city"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                error={errors.city}
                placeholder="Enter city"
              />

              <SettingsInput
                label="State/Province"
                name="state"
                value={formData.state}
                onChange={(e) =>
                  setFormData({ ...formData, state: e.target.value })
                }
                error={errors.state}
                placeholder="Enter state or province"
              />

              <SettingsInput
                label="Zip/Postal Code"
                name="zipCode"
                value={formData.zipCode}
                onChange={(e) =>
                  setFormData({ ...formData, zipCode: e.target.value })
                }
                error={errors.zipCode}
                placeholder="Enter zip or postal code"
              />

              <SettingsCombobox
                label="Country"
                name="country"
                value={formData.country}
                options={getCountryOptions()}
                onValueChange={(value) =>
                  setFormData({ ...formData, country: value })
                }
                error={errors.country}
                placeholder="Select country"
              />
            </div>

            {/* Tax ID */}
            <div className="pt-10 mt-10 border-t">
              <SettingsInput
                label="Tax ID"
                name="taxId"
                value={formData.taxId}
                onChange={(e) =>
                  setFormData({ ...formData, taxId: e.target.value })
                }
                error={errors.taxId}
                placeholder="Enter tax identification number"
              />
            </div>

            {/* Created Date - Read Only */}
            {client && (
              <div className="flex items-center gap-2 text-sm pt-10 mt-10 border-t text-muted-foreground">
                <span>
                  Created{" "}
                  {new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }).format(new Date(client.createdAt))}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
