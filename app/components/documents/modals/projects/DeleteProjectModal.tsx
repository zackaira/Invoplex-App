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
import { deleteProject } from "@/lib/actions";
import { toast } from "sonner";

export interface DeleteProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: () => void;
  project: {
    id: string;
    title: string;
    _count?: {
      documents: number;
    };
  };
}

export function DeleteProjectModal({
  open,
  onOpenChange,
  onSubmit,
  project,
}: DeleteProjectModalProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteProject(project.id);
      toast.success("Project deleted successfully");
      onSubmit?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    } finally {
      setIsLoading(false);
    }
  };

  const documentCount = project._count?.documents || 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this project?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <p className="text-sm font-medium text-foreground mb-2">
              Project: {project.title}
            </p>
            {documentCount > 0 && (
              <p className="text-sm text-muted-foreground">
                This project has {documentCount} document
                {documentCount !== 1 ? "s" : ""} associated with it. Deleting
                this project will not delete the documents, but they will no
                longer be linked to this project.
              </p>
            )}
            {documentCount === 0 && (
              <p className="text-sm text-muted-foreground">
                This project has no documents associated with it.
              </p>
            )}
          </div>
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
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
