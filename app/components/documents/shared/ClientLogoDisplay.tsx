"use client";

import { BusinessSettings } from "../types";

interface ClientLogoDisplayProps {
  businessSettings?: BusinessSettings;
  className?: string;
  defaultColor?: string;
}

export function ClientLogoDisplay({
  businessSettings,
  className = "",
  defaultColor = "#000000",
}: ClientLogoDisplayProps) {
  return (
    <div className={`flex-shrink-0 ${className}`}>
      {businessSettings?.logo ? (
        <img
          src={businessSettings.logo}
          alt={businessSettings.businessName}
          className="w-32 h-32 object-contain"
        />
      ) : (
        <h2
          className="text-3xl font-bold"
          style={{ color: businessSettings?.brandColor || defaultColor }}
        >
          {businessSettings?.businessName || "Your Business"}
        </h2>
      )}
    </div>
  );
}
