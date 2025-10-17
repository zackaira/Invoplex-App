"use client";

import { ClientInfoVisibility } from "../types";

interface ClientInfo {
  name: string;
  contact?: string;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  email?: string | null;
}

interface ClientInfoDisplayProps {
  client: ClientInfo;
  visibility?: ClientInfoVisibility;
}

export function ClientInfoDisplay({
  client,
  visibility = {
    name: true,
    contact: true,
    address: true,
    email: true,
  },
}: ClientInfoDisplayProps) {
  return (
    <>
      {visibility.name && <p className="font-semibold">{client.name}</p>}
      {visibility.contact && "contact" in client && client.contact && (
        <p className="text-sm mt-1">Attn: {client.contact}</p>
      )}
      <div className="text-sm mt-1">
        {visibility.address && client.address && <p>{client.address}</p>}
        {visibility.address &&
          (client.city || client.state || client.zipCode) && (
            <p>
              {[client.city, client.state, client.zipCode]
                .filter(Boolean)
                .join(", ")}
            </p>
          )}
        {visibility.email && client.email && <p>{client.email}</p>}
      </div>
    </>
  );
}
