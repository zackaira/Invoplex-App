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

export interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (project: {
    title: string;
    description: string;
    clientId: string;
  }) => void;
  client?: {
    id: string;
    name: string;
    email?: string | null;
    [key: string]: any;
  };
}

export function CreateProjectModal({
  open,
  onOpenChange,
  onSubmit,
  client,
}: CreateProjectModalProps) {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");

  // Reset form when modal closes
  React.useEffect(() => {
    if (!open) {
      setTitle("");
      setDescription("");
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !client?.id) return;

    onSubmit?.({
      title: title.trim(),
      description: description.trim(),
      clientId: client.id,
    });

    onOpenChange(false);
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
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim() || !client?.id}>
              Create Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
