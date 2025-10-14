"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SettingsLabel } from "./Label";
import { SettingsHelperText } from "./HelperText";

interface SettingsDatePickerProps {
  label?: string;
  helperText?: string;
  required?: boolean;
  error?: string;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  id?: string;
  disabled?: boolean;
  className?: string;
}

export function SettingsDatePicker({
  label,
  helperText,
  required,
  error,
  value,
  onChange,
  placeholder = "Select date",
  id,
  disabled,
  className,
}: SettingsDatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const inputId =
    id ||
    (label
      ? `datepicker-${label.toLowerCase().replace(/\s+/g, "-")}`
      : undefined);

  return (
    <div className="space-y-2">
      {label && (
        <SettingsLabel
          htmlFor={inputId}
          className="text-sm font-medium"
          label={label}
          required={required}
        />
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={inputId}
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full justify-start text-left font-normal py-6",
              !value && "text-muted-foreground",
              error && "border-destructive",
              className
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, "PPP") : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={(date) => {
              onChange?.(date);
              setOpen(false);
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {helperText && !error && <SettingsHelperText text={helperText} />}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
