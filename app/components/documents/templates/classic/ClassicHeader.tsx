"use client";

import { TemplateHeaderProps } from "../../types";
import { SettingsDatePicker } from "@/app/components/settings";
import { ProjectSelect } from "../../modals/projects";
import { ClientSelect } from "../../modals/clients";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDocumentHeader } from "../../hooks";

export function ClassicHeader({
  document,
  type,
  isEditable = false,
  onUpdate,
  onOpenProjectModal,
  onOpenClientModal,
  onOpenBusinessInfoModal,
  businessInfoVisibility = {
    businessName: true,
    personalName: false,
    email: true,
    phone: true,
    website: true,
    taxId: false,
    address: false,
  },
  businessSettings,
}: TemplateHeaderProps) {
  // Use the shared hook for all business logic
  const {
    selectedProjectId,
    selectedClientId,
    displayClient,
    handleIssueDateChange,
    handleProjectChange,
    handleClientChange,
  } = useDocumentHeader({ document, type, onUpdate });

  return (
    <div className="border-b border-gray-200 pb-6">
      <div className="flex justify-between items-center mb-16">
        {/* Company Logo or Business Name */}
        <div className="flex-shrink-0">
          {businessSettings?.logo ? (
            <img
              src={businessSettings.logo}
              alt={businessSettings.businessName}
              className="w-32 h-32 object-contain"
            />
          ) : (
            <h2
              className="text-3xl font-bold"
              style={{ color: businessSettings?.brandColor || "#000000" }}
            >
              {businessSettings?.businessName || "Your Business"}
            </h2>
          )}
        </div>

        {/* Title and Document Info */}
        <div className="text-right">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {type === "QUOTE" ? "Quote" : "Invoice"}
          </h1>
          <p className="text-lg text-gray-600 mb-3">
            {document.documentNumber}
          </p>

          {/* Project Selection */}
          <div className="mt-2">
            <ProjectSelect
              value={selectedProjectId}
              onChange={handleProjectChange}
              onCreateNew={onOpenProjectModal}
              isEditable={isEditable}
              className="w-full text-sm !bg-white !border-gray-300 !text-gray-900 hover:!bg-gray-50 hover:!text-gray-900"
              selectedClientId={selectedClientId}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* From Section - Your Business */}
        <div className="min-h-38">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-sm font-semibold text-gray-500 uppercase">
              From
            </h3>
            {isEditable && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 !text-invoplex hover:!bg-gray-100 hover:!text-gray-900"
                onClick={onOpenBusinessInfoModal}
              >
                <Settings className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="text-gray-900">
            {businessInfoVisibility.businessName &&
              businessSettings?.businessName && (
                <p className="font-semibold">{businessSettings.businessName}</p>
              )}
            {businessInfoVisibility.personalName &&
              businessSettings?.personalName && (
                <p className="text-sm text-gray-700 mt-1">
                  {businessSettings.personalName}
                </p>
              )}
            <div className="text-sm text-gray-600 mt-1">
              {businessInfoVisibility.email && businessSettings?.email && (
                <p>{businessSettings.email}</p>
              )}
              {businessInfoVisibility.phone && businessSettings?.phone && (
                <p>{businessSettings.phone}</p>
              )}
              {businessInfoVisibility.website && businessSettings?.website && (
                <p>{businessSettings.website}</p>
              )}
              {businessInfoVisibility.taxId && businessSettings?.taxId && (
                <p>Tax ID: {businessSettings.taxId}</p>
              )}
              {businessInfoVisibility.address && businessSettings?.address && (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>

        {/* To Section - Client */}
        <div className="min-h-38">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-sm font-semibold text-gray-500 uppercase">
              {type === "QUOTE" ? "Quote For" : "Bill To"}
            </h3>
            {isEditable && (
              <ClientSelect
                value={selectedClientId}
                onChange={handleClientChange}
                onCreateNew={onOpenClientModal}
                className="text-xs h-6 !text-gray-600 hover:!bg-gray-100 hover:!text-gray-900"
                align="center"
              />
            )}
          </div>
          <div className="text-gray-900">
            <p className="font-semibold">{displayClient.name}</p>
            {"contact" in displayClient && displayClient.contact && (
              <p className="text-sm text-gray-700 mt-1">
                Attn: {displayClient.contact}
              </p>
            )}
            <div className="text-sm text-gray-600 mt-1">
              {displayClient.address && <p>{displayClient.address}</p>}
              {(displayClient.city ||
                displayClient.state ||
                displayClient.zipCode) && (
                <p>
                  {[
                    displayClient.city,
                    displayClient.state,
                    displayClient.zipCode,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              )}
              {displayClient.email && <p>{displayClient.email}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Dates Section */}
      <div className="grid grid-cols-2 gap-8 mt-6">
        <div>
          <p className="text-sm text-gray-500">Issue Date</p>
          {isEditable ? (
            <SettingsDatePicker
              value={new Date(document.issueDate)}
              onChange={handleIssueDateChange}
              className="font-medium w-full mt-1 !bg-white !border-gray-300 !text-gray-900 placeholder:!text-gray-400 hover:!bg-gray-50 hover:!text-gray-900"
            />
          ) : (
            <p className="font-medium text-gray-900">
              {new Date(document.issueDate).toLocaleDateString("en-US")}
            </p>
          )}
        </div>

        {type === "INVOICE" && (
          <div>
            <p className="text-sm text-gray-500">Due Date</p>
            {isEditable ? (
              <SettingsDatePicker
                value={
                  document.dueDate ? new Date(document.dueDate) : undefined
                }
                onChange={(date) => onUpdate?.({ dueDate: date })}
                placeholder="Select due date"
                className="font-medium w-full mt-1 !bg-white !border-gray-300 !text-gray-900 placeholder:!text-gray-400 hover:!bg-gray-50 hover:!text-gray-900"
              />
            ) : (
              document.dueDate && (
                <p className="font-medium text-gray-900">
                  {new Date(document.dueDate).toLocaleDateString("en-US")}
                </p>
              )
            )}
          </div>
        )}
        {type === "QUOTE" && (
          <div>
            <p className="text-sm text-gray-500">Valid Until</p>
            {isEditable ? (
              <SettingsDatePicker
                value={
                  document.validUntil
                    ? new Date(document.validUntil)
                    : undefined
                }
                onChange={(date) => onUpdate?.({ validUntil: date })}
                placeholder="Select valid until date"
                className="font-medium w-full mt-1 !bg-white !border-gray-300 !text-gray-900 placeholder:!text-gray-400 hover:!bg-gray-50 hover:!text-gray-900"
              />
            ) : (
              document.validUntil && (
                <p className="font-medium text-gray-900">
                  {new Date(document.validUntil).toLocaleDateString("en-US")}
                </p>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
