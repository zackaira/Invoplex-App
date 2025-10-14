"use client";

import { useState } from "react";
import { DocumentWithRelations } from "@/app/components/documents/templates/types";
import { getTemplate } from "@/app/components/documents/templates/registry";
import { DocumentViewBar } from "./ViewBar";
import { DocumentEditBar } from "./EditBar";
import { CreateProjectModal } from "./projects";
import { AddClientModal } from "./clients";

export function TemplateRenderer({
  document,
  type,
  templateId = "classic",
  isEditable = false,
  onUpdate,
  onTemplateChange,
}: {
  document: DocumentWithRelations;
  type: "QUOTE" | "INVOICE";
  templateId?: string;
  isEditable?: boolean;
  onUpdate?: (updates: Partial<DocumentWithRelations>) => void;
  onTemplateChange?: (templateId: string) => void;
}) {
  const template = getTemplate(templateId);
  const TemplateComponent = template.component;

  // Modal states
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);

  // Handlers
  const handleCreateProject = (project: {
    title: string;
    description: string;
    clientId: string;
  }) => {
    console.log("Creating project:", project);
    // TODO: Create project via API when backend is ready
    // After creation, set the new project as selected
  };

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
          />
        </div>
      </div>

      {/* Shared Modals */}
      <CreateProjectModal
        open={isProjectModalOpen}
        onOpenChange={setIsProjectModalOpen}
        onSubmit={handleCreateProject}
        defaultClientId={document.client.id}
        onAddClient={() => {
          setIsProjectModalOpen(false);
          setIsClientModalOpen(true);
        }}
      />

      <AddClientModal
        open={isClientModalOpen}
        onOpenChange={setIsClientModalOpen}
        onSubmit={handleAddClient}
      />
    </>
  );
}
