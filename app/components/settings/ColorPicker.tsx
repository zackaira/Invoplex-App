"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import { SettingsLabel } from "./Label";
import { SettingsHelperText } from "./HelperText";

interface SettingsColorPickerProps {
  label: string;
  helperText?: string;
  value: string;
  onChange: (value: string) => void;
  name?: string;
}

export function SettingsColorPicker({
  label,
  helperText,
  value,
  onChange,
  name,
}: SettingsColorPickerProps) {
  const colorId = `color-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="space-y-2">
      <SettingsLabel htmlFor={colorId} label={label} />

      <div className="space-y-3">
        <label
          htmlFor={colorId}
          className="inline-flex items-center gap-0 cursor-pointer rounded-lg overflow-hidden border border-input shadow-sm hover:border-primary/50 transition-colors bg-background"
        >
          <div
            className="w-14 h-12 flex-shrink-0"
            style={{ backgroundColor: value }}
          />
          <Input
            id={`${colorId}-input`}
            type="text"
            value={value}
            disabled
            className="font-mono text-sm w-32 border-0 shadow-none"
          />
          <Input
            id={colorId}
            name={name}
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value.toUpperCase())}
            className="sr-only max-w-10"
          />
        </label>
      </div>

      {helperText && <SettingsHelperText text={helperText} />}
    </div>
  );
}
