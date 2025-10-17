"use client";

import { useState } from "react";
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
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  description?: string;
  unitPrice: string;
  type: string;
}

interface ProductSelectProps {
  onSelect: (product: Product) => void;
  onOpenAddModal: () => void;
  trigger?: React.ReactNode;
  className?: string;
}

// TODO: Replace with actual products from database
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Website Design",
    description: "Custom website design and development",
    unitPrice: "2500.00",
    type: "Service",
  },
  {
    id: "2",
    name: "Premium Hosting",
    description: "Premium web hosting service (yearly)",
    unitPrice: "299.00",
    type: "Product",
  },
  {
    id: "3",
    name: "Logo Design",
    description: "Professional logo design package",
    unitPrice: "500.00",
    type: "Service",
  },
  {
    id: "4",
    name: "SEO Optimization",
    description: "Monthly SEO optimization and reporting",
    unitPrice: "800.00",
    type: "Service",
  },
];

export function ProductSelect({
  onSelect,
  onOpenAddModal,
  trigger,
  className,
}: ProductSelectProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (product: Product) => {
    onSelect(product);
    setOpen(false);
  };

  const handleOpenAddModal = () => {
    onOpenAddModal();
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {trigger || (
          <Button variant="outline" className={cn("w-full", className)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-[450px] p-0" align="center">
        <Command>
          <CommandInput placeholder="Type an item name" />
          <CommandList>
            <CommandEmpty>
              <div className="text-sm text-muted-foreground px-2 py-4 text-center">
                No products found.
              </div>
            </CommandEmpty>

            {/* Add New Item Option */}
            <CommandGroup>
              <CommandItem
                onSelect={handleOpenAddModal}
                className="cursor-pointer"
              >
                <Plus className="mr-2 h-4 w-4" />
                <span>Add New Product, Service or Custom Type</span>
              </CommandItem>
            </CommandGroup>

            {/* Saved products and services list */}
            {mockProducts.length > 0 && (
              <CommandGroup heading="Saved Items">
                {mockProducts.map((product) => (
                  <CommandItem
                    key={product.id}
                    value={`${product.name} ${product.description}`}
                    onSelect={() => handleSelect(product)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center justify-between w-full gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">
                            {product.name}
                          </span>
                          <span className="text-xs px-1.5 py-0.5 bg-muted text-muted-foreground rounded flex-shrink-0">
                            {product.type}
                          </span>
                        </div>
                        {product.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                            {product.description}
                          </p>
                        )}
                      </div>
                      <span className="text-sm font-semibold flex-shrink-0">
                        ${product.unitPrice}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
