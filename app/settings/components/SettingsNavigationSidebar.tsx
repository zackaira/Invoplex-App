import { Button } from "@/components/ui/button";
import { Building2, FileText, Receipt, FileCheck, Palette } from "lucide-react";

export function SettingsNavigationSidebar() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="w-64 shrink-0">
      <div className="sticky top-8 space-y-2">
        <p className="text-sm font-semibold text-muted-foreground mb-4 px-3">
          Quick Navigation
        </p>
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => scrollToSection("business-profile")}
        >
          <Building2 className="mr-2 h-4 w-4" />
          Business Profile
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => scrollToSection("brand-settings")}
        >
          <FileCheck className="mr-2 h-4 w-4" />
          Company Branding
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => scrollToSection("tax-settings")}
        >
          <FileCheck className="mr-2 h-4 w-4" />
          Tax Settings
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => scrollToSection("quote-settings")}
        >
          <FileText className="mr-2 h-4 w-4" />
          Quote Settings
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => scrollToSection("invoice-settings")}
        >
          <Receipt className="mr-2 h-4 w-4" />
          Invoice Settings
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => scrollToSection("template-settings")}
        >
          <Palette className="mr-2 h-4 w-4" />
          Template Design
        </Button>
      </div>
    </div>
  );
}
