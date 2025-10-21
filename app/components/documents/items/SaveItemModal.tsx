"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TypeSelect } from "./TypeSelect";

interface SaveItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: { itemType: string; hasQuantityColumn: boolean }) => void;
  userId: string;
  initialType?: string;
  initialHasQuantityColumn?: boolean;
}

export function SaveItemModal({
  isOpen,
  onClose,
  onAdd,
  userId,
  initialType = "Product",
  initialHasQuantityColumn = false,
}: SaveItemModalProps) {
  const [itemType, setItemType] = useState(initialType);
  const [hasQuantityColumn, setHasQuantityColumn] = useState(
    initialHasQuantityColumn
  );

  // Sync state with props when they change
  useEffect(() => {
    if (isOpen) {
      setItemType(initialType);
      setHasQuantityColumn(initialHasQuantityColumn);
    }
  }, [isOpen, initialType, initialHasQuantityColumn]);

  const handleAdd = () => {
    onAdd({ itemType, hasQuantityColumn });
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Add a New Line Item</DialogTitle>
          <DialogDescription>
            Choose the type of item and whether it has a quantity column.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4 pb-6">
          {/* Item Type */}
          <div>
            <label
              htmlFor="item-type"
              className="block text-sm font-medium mb-2"
            >
              Type
            </label>
            <TypeSelect
              id="item-type"
              value={itemType}
              onChange={setItemType}
              userId={userId}
              className="w-full"
            />
          </div>

          {/* Has Quantity Column Toggle */}
          <div className="flex items-center justify-between">
            <label
              htmlFor="has-quantity-column"
              className="text-sm font-medium"
            >
              Has Quantity Column
            </label>
            <Switch
              id="has-quantity-column"
              checked={hasQuantityColumn}
              onCheckedChange={setHasQuantityColumn}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleAdd}>Add Item</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
