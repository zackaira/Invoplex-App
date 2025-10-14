"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  SettingsInput,
  SettingsTextarea,
  SettingsSelect,
} from "@/app/components/settings";
import { DUMMY_CLIENTS } from "../clients";

export interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (project: {
    title: string;
    description: string;
    clientId: string;
  }) => void;
  defaultClientId?: string;
  onAddClient?: () => void;
}

export function CreateProjectModal({
  open,
  onOpenChange,
  onSubmit,
  defaultClientId,
  onAddClient,
}: CreateProjectModalProps) {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [clientId, setClientId] = React.useState(defaultClientId || "");

  const handleSelectChange = (value: string) => {
    if (value === "__add_new__") {
      onAddClient?.();
    } else {
      setClientId(value);
    }
  };

  // Reset form when modal closes
  React.useEffect(() => {
    if (!open) {
      setTitle("");
      setDescription("");
      setClientId(defaultClientId || "");
    }
  }, [open, defaultClientId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !clientId) return;

    onSubmit?.({
      title: title.trim(),
      description: description.trim(),
      clientId,
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

            <SettingsSelect
              label="Client"
              placeholder="Select a client"
              value={clientId}
              onValueChange={handleSelectChange}
              required
              options={[
                ...DUMMY_CLIENTS.map((client) => ({
                  value: client.id,
                  label: client.name,
                })),
                {
                  value: "__add_new__",
                  label: "Add new client",
                  icon: <Plus className="h-4 w-4" />,
                },
              ]}
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
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim() || !clientId}>
              Create Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
