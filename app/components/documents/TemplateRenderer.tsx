/**
 * ============================================================================
 * TEMPLATE RENDERER
 * ============================================================================
 *
 * The main orchestrator for document rendering. This component handles:
 * - Loading and rendering the selected template
 * - Managing document edit/view mode
 * - Coordinating all modals (projects, clients, business info)
 * - Managing document state and updates
 *
 * This is the primary entry point for displaying documents (quotes/invoices)
 * in the application.
 *
 * Location: /app/components/documents/TemplateRenderer.tsx
 * Used by: Quote pages, invoice pages, document preview pages
 */

"use client";

import { useState } from "react";
import {
  DocumentWithRelations,
  BusinessSettings,
} from "@/app/components/documents/types";
import { getTemplate } from "@/app/components/documents/registry";
import { DocumentViewBar } from "./bars/ViewBar";
import { DocumentEditBar } from "./bars/EditBar";
import { CreateProjectModal } from "./modals/projects";
import { AddClientModal } from "./modals/clients";
import {
  BusinessInfoVisibilityModal,
  BusinessInfoVisibility,
} from "./modals/BusinessInfoVisibilityModal";

/**
 * TemplateRenderer Component
 *
 * Renders a document using the specified template and manages all document-related
 * interactions and modals.
 *
 * @param document - The document data to render
 * @param type - Whether this is a QUOTE or INVOICE
 * @param templateId - The template to use (defaults to "classic")
 * @param isEditable - Whether the document is in edit mode
 * @param onUpdate - Callback when document data changes
 * @param onTemplateChange - Callback when template is switched
 * @param businessSettings - Business profile settings (name, logo, brandColor)
 */
export function TemplateRenderer({
  document,
  type,
  templateId = "classic",
  isEditable = false,
  onUpdate,
  onTemplateChange,
  businessSettings,
}: {
  document: DocumentWithRelations;
  type: "QUOTE" | "INVOICE";
  templateId?: string;
  isEditable?: boolean;
  onUpdate?: (updates: Partial<DocumentWithRelations>) => void;
  onTemplateChange?: (templateId: string) => void;
  businessSettings?: BusinessSettings;
}) {
  // Load the selected template from the registry
  const template = getTemplate(templateId);
  const TemplateComponent = template.component;

  // =========================================================================
  // MODAL STATE MANAGEMENT
  // =========================================================================

  // Controls whether the project creation modal is open
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // Controls whether the client creation modal is open
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);

  // Controls whether the business info visibility modal is open
  const [isBusinessInfoModalOpen, setIsBusinessInfoModalOpen] = useState(false);

  // =========================================================================
  // BUSINESS INFO VISIBILITY STATE
  // =========================================================================

  // Controls which business information fields are visible in the template
  // Users can customize this through the BusinessInfoVisibilityModal
  const [businessInfoVisibility, setBusinessInfoVisibility] =
    useState<BusinessInfoVisibility>({
      businessName: true,
      personalName: false,
      email: true,
      phone: true,
      website: true,
      taxId: false,
      address: false,
    });

  // =========================================================================
  // MODAL HANDLERS
  // =========================================================================

  /**
   * Handles project creation
   * TODO: Integrate with backend API once ready
   */
  const handleCreateProject = (project: {
    title: string;
    description: string;
    clientId: string;
  }) => {
    console.log("Creating project:", project);
    // TODO: Create project via API when backend is ready
    // After creation, set the new project as selected
  };

  /**
   * Handles client creation
   * TODO: Integrate with backend API once ready
   */
  const handleAddClient = (client: {
    company: string;
    contactName: string;
    email: string;
    phone: string;
  }) => {
    console.log("Adding client:", client);
    // TODO: Create client via API when backend is ready
    // After creation, set the new client as selected
  };

  return (
    <>
      <div className="bg-accent px-6 pt-12 pb-5">
        <div className="max-w-[960px] mx-auto flex justify-between items-center">
          {isEditable ? (
            <DocumentEditBar
              document={document}
              templateId={templateId}
              onTemplateChange={onTemplateChange}
            />
          ) : (
            <DocumentViewBar document={document} />
          )}
        </div>
      </div>

      <div className="bg-accent pb-12">
        <div className="bg-white border border-border p-8 mx-auto max-w-[960px] shadow-xl/30 rounded-xs">
          <TemplateComponent
            document={document}
            type={type}
            isEditable={isEditable}
            onUpdate={isEditable ? onUpdate : undefined}
            onOpenProjectModal={() => setIsProjectModalOpen(true)}
            onOpenClientModal={() => setIsClientModalOpen(true)}
            onOpenBusinessInfoModal={() => setIsBusinessInfoModalOpen(true)}
            businessInfoVisibility={businessInfoVisibility}
            businessSettings={businessSettings}
          />
        </div>
      </div>

      {/* Shared Modals */}
      <CreateProjectModal
        open={isProjectModalOpen}
        onOpenChange={setIsProjectModalOpen}
        onSubmit={handleCreateProject}
        client={document.client}
      />

      <AddClientModal
        open={isClientModalOpen}
        onOpenChange={setIsClientModalOpen}
        onSubmit={handleAddClient}
      />

      <BusinessInfoVisibilityModal
        open={isBusinessInfoModalOpen}
        onOpenChange={setIsBusinessInfoModalOpen}
        visibility={businessInfoVisibility}
        onVisibilityChange={setBusinessInfoVisibility}
      />
    </>
  );
}
