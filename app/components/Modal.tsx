"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

interface ModalProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  trigger?: React.ReactNode;
  cancelBtnText?: string;
  submitBtnText?: string;
  onSubmit?: () => void | Promise<void>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isLoading?: boolean;
}

export default function Modal({
  title,
  description,
  children,
  trigger,
  cancelBtnText = "Cancel",
  submitBtnText = "Save",
  onSubmit,
  open,
  onOpenChange,
  isLoading = false,
}: ModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  // Use controlled state if provided, otherwise use internal state
  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      await onSubmit();
      // Optionally close the modal after successful submission
      // setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
          <div className="grid gap-4 py-4">{children}</div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isLoading}>
                {cancelBtnText}
              </Button>
            </DialogClose>
            {onSubmit && (
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Loading..." : submitBtnText}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
