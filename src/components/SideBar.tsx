"use client";

import { useSession, signOut } from "next-auth/react";
import {
  ChevronLeft,
  ChevronRight,
  Inbox,
  Send,
  Users,
  FolderPlus,
  Mail,
  LogOut,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface AppSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  collapsed: boolean
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>
}


export function AppSidebar({ activeTab, setActiveTab }: AppSidebarProps) {
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { icon: Inbox, label: "Inbox", value: "inbox" },
    { icon: Send, label: "Sent", value: "sent" },
    { icon: FolderPlus, label: "Categories", value: "categories" },
    { icon: Users, label: "Recipients", value: "recipients" },
    { icon: Mail, label: "Compose Email", value: "compose" },
  ];

  const cn = (...classes: (string | boolean | undefined)[]) => {
    return classes.filter(Boolean).join(" ");
  };

  return (
    <Sidebar className={`transition-all ${collapsed ? "w-16" : "w-64"}`}>
      <SidebarHeader className="border-b border-border flex items-center justify-between px-4 py-2">
        {!collapsed && <h1 className="text-xl font-bold">Welcome {session?.user?.username}</h1>}
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.value}>
              <SidebarMenuButton
                isActive={activeTab === item.value}
                onClick={() => setActiveTab(item.value)}
                className={cn("justify-start", collapsed && "justify-center")}
              >
                <div className={cn("flex items-center", collapsed ? "justify-center" : "gap-2")}>
                  <item.icon className="h-4 w-4" />
                  {!collapsed && <span>{item.label}</span>}
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-border p-4">
        <Button variant="outline" size="sm" onClick={() => signOut()} className="w-full">
          <LogOut className="h-4 w-4 mr-2" /> {!collapsed && "Sign Out"}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
