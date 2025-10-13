"use client";

import { DocumentWithRelations } from "../types";
import { Input } from "@/components/ui/input";
import { SettingsDatePicker } from "@/app/components/settings";

interface ClassicHeaderProps {
  document: DocumentWithRelations;
  type: "QUOTE" | "INVOICE";
  isEditable?: boolean;
  onUpdate?: (updates: Partial<DocumentWithRelations>) => void;
}

export function ClassicHeader({
  document,
  type,
  isEditable = false,
  onUpdate,
}: ClassicHeaderProps) {
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
    <div className="border-b pb-6">
      <div className="flex justify-between items-center mb-10">
        {/* Company Logo */}
        <div className="flex-shrink-0">
          <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-sm">
            Company Logo
          </div>
        </div>

        {/* Title and Document Info */}
        <div className="text-right">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {type === "QUOTE" ? "Quote" : "Invoice"}
          </h1>
          <p className="text-lg text-gray-600 mb-3">
            {document.documentNumber}
          </p>

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

      <div className="grid grid-cols-2 gap-8">
        {/* From Section - Your Business */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
            From
          </h3>
          <div className="text-gray-900">
            <p className="font-semibold">Your Business Name</p>
            <p className="text-sm text-gray-600 mt-1">
              {/* This would come from BusinessProfile */}
              123 Business Street
              <br />
              City, State 12345
              <br />
              email@business.com
            </p>
          </div>
        </div>

        {/* To Section - Client */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
            {type === "QUOTE" ? "Quote For" : "Bill To"}
          </h3>
          <div className="text-gray-900">
            <p className="font-semibold">{document.client.name}</p>
            {document.contact && (
              <p className="text-sm text-gray-700 mt-1">
                Attn: {document.contact.name}
              </p>
            )}
            <div className="text-sm text-gray-600 mt-1">
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
          <p className="text-sm text-gray-500">Issue Date</p>
          {isEditable ? (
            <SettingsDatePicker
              value={new Date(document.issueDate)}
              onChange={handleIssueDateChange}
              className="font-medium w-full mt-1"
            />
          ) : (
            <p className="font-medium">
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
                className="font-medium w-full mt-1"
              />
            ) : (
              document.dueDate && (
                <p className="font-medium">
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
                className="font-medium w-full mt-1"
              />
            ) : (
              document.validUntil && (
                <p className="font-medium">
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
