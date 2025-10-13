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
import { ItemTypeSelect } from "./ItemTypeSelect";

interface SaveItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: string;
  initialDescription?: string;
  initialUnitPrice?: string;
  currency?: string;
}

export function SaveItemModal({
  isOpen,
  onClose,
  initialType = "Product",
  initialDescription = "",
  initialUnitPrice = "0",
  currency = "USD",
}: SaveItemModalProps) {
  const [itemType, setItemType] = useState(initialType);
  const [description, setDescription] = useState(initialDescription);
  const [unitPrice, setUnitPrice] = useState(initialUnitPrice);

  // Sync state with props when they change
  useEffect(() => {
    if (isOpen) {
      setItemType(initialType);
      setDescription(initialDescription);
      setUnitPrice(initialUnitPrice);
    }
  }, [isOpen, initialType, initialDescription, initialUnitPrice]);

  const handleSave = () => {
    // TODO: Implement save to database functionality
    console.log("Saving item:", { itemType, description, unitPrice });
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Save Item to Database</DialogTitle>
          <DialogDescription>
            Save this item as a reusable product or service for future quotes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Item Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Type</label>
            <ItemTypeSelect
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
        </div>

        {/* Action Buttons */}
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
