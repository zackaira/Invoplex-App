"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getProjectsByClientId } from "@/lib/actions";
import { cn } from "@/lib/utils";
import { TooltipWrapper } from "@/app/components/ui/TooltipWrapper";

interface ProjectSelectProps {
  value?: string;
  onChange: (value: string | undefined) => void;
  selectedClientId?: string;
  onCreateNew?: () => void;
  onProjectCreated?: () => void; // Callback to refresh projects after creation
  disabled?: boolean;
  isEditable?: boolean;
  placeholder?: string;
  className?: string;
}

export function ProjectSelect({
  value,
  onChange,
  selectedClientId,
  onCreateNew,
  onProjectCreated,
  disabled = false,
  isEditable = true,
  placeholder = "Select project...",
  className,
}: ProjectSelectProps) {
  const [projects, setProjects] = React.useState<
    Array<{
      id: string;
      title: string;
      isActive: boolean;
    }>
  >([]);
  const [isLoading, setIsLoading] = React.useState(false);

  // Function to fetch projects
  const fetchProjects = React.useCallback(() => {
    if (!selectedClientId) {
      setProjects([]);
      return;
    }

    setIsLoading(true);
    getProjectsByClientId(selectedClientId)
      .then((data) => {
        if (data) {
          setProjects(data);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch projects:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [selectedClientId]);

  // Fetch projects when client changes
  React.useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Expose refresh function via callback
  React.useEffect(() => {
    if (onProjectCreated) {
      // Store the refresh function so parent can call it
      (
        window as Window & { __refreshProjects?: () => void }
      ).__refreshProjects = fetchProjects;
    }
  }, [fetchProjects, onProjectCreated]);

  // Filter to only show active projects
  const activeProjects = projects.filter((p) => p.isActive);

  const isDisabled = disabled || !isEditable || !selectedClientId;

  // Find the selected project name for view mode
  const selectedProject = activeProjects.find((p) => p.id === value);

  // If not editable, just show the project name (or nothing)
  if (!isEditable) {
    // Don't show anything if no project is selected or still loading
    if (!value || !selectedProject || isLoading) {
      return null;
    }
    return (
      <div className="text-sm text-gray-600 mt-1">
        Project: <span className="font-medium">{selectedProject.title}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center w-[200px] gap-2">
      <TooltipWrapper
        tooltip={!selectedClientId ? "Please select a client first" : undefined}
        side="top"
      >
        <div className="w-full">
          <Select
            value={value || "none"}
            onValueChange={(val) => onChange(val === "none" ? undefined : val)}
            disabled={isDisabled}
          >
            <SelectTrigger className={cn("w-full h-8", className)}>
              <SelectValue
                placeholder={
                  isLoading
                    ? "Loading projects..."
                    : !selectedClientId
                    ? "Select client first"
                    : placeholder
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Project</SelectItem>
              {activeProjects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.title}
                </SelectItem>
              ))}
              {!isLoading &&
                activeProjects.length === 0 &&
                selectedClientId && (
                  <div className="px-2 py-1.5 text-sm text-muted-foreground">
                    No projects for this client
                  </div>
                )}
            </SelectContent>
          </Select>
        </div>
      </TooltipWrapper>
      {onCreateNew && isEditable && (
        <TooltipWrapper
          tooltip={
            !selectedClientId
              ? "Please select a client first"
              : "Create new project"
          }
          side="top"
        >
          <div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onCreateNew}
              disabled={isDisabled}
              className="flex-shrink-0 h-8"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </TooltipWrapper>
      )}
    </div>
  );
}
