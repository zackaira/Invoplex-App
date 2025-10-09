"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import SidebarHead from "./SidebarHead";
import SidebarFoot from "./SidebarFoot";
import SidebarNavItems from "./SidebarNavItems";

export default function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHead />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarNavItems />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFoot />
    </Sidebar>
  );
}
