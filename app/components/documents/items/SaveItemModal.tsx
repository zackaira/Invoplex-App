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
import { TypeSelect } from "./TypeSelect";

interface SaveItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { itemType: string; hasQuantityColumn: boolean }) => void;
  mode?: "add" | "save"; // "add" = add to list, "save" = save to database
  onHasQuantityColumnChange?: (value: boolean) => void; // Real-time update for save mode
  initialType?: string;
  initialHasQuantityColumn?: boolean;
}

export function SaveItemModal({
  isOpen,
  onClose,
  onSave,
  mode = "add",
  onHasQuantityColumnChange,
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

  const handleSave = () => {
    onSave({ itemType, hasQuantityColumn });
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "save" ? "Save Item to Database" : "Add a New Line Item"}
          </DialogTitle>
          <DialogDescription>
            {mode === "save"
              ? "Save this item as a reusable product or service for future quotes."
              : "Create a new line item for your quote."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 pt-4 pb-6">
          {/* Item Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Type</label>
            <TypeSelect
              value={itemType}
              onChange={setItemType}
              className="w-full"
            />
          </div>

          {/* Has Quantity Column Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Has Quantity Column</label>
            <Switch
              checked={hasQuantityColumn}
              onCheckedChange={(checked) => {
                setHasQuantityColumn(checked);
                // In save mode, update the line item in real-time
                if (mode === "save" && onHasQuantityColumnChange) {
                  onHasQuantityColumnChange(checked);
                }
              }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {mode === "save" ? "Save Item" : "Add Item"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
