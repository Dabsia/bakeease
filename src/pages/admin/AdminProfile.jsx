import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { Loader2, User, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function AdminProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // TODO: Replace with your own user fetching logic
    const fetchUser = async () => {
      try {
        // Replace this with your actual API call
        // Example: const user = await yourAuth.getCurrentUser();
        // setUser(user);
        // setForm({
        //   full_name: user.full_name || "",
        //   email: user.email || "",
        //   password: "",
        //   confirm_password: "",
        // });

        // For now, just set loading to false
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.password) {
      toast.error("Password is required to save changes.");
      return;
    }
    if (form.password !== form.confirm_password) {
      toast.error("Passwords do not match.");
      return;
    }
    setSaving(true);

    // TODO: Replace with your own user update logic
    // Example: await yourAuth.updateUser({ full_name: form.full_name });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Profile updated");
    setForm((prev) => ({ ...prev, password: "", confirm_password: "" }));
    setSaving(false);
  };

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-foreground mb-6">
        Profile
      </h1>
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : (
        <div className="max-w-md">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4 pb-4">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                <User className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <CardTitle className="font-heading text-lg">
                  {user?.full_name || "Admin"}
                </CardTitle>
                <p className="font-body text-xs text-muted-foreground capitalize">
                  {user?.role || "admin"}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <Label className="font-body text-sm">Full Name</Label>
                  <Input
                    value={form.full_name}
                    onChange={(e) =>
                      setForm({ ...form, full_name: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="font-body text-sm">Email</Label>
                  <Input
                    value={form.email}
                    disabled
                    className="mt-1 bg-muted"
                  />
                  <p className="font-body text-xs text-muted-foreground mt-1">
                    Email cannot be changed.
                  </p>
                </div>
                <div>
                  <Label className="font-body text-sm">Password *</Label>
                  <div className="relative mt-1">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                      placeholder="Enter password to confirm changes"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <Label className="font-body text-sm">
                    Confirm Password *
                  </Label>
                  <Input
                    type="password"
                    value={form.confirm_password}
                    onChange={(e) =>
                      setForm({ ...form, confirm_password: e.target.value })
                    }
                    placeholder="Repeat password"
                    className="mt-1"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-foreground text-background hover:opacity-90 font-body font-semibold"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
