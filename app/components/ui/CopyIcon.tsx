"use client";

import { Button } from "@/components/ui/button";
import { TooltipWrapper } from "./TooltipWrapper";
import { Copy } from "lucide-react";
import { toast } from "sonner";

const handleCopyToClipboard = (value: string) => {
  navigator.clipboard.writeText(value);
  toast.success("Copied to clipboard");
};

export function CopyIcon({ value }: { value: string }) {
  return (
    <span className="flex items-center gap-0 opacity-0 group-hover:opacity-100 transition-opacity">
      <TooltipWrapper tooltip="Copy to clipboard" side="top">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => handleCopyToClipboard(value)}
        >
          <Copy className="h-3.5 w-3.5 text-muted-foreground" />
        </Button>
      </TooltipWrapper>
    </span>
  );
}
