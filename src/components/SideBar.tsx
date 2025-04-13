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
  useSidebar
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

interface AppSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function AppSidebar({ activeTab, setActiveTab }: AppSidebarProps) {
  const { data: session } = useSession();
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";

  const menuItems = [
    { icon: Inbox, label: "Inbox", value: "inbox" },
    { icon: Send, label: "Sent", value: "sent" },
    { icon: FolderPlus, label: "Categories", value: "categories" },
    { icon: Users, label: "Recipients", value: "recipients" },
    { icon: Mail, label: "Compose Email", value: "compose" },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-border flex items-center justify-between px-4 py-2">
        {!collapsed && <h1 className="text-xl font-bold">Welcome {session?.user?.username}</h1>}
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.value} className={collapsed ? "flex justify-center" : ""}>
              <SidebarMenuButton
                isActive={activeTab === item.value}
                onClick={() => setActiveTab(item.value)}
                className={collapsed ? "justify-center" : "justify-start"}
              >
                <item.icon className="h-4 w-4" />
                {!collapsed && <span className="ml-2">{item.label}</span>}
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