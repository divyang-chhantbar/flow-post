"use client";

import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { AppSidebar } from "./SideBar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import CategoryManagement from "./CategoryManagement";
import EmailComposer from "./EmailComposer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion"; 
import { ThemeProvider } from "@/components/ThemeProvider";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("inbox");
  
  useEffect(() => {
    const storedTab = localStorage.getItem("activeTab");
    if (storedTab) {
      setActiveTab(storedTab);
    }
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    localStorage.setItem("activeTab", tab);
  };

  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await axios.get("/api/category", { withCredentials: true });
        if (response.status !== 200) {
          throw new Error("API is not reachable");
        }
        setApiError(null);
      } catch (error: unknown) {
        console.error("API connectivity check failed:", error);

        if (error instanceof AxiosError && error.response) {
          const message = error.response.data?.message || error.response.statusText;
          setApiError(`API Error: ${message}`);
        } else if (error instanceof AxiosError && error.request) {
          setApiError("No response from API. Please check your network.");
        } else {
          setApiError("Unexpected error occurred.");
        }
      }
    };

    checkApiStatus();
  }, []);

  return (
    <ThemeProvider defaultTheme="system" storageKey="flow-post-theme">
    <SidebarProvider defaultOpen={true} style={{ "--sidebar-width-icon": "4rem" } as React.CSSProperties}>
      <div className="flex h-screen overflow-hidden bg-background">
        <AppSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <SidebarInset className="flex flex-col flex-1 overflow-auto">
          <div className="border-b border-border bg-background sticky top-0 z-10 px-4 py-3">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="flex gap-4">
                <TabsTrigger value="inbox" className="text-lg">
                  Inbox
                </TabsTrigger>
                <TabsTrigger value="categories" className="text-lg">
                  Categories
                </TabsTrigger>
                <TabsTrigger value="compose" className="text-lg">
                  Compose Email
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex-1 p-6">
            {apiError && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>API Error</AlertTitle>
                <AlertDescription className="flex items-center justify-between">
                  <span>{apiError}</span>
                  <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Retry
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsContent value="inbox">
                <motion.div
                  key="inbox"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <div className="text-muted-foreground text-center py-20">
                    Inbox is under construction 📬
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="categories">
                <motion.div
                  key="categories"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <CategoryManagement />
                </motion.div>
              </TabsContent>

              <TabsContent value="compose">
                <motion.div
                  key="compose"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <EmailComposer />
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
    </ThemeProvider>
  );
}
