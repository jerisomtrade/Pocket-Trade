"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Award,
  CheckCircle2,
  Rocket,
  Target,
  Percent,
  Coins,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { callApi } from "@/lib/helpers";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";

interface TraderRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TraderRegistrationModal({
  isOpen,
  onClose,
}: TraderRegistrationModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    riskLevel: "medium",
    assetFocus: "both",
    commissionRate: "10",
    minCopyAmount: "500",
  });

  const queryClient = useQueryClient();

  const handleRegister = async () => {
    if (!formData.displayName || !formData.bio) {
      toast.error("Required Fields Missing", { description: "Please fill in your display name and bio." });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await callApi("/traders/register", {
        ...formData,
        commissionRate: parseFloat(formData.commissionRate),
        minCopyAmount: parseFloat(formData.minCopyAmount),
      });

      if (error) throw new Error(error.message);

      toast.success("Registration Successful!", {
        description: "You are now a registered trader. Start opening trades to build your track record.",
      });

      void queryClient.invalidateQueries();
      onClose();
    } catch (err) {
      toast.error("Registration failed", {
        description: err instanceof Error ? err.message : "Something went wrong during registration.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-slate-900 border-white/5 p-0 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="relative p-8 bg-emerald-500/10 border-b border-white/5 overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full"></div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.1, scale: 1 }}
            className="absolute top-0 right-0 p-8"
          >
            <Award size={120} strokeWidth={3} className="text-emerald-400" />
          </motion.div>

          <DialogHeader className="relative z-10">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20">
                <Rocket className="w-7 h-7" />
              </div>
              <div className="text-left">
                <DialogTitle className="text-2xl font-black text-white tracking-tighter uppercase">
                  Join the <span className="text-emerald-400">Elite</span>
                </DialogTitle>
                <DialogDescription className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">
                  Professional Trader Certification Program
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="grid gap-6">
            <div className="space-y-3">
              <Label htmlFor="displayName">Public Profile Name</Label>
              <Input
                id="displayName"
                placeholder="Elite Trader Alpha"
                className="h-12 bg-slate-950 border-white/5 focus:border-emerald-500/50 text-white font-bold rounded-xl"
                value={formData.displayName}
                onChange={(e) =>
                  setFormData({ ...formData, displayName: e.target.value })
                }
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="bio">Trading Bio & Philosophy</Label>
              <Textarea
                id="bio"
                placeholder="Describe your strategy, risk management, and experience..."
                className="bg-slate-950 border-white/5 focus:border-emerald-500/50 text-white font-medium rounded-xl min-h-[100px]"
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label>Risk Level</Label>
                <Select
                  value={formData.riskLevel}
                  onValueChange={(val) =>
                    setFormData({ ...formData, riskLevel: val || "" })
                  }
                >
                  <SelectTrigger className="h-12 bg-slate-950 border-white/5 focus:border-emerald-500/50 text-white font-bold rounded-xl">
                    <SelectValue placeholder="Select risk" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/5 text-white">
                    <SelectItem value="low">Low Risk</SelectItem>
                    <SelectItem value="medium">Medium Risk</SelectItem>
                    <SelectItem value="high">High Risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label>Asset Focus</Label>
                <Select
                  value={formData.assetFocus}
                  onValueChange={(val) =>
                    setFormData({ ...formData, assetFocus: val || "" })
                  }
                >
                  <SelectTrigger className="h-12 bg-slate-950 border-white/5 focus:border-emerald-500/50 text-white font-bold rounded-xl">
                    <SelectValue placeholder="Select focus" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/5 text-white">
                    <SelectItem value="stocks">Stocks Only</SelectItem>
                    <SelectItem value="crypto">Crypto Only</SelectItem>
                    <SelectItem value="both">Both Markets</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label>Commission (%)</Label>
                <div className="relative group">
                  <Percent className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                  <Input
                    type="number"
                    className="h-12 bg-slate-950 border-white/5 focus:border-emerald-500/50 pl-10 font-bold text-white rounded-xl"
                    value={formData.commissionRate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        commissionRate: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label>Min. Copy ($)</Label>
                <div className="relative group">
                  <Coins className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                  <Input
                    type="number"
                    className="h-12 bg-slate-950 border-white/5 focus:border-emerald-500/50 pl-10 font-bold text-white rounded-xl"
                    value={formData.minCopyAmount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minCopyAmount: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
              <ShieldCheck size={18} className="text-emerald-400 shrink-0" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                Profile Verification will be required for public visibility.
              </p>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                Earnings from commissions are credited to your wallet instantly.
              </p>
            </div>
          </div>

          <Button
            onClick={handleRegister}
            disabled={isLoading}
            className="w-full h-16 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base uppercase tracking-[0.2em] rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin"></div>
                Finalizing Profile...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Launch Trader Profile
                <Target className="w-5 h-5" />
              </span>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
