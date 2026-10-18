"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ApiResponse } from "@/interfaces";
import { useInitSession } from "@/store/useSession";
import { callApi } from "@/lib/helpers";
import { LogOut, Trash2, AlertCircle, ShieldCheck } from "lucide-react";
import { useDemoMode } from "@/store/useDemoMode";
import { motion } from "framer-motion";
import { useState } from "react";

// Shadcn UI Imports
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DashboardSettings() {
  const router = useRouter();
  const actions = useInitSession((state) => state.actions);
  const { isDemoMode } = useDemoMode();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDeleteAccount = async () => {
    if (isDemoMode) {
      toast.error("Action not allowed", { description: "You cannot delete your account while in demo mode." });
      return;
    }
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 5000);
      return;
    }

    try {
      const { error } = await callApi<ApiResponse>("/user/delete-account");
      if (error) {
        toast.error("Account deletion failed", { description: error.message || "Something went wrong." });
      } else {
        actions.clearSession();
        toast.success("Account Deleted", { description: "Your account has been permanently deleted." });
        router.push("/");
      }
    } catch (err) {
      toast.error("Account deletion failed", { description: err instanceof Error ? err.message : "An unexpected error occurred." });
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await callApi<ApiResponse>("/auth/sign-out");
      if (error) {
        toast.error("Logout Failed", { description: error.message || "Something went wrong." });
      } else {
        actions.clearSession();
        toast.success("Signed Out", { description: "You have been signed out from all sessions." });
      }
    } catch (err) {
      toast.error("Logout Failed", { description: err instanceof Error ? err.message : "An unexpected error occurred." });
    }
  };

  return (
    <div className="flex flex-col gap-y-8 max-w-2xl mx-auto pb-20 mt-16 lg:mt-0">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="bg-slate-900/50 border-white/5 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full -mr-20 -mt-20 pointer-events-none"></div>
          <CardHeader className="p-8 relative z-10">
            <CardTitle className="text-3xl font-black text-white tracking-tighter uppercase mb-2">
              Account <span className="text-emerald-400">Settings</span>
            </CardTitle>
            <CardDescription className="text-sm font-medium text-slate-400">Manage your account security and preferences.</CardDescription>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Account Status */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="bg-slate-900/50 border-white/5 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-sm font-black text-white uppercase tracking-widest">Account Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-5 bg-slate-950 border border-white/10 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="font-black text-white text-sm">Account Active</p>
                  <p className="text-xs font-medium text-slate-400">Your account is in good standing</p>
                </div>
              </div>
              <Badge variant="outline" className="text-[10px] font-black text-emerald-400 border-emerald-500/20 bg-emerald-500/10 px-3 py-1 uppercase tracking-widest gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Sign Out */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="bg-slate-900/50 border-white/5 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-sm font-black text-white uppercase tracking-widest">Session Management</CardTitle>
            <CardDescription className="text-slate-400">Sign out from all devices and active sessions.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full h-12 bg-white/5 border-white/10 hover:bg-white/10 text-white font-black text-xs uppercase tracking-widest"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out of All Devices
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Danger Zone */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="bg-slate-900/50 border-red-500/20 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                <AlertCircle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <CardTitle className="text-sm font-black text-red-400 uppercase tracking-widest mb-1">Danger Zone</CardTitle>
                <CardDescription className="text-slate-400 font-medium">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-y-4">
            {confirmDelete && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-sm text-red-300 font-bold">
                ⚠️ Click again within 5 seconds to permanently confirm deletion.
              </div>
            )}

            <Button
              onClick={handleDeleteAccount}
              className={`w-full h-12 font-black text-xs uppercase tracking-widest transition-all ${
                confirmDelete
                  ? "bg-red-500 hover:bg-red-400 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                  : "bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20"
              }`}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {confirmDelete ? "Confirm — Delete Permanently" : "Delete Account"}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
