"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Archive, ArchiveRestore } from "lucide-react";
import {
  EditProjectModal,
  DeleteProjectModal,
} from "@/app/components/documents/modals/projects";
import { archiveProject, unarchiveProject } from "@/lib/actions";
import { toast } from "sonner";

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string | null;
    isActive: boolean;
    createdAt: Date | string;
    _count?: {
      documents: number;
    };
  };
  onUpdate?: () => void;
}

export function ProjectCard({ project, onUpdate }: ProjectCardProps) {
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [isArchiving, setIsArchiving] = React.useState(false);

  const handleArchiveToggle = async () => {
    setIsArchiving(true);
    try {
      if (project.isActive) {
        await archiveProject(project.id);
        toast.success("Project archived successfully");
      } else {
        await unarchiveProject(project.id);
        toast.success("Project restored successfully");
      }
      onUpdate?.();
    } catch (error) {
      console.error("Error toggling archive status:", error);
      toast.error("Failed to update project status");
    } finally {
      setIsArchiving(false);
    }
  };

  const documentCount = project._count?.documents || 0;

  return (
    <>
      <Card
        className={`p-6 hover:shadow-md transition-shadow ${
          !project.isActive ? "opacity-60 bg-muted/30" : ""
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-foreground truncate">
                {project.title}
              </h3>
              {!project.isActive && (
                <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground font-medium">
                  Archived
                </span>
              )}
            </div>
            {project.description && (
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {project.description}
              </p>
            )}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>
                {documentCount} document{documentCount !== 1 ? "s" : ""}
              </span>
              <span>
                Created {new Date(project.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setEditModalOpen(true)}
              disabled={!project.isActive}
              className="h-8 w-8 p-0"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleArchiveToggle}
              disabled={isArchiving}
              className="h-8 w-8 p-0"
            >
              {project.isActive ? (
                <Archive className="h-4 w-4" />
              ) : (
                <ArchiveRestore className="h-4 w-4" />
              )}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setDeleteModalOpen(true)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      <EditProjectModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        project={project}
        onSubmit={() => {
          onUpdate?.();
        }}
      />

      <DeleteProjectModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        project={project}
        onSubmit={() => {
          onUpdate?.();
        }}
      />
    </>
  );
}
