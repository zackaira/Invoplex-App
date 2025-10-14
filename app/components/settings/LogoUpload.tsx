"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CloudUpload, X } from "lucide-react";
import { SettingsLabel } from "./Label";
import { SettingsHelperText } from "./HelperText";

interface SettingsLogoUploadProps {
  label: string;
  helperText?: string;
  preview: string | null;
  onFileSelect: (file: File) => void;
  onRemove: () => void;
  accept?: string;
  maxSizeMB?: number;
}

export function SettingsLogoUpload({
  label,
  helperText,
  preview,
  onFileSelect,
  onRemove,
  accept = "image/jpeg,image/png,image/gif",
  maxSizeMB = 5,
}: SettingsLogoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const uploadId = `upload-${label.toLowerCase().replace(/\s+/g, "-")}`;

  const processFile = (file: File) => {
    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (JPG, PNG, or GIF)");
      return;
    }

    onFileSelect(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div className="space-y-2">
      <SettingsLabel htmlFor={uploadId} label={label} />

      {!preview ? (
        <label
          htmlFor={uploadId}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            isDragging
              ? "border-primary bg-primary/10"
              : "border-primary/30 bg-muted/10 hover:bg-muted/30"
          }`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <CloudUpload className="w-16 h-16 mb-4 text-primary" />
            <p className="mb-2 text-base">
              <span className="font-semibold text-primary">Browse</span>{" "}
              <span className="text-muted-foreground">
                or drop your logo here
              </span>
            </p>
            <p className="text-sm text-muted-foreground">
              Maximum {maxSizeMB}MB in size.
            </p>
            <p className="text-sm text-muted-foreground">
              JPG, PNG, or GIF formats.
            </p>

            {helperText && <SettingsHelperText text={helperText} />}
          </div>
          <Input
            id={uploadId}
            name={uploadId}
            type="file"
            accept={accept}
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      ) : (
        <div className="relative w-full border-2 border-dashed border-primary/30 rounded-lg p-4 bg-muted/10">
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 z-10 h-8 w-8"
            onClick={onRemove}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="flex items-center justify-center">
            <img
              src={preview}
              alt="Logo preview"
              className="max-h-48 max-w-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
