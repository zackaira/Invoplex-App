"use client";

import { TooltipWrapper } from "./TooltipWrapper";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function ExternalLinkIcon({
  href,
  tooltip,
  className,
}: {
  href: string;
  tooltip?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex items-center gap-0 opacity-0 group-hover:opacity-100 transition-opacity",
        className
      )}
    >
      <TooltipWrapper tooltip={tooltip || "Open in new tab"} side="top">
        <Link href={href} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
        </Link>
      </TooltipWrapper>
    </span>
  );
}
