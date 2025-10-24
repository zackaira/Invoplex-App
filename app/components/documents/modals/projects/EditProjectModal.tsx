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
import { updateProject } from "@/lib/actions";
import { toast } from "sonner";

export interface EditProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (project: {
    id: string;
    title: string;
    description: string | null;
  }) => void;
  project: {
    id: string;
    title: string;
    description: string | null;
  };
}

export function EditProjectModal({
  open,
  onOpenChange,
  onSubmit,
  project,
}: EditProjectModalProps) {
  const [title, setTitle] = React.useState(project.title);
  const [description, setDescription] = React.useState(
    project.description || ""
  );
  const [isLoading, setIsLoading] = React.useState(false);

  // Reset form when project changes or modal opens
  React.useEffect(() => {
    if (open) {
      setTitle(project.title);
      setDescription(project.description || "");
    }
  }, [open, project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    try {
      const updatedProject = await updateProject(project.id, {
        title: title.trim(),
        description: description.trim() || null,
      });

      toast.success("Project updated successfully");

      onSubmit?.({
        id: updatedProject.id,
        title: updatedProject.title,
        description: updatedProject.description,
      });

      onOpenChange(false);
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Update the project details below.
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

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim() || isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
