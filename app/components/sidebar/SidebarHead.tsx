import { SidebarHeader } from "@/components/ui/sidebar";

export default function SidebarHead() {
  return (
    <SidebarHeader className="h-16 border-b border-border flex justify-center mb-2">
      <div className="flex items-center gap-2 px-2">
        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <span className="text-md font-bold">I</span>
        </div>
        <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
          <span>INVOPLEX</span>
        </div>
      </div>
    </SidebarHeader>
  );
}
