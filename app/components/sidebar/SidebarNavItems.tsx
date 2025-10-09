import Link from "next/link";
import { FileInput, FilePlus, Settings, UsersRound, Clock } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export default function SidebarNavItems() {
  const menuItems = [
    {
      title: "Overview",
      url: "/",
      icon: Clock,
    },
    {
      title: "Quotes",
      url: "/quotes",
      icon: FilePlus,
    },
    {
      title: "Invoices",
      url: "/invoices",
      icon: FileInput,
    },
    {
      title: "Clients",
      url: "/clients",
      icon: UsersRound,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
  ];

  return (
    <SidebarMenu>
      {menuItems.map((item) => (
        <SidebarMenuItem
          key={item.title}
          className={`${
            item.title === "Overview" || item.title === "Clients"
              ? "mb-4"
              : "mb-1"
          }`}
        >
          <SidebarMenuButton
            asChild
            tooltip={item.title}
            className="group-data-[collapsible=icon]:!w-full group-data-[collapsible=icon]:!h-8"
          >
            <Link href={item.url}>
              <item.icon />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
