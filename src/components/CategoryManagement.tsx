"use client";

import { useState, useEffect, useCallback } from "react";
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

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<Category[]>("/category");
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
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data: newCategory } = await api.post<Category>(
        "/category",
        formData
      );
      setCategories((prev) => [...prev, newCategory]);
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
      if (response.status === 200) {
        setCategories((prev) =>
          prev.map((category) => {
            if (category._id === selectedCategory) {
              return {
                ...category,
                recipients: [...category.recipients, recipientData],
              };
            }
            return category;
          })
        );
        toast.success(response.data.message || "Recipient added successfully");
        setRecipientData({ name: "", email: "" });
        setRecipientDialogOpen(false);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || err.message);
      } else {
        toast.error("Failed to add recipient");
      }
    }
  };

  //// Handle recipient removal
  const handleRemoveRecipient = (categoryId: string, email: string) => {
    setCategories((prev) =>
      prev.map((category) => {
        if (category._id === categoryId) {
          return {
            ...category,
            recipients:
              category.recipients?.filter((r) => r.email !== email) || [],
          };
        }
        return category;
      })
    );
    toast.success("Recipient removed successfully");
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
          <p className="text-muted-foreground">
            Manage your email recipient categories
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
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
        <div className="grid gap-6">
          {categories.map((category) => (
            <Collapsible key={category._id}>
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{category.name}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </div>
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
                </CardHeader>
                <CardContent>
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center gap-2 mb-4 cursor-pointer hover:text-primary">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {category.recipients.length} Recipients
                      </span>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="space-y-2 mt-4">
                      {category.recipients.map((recipient) => (
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
