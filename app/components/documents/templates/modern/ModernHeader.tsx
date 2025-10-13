"use client";

import { DocumentWithRelations } from "../types";
import { Input } from "@/components/ui/input";
import { SettingsDatePicker } from "@/app/components/settings";

interface ModernHeaderProps {
  document: DocumentWithRelations;
  type: "QUOTE" | "INVOICE";
  isEditable?: boolean;
  onUpdate?: (updates: Partial<DocumentWithRelations>) => void;
}

export function ModernHeader({
  document,
  type,
  isEditable = false,
  onUpdate,
}: ModernHeaderProps) {
  const validDays = 15;

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

          {/* Project Name / Additional Info Field */}
          {isEditable ? (
            <Input
              type="text"
              placeholder="Project name or description"
              value={""}
              onChange={(e) => {}}
              className="text-sm text-black mt-2"
            />
          ) : (
            document.notes && <p className="text-sm opacity-90 mt-2">{""}</p>
          )}
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
          <h3 className="text-sm font-semibold uppercase mb-2 opacity-75">
            {type === "QUOTE" ? "Quote For" : "Bill To"}
          </h3>
          <div>
            <p className="font-semibold text-lg">{document.client.name}</p>
            {document.contact && (
              <p className="text-sm opacity-90 mt-1">
                Attn: {document.contact.name}
              </p>
            )}
            <div className="text-sm opacity-90 mt-1">
              {document.client.address && <p>{document.client.address}</p>}
              {(document.client.city ||
                document.client.state ||
                document.client.zipCode) && (
                <p>
                  {[
                    document.client.city,
                    document.client.state,
                    document.client.zipCode,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              )}
              {document.client.email && <p>{document.client.email}</p>}
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
