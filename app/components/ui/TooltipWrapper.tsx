"use client";

import * as React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TooltipWrapperProps {
  children: React.ReactElement;
  tooltip?: string;
  side?: "top" | "right" | "bottom" | "left";
  delayDuration?: number;
  sideOffset?: number;
  maxWidth?: string;
}

export function TooltipWrapper({
  children,
  tooltip,
  side = "bottom",
  delayDuration = 200,
  sideOffset = 4,
}: TooltipWrapperProps) {
  // If no tooltip, just return the children without wrapping
  if (!tooltip) {
    return children;
  }

  return (
    <Tooltip delayDuration={delayDuration}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side} sideOffset={sideOffset}>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
}
