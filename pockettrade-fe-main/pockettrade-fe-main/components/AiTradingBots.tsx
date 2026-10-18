"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bot,
  Zap,
  Clock,
  Calendar,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Cpu,
} from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/store/useSession";
import { useDemoMode } from "@/store/useDemoMode";
import { callApi } from "@/lib/helpers";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";

const BOTS = [
  {
    id: "daily-bot",
    name: "Neural Daily",
    description: "High-frequency algorithmic execution optimized for intra-day volatility capture.",
    duration: "9 Days",
    durationDays: 9,
    amount: 3500.0,
    roi: "15-20%",
    icon: Zap,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
  },
  {
    id: "weekly-bot",
    name: "Momentum Weekly",
    description: "Swing trading neural network designed for medium-term market trend exploitation.",
    duration: "3 Weeks",
    durationDays: 21,
    amount: 8500.0,
    roi: "35-45%",
    icon: Cpu,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  {
    id: "monthly-bot",
    name: "Institutional Monthly",
    description: "Long-term position management using institutional-grade liquidity flow analysis.",
    duration: "2 Months",
    durationDays: 60,
    amount: 20000.0,
    roi: "80-100%",
    icon: ShieldCheck,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
  },
];

export default function AiTradingBots() {
  const { user } = useSession((state) => state);
  const { isDemoMode } = useDemoMode();
  const [loading, setLoading] = useState<string | null>(null);
  const [confirmBot, setConfirmBot] = useState<(typeof BOTS)[number] | null>(
    null,
  );
  const router = useRouter();
  const queryClient = useQueryClient();

  const displayBalance = user?.[0]?.wallet?.balance ?? 0;

  const handlePurchase = async (bot: (typeof BOTS)[number]) => {
    setConfirmBot(null);
    setLoading(bot.id);

    try {
      const { error } = await callApi("/trading/bot/purchase", {
        botId: bot.id,
        name: bot.name,
        amount: bot.amount,
        roi: bot.roi,
        duration_days: bot.durationDays,
      });

      if (error) {
        toast.error("Deployment Failed", { description: error.message || "Failed to initialize bot." });
      } else {
        toast.success("Bot Deployed Successfully", { 
           description: `${bot.name} is now active and monitoring the markets.`,
           duration: 5000 
        });
        void queryClient.invalidateQueries();
        router.push("/dashboard/investments");
      }
    } catch (err) {
      toast.error("Error", { description: "An unexpected system error occurred." });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-12 pb-20 mt-16 lg:mt-0 relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 relative z-10">
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="h-10 w-1 bg-emerald-500 rounded-full"></div>
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">Neural Networks</p>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-6xl font-black tracking-tighter text-white uppercase leading-none"
          >
            AI Trading <span className="text-emerald-400">Bots</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 max-w-xl font-medium text-lg leading-relaxed"
          >
            Deploy advanced autonomous agents to manage your portfolio 24/7. High-precision execution with sub-millisecond market response.
          </motion.p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-slate-900/40 border border-white/5 backdrop-blur-3xl rounded-[2.5rem] p-10 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10 overflow-hidden group"
      >
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full group-hover:bg-emerald-500/10 transition-all"></div>
        <div className="relative z-10">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">
            Available Capital
          </p>
          <p className="text-5xl font-black text-white tracking-tighter">
            ${displayBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
        <Button
          asChild
          className="h-16 px-10 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black uppercase tracking-widest rounded-2xl transition-all relative z-10"
        >
          <Link href="/dashboard/add-funds">Top up Balance</Link>
        </Button>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-3 relative z-10">
        {BOTS.map((bot, idx) => (
          <motion.div
            key={bot.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (idx + 4) }}
          >
            <Card
              className="relative overflow-hidden bg-slate-900/50 border-white/5 backdrop-blur-xl rounded-[2rem] hover:border-emerald-500/30 transition-all duration-500 group"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <bot.icon className="h-32 w-32 text-emerald-400" />
              </div>

              <CardHeader className="p-8 space-y-6">
                <div
                  className={`h-16 w-16 rounded-2xl ${bot.bgColor} flex items-center justify-center ${bot.color} shadow-lg shadow-black/20`}
                >
                  <bot.icon className="h-8 w-8" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-black text-white tracking-tight uppercase">{bot.name}</CardTitle>
                  <CardDescription className="mt-3 text-slate-400 font-medium leading-relaxed">
                    {bot.description}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="p-8 pt-0 space-y-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl group-hover:bg-white/[0.04] transition-colors">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">
                      Cycle
                    </p>
                    <p className="text-sm font-black text-white">
                      {bot.duration}
                    </p>
                  </div>
                  <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl group-hover:bg-white/[0.04] transition-colors">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">
                      Price
                    </p>
                    <p className="text-sm font-black text-white">
                      ${bot.amount.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                      ROI Target: {bot.roi}
                    </span>
                  </div>
                  <Badge
                    className="bg-emerald-500/20 text-emerald-400 border-transparent font-black text-[9px] uppercase px-3 py-1"
                  >
                    DEPLOY READY
                  </Badge>
                </div>

                <ul className="space-y-4">
                  {[
                    "Autonomous Execution",
                    "Advanced Risk Matrix",
                    "Real-time Monitoring",
                  ].map((feat) => (
                    <li
                      key={feat}
                      className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      {feat}
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => setConfirmBot(bot)}
                  disabled={loading === bot.id}
                  className="w-full h-16 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-emerald-500/10 transition-all active:scale-[0.98]"
                >
                  {loading === bot.id ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin"></div>
                      Deploying...
                    </span>
                  ) : (
                    "Deploy Bot Agent"
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Confirmation Dialog */}
      <Dialog
        open={!!confirmBot}
        onOpenChange={(open) => !open && setConfirmBot(null)}
      >
        <DialogContent className="sm:max-w-md bg-slate-900 border-white/5 rounded-[2rem] p-8 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl font-black text-white uppercase tracking-tighter">
              <AlertTriangle className="h-6 w-6 text-amber-500" />
              Confirm <span className="text-emerald-400">Deployment</span>
            </DialogTitle>
            <DialogDescription className="pt-4 text-slate-400 font-medium leading-relaxed">
              You are about to deploy the <span className="text-white font-black">{confirmBot?.name}</span> agent. 
              The deployment cost of <span className="text-white font-black">${confirmBot?.amount.toLocaleString()}</span> will be debited from your primary wallet.
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-slate-950 border border-white/5 rounded-2xl p-6 space-y-4 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Duration</span>
              <span className="text-sm font-black text-white uppercase">{confirmBot?.duration}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Expected Yield</span>
              <span className="text-sm font-black text-emerald-400">{confirmBot?.roi}</span>
            </div>
            <div className="h-px bg-white/5" />
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Debit</span>
              <span className="text-lg font-black text-white">${confirmBot?.amount.toLocaleString()}</span>
            </div>
          </div>

          <DialogFooter className="mt-8 flex gap-3">
            <Button
              variant="outline"
              onClick={() => setConfirmBot(null)}
              className="flex-1 h-14 bg-white/5 border-white/10 hover:bg-white/10 text-white font-black uppercase tracking-widest rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={() => confirmBot && handlePurchase(confirmBot)}
              className="flex-1 h-14 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-500/10"
            >
              Confirm & Deploy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
