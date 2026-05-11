import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Card, CardContent } from "../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Upload,
  AlertTriangle,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../lib/AuthContext";

const API_URL = "https://bakeease-backend.onrender.com/api/v1";

const emptyProduct = {
  name: "",
  description: "",
  price: "",
  category: "",
  loafSize: "mini",
  ingredients: "",
  combo_items: [],
  imageFile: null,
  imagePreview: "",
};

export default function AdminProducts() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Fetch products
  const {
    data: productsResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`${API_URL}/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        toast.error("Session expired. Please login again.");
        window.location.href = "/auth";
        throw new Error("Unauthorized");
      }

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      return response.json();
    },
  });

  const products = productsResponse?.data || [];

  // Create product mutation
  const createMutation = useMutation({
    mutationFn: async (data) => {
      const token = localStorage.getItem("auth_token");

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", data.price);
      formData.append("category", data.category);
      formData.append("loafSize", data.loafSize);
      formData.append("ingredients", data.ingredients);
      if (data.combo_items && data.combo_items.length > 0) {
        formData.append("combo_items", JSON.stringify(data.combo_items));
      }
      if (data.imageFile) {
        formData.append("image", data.imageFile);
      }

      const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.status === 401) {
        toast.error("Session expired. Please login again.");
        window.location.href = "/auth";
        throw new Error("Unauthorized");
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create product");
      }

      const result = await response.json();
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setDialogOpen(false);
      resetForm();
      toast.success("Product created successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create product");
    },
  });

  // Update product mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const token = localStorage.getItem("auth_token");

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", data.price);
      formData.append("category", data.category);
      formData.append("loafSize", data.loafSize);
      formData.append("ingredients", data.ingredients);
      if (data.combo_items && data.combo_items.length > 0) {
        formData.append("combo_items", JSON.stringify(data.combo_items));
      }
      if (data.imageFile) {
        formData.append("image", data.imageFile);
      }

      const response = await fetch(`${API_URL}/products/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.status === 401) {
        toast.error("Session expired. Please login again.");
        window.location.href = "/auth";
        throw new Error("Unauthorized");
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update product");
      }

      const result = await response.json();
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setDialogOpen(false);
      resetForm();
      toast.success("Product updated successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update product");
    },
  });

  // Delete product mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        toast.error("Session expired. Please login again.");
        window.location.href = "/auth";
        throw new Error("Unauthorized");
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete product");
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setDeleteTarget(null);
      toast.success("Product deleted successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete product");
    },
  });

  const resetForm = () => {
    setForm(emptyProduct);
    setEditing(null);
  };

  const openCreate = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (product) => {
    setEditing(product);
    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      category: product.category || "",
      loafSize: product.loafSize || "mini",
      ingredients: product.ingredients || "",
      combo_items: product.combo_items || [],
      imageFile: null,
      imagePreview: product.image?.url || "",
    });
    setDialogOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setUploading(true);

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({
          ...prev,
          imagePreview: reader.result,
          imageFile: file,
        }));
        setUploading(false);
      };
      reader.readAsDataURL(file);

      toast.success("Image selected successfully");
    } catch (error) {
      console.error("Error handling image:", error);
      toast.error("Failed to process image");
      setUploading(false);
    }
  };

  const removeImage = () => {
    setForm((prev) => ({ ...prev, imageFile: null, imagePreview: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name) {
      toast.error("Please enter product name");
      return;
    }

    if (!form.price) {
      toast.error("Please enter product price");
      return;
    }

    if (!form.category) {
      toast.error("Please select a category");
      return;
    }

    if (!form.imagePreview && !editing) {
      toast.error("Please upload an image");
      return;
    }

    const data = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      category: form.category,
      loafSize: form.loafSize,
      ingredients: form.ingredients,
      combo_items: form.combo_items,
      imageFile: form.imageFile,
    };

    if (editing) {
      updateMutation.mutate({ id: editing._id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const categoryOptions = [
    "Classic",
    "Fruity",
    "Chocolatey",
    "Nutty",
    "Combo",
    "Wheat",
    "Sourdough",
  ];

  const loafSizeOptions = ["mini", "midi", "regular", "maxi"];

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const isDisabled = uploading || isSaving;

  if (user?.role !== "admin") {
    return (
      <div className="flex items-center justify-center h-96">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="font-body text-muted-foreground">
              You don't have permission to access this page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="font-body text-destructive">
            Error loading products. Please try again.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Products
        </h1>
        <Button
          onClick={openCreate}
          className="bg-foreground text-background hover:opacity-90 font-body text-sm"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="font-body text-muted-foreground">
              No products yet. Add your first product!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {products.map((product) => (
            <Card key={product._id}>
              <CardContent className="flex items-center gap-4 py-3 px-4">
                <div className="w-14 h-14 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                  {product.image?.url ? (
                    <img
                      src={product.image.url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                      No img
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-body font-semibold text-sm truncate">
                    {product.name}
                  </h3>
                  <p className="font-body text-xs text-muted-foreground capitalize">
                    {product.category} • €{product.price?.toFixed(2)} •{" "}
                    {product.loafSize}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEdit(product)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteTarget(product)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Product dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">
              {editing ? "Edit Product" : "New Product"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="font-body text-sm">Name *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="mt-1"
                disabled={isDisabled}
              />
            </div>

            <div>
              <Label className="font-body text-sm">Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={3}
                className="mt-1"
                disabled={isDisabled}
              />
            </div>

            <div>
              <Label className="font-body text-sm">Price (€) *</Label>
              <Input
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
                className="mt-1"
                disabled={isDisabled}
              />
            </div>

            <div>
              <Label className="font-body text-sm">Category *</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm({ ...form, category: v })}
                disabled={isDisabled}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((cat) => (
                    <SelectItem key={cat} value={cat.toLowerCase()}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="font-body text-sm">Loaf Size</Label>
              <Select
                value={form.loafSize}
                onValueChange={(v) => setForm({ ...form, loafSize: v })}
                disabled={isDisabled}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {loafSizeOptions.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size.charAt(0).toUpperCase() + size.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="font-body text-sm">Ingredients</Label>
              <Textarea
                value={form.ingredients}
                onChange={(e) =>
                  setForm({ ...form, ingredients: e.target.value })
                }
                rows={2}
                className="mt-1"
                placeholder="Separate ingredients with commas"
                disabled={isDisabled}
              />
            </div>

            <div>
              <Label className="font-body text-sm">
                Product Image {!editing && "*"}
              </Label>
              <div className="mt-1">
                {form.imagePreview ? (
                  <div className="relative inline-block">
                    <img
                      src={form.imagePreview}
                      alt="Preview"
                      className="w-24 h-24 rounded-lg object-cover border border-border"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 p-1 bg-destructive text-white rounded-full hover:bg-destructive/90 transition-colors"
                      disabled={isDisabled}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label
                    className={`flex items-center gap-2 px-4 py-2 border border-border rounded-lg cursor-pointer hover:bg-muted transition-colors font-body text-sm ${
                      uploading || isDisabled
                        ? "opacity-60 pointer-events-none"
                        : ""
                    }`}
                  >
                    {uploading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    {uploading ? "Processing..." : "Choose Image"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={uploading || isDisabled}
                    />
                  </label>
                )}
              </div>
              {!form.imagePreview && !editing && (
                <p className="font-body text-xs text-destructive mt-1">
                  Image is required for new products
                </p>
              )}
              {editing && !form.imagePreview && (
                <p className="font-body text-xs text-muted-foreground mt-1">
                  Current image will be kept. Choose a new image to replace it.
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-foreground text-background hover:opacity-90 font-body font-semibold"
              disabled={isDisabled}
            >
              {(isSaving || uploading) && (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              )}
              {uploading
                ? "Processing Image..."
                : isSaving
                  ? "Saving..."
                  : editing
                    ? "Update Product"
                    : "Create Product"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-heading flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Delete Product
            </DialogTitle>
          </DialogHeader>
          <p className="font-body text-sm text-muted-foreground">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              {deleteTarget?.name}
            </span>
            ? This action cannot be undone.
          </p>
          <DialogFooter className="flex gap-2 mt-2">
            <Button
              variant="outline"
              className="flex-1 font-body"
              onClick={() => setDeleteTarget(null)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-destructive text-white hover:bg-destructive/90 font-body"
              onClick={() => deleteMutation.mutate(deleteTarget._id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
