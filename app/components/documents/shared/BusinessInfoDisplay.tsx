"use client";

import { BusinessSettings, BusinessInfoVisibility } from "../types";

interface BusinessInfoDisplayProps {
  businessSettings?: BusinessSettings;
  businessInfoVisibility: BusinessInfoVisibility;
}

export function BusinessInfoDisplay({
  businessSettings,
  businessInfoVisibility,
}: BusinessInfoDisplayProps) {
  return (
    <>
      {businessInfoVisibility.businessName &&
        businessSettings?.businessName && (
          <p className="font-semibold capitalize">
            {businessSettings.businessName}
          </p>
        )}
      {businessInfoVisibility.personalName &&
        businessSettings?.personalName && (
          <p className="text-sm mt-1 capitalize">
            {businessSettings.personalName}
          </p>
        )}
      <div className="text-sm mt-1">
        {businessInfoVisibility.email && businessSettings?.email && (
          <p>{businessSettings.email}</p>
        )}
        {businessInfoVisibility.phone && businessSettings?.phone && (
          <p>{businessSettings.phone}</p>
        )}
        {businessInfoVisibility.website && businessSettings?.website && (
          <p>{businessSettings.website}</p>
        )}

        {businessInfoVisibility.address && businessSettings?.address && (
          <div className="mt-2">
            <p>{businessSettings.address}</p>
            {(businessSettings.city ||
              businessSettings.state ||
              businessSettings.zipCode) && (
              <p>
                {[
                  businessSettings.city,
                  businessSettings.state,
                  businessSettings.zipCode,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            )}
          </div>
        )}

        {businessInfoVisibility.taxId && businessSettings?.taxId && (
          <p className="mt-2">Tax ID: {businessSettings.taxId}</p>
        )}
      </div>
    </>
  );
}
