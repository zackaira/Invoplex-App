"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import SidebarHead from "./Head";
import SidebarFoot from "./Foot";
import SidebarNavItems from "./NavItems";

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
