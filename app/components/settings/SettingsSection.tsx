import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface SettingsSectionProps {
  id?: string;
  icon?: LucideIcon;
  title: string;
  description: string;
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  saveButtonText?: string;
  isSaving?: boolean;
  hasUnsavedChanges?: boolean;
  showSaveButton?: boolean;
}

export function SettingsSection({
  id,
  icon: Icon,
  title,
  description,
  children,
  onSubmit,
  saveButtonText = "Save Changes",
  isSaving = false,
  hasUnsavedChanges = false,
  showSaveButton = true,
}: SettingsSectionProps) {
  const content = (
    <>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {Icon && <Icon className="h-5 w-5" />}
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 mb-6">{children}</CardContent>
      {showSaveButton && (
        <CardFooter className="bg-accent/50 border-t pb-6 justify-end">
          <Button
            type="submit"
            disabled={isSaving || !hasUnsavedChanges}
            variant={hasUnsavedChanges ? "default" : "secondary"}
          >
            {isSaving ? "Saving..." : saveButtonText}
          </Button>
        </CardFooter>
      )}
    </>
  );

  if (onSubmit) {
    return (
      <Card id={id} className="pb-0 shadow-md">
        <form onSubmit={onSubmit}>{content}</form>
      </Card>
    );
  }

  return (
    <Card id={id} className="pb-0 shadow-md">
      {content}
    </Card>
  );
}
