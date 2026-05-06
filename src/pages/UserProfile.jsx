import React, { useState, useEffect } from "react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Loader2, User, LogOut, Pencil, Check, X } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "../lib/AuthContext";

export default function UserProfile() {
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const { logout } = useAuth();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleSaveName = async () => {
    setSaving(true);

    setUser((prev) => ({ ...prev, full_name: name }));
    setEditingName(false);
    toast.success("Name updated");
    setSaving(false);
  };

  const handleSignOut = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <div className="py-12 px-4 min-h-screen">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-heading text-3xl font-black text-foreground">
            Profile
          </h1>
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="font-body text-sm gap-2 rounded-full border-destructive text-destructive hover:bg-destructive hover:text-white"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6 space-y-5">
            {/* Avatar */}
            <div className="flex items-center gap-4 pb-4 border-b border-border">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <User className="w-7 h-7 text-muted-foreground" />
              </div>
              <div>
                <p className="font-body font-semibold text-foreground">
                  {user?.name || "No name set"}
                </p>
                <p className="font-body text-xs text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </div>

            {/* Name field */}
            <div>
              <Label className="font-body text-xs text-muted-foreground uppercase tracking-wide">
                Name
              </Label>
              {editingName ? (
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-1"
                    autoFocus
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleSaveName}
                    disabled={saving}
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4 text-green-600" />
                    )}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setEditingName(false);
                      setName(user?.full_name || "");
                    }}
                  >
                    <X className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between mt-1">
                  <p className="font-body text-sm text-foreground">
                    {user?.name || (
                      <span className="text-muted-foreground italic">
                        Not set
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <Label className="font-body text-xs text-muted-foreground uppercase tracking-wide">
                Email
              </Label>
              <p className="font-body text-sm text-foreground mt-1">
                {user?.email}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
