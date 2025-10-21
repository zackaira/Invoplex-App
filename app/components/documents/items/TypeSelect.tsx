"use client";

import { useState, useEffect } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { getSavedProducts } from "@/lib/actions";

interface TypeSelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  id?: string;
  userId: string;
}

const DEFAULT_TYPES = [
  { value: "Product", label: "Product" },
  { value: "Service", label: "Service" },
];

export function TypeSelect({
  value,
  onChange,
  className,
  id,
  userId,
}: TypeSelectProps) {
  const [open, setOpen] = useState(false);
  const [customTypes, setCustomTypes] = useState<string[]>([]);
  const [savedTypes, setSavedTypes] = useState<string[]>([]);

  // Fetch saved product types when popover opens
  useEffect(() => {
    if (open) {
      loadSavedTypes();
    }
  }, [open, userId]);

  const loadSavedTypes = async () => {
    try {
      const products = await getSavedProducts(userId);
      // Extract unique types from saved products
      const uniqueTypes = Array.from(
        new Set(
          products
            .map((p) => p.type)
            .filter(
              (type) =>
                type &&
                !DEFAULT_TYPES.some(
                  (dt) => dt.value.toLowerCase() === type.toLowerCase()
                )
            )
        )
      );
      setSavedTypes(uniqueTypes);
    } catch (error) {
      console.error("Error loading saved types:", error);
    }
  };

  // Combine default, saved, and custom types
  const allTypes = [
    ...DEFAULT_TYPES,
    ...savedTypes.map((type) => ({ value: type, label: type })),
    ...customTypes
      .filter(
        (type) =>
          !savedTypes.some((st) => st.toLowerCase() === type.toLowerCase())
      )
      .map((type) => ({ value: type, label: type })),
  ];

  const handleSelect = (currentValue: string) => {
    onChange(currentValue);
    setOpen(false);
  };

  const handleCustomType = (searchValue: string) => {
    const trimmedValue = searchValue.trim();
    const allExistingTypes = [
      ...DEFAULT_TYPES.map((t) => t.value.toLowerCase()),
      ...customTypes.map((t) => t.toLowerCase()),
    ];

    if (
      trimmedValue &&
      !allExistingTypes.includes(trimmedValue.toLowerCase())
    ) {
      setCustomTypes((prev) => [...prev, trimmedValue]);
      onChange(trimmedValue);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
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
