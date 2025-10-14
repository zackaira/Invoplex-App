"use client";

import { useState } from "react";
import { DocumentWithRelations } from "../types";
import { SettingsDatePicker } from "@/app/components/settings";
import { ProjectSelect } from "../../projects";
import { ClientSelect, DUMMY_CLIENTS } from "../../clients";

interface ModernHeaderProps {
  document: DocumentWithRelations;
  type: "QUOTE" | "INVOICE";
  isEditable?: boolean;
  onUpdate?: (updates: Partial<DocumentWithRelations>) => void;
  onOpenProjectModal?: () => void;
  onOpenClientModal?: () => void;
}

export function ModernHeader({
  document,
  type,
  isEditable = false,
  onUpdate,
  onOpenProjectModal,
  onOpenClientModal,
}: ModernHeaderProps) {
  const validDays = 15;
  const [selectedProjectId, setSelectedProjectId] = useState<
    string | undefined
  >(undefined);
  const [selectedClientId, setSelectedClientId] = useState<string | undefined>(
    document.client?.id
  );

  const handleIssueDateChange = (date: Date | undefined) => {
    if (!date || !onUpdate) return;

    if (type === "QUOTE") {
      // Auto-set Valid Until date to 15 days from Issue Date
      const validUntilDate = new Date(date);
      validUntilDate.setDate(validUntilDate.getDate() + validDays);
      onUpdate({ issueDate: date, validUntil: validUntilDate });
    } else {
      onUpdate({ issueDate: date });
    }
  };

  const handleProjectChange = (projectId: string | undefined) => {
    setSelectedProjectId(projectId);
    // TODO: Update document with projectId when backend is ready
    // onUpdate?.({ projectId });
  };

  const handleClientChange = (clientId: string | undefined) => {
    setSelectedClientId(clientId);
    // TODO: Update document with clientId when backend is ready
    // onUpdate?.({ clientId });
  };

  // Get selected client info for display
  const displayClient =
    DUMMY_CLIENTS.find((c) => c.id === selectedClientId) || document.client;

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-t-lg">
      <div className="flex justify-between items-start mb-6">
        {/* Company Logo */}
        <div className="flex-shrink-0">
          <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-white/60 text-sm">
            Company Logo
          </div>
        </div>

        {/* Title and Document Info */}
        <div className="text-right">
          <h1 className="text-5xl font-bold mb-2">
            {type === "QUOTE" ? "Quote" : "Invoice"}
          </h1>
          <p className="text-xl opacity-90 mb-3">{document.documentNumber}</p>

          {/* Project Selection */}
          <div className="mt-2">
            <ProjectSelect
              value={selectedProjectId}
              onChange={handleProjectChange}
              onCreateNew={onOpenProjectModal}
              isEditable={isEditable}
              className="w-full text-sm bg-white"
              selectedClientId={selectedClientId}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mt-8">
        {/* From Section */}
        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
          <h3 className="text-sm font-semibold uppercase mb-2 opacity-75">
            From
          </h3>
          <div>
            <p className="font-semibold text-lg">Your Business Name</p>
            <p className="text-sm opacity-90 mt-1">
              123 Business Street
              <br />
              City, State 12345
              <br />
              email@business.com
            </p>
          </div>
        </div>

        {/* To Section */}
        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-sm font-semibold uppercase opacity-75">
              {type === "QUOTE" ? "Quote For" : "Bill To"}
            </h3>
            {isEditable && (
              <ClientSelect
                value={selectedClientId}
                onChange={handleClientChange}
                onCreateNew={onOpenClientModal}
                className="text-xs h-6 bg-white"
                align="start"
              />
            )}
          </div>
          <div>
            <p className="font-semibold text-lg">{displayClient.name}</p>
            {document.contact && (
              <p className="text-sm opacity-90 mt-1">
                Attn: {document.contact.name}
              </p>
            )}
            <div className="text-sm opacity-90 mt-1">
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
          <p className="text-sm uppercase opacity-75">Issue Date</p>
          {isEditable ? (
            <SettingsDatePicker
              value={new Date(document.issueDate)}
              onChange={handleIssueDateChange}
              className="font-medium text-black w-full mt-1"
            />
          ) : (
            <p className="font-medium text-lg mt-1">
              {new Date(document.issueDate).toLocaleDateString("en-US")}
            </p>
          )}
        </div>
        {type === "INVOICE" && (
          <div>
            <p className="text-sm uppercase opacity-75">Due Date</p>
            {isEditable ? (
              <SettingsDatePicker
                value={
                  document.dueDate ? new Date(document.dueDate) : undefined
                }
                onChange={(date) => onUpdate?.({ dueDate: date })}
                placeholder="Select due date"
                className="font-medium text-black w-full mt-1"
              />
            ) : (
              document.dueDate && (
                <p className="font-medium text-lg mt-1">
                  {new Date(document.dueDate).toLocaleDateString("en-US")}
                </p>
              )
            )}
          </div>
        )}
        {type === "QUOTE" && (
          <div>
            <p className="text-sm uppercase opacity-75">Valid Until</p>
            {isEditable ? (
              <SettingsDatePicker
                value={
                  document.validUntil
                    ? new Date(document.validUntil)
                    : undefined
                }
                onChange={(date) => onUpdate?.({ validUntil: date })}
                placeholder="Select valid until date"
                className="font-medium text-black w-full mt-1"
              />
            ) : (
              document.validUntil && (
                <p className="font-medium text-lg mt-1">
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
