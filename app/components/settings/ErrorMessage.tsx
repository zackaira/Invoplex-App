/**
 * Error Message Component
 *
 * Small reusable component for displaying validation errors
 * with consistent styling and animations.
 */

import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorMessageProps {
  message?: string;
  className?: string;
}

export function ErrorMessage({ message, className }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div
      className={cn(
        "flex items-start gap-2 text-sm text-destructive animate-in fade-in-50 duration-200",
        className
      )}
      role="alert"
      aria-live="polite"
    >
      <AlertCircle className="size-4 mt-0.5 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
}
