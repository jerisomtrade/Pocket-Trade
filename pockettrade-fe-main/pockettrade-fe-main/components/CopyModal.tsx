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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Wallet,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { callApi } from "@/lib/helpers";
import { useSession } from "@/store/useSession";
import { useDemoMode } from "@/store/useDemoMode";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiResponse,  } from "@/interfaces";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface Trader {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  commissionRate: number;
  minCopyAmount: number;
  riskLevel: string;
}

interface CopyModalProps {
  trader: Trader;
  isOpen: boolean;
  onClose: () => void;
}

export default function CopyModal({ trader, isOpen, onClose }: CopyModalProps) {
  const [amount, setAmount] = useState<string>(trader.minCopyAmount.toString());
  const [maxLoss, setMaxLoss] = useState<string>("20");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSession((state) => state);
  const { isDemoMode } = useDemoMode();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: wallets } = useQuery<any>({
    queryKey: ["sidebar-wallets", isDemoMode],
    queryFn: async () => {
      const { data } = await callApi<ApiResponse<any>>("/wallet/user");
      return data?.data || [];
    },
    enabled: !!user,
  });
  
  const userBalance = wallets?.[0]?.balance ?? 0; 

  const handleCopy = async () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < trader.minCopyAmount) {
      toast.error(`Minimum copy amount is $${trader.minCopyAmount}`);
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await callApi("/copy/subscribe", {
        traderId: trader.id,
        allocatedAmount: numAmount,
        maxLossPercent: parseFloat(maxLoss),
      });

      if (error) throw new Error(error.message);

      toast.success(`Strategy Mirroring Active`, {
        description: `Successfully copying ${trader.displayName} with $${numAmount.toLocaleString()}.`,
        duration: 5000,
      });

      void queryClient.invalidateQueries();
      onClose();
      router.push("/dashboard/investments");
     } catch (err) {
       toast.error("Subscription failed", {
         description: err instanceof Error ? err.message : "Failed to start copying trader.",
       });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-slate-900 border-white/5 p-0 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        {/* Header Visual */}
        <div className="relative p-8 bg-emerald-500/10 overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full"></div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.1, scale: 1 }}
            className="absolute top-0 right-0 p-8"
          >
            <TrendingUp size={120} strokeWidth={3} className="text-emerald-400" />
          </motion.div>

          <DialogHeader className="relative z-10">
            <div className="flex items-center gap-5">
              <div className="relative">
                <Avatar className="h-20 w-20 border-4 border-emerald-500/20 shadow-xl">
                  <AvatarImage
                    src={trader.avatarUrl || ""}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-slate-800 text-emerald-400 font-black text-2xl">
                    {trader.displayName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1.5 shadow-lg">
                  <CheckCircle2 size={14} className="text-slate-950" />
                </div>
              </div>
              <div className="text-left">
                <DialogTitle className="text-2xl font-black text-white tracking-tighter uppercase">
                  Copy <span className="text-emerald-400">Strategy</span>
                </DialogTitle>
                <DialogDescription className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">
                  Mirroring Expert: {trader.displayName}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="p-8 space-y-8">
          <div className="space-y-6">
            {/* Amount Input */}
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <Label htmlFor="amount">Investment Amount</Label>
                <span className="text-[10px] font-black text-slate-500 uppercase">USD</span>
              </div>
              <div className="relative group">
                <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                <Input
                  id="amount"
                  type="number"
                  placeholder={`Min. $${trader.minCopyAmount}`}
                  className="pl-12 h-14 bg-slate-950 border-white/5 focus:border-emerald-500/50 text-xl font-black text-white rounded-2xl transition-all"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="flex justify-between items-center px-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Available: <span className="text-white">${userBalance.toLocaleString()}</span>
                </p>
                <button
                  onClick={() => setAmount(userBalance.toString())}
                  className="text-[10px] font-black text-emerald-400 hover:text-emerald-300 uppercase tracking-widest transition-colors"
                >
                  Max Amount
                </button>
              </div>
            </div>

            {/* Stop Loss Input */}
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <Label htmlFor="maxLoss">Stop-Loss Protection</Label>
                <span className="text-[10px] font-black text-slate-500 uppercase">Percent %</span>
              </div>
              <div className="relative group">
                <ShieldAlert className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-red-400 transition-colors" />
                <Input
                  id="maxLoss"
                  type="number"
                  placeholder="20"
                  className="pl-12 h-14 bg-slate-950 border-white/5 focus:border-red-500/50 text-xl font-black text-white rounded-2xl transition-all"
                  value={maxLoss}
                  onChange={(e) => setMaxLoss(e.target.value)}
                />
              </div>
              <p className="text-[10px] font-medium text-slate-500 italic px-1">
                Strategy will automatically disconnect if drawdown exceeds this limit.
              </p>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 gap-4">
             <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Profit Share</p>
                <p className="text-lg font-black text-white">{trader.commissionRate}%</p>
             </div>
             <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Execution</p>
                <p className="text-lg font-black text-emerald-400">INSTANT</p>
             </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
            <Lock size={16} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[10px] font-medium text-amber-500/80 leading-relaxed uppercase tracking-wider">
              Your funds remain in your wallet. Performance metrics are calculated in real-time. Capital is at risk.
            </p>
          </div>

          <Button
            onClick={handleCopy}
            disabled={isLoading}
            className="w-full h-16 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base uppercase tracking-[0.2em] rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin"></div>
                Initializing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Confirm Copy Strategy
                <ArrowRight className="w-5 h-5" />
              </span>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
