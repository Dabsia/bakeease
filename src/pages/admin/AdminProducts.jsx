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
} from "lucide-react";
import { toast } from "sonner";

const emptyProduct = {
  name: "",
  description: "",
  price: "",
  original_price: "",
  category: "classic",
  image_url: "",
  featured: false,
  loafSize: "mini",
  in_stock: true,
  ingredients: "",
  combo_items: [],
};

export default function AdminProducts() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // TODO: Replace with your own products fetching logic
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      // Replace this with your actual API call
      // Example: return await yourApi.getProducts({ sort: "-created_date", limit: 100 });

      // For now, return empty array
      return [];
    },
  });

  // TODO: Replace with your own product creation logic
  const createMutation = useMutation({
    mutationFn: async (data) => {
      // Replace this with your actual API call
      // Example: return await yourApi.createProduct(data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setDialogOpen(false);
      toast.success("Product created");
    },
  });

  // TODO: Replace with your own product update logic
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      // Replace this with your actual API call
      // Example: return await yourApi.updateProduct(id, data);
      return { id, ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setDialogOpen(false);
      toast.success("Product updated");
    },
  });

  // TODO: Replace with your own product deletion logic
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      // Replace this with your actual API call
      // Example: return await yourApi.deleteProduct(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setDeleteTarget(null);
      toast.success("Product deleted");
    },
  });

  const openCreate = () => {
    setEditing(null);
    setForm(emptyProduct);
    setDialogOpen(true);
  };

  const openEdit = (product) => {
    setEditing(product);
    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      original_price: product.original_price || "",
      category: product.category || "classic",
      loafSize: product.loafSize || "mini",
      image_url: product.image_url || "",
      featured: product.featured || false,
      in_stock: product.in_stock !== false,
      ingredients: product.ingredients || "",
      combo_items: product.combo_items || [],
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.image_url) {
      toast.error("Please upload an image before saving.");
      return;
    }
    const data = {
      ...form,
      price: parseFloat(form.price) || 0,
      original_price: form.original_price
        ? parseFloat(form.original_price)
        : undefined,
    };
    if (editing) {
      updateMutation.mutate({ id: editing.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  // TODO: Replace with your own image upload logic
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    // Replace this with your actual image upload API call
    // Example: const { file_url } = await yourApi.uploadImage(file);
    // setForm((prev) => ({ ...prev, image_url: file_url }));

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setUploading(false);
    toast.error(
      "Image upload not implemented. Please implement your own upload logic."
    );
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const isDisabled = uploading || isSaving;

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
            <Card key={product.id}>
              <CardContent className="flex items-center gap-4 py-3 px-4">
                <div className="w-14 h-14 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                      —
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-body font-semibold text-sm truncate">
                    {product.name}
                  </h3>
                  <p className="font-body text-xs text-muted-foreground capitalize">
                    {product.category} • €{product.price?.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {product.featured && (
                    <span className="font-body text-xs bg-primary/20 text-primary-foreground px-2 py-0.5 rounded-full mr-2">
                      Featured
                    </span>
                  )}
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
              />
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label className="font-body text-sm">Price (€) *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label className="font-body text-sm">Category</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm({ ...form, category: v })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="classic">Classic</SelectItem>
                  <SelectItem value="fruity">Fruity</SelectItem>
                  <SelectItem value="chocolatey">Chocolatey</SelectItem>
                  <SelectItem value="nutty">Nutty</SelectItem>
                  <SelectItem value="combo">Combo / Bundle</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="font-body text-sm">Bread Loaf Size</Label>
              <Select
                value={form.loafSize}
                onValueChange={(v) => setForm({ ...form, loafSize: v })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mini">Mini</SelectItem>
                  <SelectItem value="midi">Midi</SelectItem>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="maxi">Maxi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="font-body text-sm">Image *</Label>
              <div className="mt-1 flex items-center gap-3">
                {form.image_url && !uploading && (
                  <img
                    src={form.image_url}
                    alt=""
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}
                <label
                  className={`flex items-center gap-2 px-4 py-2 border border-border rounded-lg cursor-pointer hover:bg-muted transition-colors font-body text-sm ${
                    uploading ? "opacity-60 pointer-events-none" : ""
                  }`}
                >
                  {uploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  {uploading ? "Uploading..." : "Upload Image"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                </label>
              </div>
              {!form.image_url && !uploading && (
                <p className="font-body text-xs text-destructive mt-1">
                  Image is required
                </p>
              )}
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
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-foreground text-background hover:opacity-90 font-body font-semibold"
              disabled={isDisabled}
            >
              {uploading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {isSaving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {uploading
                ? "Waiting for image..."
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
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-destructive text-white hover:bg-destructive/90 font-body"
              onClick={() => deleteMutation.mutate(deleteTarget.id)}
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
