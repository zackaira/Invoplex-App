"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { DocumentWithRelations } from "./templates/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllTemplates } from "./templates/registry";

export function DocumentEditBar({
  document,
  templateId = "classic",
  onTemplateChange,
}: {
  document: DocumentWithRelations;
  templateId?: string;
  onTemplateChange?: (templateId: string) => void;
}) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const templates = getAllTemplates();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement save to database
      // await updateDocument(document);
      router.push(`/quote/${document.id}`);
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            Template:
          </span>
          <Select value={templateId} onValueChange={onTemplateChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select template" />
            </SelectTrigger>
            <SelectContent>
              {templates.map((template) => (
                <SelectItem
                  key={template.metadata.id}
                  value={template.metadata.id}
                >
                  {template.metadata.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </>
  );
}
