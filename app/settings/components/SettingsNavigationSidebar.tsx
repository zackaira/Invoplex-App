import { Button } from "@/components/ui/button";
import {
  Building2,
  FilePlus,
  FileInput,
  Receipt,
  FileCheck,
  Palette,
  Landmark,
} from "lucide-react";

interface SettingsNavigationSidebarProps {
  showBankDetails?: boolean;
}

export function SettingsNavigationSidebar({
  showBankDetails,
}: SettingsNavigationSidebarProps) {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="w-64 shrink-0 order-1 md:order-2">
      <div className="sticky top-8 space-y-2">
        <p className="text-sm font-semibold text-muted-foreground mb-4 px-3">
          Quick Navigation
        </p>

        <div className="flex flex-row space-y-2 md:flex-col">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => scrollToSection("business-profile")}
          >
            <Building2 className="mr-1 h-4 w-4" />
            Business Profile
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => scrollToSection("financial-settings")}
          >
            <Receipt className="mr-1 h-4 w-4" />
            Financial Settings
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => scrollToSection("brand-settings")}
          >
            <FileCheck className="mr-1 h-4 w-4" />
            Company Branding
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => scrollToSection("quote-settings")}
          >
            <FilePlus className="mr-1 h-4 w-4" />
            Quote Settings
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => scrollToSection("invoice-settings")}
          >
            <FileInput className="mr-1 h-4 w-4" />
            Invoice Settings
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start pl-8"
            onClick={() => scrollToSection("bank-details")}
            disabled={!showBankDetails}
          >
            <Landmark className="mr-1 h-4 w-4" />
            Bank Details
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => scrollToSection("template-settings")}
          >
            <Palette className="mr-1 h-4 w-4" />
            Template Design
          </Button>
        </div>
      </div>
    </div>
  );
}
