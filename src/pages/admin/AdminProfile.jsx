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
import {
  Loader2,
  User,
  Eye,
  EyeOff,
  LogOut,
  CheckCircle,
  XCircle,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../lib/AuthContext";
import { useNavigate } from "react-router-dom";
import { getBankDetails, saveBankDetails } from "../../lib/bankDetails";
import { API_URL } from "../../lib/api";
import { useQuery } from "@tanstack/react-query";

export default function AdminProfile() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirm_password: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(null);
  
  const [date, setDate] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const { logout, user: authUser } = useAuth();
  const navigate = useNavigate();

  const user = authUser;

  useEffect(() => {
    const token = localStorage.getItem("auth_token");

    fetch(`${API_URL}/date`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.data.deliveryDate) {
          const formatted = new Date(data.data.deliveryDate)
            .toISOString()
            .split("T")[0];
          setDate(formatted);
          localStorage.setItem("shippingDate", formatted);
        }
      })
      .catch((err) => console.error("Failed to fetch delivery date:", err));
  }, []);

  const handleLogout = async () => {
    await logout(true);
    navigate("/auth");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setUpdateStatus(null);

    if (!form.currentPassword) {
      toast.error("Please enter your current password");
      return;
    }
    if (!form.newPassword) {
      toast.error("Please enter a new password");
      return;
    }
    if (form.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (form.newPassword !== form.confirm_password) {
      toast.error("New passwords do not match");
      return;
    }
    if (form.currentPassword === form.newPassword) {
      toast.error("New password must be different from current password");
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem("auth_token");

      const response = await fetch(`${API_URL}/auth/update-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        setUpdateStatus("error");
        toast.error("Session expired. Please login again.");
        setTimeout(() => {
          logout(true);
          navigate("/auth");
        }, 1500);
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to update password");
      }

      if (data.message === "Password changed successfully") {
        setUpdateStatus("success");
        toast.success(data.message || "Password updated successfully!");
        setForm({ currentPassword: "", newPassword: "", confirm_password: "" });
        setTimeout(() => setUpdateStatus(null), 5000);
      } else {
        throw new Error(data.message || "Failed to update password");
      }
    } catch (error) {
      console.error("Password update error:", error);
      setUpdateStatus("error");
      toast.error(error.message || "Failed to update password. Please check your current password.");
      setTimeout(() => setUpdateStatus(null), 5000);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatDeliveryDate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("auth_token");

      const response = await fetch(`${API_URL}/date`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ deliveryDate: date }),
      });

      const data = await response.json();

      if (response.status === 401) {
        toast.error("Session expired. Please login again.");
        setTimeout(() => {
          logout(true);
          navigate("/auth");
        }, 1500);
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to update date");
      }

      if (data.success) {
        localStorage.setItem("shippingDate", date);
        toast.success(data.message || "Delivery date updated successfully!");
      } else {
        throw new Error(data.message || "Failed to update delivery date");
      }
    } catch (error) {
      console.error("Delivery date update error:", error);
      toast.error(error.message || "Failed to update delivery date.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }


  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Profile
        </h1>
        <Button
          onClick={handleLogout}
          variant="outline"
          className="font-body text-sm border-destructive text-destructive hover:bg-destructive hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      {updateStatus === "success" && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 animate-in slide-in-from-top-2">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <div>
            <p className="text-green-800 font-body font-semibold text-sm">
              ✓ Password Changed Successfully!
            </p>
            <p className="text-green-700 font-body text-xs mt-1">
              Your password has been updated. Please use your new password next
              time you log in.
            </p>
          </div>
        </div>
      )}

      {updateStatus === "error" && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 animate-in slide-in-from-top-2">
          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div>
            <p className="text-red-800 font-body font-semibold text-sm">
              ✗ Password Update Failed
            </p>
            <p className="text-red-700 font-body text-xs mt-1">
              Please check your current password and try again.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4 pb-4">
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
              <User className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <CardTitle className="font-heading text-lg">
                {user?.name || "Admin User"}
              </CardTitle>
              <p className="font-body text-xs text-muted-foreground capitalize">
                {user?.role || "admin"} • {user?.email || "admin@example.com"}
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <Label className="font-body text-sm">Current Password *</Label>
                <div className="relative mt-1">
                  <Input
                    type={showCurrentPassword ? "text" : "password"}
                    value={form.currentPassword}
                    onChange={(e) =>
                      setForm({ ...form, currentPassword: e.target.value })
                    }
                    placeholder="Enter current password"
                    required
                    disabled={saving}
                    className={
                      updateStatus === "error"
                        ? "border-red-500 focus:ring-red-500"
                        : ""
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <Label className="font-body text-sm">New Password *</Label>
                <div className="relative mt-1">
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    value={form.newPassword}
                    onChange={(e) =>
                      setForm({ ...form, newPassword: e.target.value })
                    }
                    placeholder="Enter new password (min 8 characters)"
                    required
                    disabled={saving}
                    className={
                      updateStatus === "success"
                        ? "border-green-500 focus:ring-green-500"
                        : ""
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {form.newPassword && form.newPassword.length < 6 && (
                  <p className="text-xs text-destructive mt-1 animate-in slide-in-from-left-1">
                    Password must be at least 6 characters
                  </p>
                )}
              </div>

              <div>
                <Label className="font-body text-sm">
                  Confirm New Password *
                </Label>
                <div className="relative mt-1">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={form.confirm_password}
                    onChange={(e) =>
                      setForm({ ...form, confirm_password: e.target.value })
                    }
                    placeholder="Confirm new password"
                    className="mt-1"
                    required
                    disabled={saving}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {form.confirm_password &&
                  form.newPassword !== form.confirm_password && (
                    <p className="text-xs text-destructive mt-1 animate-in slide-in-from-left-1">
                      Passwords do not match
                    </p>
                  )}
              </div>

              <Button
                type="submit"
                disabled={saving}
                className={`w-full font-body font-semibold transition-all duration-200 ${
                  updateStatus === "success"
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : updateStatus === "error"
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-foreground text-background hover:opacity-90"
                }`}
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {saving
                  ? "Updating Password..."
                  : updateStatus === "success"
                    ? "✓ Password Updated!"
                    : updateStatus === "error"
                      ? "✗ Failed - Try Again"
                      : "Update Password"}
              </Button>

              {updateStatus === "success" && (
                <p className="text-center text-green-600 text-xs font-body mt-2 animate-in fade-in">
                  Your password has been successfully changed
                </p>
              )}
              {updateStatus === "error" && (
                <p className="text-center text-red-600 text-xs font-body mt-2 animate-in fade-in">
                  Please verify your current password and try again
                </p>
              )}
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-4 pb-4">
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
              <Calendar className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <CardTitle className="font-heading text-lg">
                Delivery Date
              </CardTitle>
              <p className="font-body text-xs text-muted-foreground">
                Show Customers the next date for delivery
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdatDeliveryDate} className="space-y-4">
             
              <div>
                <Label className="font-body text-sm">
                  Next Delivery Date *
                </Label>
                <Input
                  required
                  type="date"
                  value={date}
                  min={today}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 outline-none"
                />
              </div>
              <Button
                type="submit"
            
                className="w-full bg-foreground text-background hover:opacity-90 font-body font-semibold"
              >
               
                Save Next Delivery Date
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}