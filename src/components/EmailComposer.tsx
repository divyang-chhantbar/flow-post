"use client"

import type React from "react"
import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Send } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Category {
  _id: string
  name: string
  description: string
  recipients?: {
    name: string
    email: string
  }[]
}

export default function EmailComposer() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [formData, setFormData] = useState({
    subject: "",
    body: "",
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get("/api/category", { withCredentials: true })
      setCategories(data)
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast({
        title: "Error",
        description: "Failed to load categories. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedCategories.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one category",
        variant: "destructive",
      })
      return
    }

    try {
      setSending(true)
      await axios.post(
        "/api/send-email",
        {
          categoryIds: selectedCategories,
          subject: formData.subject,
          body: formData.body,
        },
        { withCredentials: true }
      )

      toast({
        title: "Success",
        description: "Email sent successfully",
      })

      setFormData({ subject: "", body: "" })
      setSelectedCategories([])
    } catch (error) {
      console.error("Error sending email:", error)
      toast({
        title: "Error",
        description: "Failed to send email",
        variant: "destructive",
      })
    } finally {
      setSending(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    )
  }

  const totalSelectedRecipients = categories
    .filter((category) => selectedCategories.includes(category._id))
    .reduce((total, category) => total + (category.recipients?.length || 0), 0)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Compose Email</h2>
        <p className="text-muted-foreground">Create and send emails to your recipient categories</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Categories</CardTitle>
              </CardHeader>
              <CardContent>
                {categories.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">No categories found. Create categories first to send emails.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((category) => (
                      <div key={category._id} className="flex items-start space-x-2">
                        <Checkbox
                          id={category._id}
                          checked={selectedCategories.includes(category._id)}
                          onCheckedChange={() => handleCategoryToggle(category._id)}
                        />
                        <div className="grid gap-1.5">
                          <Label
                            htmlFor={category._id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {category.name}
                          </Label>
                          <p className="text-xs text-muted-foreground">{category.recipients?.length || 0} recipients</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {selectedCategories.length > 0 && (
                  <div className="mt-4 p-3 bg-muted rounded-md">
                    <p className="text-sm">
                      <span className="font-medium">Selected:</span> {selectedCategories.length} categories with {totalSelectedRecipients} total recipients
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Email Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" name="subject" value={formData.subject} onChange={handleChange} placeholder="Email subject" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="body">Message</Label>
                    <Textarea id="body" name="body" value={formData.body} onChange={handleChange} placeholder="Write your email message here..." className="min-h-[200px]" required />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="reset">Clear</Button>
                <Button type="submit" disabled={sending || selectedCategories.length === 0}>
                  {sending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</> : <><Send className="mr-2 h-4 w-4" /> Send Email</>}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      )}
    </div>
  )
}
