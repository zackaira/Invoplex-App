"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Dummy project data - will be replaced with real data later
const DUMMY_PROJECTS = [
  { id: "1", name: "Website Redesign", clientId: "client-1" },
  { id: "2", name: "Mobile App Development", clientId: "client-2" },
  { id: "3", name: "Brand Identity", clientId: "client-1" },
  { id: "4", name: "E-commerce Platform", clientId: "client-3" },
];

export interface ProjectSelectProps {
  value?: string;
  onChange?: (projectId: string | undefined) => void;
  onCreateNew?: () => void;
  isEditable?: boolean;
  className?: string;
  selectedClientId?: string;
}

export function ProjectSelect({
  value,
  onChange,
  onCreateNew,
  isEditable = false,
  className,
  selectedClientId,
}: ProjectSelectProps) {
  const [open, setOpen] = React.useState(false);

  const selectedProject = DUMMY_PROJECTS.find(
    (project) => project.id === value
  );

  // Determine the effective client ID - either from prop or from selected project
  const effectiveClientId = selectedClientId || selectedProject?.clientId;

  // Filter projects by selected client
  const filteredProjects = effectiveClientId
    ? DUMMY_PROJECTS.filter((project) => project.clientId === effectiveClientId)
    : [];

  if (!isEditable && !selectedProject) {
    return null;
  }

  if (!isEditable && selectedProject) {
    return (
      <p className={cn("text-sm text-gray-600", className)}>
        Project: {selectedProject.name}
      </p>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between", className)}
        >
          {selectedProject ? (
            <span className="truncate !text-gray-900">
              {selectedProject.name}
            </span>
          ) : (
            <span className="!text-gray-500">Select project...</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 !text-gray-600" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[300px] p-0 !bg-white !border-gray-300 !text-gray-900"
        align="end"
      >
        {!effectiveClientId ? (
          <div className="p-4 text-sm !text-gray-500 text-center">
            Please select a client below first
          </div>
        ) : (
          <Command className="!bg-white !text-gray-900">
            <CommandInput
              placeholder="Search projects..."
              className="h-9 !border-gray-200 !text-gray-900 placeholder:!text-gray-400"
            />
            <CommandList>
              <CommandEmpty>No project found.</CommandEmpty>
              <CommandGroup>
                {filteredProjects.map((project) => (
                  <CommandItem
                    key={project.id}
                    value={project.name}
                    onSelect={() => {
                      onChange?.(project.id === value ? undefined : project.id);
                      setOpen(false);
                    }}
                  >
                    {project.name}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === project.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    onCreateNew?.();
                    setOpen(false);
                  }}
                  className="text-primary"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create new project
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        )}
      </PopoverContent>
    </Popover>
  );
}
