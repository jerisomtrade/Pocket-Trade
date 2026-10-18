"use client";

import React, { useState } from "react";
import { INVESTMENT_PLANS } from "@/components/NewInvestment";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ApiResponse, Investment } from "@/interfaces";
import { callApi } from "@/lib/helpers";
import { useDemoMode } from "@/store/useDemoMode";
import { useQueryClient } from "@tanstack/react-query";
import { Check, TrendingUp, ShieldCheck, Zap, Star, ArrowRight, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function InvestmentPlansPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isDemoMode } = useDemoMode();

  const [selectedPlan, setSelectedPlan] = useState<typeof INVESTMENT_PLANS[0] | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenDialog = (plan: typeof INVESTMENT_PLANS[0]) => {
    setSelectedPlan(plan);
    setInvestmentAmount(plan.min);
  };

  const handleCloseDialog = () => {
    setSelectedPlan(null);
    setInvestmentAmount(0);
  };

  const handleConfirmInvestment = async () => {
    if (!selectedPlan || investmentAmount <= 0) return;

    if (investmentAmount < selectedPlan.min || (selectedPlan.max !== null && investmentAmount > selectedPlan.max)) {
      toast.error("Allocation Boundary Violated", {
         description: `Amount must be between $${selectedPlan.min.toLocaleString()} and ${selectedPlan.max ? `$${selectedPlan.max.toLocaleString()}` : 'unlimited'}.`
      });
      return;
    }

    setIsLoading(true);

    const roiMatch = selectedPlan.roi.match(/(\d+)\s*-\s*(\d+)/);
    const avgRoi = roiMatch 
      ? (parseInt(roiMatch[1]) + parseInt(roiMatch[2])) / 2 
      : parseFloat(selectedPlan.roi) || 0;
    const estimatedReturn = ((investmentAmount * avgRoi) / 100).toFixed(2);

    try {
      const { data: responseData, error } = await callApi<ApiResponse<Investment>>("/investment/create", {
        isRetirement: false,
        plan: selectedPlan.id,
        type: "stocks", // Generic fallback
        symbol: "PLAN", // Generic fallback
        name: selectedPlan.name,
        amount: investmentAmount,
      });

      if (error) throw new Error(error.message);

      if (responseData?.status === "success") {
        toast.success("Capital Deployed Successfully", {
          description: `${selectedPlan.name} strategy active. Est. yield: $${estimatedReturn}`,
        });
        void queryClient.invalidateQueries();
        router.push("/dashboard/investments");
      }
    } catch (err) {
      toast.error("Deployment Failed", {
        description: err instanceof Error ? err.message : "An unexpected system error occurred.",
      });
    } finally {
      setIsLoading(false);
      handleCloseDialog();
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
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">Institutional Grade</p>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-6xl font-black tracking-tighter text-white uppercase leading-none"
          >
            Investment <span className="text-emerald-400">Strategies</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 max-w-xl font-medium text-lg leading-relaxed"
          >
            Select a risk-adjusted strategy managed by our quantitative algorithms. Diversified exposure across global liquid markets.
          </motion.p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        {INVESTMENT_PLANS.map((plan, i) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 + 0.3 }}
          >
            <Card className={cn(
              "group relative overflow-hidden bg-slate-900/50 border-white/5 backdrop-blur-xl rounded-[2.5rem] transition-all duration-500 hover:border-emerald-500/30 flex flex-col h-full",
              plan.isPopular && "border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.05)]"
            )}>
              {plan.isPopular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 px-6 py-1.5 rounded-b-2xl text-[10px] font-black uppercase tracking-widest shadow-xl z-20">
                  Top Performance
                </div>
              )}
              
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                 {i % 2 === 0 ? <Zap size={80} /> : <Star size={80} />}
              </div>

              <CardHeader className="p-10 pb-6 space-y-6 flex-grow">
                <div className="space-y-2">
                   <h3 className="text-2xl font-black text-white uppercase tracking-tight group-hover:text-emerald-400 transition-colors">{plan.name}</h3>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{plan.duration} Cycle</p>
                </div>
                
                <div className="space-y-1">
                   <p className="text-4xl font-black text-white tracking-tighter">{plan.roi}</p>
                   <div className="flex items-center gap-2">
                      <TrendingUp size={14} className="text-emerald-500" />
                      <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Projected Yield</span>
                   </div>
                </div>

                <p className="text-slate-400 text-sm font-medium leading-relaxed">{plan.description}</p>
                
                <div className="h-px bg-white/5 w-full my-6" />

                <ul className="space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardHeader>

              <CardContent className="p-10 pt-0">
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 mb-8 flex justify-between items-center group-hover:bg-white/[0.04] transition-colors">
                   <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Entry Limit</span>
                   <span className="text-xs font-black text-white tracking-tight">
                     ${plan.min.toLocaleString()} — {plan.max ? `$${plan.max.toLocaleString()}` : "Unlimited"}
                   </span>
                </div>
                <Button 
                  onClick={() => handleOpenDialog(plan)}
                  className="w-full h-16 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-emerald-500/10 transition-all active:scale-[0.98]"
                >
                  Deploy Capital
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog open={!!selectedPlan} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="sm:max-w-md bg-slate-900 border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl font-black text-white uppercase tracking-tighter">
              Invest in <span className="text-emerald-400">{selectedPlan?.name}</span>
            </DialogTitle>
            <DialogDescription className="pt-4 text-slate-400 font-medium leading-relaxed">
              Define your capital allocation for this strategy. All trades are executed via our proprietary institutional liquidity pool.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-8 space-y-6">
            <div className="space-y-3">
               <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">
                 Allocation Amount (USD)
               </label>
               <div className="relative group">
                 <span className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-400 font-black text-xl">$</span>
                 <Input
                   type="number"
                   placeholder="0.00"
                   className="h-16 pl-10 bg-slate-950 border-white/10 focus:border-emerald-500/50 text-white text-2xl font-black rounded-2xl transition-all"
                   value={investmentAmount || ""}
                   onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                 />
               </div>
               {selectedPlan && (
                 <div className="flex justify-between items-center px-2">
                   <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
                     Min: ${selectedPlan.min.toLocaleString()} 
                   </p>
                   <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
                     Max: {selectedPlan.max ? `$${selectedPlan.max.toLocaleString()}` : "Unlimited"}
                   </p>
                 </div>
               )}
            </div>

            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-6 flex justify-between items-center">
               <div>
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Target Yield</p>
                  <p className="text-xl font-black text-white">{selectedPlan?.roi}</p>
               </div>
               <div className="text-right">
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Duration</p>
                  <p className="text-xl font-black text-white uppercase">{selectedPlan?.duration}</p>
               </div>
            </div>
          </div>

          <DialogFooter className="gap-4">
            <Button
              variant="outline"
              onClick={handleCloseDialog}
              className="flex-1 h-14 bg-white/5 border-white/10 hover:bg-white/10 text-white font-black uppercase tracking-widest rounded-xl"
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 h-14 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-500/10" 
              onClick={handleConfirmInvestment}
              disabled={
                isLoading || 
                !selectedPlan || 
                !investmentAmount || 
                investmentAmount < selectedPlan.min || 
                (selectedPlan.max !== null && investmentAmount > selectedPlan.max)
              }
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin"></div>
                  Deploying...
                </span>
              ) : `Confirm $${investmentAmount?.toLocaleString()}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
