"use client";

import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Briefcase,
  Heart,
  ArrowRight,
  FlaskConical,
  Plus,
  Award,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "@/store/useSession";
import { useDemoMode } from "@/store/useDemoMode";
import { callApi } from "@/lib/helpers";
import { ApiResponse, Wallet, UserInvestmentData } from "@/interfaces";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function DashboardHome() {
  const { user } = useSession((state) => state);
  const { isDemoMode, toggleDemoMode } = useDemoMode();
  const queryClient = useQueryClient();

  const handleToggleDemoMode = () => {
    toggleDemoMode();
    setTimeout(() => {
      queryClient.invalidateQueries();
    }, 50);
  };

  const fundDemoMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await callApi<ApiResponse<any>>("/wallet/fund-demo", { 'amount': 50000 });
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      toast.success("Demo account funded with $50,000");
      queryClient.invalidateQueries({ queryKey: ["balance"] });
      queryClient.refetchQueries({ queryKey: ["balance"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to fund demo account");
    }
  });

  const {
    data: balance,
    isLoading: loading,
  } = useQuery<Wallet[], Error>({
    queryKey: ["balance", isDemoMode],
    queryFn: async () => {
      const { data: responseData, error } = await callApi<ApiResponse<Wallet[]>>("/wallet/user");
      if (error) throw new Error(error.message || "Failed to fetch wallet balance");
      return responseData?.data || [];
    },
  });

  const {
    data: investmentsData,
    isLoading: isInvestmentsLoading,
  } = useQuery<UserInvestmentData, Error>({
    queryKey: ["investments", isDemoMode],
    queryFn: async () => {
      const { data: responseData, error } = await callApi<ApiResponse<UserInvestmentData>>("/investment/user");
      if (error) throw new Error(error.message || "Failed to fetch investments");
      return responseData?.data || [];
    },
  });

  const allInvestments = investmentsData || [];

  const allocation = allInvestments.reduce(
    (acc, investment) => {
      switch (investment.type) {
        case "crypto": acc.crypto += 1; break;
        case "stocks": acc.stocks += 1; break;
        case "etfs": acc.etfs += 1; break;
        case "retirement": acc.retirement += 1; break;
      }
      return acc;
    },
    { crypto: 0, stocks: 0, etfs: 0, retirement: 0, totalCount: allInvestments.length }
  );

  const percentages = {
    crypto: allocation.totalCount > 0 ? (allocation.crypto / allocation.totalCount) * 100 : 0,
    stocks: allocation.totalCount > 0 ? (allocation.stocks / allocation.totalCount) * 100 : 0,
    etfs: allocation.totalCount > 0 ? (allocation.etfs / allocation.totalCount) * 100 : 0,
    retirement: allocation.totalCount > 0 ? (allocation.retirement / allocation.totalCount) * 100 : 0,
  };

  const displayBalance = balance && balance[0]?.balance ? balance[0].balance : 0;
  
  const { totalValue, totalProfitValue } = allInvestments.reduce((acc, item) => {
    const principal = parseFloat(item.amount?.toString() || "0");
    const currentProfit = parseFloat(item.dailyprofit?.toString() || "0");
    return {
      totalValue: acc.totalValue + principal + currentProfit,
      totalProfitValue: acc.totalProfitValue + currentProfit
    };
  }, { totalValue: 0, totalProfitValue: 0 });

  const displayPortfolio = totalValue > 0 ? totalValue : (balance && balance[0]?.portfolioBalance ? balance[0].portfolioBalance : 0);
  const displayProfitValue = totalValue > 0 ? totalProfitValue : (user?.[0]?.totalProfit ?? 0);

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-slate-900/50 border border-white/5 p-6 rounded-3xl glass-panel">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">
            Welcome back, <span className="gradient-text">{user?.[0]?.firstName || "User"}</span>
          </h1>
          <p className="text-slate-400 font-medium">Here's your institutional portfolio breakdown.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {isDemoMode && (
            <button
              onClick={() => fundDemoMutation.mutate()}
              disabled={fundDemoMutation.isPending}
              className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Fund Demo
            </button>
          )}
          <button
            onClick={handleToggleDemoMode}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 border ${
              isDemoMode
                ? "bg-amber-500/20 border-amber-500/30 text-amber-400 hover:bg-amber-500/30"
                : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
            }`}
          >
            <FlaskConical className="h-4 w-4" />
            {isDemoMode ? "Exit Demo" : "Trigger Demo"}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Portfolio Value */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel bg-slate-900/50 border border-white/5 p-6 rounded-3xl">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Portfolio Value</p>
          <div className="text-4xl font-black text-white mb-3">
            {loading ? <span className="animate-pulse opacity-50">Loading...</span> : `$${displayPortfolio.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          </div>
          {allInvestments.length > 0 && user?.[0]?.totalProfit != null && (
            <div className="flex items-center gap-2 text-sm font-bold">
               {user[0].totalProfit >= 0 ? <TrendingUp className="text-emerald-500 h-4 w-4" /> : <TrendingDown className="text-red-500 h-4 w-4" />}
               <span className={user[0].totalProfit >= 0 ? "text-emerald-500" : "text-red-500"}>
                 {user[0].totalProfit >= 0 ? "+" : ""}${Math.abs(user[0].totalProfit).toLocaleString(undefined, { minimumFractionDigits: 2 })}
               </span>
               <span className="text-slate-500 font-medium ml-1">Today</span>
            </div>
          )}
        </motion.div>

        {/* Total Profit */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel bg-slate-900/50 border border-white/5 p-6 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
             <TrendingUp className="w-24 h-24 text-emerald-500" />
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 relative z-10">Total Profit</p>
          <div className="text-4xl font-black text-white mb-3 relative z-10">
            {isInvestmentsLoading ? <span className="animate-pulse opacity-50">Loading...</span> : `$${displayProfitValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          </div>
          <p className="text-emerald-500 text-sm font-bold relative z-10">All time returns</p>
        </motion.div>

        {/* Available Funds */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-panel bg-slate-900/50 border border-white/5 p-6 rounded-3xl">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Available Funds</p>
          <div className="text-4xl font-black text-white mb-6">
            ${displayBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex gap-3">
             <Link href="/dashboard/add-funds" className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black py-2.5 rounded-xl flex items-center justify-center transition-colors">
                ADD FUNDS
             </Link>
             <Link href="/dashboard/withdraw" className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-black py-2.5 rounded-xl flex items-center justify-center transition-colors">
                WITHDRAW
             </Link>
             <a href="https://connect.jerisomtrade.com" className="flex-1 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-400 text-xs font-black py-2.5 rounded-xl flex items-center justify-center transition-colors">
                CONNECT WALLET
             </a>
          </div>
        </motion.div>
      </div>

      {/* Middle Section */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Chart Area */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="md:col-span-2 glass-panel bg-slate-900/50 border border-white/5 p-6 rounded-3xl flex flex-col">
          <div className="flex justify-between items-center mb-8">
             <div>
               <h2 className="text-xl font-black text-white">Investment Overview</h2>
               <p className="text-sm text-slate-400 font-medium">Your portfolio performance</p>
             </div>
             <Link href="/dashboard/investments" className="text-emerald-400 hover:text-emerald-300 text-xs font-bold uppercase tracking-widest flex items-center gap-1 transition-colors">
                View All <ArrowRight className="w-3 h-3" />
             </Link>
          </div>
          <div className="flex-1 flex items-center justify-center bg-slate-950/30 rounded-2xl border border-white/5 min-h-[250px]">
             <BarChart3 className="w-16 h-16 text-slate-700" />
          </div>
        </motion.div>

        {/* Allocation Area */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-panel bg-slate-900/50 border border-white/5 p-6 rounded-3xl">
          <h2 className="text-xl font-black text-white mb-2">Asset Allocation</h2>
          <p className="text-sm text-slate-400 font-medium mb-8">Portfolio distribution</p>
          
          <div className="space-y-6">
             {isInvestmentsLoading ? (
               <div className="space-y-4 animate-pulse">
                  {[1,2,3].map(i => <div key={i} className="h-10 bg-white/5 rounded-xl"></div>)}
               </div>
             ) : allInvestments.length === 0 ? (
               <div className="h-40 flex flex-col items-center justify-center text-slate-500">
                 <Briefcase className="w-8 h-8 mb-3 opacity-50" />
                 <p className="text-xs font-bold uppercase tracking-widest text-center">No investments yet</p>
               </div>
             ) : (
               <>
                 {[
                    { label: "Crypto", value: percentages.crypto, color: "bg-emerald-500" },
                    { label: "Stocks", value: percentages.stocks, color: "bg-blue-500" },
                    { label: "ETFs", value: percentages.etfs, color: "bg-purple-500" },
                    { label: "Retirement", value: percentages.retirement, color: "bg-amber-500" },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-center mb-2 text-sm font-bold">
                        <span className="text-slate-300">{item.label}</span>
                        <span className="text-white">{item.value.toFixed(0)}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color}`} style={{ width: `${item.value}%` }}></div>
                      </div>
                    </div>
                  ))}
               </>
             )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <h2 className="text-xl font-black text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {[
            { title: "Investments", icon: Briefcase, href: "/dashboard/investments", desc: "Portfolio" },
            { title: "Watchlist", icon: Heart, href: "/dashboard/watchlist", desc: "Saved" },
            { title: "Traders", icon: Award, href: "/dashboard/traders", desc: "Leaderboard" },
            { title: "Transactions", icon: TrendingUp, href: "/dashboard/transactions", desc: "Activity" },
            { title: "Referrals", icon: Users, href: "/dashboard/referrals", desc: "Invite Friends" }
          ].map((action, i) => (
            <Link key={i} href={action.href} className="group glass-panel bg-slate-900/50 border border-white/5 p-6 rounded-3xl hover:bg-white/5 hover:border-emerald-500/30 transition-all flex flex-col items-center text-center">
               <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 group-hover:text-emerald-400 transition-all text-slate-400">
                 <action.icon className="w-6 h-6" />
               </div>
               <h3 className="text-sm font-black text-white uppercase tracking-widest">{action.title}</h3>
               <p className="text-xs text-slate-500 mt-1 font-medium">{action.desc}</p>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
