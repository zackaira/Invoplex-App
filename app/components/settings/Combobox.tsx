"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
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
import { SettingsLabel } from "./Label";
import { SettingsHelperText } from "./HelperText";

interface SettingsComboboxProps {
  label: string;
  helperText?: string;
  required?: boolean;
  error?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  options: Array<{ value: string; label: string; keywords?: string[] }>;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  disabled?: boolean;
}

export function SettingsCombobox({
  label,
  helperText,
  required,
  error,
  placeholder,
  searchPlaceholder,
  emptyText,
  options,
  value,
  defaultValue,
  onValueChange,
  name,
  disabled,
}: SettingsComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(
    defaultValue || value || ""
  );

  const comboboxId = `combobox-${label.toLowerCase().replace(/\s+/g, "-")}`;
  const currentValue = value !== undefined ? value : internalValue;

  const handleSelect = (selectedValue: string) => {
    const newValue = selectedValue === currentValue ? "" : selectedValue;
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
    setOpen(false);
  };

  const selectedOption = options.find(
    (option) => option.value === currentValue
  );

  return (
    <div className="space-y-2">
      <SettingsLabel htmlFor={comboboxId} label={label} required={required} />

      <input type="hidden" name={name} value={currentValue} />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={comboboxId}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "py-6 w-full justify-between font-normal",
              !currentValue && "text-muted-foreground",
              error && "border-destructive"
            )}
          >
            {selectedOption?.label ||
              placeholder ||
              `Select ${label.toLowerCase()}...`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder={
                searchPlaceholder || `Search ${label.toLowerCase()}...`
              }
            />
            <CommandList>
              <CommandEmpty>
                {emptyText || `No ${label.toLowerCase()} found.`}
              </CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    keywords={option.keywords || [option.value]}
                    onSelect={() => handleSelect(option.value)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        currentValue === option.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {helperText && !error && <SettingsHelperText text={helperText} />}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
