"use client"

import { useState, useEffect } from "react"
import axios, { AxiosError } from "axios"
import { AppSidebar } from "./SideBar"
import { SidebarProvider } from "@/components/ui/sidebar"
import CategoryManagement from "./CategoryManagement"
import EmailComposer from "./EmailComposer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("inbox")
  const [apiError, setApiError] = useState<string | null>(null)
  const [collapsed, setCollapsed] = useState(false)

  // Check API connectivity using Axios
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await axios.get("/api/category", {
          withCredentials: true,
        })
        if (response.status !== 200) {
          throw new Error("API is not reachable")
        }
        // API is reachable, you can set the state or perform any action here
        console.log("API is reachable")
        // after successful check, you can clear the error state
        setApiError(null) // Clear error if successful
      } catch (error: unknown) {
        console.error("API connectivity check failed:", error)

        if (error instanceof AxiosError && error.response) {
          // Server responded with a status code outside the range of 2xx
          const message = error.response.data?.message || error.response.statusText

          setApiError(`API Error: ${message}`)
        } else if (error instanceof AxiosError && error.request) {
          // Request was made but no response received
          setApiError("No response from API. Please check your network.")
        } else {
          // Something else happened
          setApiError("Unexpected error occurred.")
        }
      }
    }

    checkApiStatus()
  }, [])

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        <AppSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        collapsed = {collapsed}
        setCollapsed = {setCollapsed} />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto py-6 px-4">
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
              <TabsList className="mb-6">
                <TabsTrigger value="inbox">Inbox</TabsTrigger>
                <TabsTrigger value="categories">Categories</TabsTrigger>
                <TabsTrigger value="compose">Compose Email</TabsTrigger>
              </TabsList>
              <TabsContent value="categories">
                <CategoryManagement />
              </TabsContent>
              <TabsContent value="compose">
                <EmailComposer />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
