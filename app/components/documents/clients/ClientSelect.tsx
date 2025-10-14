"use client";

import * as React from "react";
import { Check, ChevronsUpDown, PencilIcon, Plus } from "lucide-react";
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

// Dummy client data - will be replaced with real data later
export const DUMMY_CLIENTS = [
  {
    id: "client-1",
    name: "Acme Corporation",
    contact: "John Doe",
    email: "contact@acme.com",
    phone: "+1 (555) 123-4567",
    address: "123 Business St",
    city: "New York",
    state: "NY",
    zipCode: "10001",
  },
  {
    id: "client-2",
    name: "TechStart Inc.",
    contact: "Jane Smith",
    email: "hello@techstart.com",
    phone: "+1 (555) 234-5678",
    address: "456 Innovation Ave",
    city: "San Francisco",
    state: "CA",
    zipCode: "94102",
  },
  {
    id: "client-3",
    name: "Global Solutions Ltd.",
    email: "info@globalsolutions.com",
    phone: "+1 (555) 345-6789",
    address: "789 Enterprise Blvd",
    city: "Chicago",
    state: "IL",
    zipCode: "60601",
  },
  {
    id: "client-4",
    name: "Creative Agency Co.",
    email: "team@creativeagency.com",
    phone: "+1 (555) 456-7890",
    address: "321 Design Way",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90001",
  },
];

export interface ClientSelectProps {
  value?: string;
  onChange?: (clientId: string | undefined) => void;
  onCreateNew?: () => void;
  className?: string;
  align?: "start" | "center" | "end";
}

export function ClientSelect({
  value,
  onChange,
  onCreateNew,
  className,
  align = "center",
}: ClientSelectProps) {
  const [open, setOpen] = React.useState(false);

  const selectedClient = DUMMY_CLIENTS.find((client) => client.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between", className)}
        >
          <span className="text-muted-foreground">
            <PencilIcon className="h-4 w-4" />
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align={align}>
        <Command>
          <CommandInput placeholder="Search Clients..." className="h-9" />
          <CommandList>
            <CommandEmpty>No client found.</CommandEmpty>
            <CommandGroup>
              {DUMMY_CLIENTS.map((client) => (
                <CommandItem
                  key={client.id}
                  value={client.name}
                  onSelect={() => {
                    onChange?.(client.id);
                    setOpen(false);
                  }}
                >
                  <div className="flex flex-col flex-1">
                    <span className="font-medium">{client.name}</span>
                    {client.email && (
                      <span className="text-xs text-muted-foreground">
                        {client.email}
                      </span>
                    )}
                  </div>
                  <Check
                    className={cn(
                      "ml-2 h-4 w-4",
                      value === client.id ? "opacity-100" : "opacity-0"
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
                Add new client
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
