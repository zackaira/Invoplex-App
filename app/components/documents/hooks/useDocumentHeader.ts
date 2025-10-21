/**
 * ============================================================================
 * DOCUMENT HEADER HOOK
 * ============================================================================
 *
 * This hook manages all business logic for document headers across templates.
 * It handles client selection, project selection, and date management.
 *
 * WHY THIS EXISTS:
 * Templates should focus on design/layout. This hook extracts the shared
 * business logic so all templates behave consistently.
 *
 * USAGE:
 * Import this hook in any template header component (ClassicHeader, ModernHeader, etc.)
 * and use the returned functions to handle user interactions.
 *
 * Location: /app/components/documents/hooks/useDocumentHeader.ts
 */

"use client";

import { useState, useEffect } from "react";
import { DocumentWithRelations } from "@/app/components/documents/types";
import { getClientsByUserId } from "@/lib/actions";

interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  country: string | null;
  currency: string;
  taxId: string | null;
  userId: string;
  website: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface UseDocumentHeaderProps {
  document: DocumentWithRelations;
  type: "QUOTE" | "INVOICE";
  onUpdate?: (updates: Partial<DocumentWithRelations>) => void;
}

/**
 * Custom hook to handle all document header business logic
 *
 * This hook manages:
 * - Client selection and display
 * - Project selection (when available)
 * - Issue date handling with automatic valid-until calculation for quotes
 *
 * @param document - The document being displayed/edited
 * @param type - Whether this is a QUOTE or INVOICE (affects date handling)
 * @param onUpdate - Callback to update the document
 *
 * @returns Object with state and handlers for header interactions
 */
export function useDocumentHeader({
  document,
  type,
  onUpdate,
}: UseDocumentHeaderProps) {
  // Number of days a quote is valid for (from issue date)
  const validDays = 15;

  // Track selected project (TODO: backend integration)
  const [selectedProjectId, setSelectedProjectId] = useState<
    string | undefined
  >(undefined);

  // Track selected client (defaults to document's current client)
  const [selectedClientId, setSelectedClientId] = useState<string | undefined>(
    document.client?.id
  );

  // Store fetched clients
  const [clients, setClients] = useState<Client[]>([]);

  // Fetch clients for this user
  useEffect(() => {
    if (document.userId) {
      getClientsByUserId(document.userId)
        .then((data) => {
          if (data) {
            setClients(data);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch clients:", error);
        });
    }
  }, [document.userId]);

  /**
   * Handles issue date changes
   *
   * For quotes: Automatically sets "Valid Until" date to 15 days from issue date
   * For invoices: Just updates the issue date
   *
   * @param date - The new issue date
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
   *
   * TODO: This will integrate with backend once project feature is complete
   *
   * @param projectId - The selected project ID
   */
  const handleProjectChange = (projectId: string | undefined) => {
    setSelectedProjectId(projectId);
    // TODO: Update document with projectId when backend is ready
    // onUpdate?.({ projectId });
  };

  /**
   * Handles client selection changes
   *
   * When a user selects a different client from the dropdown,
   * this updates the document with the full client object.
   *
   * @param clientId - The selected client ID
   */
  const handleClientChange = (clientId: string | undefined) => {
    setSelectedClientId(clientId);

    // Update document with full client object
    if (clientId && onUpdate) {
      const selectedClient = clients.find((c) => c.id === clientId);
      if (selectedClient) {
        onUpdate({
          clientId: selectedClient.id,
          client: selectedClient as any,
        });
      }
    }
  };

  /**
   * Get the client to display
   * Uses the selected client if available, otherwise falls back to document's client
   */
  const displayClient =
    clients.find((c) => c.id === selectedClientId) || document.client;

  // Return all state and handlers for use in template components
  return {
    selectedProjectId,
    selectedClientId,
    displayClient,
    handleIssueDateChange,
    handleProjectChange,
    handleClientChange,
  };
}
