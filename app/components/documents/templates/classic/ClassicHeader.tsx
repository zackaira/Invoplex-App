"use client";

import { TemplateHeaderProps } from "../../types";
import { SettingsDatePicker } from "@/app/components/settings";
import { ProjectSelect } from "../../modals/projects";
import { ClientSelect } from "../../modals/clients";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDocumentHeader } from "../../hooks";
import {
  ClientLogoDisplay,
  BusinessInfoDisplay,
  ClientInfoDisplay,
} from "../../shared";
import { TooltipWrapper } from "@/app/components/ui/TooltipWrapper";

export function ClassicHeader({
  document,
  type,
  isEditable = false,
  onUpdate,
  onOpenProjectModal,
  onOpenClientModal,
  onOpenBusinessInfoModal,
  onOpenClientInfoModal,
  businessInfoVisibility = {
    businessName: true,
    personalName: false,
    email: true,
    phone: true,
    website: true,
    taxId: false,
    address: false,
  },
  clientInfoVisibility = {
    name: true,
    contact: true,
    address: true,
    email: true,
  },
  businessSettings,
  projectsRefreshKey,
  clientsRefreshKey,
}: TemplateHeaderProps) {
  // Use the shared hook for all business logic
  const {
    selectedProjectId,
    selectedClientId,
    displayClient,
    primaryContactName,
    handleIssueDateChange,
    handleProjectChange,
    handleClientChange,
  } = useDocumentHeader({ document, type, onUpdate, clientsRefreshKey });

  return (
    <div className="border-b border-gray-200 pb-6">
      <div className="flex justify-between items-center mb-16">
        {/* Company Logo or Business Name */}
        <ClientLogoDisplay businessSettings={businessSettings} />

        {/* Title and Document Info */}
        <div className="text-right">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {type === "QUOTE"
              ? businessSettings?.quoteTitle || "QUOTE"
              : businessSettings?.invoiceTitle || "INVOICE"}
          </h1>
          <p className="text-lg text-gray-600 mb-3">
            {document.documentNumber}
          </p>

          {/* Project Selection */}
          <div className="mt-2">
            <ProjectSelect
              key={`projects-${projectsRefreshKey}`}
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
              <TooltipWrapper tooltip="Edit Info to display" side="top">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 !text-invoplex hover:!bg-gray-100 hover:!text-gray-900"
                  onClick={onOpenBusinessInfoModal}
                >
                  <Settings className="h-4 w-4" />
                  <span className="sr-only">Edit Info to display</span>
                </Button>
              </TooltipWrapper>
            )}
          </div>
          <div className="text-gray-900">
            <BusinessInfoDisplay
              businessSettings={businessSettings}
              businessInfoVisibility={businessInfoVisibility}
            />
          </div>
        </div>

        {/* To Section - Client */}
        <div className="min-h-38">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-sm font-semibold text-gray-500 uppercase">
              {type === "QUOTE" ? "Quote For" : "Bill To"}
            </h3>
            {isEditable && (
              <>
                <ClientSelect
                  key={`clients-${clientsRefreshKey}`}
                  userId={document.userId}
                  value={selectedClientId}
                  onChange={handleClientChange}
                  onCreateNew={onOpenClientModal}
                  className="text-xs h-6 !text-gray-600 hover:!bg-gray-100 hover:!text-gray-900"
                  align="center"
                />

                <TooltipWrapper tooltip="Edit Info to display" side="top">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 !text-invoplex hover:!bg-gray-100 hover:!text-gray-900"
                    onClick={onOpenClientInfoModal}
                  >
                    <Settings className="h-4 w-4" />
                    <span className="sr-only">Edit Info to display</span>
                  </Button>
                </TooltipWrapper>
              </>
            )}
          </div>
          <div className="text-gray-900">
            <ClientInfoDisplay
              client={{
                ...displayClient,
                contact: primaryContactName,
              }}
              visibility={clientInfoVisibility}
            />
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
