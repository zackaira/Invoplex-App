"use client";

import { ModeToggle } from "@/app/components/topbar/ModeToggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

function getPageTitle(pathname: string): string {
  // Remove trailing slash if present
  const cleanPath =
    pathname.endsWith("/") && pathname !== "/"
      ? pathname.slice(0, -1)
      : pathname;

  // Handle exact matches first
  const pathMap: Record<string, string> = {
    "/": "Overview",
    "/quotes": "Quotes",
    "/invoices": "Invoices",
    "/clients": "Clients",
    "/settings": "Settings",
  };

  if (pathMap[cleanPath]) {
    return pathMap[cleanPath];
  }

  // Handle nested routes
  if (cleanPath.startsWith("/quote/")) {
    if (cleanPath.endsWith("/edit")) {
      return "Edit Quote";
    }
    return "Quote";
  }

  if (cleanPath.startsWith("/invoice/")) {
    if (cleanPath.endsWith("/edit")) {
      return "Edit Invoice";
    }
    return "Invoice";
  }

  // Default fallback - capitalize first segment
  const segments = cleanPath.split("/").filter(Boolean);
  if (segments.length > 0) {
    return segments[0].charAt(0).toUpperCase() + segments[0].slice(1);
  }

  return "Dashboard";
}

export default function TopNav() {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-card px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="text-foreground hover:bg-accent" />
      </div>

      {/* Left side - Navigation tabs */}
      <h1 className="flex items-center gap-6 flex-1">{pageTitle}</h1>

      {/* Right side - User avatar */}
      <div className="flex items-center gap-4">
        <ModeToggle />
      </div>
    </header>
  );
}
