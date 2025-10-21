"use client";

import * as React from "react";
import { Check, Users, Plus } from "lucide-react";
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
import { TooltipWrapper } from "@/app/components/ui/TooltipWrapper";
import { getClientsByUserId } from "@/lib/actions";

interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
}

export interface ClientSelectProps {
  userId: string;
  value?: string;
  onChange?: (clientId: string | undefined) => void;
  onCreateNew?: () => void;
  className?: string;
  align?: "start" | "center" | "end";
}

export function ClientSelect({
  userId,
  value,
  onChange,
  onCreateNew,
  className,
  align = "center",
}: ClientSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [clients, setClients] = React.useState<Client[]>([]);
  const [loading, setLoading] = React.useState(false);

  // Fetch clients when the popover opens
  React.useEffect(() => {
    if (open && clients.length === 0) {
      setLoading(true);
      getClientsByUserId(userId)
        .then((data) => {
          if (data) {
            setClients(data);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch clients:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, userId, clients.length]);

  const selectedClient = clients.find((client) => client.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <TooltipWrapper tooltip="Select a Client" side="top">
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            role="combobox"
            aria-expanded={open}
            className={cn("h-6 w-6", className)}
          >
            <span className="!text-invoplex">
              <Users className="h-4 w-4" />
            </span>
          </Button>
        </PopoverTrigger>
      </TooltipWrapper>

      <PopoverContent className="w-[300px] p-0" align={align}>
        <Command>
          <CommandInput placeholder="Search Clients..." className="h-9" />
          <CommandList>
            {loading ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Loading clients...
              </div>
            ) : (
              <>
                <CommandEmpty>No client found.</CommandEmpty>
                <CommandGroup>
                  {clients.map((client) => (
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
                          <span className="text-xs">{client.email}</span>
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
              </>
            )}
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
