"use client";

import * as React from "react";
import { Bell, Plus } from "lucide-react";
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

export interface ProjectSelectProps {
  className?: string;
  onSearchChange?: (search: string) => void;
}

export function AppNotifications({
  className,
  onSearchChange,
}: ProjectSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const domContent = [
    {
      id: "1",
      title: "Notification 1",
      description: "This is the first notification",
    },
    {
      id: "2",
      title: "Notification 2",
      description: "This is the second notification",
    },
    {
      id: "3",
      title: "Notification 3",
      description: "This is the third notification",
    },
    {
      id: "4",
      title: "Notification 4",
      description: "This is the fourth notification",
    },
    {
      id: "5",
      title: "Notification 5",
      description: "This is the fifth notification",
    },
  ];

  // Filter projects by selected client
  const filteredDoms = domContent.filter((dom) =>
    dom.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon-sm"
          role="combobox"
          className="relative"
          aria-expanded={open}
        >
          <div className="w-[18px] h-[18px] rounded-full bg-invoplex text-white absolute top-[-10px] left-[-10px] text-xs flex items-center justify-center">
            4
          </div>
          <Bell className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[440px] p-0" align="end">
        <Command>
          <CommandInput
            placeholder="Search doms..."
            value={search}
            onValueChange={(value) => setSearch(value)}
          />
          <CommandList>
            <CommandEmpty>No project found.</CommandEmpty>
            <CommandGroup>
              {filteredDoms.map((dom) => (
                <CommandItem key={dom.id} value={dom.title} onSelect={() => {}}>
                  <h4>{dom.title}</h4>
                  <div className="text-sm text-gray-500">{dom.description}</div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
