import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, Globe, MapPin, Building2, Calendar } from "lucide-react";
import { CopyIcon } from "@/app/components/ui/CopyIcon";
import { ExternalLinkIcon } from "@/app/components/ui/ExternalLinkIcon";

type ClientDetailsCardProps = {
  client: {
    name: string;
    email: string | null;
    phone: string | null;
    website: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    zipCode: string | null;
    country: string | null;
    taxId: string | null;
    createdAt: Date;
  };
};

export function ClientDetailsCard({ client }: ClientDetailsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 group">
        <div>
          <h3 className="text-xl font-semibold mb-2">{client.name}</h3>
        </div>

        <div className="space-y-3">
          {client.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a
                href={`mailto:${client.email}`}
                className="text-blue-600 hover:underline"
              >
                {client.email}
              </a>

              <CopyIcon value={client.email || ""} />
            </div>
          )}

          {client.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <a
                href={`tel:${client.phone}`}
                className="text-blue-600 hover:underline"
              >
                {client.phone}
              </a>

              <CopyIcon value={client.phone || ""} />
            </div>
          )}

          {client.website && (
            <div className="flex items-center gap-2 text-sm mt-4">
              <Globe className="h-4 w-4 text-muted-foreground" />

              {client.website}

              <ExternalLinkIcon href={client.website || ""} />
            </div>
          )}
        </div>

        {(client.address ||
          client.city ||
          client.state ||
          client.zipCode ||
          client.country) && (
          <div className="pt-4 border-t">
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />

              <div>
                {client.address && <div>{client.address}</div>}
                <div>
                  {[client.city, client.state, client.zipCode]
                    .filter(Boolean)
                    .join(", ")}
                </div>
                {client.country && <div>{client.country}</div>}
              </div>

              <ExternalLinkIcon
                href={`https://maps.google.com/?q=${client.address}, ${client.city}, ${client.state}, ${client.zipCode}, ${client.country}`}
                tooltip="Open in Google Maps"
                className="mt-1 ml-2"
              />
            </div>
          </div>
        )}

        {client.taxId && (
          <div className="flex items-center gap-2 text-sm pt-4 border-t">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Tax ID:</span>{" "}
              {client.taxId}
              <CopyIcon value={client.taxId || ""} />
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm pt-4 border-t text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            Created{" "}
            {new Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }).format(new Date(client.createdAt))}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
