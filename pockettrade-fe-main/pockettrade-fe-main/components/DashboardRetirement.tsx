"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ShieldCheck, PieChart, Landmark, Scale, Coins, ArrowRight, Zap } from "lucide-react";
import { toast } from "sonner";
import { ApiResponse, Investment } from "@/interfaces";
import { callApi } from "@/lib/helpers";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const RETIREMENT_PLANS = [
  {
    id: "gold",
    name: "Gold",
    price: 10000,
    roi: 147.5,
    isPopular: false,
    description: "Conservative strategies for stable wealth accumulation.",
    features: [
      "Basic market research",
      "Educational resources",
      "Standard customer support",
    ],
  },
  {
    id: "platinum",
    name: "Platinum",
    price: 25000,
    roi: 189.5,
    isPopular: true,
    description: "Income-focused allocation with professional management.",
    features: [
      "All Gold features plus RMD",
      "Advanced market research",
      "Real-time market data",
      "Retirement planning tools",
      "Priority customer support",
    ],
  },
  {
    id: "diamond",
    name: "Diamond",
    price: 50000,
    roi: 279.5,
    isPopular: false,
    description: "High-growth institutional allocation for elite portfolios.",
    features: [
      "All Platinum features",
      "Professional-grade research",
      "Tax-loss harvesting",
      "Dedicated financial advisor",
      "Exclusive retirement opportunities",
      "24/7 premium support",
    ],
  },
];

const ACCOUNT_TYPES = [
  {
    id: "traditional-ira",
    name: "Traditional IRA",
    icon: Landmark,
    description: "Tax-deferred retirement account",
    taxBenefits: "Tax-deductible contributions, tax-deferred growth",
    withdrawal: "Taxed as income upon withdrawal",
    contributionLimit: "$7,500/yr (2025)",
  },
  {
    id: "roth-ira",
    name: "Roth IRA",
    icon: ShieldCheck,
    description: "After-tax account with tax-free growth",
    taxBenefits: "Tax-free growth and withdrawals",
    withdrawal: "Tax-free after age 59½",
    contributionLimit: "$8,000/yr (2025)",
  },
  {
    id: "401k",
    name: "401(k)",
    icon: Scale,
    description: "Employer-sponsored retirement plan",
    taxBenefits: "Tax-deferred contributions and growth",
    withdrawal: "Taxed as income upon withdrawal",
    contributionLimit: "$31,500/yr (2025)",
  },
  {
    id: "sep-ira",
    name: "SEP IRA",
    icon: Coins,
    description: "For self-employed individuals",
    taxBenefits: "Tax-deductible contributions",
    withdrawal: "Taxed as income upon withdrawal",
    contributionLimit: "Up to $72,000 (2025)",
  },
];

export default function DashboardRetirement() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedAccountType, setSelectedAccountType] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("plans");
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddToPortfolio = async () => {
    if (!selectedPlan || !selectedAccountType) return;
    
    setIsSubmitting(true);
    try {
      const { data: responseData, error } = await callApi<ApiResponse<Investment>>("/investment/create", {
        isRetirement: true,
        plan: selectedPlan,
        retirementAccountType: selectedAccountType,
        type: "retirement",
        symbol: "RETIRE",
        name: `Retirement (${selectedPlan.toUpperCase()})`,
        amount: RETIREMENT_PLANS.find(p => p.id === selectedPlan)?.price || 0,
      });

      if (error) throw new Error(error.message);

      if (responseData?.status === "success") {
        toast.success("Retirement Position Opened", {
          description: "Your retirement account has been successfully initialized.",
        });
        void queryClient.invalidateQueries();
        router.push("/dashboard/investments");
      }
    } catch (err) {
      toast.error("Deployment Failed", {
        description: err instanceof Error ? err.message : "Something went wrong",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-12 pb-20 mt-16 lg:mt-0 relative">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 relative z-10">
        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
            <div className="h-10 w-1 bg-emerald-500 rounded-full"></div>
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">Future Security</p>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl lg:text-6xl font-black tracking-tighter text-white uppercase leading-none">
            Retirement <span className="text-emerald-400">Planning</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-slate-400 max-w-xl font-medium text-lg leading-relaxed">
            Build long-term generational wealth with our specialized retirement vehicles. Optimized for tax efficiency and consistent growth.
          </motion.p>
        </div>
      </div>

      <Tabs defaultValue="plans" value={activeTab} onValueChange={setActiveTab} className="space-y-12 relative z-10">
        <TabsList className="bg-slate-900/50 border border-white/5 p-1 rounded-2xl h-14">
          <TabsTrigger value="plans" className="rounded-xl px-8 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-emerald-500 data-[state=active]:text-slate-950">Managed Plans</TabsTrigger>
          <TabsTrigger value="accounts" className="rounded-xl px-8 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-emerald-500 data-[state=active]:text-slate-950">Account Types</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
          <div className="grid md:grid-cols-3 gap-8">
            {RETIREMENT_PLANS.map((plan, i) => (
              <Card key={plan.id} className={cn(
                "group relative bg-slate-900/50 border-white/5 backdrop-blur-xl rounded-[2.5rem] transition-all duration-500 hover:border-emerald-500/30 flex flex-col h-full overflow-hidden",
                selectedPlan === plan.id && "border-emerald-500/50 shadow-[0_0_50px_rgba(16,185,129,0.1)]"
              )}>
                {plan.isPopular && (
                  <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 px-6 py-1.5 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">
                    Popular Choice
                  </div>
                )}
                <CardHeader className="p-10 pb-6">
                  <CardTitle className="text-2xl font-black text-white uppercase tracking-tight group-hover:text-emerald-400 transition-colors">{plan.name}</CardTitle>
                  <CardDescription className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-10 pt-0 space-y-8 flex-grow">
                  <div className="space-y-1">
                    <p className="text-4xl font-black text-white tracking-tighter">${plan.price.toLocaleString()}<span className="text-sm font-medium text-slate-500"> /mo</span></p>
                    <div className="flex items-center gap-2">
                       <Zap size={14} className="text-emerald-500" />
                       <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{plan.roi}% Projected ROI</span>
                    </div>
                  </div>
                  <ul className="space-y-4">
                    {plan.features.map((f, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="p-10 pt-0">
                  <Button
                    onClick={() => { setSelectedPlan(plan.id); setActiveTab("accounts"); }}
                    className={cn(
                      "w-full h-14 rounded-2xl font-black uppercase tracking-widest transition-all",
                      selectedPlan === plan.id ? "bg-emerald-500 text-slate-950" : "bg-white/5 text-white hover:bg-white/10"
                    )}
                  >
                    {selectedPlan === plan.id ? "Strategy Selected" : "Select Strategy"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="accounts" className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
          <div className="grid md:grid-cols-2 gap-8">
            {ACCOUNT_TYPES.map((account) => (
              <Card key={account.id} className={cn(
                "group bg-slate-900/50 border-white/5 backdrop-blur-xl rounded-[2.5rem] transition-all duration-500 hover:border-emerald-500/30 cursor-pointer overflow-hidden",
                selectedAccountType === account.id && "border-emerald-500/50 bg-emerald-500/5"
              )} onClick={() => setSelectedAccountType(account.id)}>
                <CardContent className="p-10 flex gap-8">
                  <div className={cn(
                    "h-16 w-16 rounded-2xl flex items-center justify-center shrink-0 transition-all",
                    selectedAccountType === account.id ? "bg-emerald-500 text-slate-950 scale-110" : "bg-white/5 text-slate-400 group-hover:text-white"
                  )}>
                    <account.icon className="w-8 h-8" />
                  </div>
                  <div className="space-y-4 flex-1">
                    <div>
                      <h3 className="text-xl font-black text-white uppercase tracking-tight">{account.name}</h3>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">{account.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                       <div>
                         <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Tax Benefit</p>
                         <p className="text-[10px] font-bold text-slate-300 uppercase leading-relaxed">{account.taxBenefits}</p>
                       </div>
                       <div>
                         <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Limit</p>
                         <p className="text-[10px] font-bold text-emerald-400 uppercase">{account.contributionLimit}</p>
                       </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex justify-center pt-8 relative z-10">
        <Button
          disabled={!selectedPlan || !selectedAccountType || isSubmitting}
          onClick={handleAddToPortfolio}
          className="h-16 px-12 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-emerald-500/20 group disabled:opacity-50"
        >
          {isSubmitting ? "Initializing Account..." : (
            <span className="flex items-center gap-3">
               Initialize Retirement Account
               <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          )}
        </Button>
      </motion.div>
    </div>
  );
}
