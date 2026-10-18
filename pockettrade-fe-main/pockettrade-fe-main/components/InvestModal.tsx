"use client";

import { callApi } from "@/lib/helpers";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Crown,
  ShieldCheck,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const INVESTMENT_PLANS = [
  {
    id: "basic",
    name: "Basic",
    price: 3000,
    roi: 147.5,
    icon: ShieldCheck,
    color: "from-blue-500 to-cyan-500",
    shadow: "shadow-blue-500/20",
    description: "Beginner-friendly strategy with automated rebalancing.",
  },
  {
    id: "plus",
    name: "Plus",
    price: 7000,
    roi: 189.5,
    icon: Zap,
    color: "from-emerald-400 to-teal-500",
    shadow: "shadow-emerald-500/20",
    description: "Active management with real-time data integration.",
    isPopular: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: 15000,
    roi: 279.5,
    icon: Crown,
    color: "from-purple-500 to-fuchsia-500",
    shadow: "shadow-purple-500/20",
    description: "Elite dedicated strategies for maximum capital growth.",
  },
];

interface InvestModalProps {
  asset: {
    id: string;
    name: string;
    symbol: string;
    type: string;
    price: number | null;
    change_percentage: number | null;
    volume: string | number | null;
    last_sync: string | null;
    sector?: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

export default function InvestModal({
  asset,
  isOpen,
  onClose,
}: InvestModalProps) {
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<
    (typeof INVESTMENT_PLANS)[0] | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!selectedPlan) return;
    setIsSubmitting(true);

    try {
      const { error } = await callApi("/investment/create", {
        plan: selectedPlan.id,
        type: asset.type,
        symbol: asset.symbol,
        name: asset.name,
        amount: selectedPlan.price,
        percentageProfit: selectedPlan.roi,
      });

      if (error) throw new Error(error.message);

      toast.success("Investment Started!", {
        description: `Successfully invested in ${asset.name} via ${selectedPlan.name} plan.`,
      });

      queryClient.invalidateQueries({ queryKey: ["investments"] });
      queryClient.invalidateQueries({ queryKey: ["balance"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      onClose();
      router.push("/dashboard/investments");
    } catch (err) {
      toast.error("Investment Failed", {
        description:
          err instanceof Error
            ? err.message
            : "Failed to process investment request.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-slate-900 border border-white/10 rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Left Side: Asset Summary */}
          <div className="bg-slate-950/50 p-8 md:w-1/3 border-b md:border-b-0 md:border-r border-white/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full -ml-20 -mt-20 pointer-events-none"></div>
            
            <div className="flex flex-col gap-y-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-white text-lg">{asset.name}</h3>
                  <span className="text-xs font-black text-slate-500 tracking-widest uppercase">
                    {asset.symbol}
                  </span>
                </div>
              </div>

              <div className="p-5 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-md">
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">
                  Current Price
                </p>
                <p className="text-3xl font-black text-white">
                  $
                  {asset.price?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>

              <div className="flex flex-col gap-y-3">
                <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                  Why Invest?
                </h4>
                <p className="text-sm text-slate-400 font-medium leading-relaxed">
                  Unlock professional-grade portfolio management for {asset.name}.
                  Our algorithms work 24/7 to optimize your entry and exit points
                  based on the chosen strategy.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side: Plan Selection */}
          <div className="flex-1 p-8 overflow-y-auto custom-scrollbar relative bg-slate-900">
            {step === 1 ? (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-white">
                      Select Strategy
                    </h2>
                    <p className="text-sm font-medium text-slate-400 mt-1">
                      Pick a management plan that fits your goals.
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid gap-4 mt-8">
                  {INVESTMENT_PLANS.map((plan) => (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan)}
                      className={`group relative p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        selectedPlan?.id === plan.id
                          ? "border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.15)]"
                          : "border-white/5 hover:border-white/20 bg-slate-950/50"
                      }`}
                    >
                      <div className="flex items-center gap-5">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center text-white shadow-lg ${plan.shadow}`}
                        >
                          <plan.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={`font-black text-lg ${selectedPlan?.id === plan.id ? 'text-emerald-400' : 'text-white'}`}>
                              {plan.name}
                            </h4>
                            {plan.isPopular && (
                              <span className="text-[9px] bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full font-black uppercase tracking-widest">
                                POPULAR
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-medium text-slate-500 max-w-[200px] leading-relaxed">
                            {plan.description}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-xl font-black text-white">
                          ${plan.price.toLocaleString()}
                        </p>
                        <p className="text-xs font-black text-emerald-400 mt-1">
                          ROI: {plan.roi}%
                        </p>
                      </div>

                      {selectedPlan?.id === plan.id && (
                        <div className="absolute -top-3 -right-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/30">
                            <Check className="w-5 h-5 font-black" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  disabled={!selectedPlan}
                  className="w-full h-14 mt-8 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-black text-sm uppercase tracking-widest shadow-[0_0_30px_rgba(16,185,129,0.2)] disabled:shadow-none transition-all flex items-center justify-center"
                  onClick={() => setStep(2)}
                >
                  Continue to Review
                  <ChevronRight className="ml-2 w-5 h-5" />
                </button>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-y-8">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-2xl font-black text-white">
                    Review Order
                  </h2>
                </div>

                <div className="bg-slate-950/50 border border-white/5 rounded-3xl p-6 flex flex-col gap-y-4">
                  <div className="flex justify-between items-center text-sm border-b border-white/5 pb-4">
                    <span className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Asset</span>
                    <span className="font-black text-white">{asset.name}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-white/5 pb-4">
                    <span className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Strategy</span>
                    <span className="font-black text-white">
                      {selectedPlan?.name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-white/5 pb-4">
                    <span className="text-slate-500 font-black uppercase tracking-widest text-[10px]">
                      Expected ROI
                    </span>
                    <span className="font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
                      {selectedPlan?.roi}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-lg lg:text-xl pt-4">
                    <span className="text-white font-black uppercase tracking-widest text-sm">
                      Total Allocation
                    </span>
                    <span className="font-black text-emerald-400">
                      ${selectedPlan?.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-6 mt-12">
                  <button
                    disabled={isSubmitting}
                    className="w-full h-16 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 text-slate-950 font-black text-lg uppercase tracking-widest shadow-[0_0_40px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center"
                    onClick={handleConfirm}
                  >
                    {isSubmitting ? "PROCESSING..." : "CONFIRM & LAUNCH"}
                  </button>
                  <p className="text-[10px] text-center font-bold text-slate-500 uppercase tracking-widest px-8 leading-relaxed">
                    By clicking confirm, you agree to allocate <span className="text-emerald-500">${selectedPlan?.price.toLocaleString()}</span> from your balance to
                    the managed <span className="text-white">{asset.name}</span> portfolio.
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
