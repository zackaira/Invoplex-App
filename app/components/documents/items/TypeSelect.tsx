"use client";

import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface TypeSelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const DEFAULT_TYPES = [
  { value: "Product", label: "Product" },
  { value: "Service", label: "Service" },
];

export function TypeSelect({ value, onChange, className }: TypeSelectProps) {
  const [open, setOpen] = useState(false);
  const [customTypes, setCustomTypes] = useState<string[]>([]);

  const allTypes = [
    ...DEFAULT_TYPES,
    ...customTypes.map((type) => ({ value: type, label: type })),
  ];

  const handleSelect = (currentValue: string) => {
    onChange(currentValue);
    setOpen(false);
  };

  const handleCustomType = (searchValue: string) => {
    if (searchValue && !allTypes.some((t) => t.value === searchValue)) {
      setCustomTypes((prev) => [...prev, searchValue]);
      onChange(searchValue);
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between h-9", className)}
        >
          {value || "Select type..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[340px] p-0" align="center">
        <Command>
          <CommandInput
            placeholder="Search or Enter a New Type..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const input = e.currentTarget.value;
                if (input) {
                  handleCustomType(input);
                }
              }
            }}
          />
          <CommandList>
            <CommandEmpty>
              <div className="text-sm text-muted-foreground px-2 py-1.5">
                Press Enter to add custom type
              </div>
            </CommandEmpty>
            <CommandGroup>
              {allTypes.map((type) => (
                <CommandItem
                  key={type.value}
                  value={type.value}
                  onSelect={handleSelect}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === type.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {type.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
