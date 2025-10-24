"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SettingsInput, SettingsTextarea } from "@/app/components/settings";
import { createProject } from "@/lib/actions";
import { toast } from "sonner";

export interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  onSubmit?: (project: {
    id: string;
    title: string;
    description: string | null;
    clientId: string;
  }) => void;
  client?: {
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
}

export function CreateProjectModal({
  open,
  onOpenChange,
  userId,
  onSubmit,
  client,
}: CreateProjectModalProps) {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  // Reset form when modal closes
  React.useEffect(() => {
    if (!open) {
      setTitle("");
      setDescription("");
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !client?.id || !userId) return;

    setIsLoading(true);
    try {
      const project = await createProject({
        userId,
        clientId: client.id,
        title: title.trim(),
        description: description.trim() || undefined,
      });

      toast.success("Project created successfully");

      onSubmit?.({
        id: project.id,
        title: project.title,
        description: project.description,
        clientId: project.clientId,
      });

      onOpenChange(false);
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Add a new project to organize your quotes and invoices.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <SettingsInput
              label="Project Title"
              id="project-title"
              placeholder="Enter project name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />

            <SettingsTextarea
              label="Description"
              id="project-description"
              placeholder="Enter project description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {client && (
            <div className="mb-4 rounded-lg border border-muted bg-muted/30 p-4">
              <div className="text-sm font-medium text-muted-foreground mb-2">
                Assigning this project to Client
              </div>
              <div className="space-y-1">
                <div className="font-semibold text-foreground">
                  {client.name}
                </div>
                {client.email && (
                  <div className="text-sm text-muted-foreground">
                    {client.email}
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!title.trim() || !client?.id || !userId || isLoading}
            >
              {isLoading ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
