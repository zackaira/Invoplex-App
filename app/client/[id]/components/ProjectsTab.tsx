"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProjectCard } from "./ProjectCard";
import { CreateProjectModal } from "@/app/components/documents/modals/projects";
import { getProjectsByClientId } from "@/lib/actions";

type Project = {
  id: string;
  userId: string;
  clientId: string;
  title: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
};

type ClientInfo = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  country?: string | null;
  currency?: string;
  taxId?: string | null;
  website?: string | null;
};

interface ProjectsTabProps {
  userId: string;
  client: ClientInfo;
}

export function ProjectsTab({ userId, client }: ProjectsTabProps) {
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [createModalOpen, setCreateModalOpen] = React.useState(false);
  const [showArchived, setShowArchived] = React.useState(false);

  const loadProjects = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getProjectsByClientId(client.id);
      setProjects(data || []);
    } catch (error) {
      console.error("Error loading projects:", error);
    } finally {
      setIsLoading(false);
    }
  }, [client.id]);

  React.useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const activeProjects = projects.filter((p) => p.isActive);
  const archivedProjects = projects.filter((p) => !p.isActive);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Projects</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Organize quotes and invoices by project
          </p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading projects...</p>
        </div>
      ) : activeProjects.length === 0 && archivedProjects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            No projects yet. Create your first project to get started.
          </p>
          <Button onClick={() => setCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Project
          </Button>
        </div>
      ) : (
        <>
          {activeProjects.length > 0 && (
            <div className="space-y-3">
              {activeProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onUpdate={loadProjects}
                />
              ))}
            </div>
          )}

          {archivedProjects.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-muted-foreground">
                  Archived Projects ({archivedProjects.length})
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowArchived(!showArchived)}
                >
                  {showArchived ? "Hide" : "Show"}
                </Button>
              </div>
              {showArchived && (
                <div className="space-y-3">
                  {archivedProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onUpdate={loadProjects}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      <CreateProjectModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        userId={userId}
        client={client}
        onSubmit={loadProjects}
      />
    </div>
  );
}
