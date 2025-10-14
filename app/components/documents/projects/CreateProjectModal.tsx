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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
            {/* Project Title */}
            <div className="grid gap-2">
              <label
                htmlFor="project-title"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Project Title
              </label>
              <Input
                id="project-title"
                placeholder="Enter project name"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                autoFocus
              />
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <label
                htmlFor="project-description"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Description{" "}
                <span className="text-muted-foreground">(Optional)</span>
              </label>
              <Textarea
                id="project-description"
                placeholder="Enter project description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            {/* Client Select */}
            <div className="grid gap-2">
              <label
                htmlFor="project-client"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Client
              </label>
              <Select
                value={clientId}
                onValueChange={handleSelectChange}
                required
              >
                <SelectTrigger id="project-client">
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {DUMMY_CLIENTS.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectItem value="__add_new__" className="text-primary">
                    <div className="flex items-center">
                      <Plus className="mr-2 h-4 w-4" />
                      Add new client
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
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
