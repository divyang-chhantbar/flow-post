"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  FolderPlus,
  Loader2,
  Users,
  RefreshCw,
  UserPlus,
  Mail,
  X,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import * as XLSX from "xlsx";

interface Category {
  _id: string;
  name: string;
  description: string;
  recipients: Recipient[];
}

interface Recipient {
  name: string;
  email: string;
}

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recipientDialogOpen, setRecipientDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [recipientData, setRecipientData] = useState<Recipient>({
    name: "",
    email: "",
  });
  const [excelDialogOpen, setExcelDialogOpen] = useState(false);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<Category[]>("/category");
      console.log("Fetched Categories:", data);
      setCategories(data);
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Failed to load categories.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [setCategories]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post<Category>("/category", formData);
      await fetchCategories(); // re-fetch to get updated categories with recipients
      toast.success("Category created successfully");
      setFormData({ name: "", description: "" });
      setOpen(false);
    } catch (err) {
      toast.error(
        axios.isAxiosError(err)
          ? err.response?.data?.message || err.message
          : "An unknown error occurred"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Handle recipient form submission
  const handleAddRecipient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return;
    try {
      const response = await api.post("/recipients", {
        name: recipientData.name,
        email: recipientData.email,
        categoryId: selectedCategory,
      });
      if (response.status === 200 || response.status === 201) {
        toast.success(response.data.message || "Recipient added successfully");
        setRecipientData({ name: "", email: "" });
        await fetchCategories();
        console.log(
          "Re-fetched after adding recipient — selectedCategory:",
          selectedCategory
        );

        setRecipientDialogOpen(false);
      }
    } catch (err) {
      toast.error(
        axios.isAxiosError(err)
          ? err.response?.data?.message || err.message
          : "Failed to add recipient"
      );
    }
  };

  //// Handle recipient removal
  const handleRemoveRecipient = async (categoryId: string, recipientEmail: string) => {
    try {
      await api.delete("/recipients", {
        data: { categoryId, recipientEmail },
      });
      toast.success("Recipient removed successfully");
      // Update the local categories state instead of refetching
      setCategories(prevCategories =>
        prevCategories.map(category => {
          if (category._id === categoryId) {
            return {
              ...category,
              recipients: category.recipients.filter(recipient => recipient.email !== recipientEmail)
            };
          }
          return category;
        })
      );
    } catch (error) {
      toast.error(
        axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : "Failed to remove recipient"
      );
      
    }
  };

  // Parsing Excel data
  const [parsedRows, setParsedRows] = useState<any[]>([]);

  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // e.target.files is a FileList, and [0] gets the first file
    if (!file) return;

    const data = await file.arrayBuffer(); // Read the file as an ArrayBuffer
    const workbook = XLSX.read(data); // Parse the ArrayBuffer into a workbook
    const sheet = workbook.Sheets[workbook.SheetNames[0]]; // Get the first sheet
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Convert the sheet to JSON
    setParsedRows(rows); // Set the parsed rows to state , it means we have the data in a 2D array format


    toast.success("Excel file parsed successfully");
  };

  // Handle parsed data submission
  const submitParsedDataToBackend = async () => {
    if (!parsedRows.length) {
      toast.error("No data to upload!");
      return;
    }
  
    try {
      await api.post("/excel-upload", { rows: parsedRows });
      toast.success("Excel data uploaded successfully!");
      await fetchCategories(); // refresh UI
      setExcelDialogOpen(false); // close the dialog if open
    } catch (err) {
      toast.error(axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Upload failed."
      );
    }
  };

  // Delete category and its recipients
  const handleDeleteCategory = async (categoryId: string) => {
  try {
    const res = await api.delete('/category', {
      data: { categoryId },
    });

    if (res.status === 200) {
      toast.success(res.data.message || "Category deleted successfully!");
      await fetchCategories();
    } else {
      toast.error(res.data.message || "Failed to delete category.");
    }
  } catch (err) {
    toast.error(
      axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Error deleting category."
    );
  }
};

  
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
          <p className="text-muted-foreground">
            Manage your email recipient categories
          </p>
        </div>
        <Dialog
          open={open}
          onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) {
              setFormData({ name: "", description: "" });
            }
          }}
        >
          <DialogTrigger asChild>
            <Button onClick={() => setOpen(true)}>
              <FolderPlus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Category</DialogTitle>
              <DialogDescription>
                Add a new category to organize your email recipients
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Category name"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Category description"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Create Category"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Import from Excel */}
      <Dialog open={excelDialogOpen} onOpenChange={setExcelDialogOpen}>
  <DialogTrigger asChild>
  <Button variant="outline" onClick={() => setExcelDialogOpen(true)}>
      <Upload className="mr-2 h-4 w-4" />
      Import Data from Excel
    </Button>
  </DialogTrigger>

  <DialogContent>
    <DialogHeader>
      <DialogTitle>Import Categories + Recipients</DialogTitle>
      <DialogDescription>
        Upload an Excel sheet to automatically create categories and assign recipients.
      </DialogDescription>
    </DialogHeader>

    {/* Excel Upload Input */}
    <div className="grid gap-4 py-4">
      <Input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleExcelUpload}
      />
    </div>

    <DialogFooter>
      <Button onClick={submitParsedDataToBackend}
      >
        Upload to Flow-Post
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

      {/* Add Recipient Dialog */}
      <Dialog open={recipientDialogOpen} onOpenChange={setRecipientDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Recipient</DialogTitle>
            <DialogDescription>
              Add a new recipient to this category
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddRecipient}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="recipientName">Name</Label>
                <Input
                  id="recipientName"
                  value={recipientData.name}
                  onChange={(e) =>
                    setRecipientData({ ...recipientData, name: e.target.value })
                  }
                  placeholder="Recipient name"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="recipientEmail">Email</Label>
                <Input
                  id="recipientEmail"
                  type="email"
                  value={recipientData.email}
                  onChange={(e) =>
                    setRecipientData({
                      ...recipientData,
                      email: e.target.value,
                    })
                  }
                  placeholder="recipient@example.com"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Add Recipient</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Error Handling */}
      {error && (
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <p className="text-red-500 text-center">{error}</p>
          <Button onClick={fetchCategories}>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Retry
          </Button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Empty State */}
      {!loading && categories.length === 0 && !error && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <FolderPlus className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              No categories found. Create your first category to get started.
            </p>
            <Button className="mt-4" onClick={() => setOpen(true)}>
              Create Category
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Categories List */}
      {!loading && categories.length > 0 && (
        <div className="grid gap-6 md:grid-cols-1">
          {categories.map((category) => (
            <Collapsible key={category._id}>
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <CardTitle className="flex items-center gap-2">{category.name}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteCategory(category._id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedCategory(category._id);
                          setRecipientDialogOpen(true);
                        }}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add Recipient
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center gap-2 mb-4 cursor-pointer hover:text-primary">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {category.recipients?.length || 0} Recipients
                      </span>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="space-y-2 mt-4">
                      {(category.recipients || []).map((recipient) => (
                        <div
                          key={recipient.email}
                          className="flex items-center justify-between p-3 bg-muted rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{recipient.name}</p>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Mail className="h-3 w-3" />
                                <span>{recipient.email}</span>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleRemoveRecipient(
                                category._id,
                                recipient.email
                              )
                            }
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </CardContent>
              </Card>
            </Collapsible>
          ))}
        </div>
      )}
    </div>
  );
}
