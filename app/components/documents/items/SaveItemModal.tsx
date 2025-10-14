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
import { Textarea } from "@/components/ui/textarea";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Switch } from "@/components/ui/switch";
import { TypeSelect } from "./TypeSelect";

interface SaveItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    itemType: string;
    description: string;
    unitPrice: string;
    hasQuantityColumn: boolean;
  }) => void;
  mode?: "add" | "save"; // "add" = add to list, "save" = save to database
  onHasQuantityColumnChange?: (value: boolean) => void; // Real-time update for save mode
  initialType?: string;
  initialDescription?: string;
  initialUnitPrice?: string;
  initialHasQuantityColumn?: boolean;
  currency?: string;
}

export function SaveItemModal({
  isOpen,
  onClose,
  onSave,
  mode = "add",
  onHasQuantityColumnChange,
  initialType = "Product",
  initialDescription = "",
  initialUnitPrice = "0",
  initialHasQuantityColumn = false,
  currency = "USD",
}: SaveItemModalProps) {
  const [itemType, setItemType] = useState(initialType);
  const [description, setDescription] = useState(initialDescription);
  const [unitPrice, setUnitPrice] = useState(initialUnitPrice);
  const [hasQuantityColumn, setHasQuantityColumn] = useState(
    initialHasQuantityColumn
  );

  // Sync state with props when they change
  useEffect(() => {
    if (isOpen) {
      setItemType(initialType);
      setDescription(initialDescription);
      setUnitPrice(initialUnitPrice);
      setHasQuantityColumn(initialHasQuantityColumn);
    }
  }, [
    isOpen,
    initialType,
    initialDescription,
    initialUnitPrice,
    initialHasQuantityColumn,
  ]);

  const handleSave = () => {
    onSave({ itemType, description, unitPrice, hasQuantityColumn });
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
            {mode === "save" ? "Save Item to Database" : "Add New Item"}
          </DialogTitle>
          <DialogDescription>
            {mode === "save"
              ? "Save this item as a reusable product or service for future quotes."
              : "Add a new line item to your quote."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Item Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Type</label>
            <TypeSelect
              value={itemType}
              onChange={setItemType}
              className="w-full"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter item description"
              className="w-full min-h-[100px] resize-y"
            />
          </div>

          {/* Unit Price */}
          <div>
            <label className="block text-sm font-medium mb-2">Unit Price</label>
            <InputGroup className="w-full">
              <InputGroupAddon align="inline-start">
                <InputGroupText className="text-xs">{currency}</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                type="number"
                step="0.01"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                className="ps-12"
                placeholder="0.00"
              />
            </InputGroup>
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
