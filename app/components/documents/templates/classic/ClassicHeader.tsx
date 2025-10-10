"use client";

import { DocumentWithRelations } from "../types";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getStatusColor } from "../../shared/utils";

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
  return (
    <div className="border-b pb-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {type === "QUOTE" ? "Quote" : "Invoice"}
          </h1>
          <p className="text-lg text-gray-600">{document.documentNumber}</p>
        </div>
        <div className="text-right">
          <Badge className={getStatusColor(document.status)}>
            {document.status}
          </Badge>
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
            <Input
              type="date"
              value={new Date(document.issueDate).toISOString().split("T")[0]}
              onChange={(e) =>
                onUpdate?.({ issueDate: new Date(e.target.value) })
              }
              className="font-medium"
            />
          ) : (
            <p className="font-medium">
              {new Date(document.issueDate).toLocaleDateString()}
            </p>
          )}
        </div>
        {type === "INVOICE" && (
          <div>
            <p className="text-sm text-gray-500">Due Date</p>
            {isEditable ? (
              <Input
                type="date"
                value={
                  document.dueDate
                    ? new Date(document.dueDate).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  onUpdate?.({ dueDate: new Date(e.target.value) })
                }
                className="font-medium"
              />
            ) : (
              document.dueDate && (
                <p className="font-medium">
                  {new Date(document.dueDate).toLocaleDateString()}
                </p>
              )
            )}
          </div>
        )}
        {type === "QUOTE" && (
          <div>
            <p className="text-sm text-gray-500">Valid Until</p>
            {isEditable ? (
              <Input
                type="date"
                value={
                  document.validUntil
                    ? new Date(document.validUntil).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  onUpdate?.({ validUntil: new Date(e.target.value) })
                }
                className="font-medium"
              />
            ) : (
              document.validUntil && (
                <p className="font-medium">
                  {new Date(document.validUntil).toLocaleDateString()}
                </p>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
