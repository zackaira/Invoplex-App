"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
import { Plus, Package, Wrench, Tag, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getSavedProducts, deleteProduct } from "@/lib/actions";
import { ConfirmModal } from "./ConfirmModal";
import { toast } from "sonner";

interface SavedProduct {
  id: string;
  name: string;
  description: string | null;
  unitPrice: string;
  type: string;
  hasQuantityColumn: boolean;
}

interface ProductSelectProps {
  userId: string;
  onSelectProduct: (product: SavedProduct) => void;
  onOpenAddModal: () => void;
  trigger?: React.ReactNode;
  className?: string;
}

export function ProductSelect({
  userId,
  onSelectProduct,
  onOpenAddModal,
  trigger,
  className,
}: ProductSelectProps) {
  const [open, setOpen] = useState(false);
  const [savedProducts, setSavedProducts] = useState<SavedProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<SavedProduct | null>(
    null
  );

  useEffect(() => {
    if (open) {
      loadSavedProducts();
    }
  }, [open]);

  const loadSavedProducts = async () => {
    setLoading(true);
    try {
      const products = await getSavedProducts(userId);
      setSavedProducts(products);
    } catch (error) {
      console.error("Error loading saved products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (product: SavedProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    try {
      await deleteProduct(productToDelete.id);
      toast.success("Item deleted from your Saved Items");
      // Reload products
      loadSavedProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete item");
    }
  };

  const getIconForType = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType === "service") {
      return <Wrench className="mr-2 h-4 w-4 text-muted-foreground" />;
    } else if (lowerType === "product") {
      return <Package className="mr-2 h-4 w-4 text-muted-foreground" />;
    } else {
      return <Tag className="mr-2 h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {trigger || (
            <Button variant="outline" className={cn("w-full", className)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          )}
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="center">
          <Command>
            <CommandInput placeholder="Search products..." />
            <CommandList>
              <CommandEmpty>
                {loading ? "Loading..." : "No saved products found."}
              </CommandEmpty>

              {/* Add New Button */}
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    onOpenAddModal();
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  <span>Add new product, service or a custom type</span>
                </CommandItem>
              </CommandGroup>

              {/* Saved Products */}
              {savedProducts.length > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup heading="Saved Items">
                    {savedProducts.map((product) => (
                      <div key={product.id} className="relative group">
                        <CommandItem
                          onSelect={() => {
                            onSelectProduct(product);
                            setOpen(false);
                          }}
                          className="cursor-pointer pr-10 py-3"
                        >
                          {getIconForType(product.type)}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium mb-0.5 line-clamp-1">
                              <span className="mr-2">{product.name}</span>

                              <span className="text-xs text-muted-foreground bg-muted rounded-md py-1 px-2">
                                {product.type}
                              </span>
                            </div>
                            {product.description && (
                              <div className="text-xs text-muted-foreground">
                                {(() => {
                                  // Remove all formatting (line breaks, extra spaces)
                                  const cleanDescription = product.description
                                    .replace(/\s+/g, " ")
                                    .trim();
                                  return cleanDescription.length > 70
                                    ? `${cleanDescription.substring(0, 70)}...`
                                    : cleanDescription;
                                })()}
                              </div>
                            )}
                          </div>
                          <div className="ml-3 text-sm font-medium text-muted-foreground whitespace-nowrap">
                            ${product.unitPrice}
                          </div>
                        </CommandItem>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-opacity"
                          onClick={(e) => handleDeleteClick(product, e)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Saved Item"
        description="Are you sure you want to delete this item from your saved items? This action cannot be undone."
        confirmButtonText="Delete"
        confirmButtonVariant="destructive"
      />
    </>
  );
}
