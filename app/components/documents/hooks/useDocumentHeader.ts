"use client";

import { useState } from "react";
import { DocumentWithRelations } from "@/app/components/documents/templates/types";
import { DUMMY_CLIENTS } from "../clients";

interface UseDocumentHeaderProps {
  document: DocumentWithRelations;
  type: "QUOTE" | "INVOICE";
  onUpdate?: (updates: Partial<DocumentWithRelations>) => void;
}

/**
 * Custom hook to handle all document header business logic
 * This extracts the logic from template components so they can focus on design
 */
export function useDocumentHeader({
  document,
  type,
  onUpdate,
}: UseDocumentHeaderProps) {
  const validDays = 15;
  const [selectedProjectId, setSelectedProjectId] = useState<
    string | undefined
  >(undefined);
  const [selectedClientId, setSelectedClientId] = useState<string | undefined>(
    document.client?.id
  );

  /**
   * Handles issue date changes
   * For quotes, automatically sets valid until date to 15 days from issue date
   */
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

  /**
   * Handles project selection changes
   */
  const handleProjectChange = (projectId: string | undefined) => {
    setSelectedProjectId(projectId);
    // TODO: Update document with projectId when backend is ready
    // onUpdate?.({ projectId });
  };

  /**
   * Handles client selection changes
   * Updates the document with the full client object
   */
  const handleClientChange = (clientId: string | undefined) => {
    setSelectedClientId(clientId);

    // Update document with full client object
    if (clientId && onUpdate) {
      const selectedClient = DUMMY_CLIENTS.find((c) => c.id === clientId);
      if (selectedClient) {
        onUpdate({ client: selectedClient as any });
      }
    }
  };

  /**
   * Get the client to display (selected or from document)
   */
  const displayClient =
    DUMMY_CLIENTS.find((c) => c.id === selectedClientId) || document.client;

  return {
    selectedProjectId,
    selectedClientId,
    displayClient,
    handleIssueDateChange,
    handleProjectChange,
    handleClientChange,
  };
}
