"use client";

import React from "react";
import {
  Users,
  TrendingUp,
  DollarSign,
  Calendar,
  Terminal,
  ArrowUpRight,
  BarChart3,
  MousePointerClick,
  Zap,
  Activity,
  ShieldCheck,
  Target
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { callApi } from "@/lib/helpers";
import { ApiResponse } from "@/interfaces";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TraderDashboardData {
  id: string;
  totalFollowers: number;
  totalAum: number;
  totalEarnings: number;
  winRate: number;
  activeTrades: number;
  performanceData: Array<{ date: string; aum: number }>;
}

const mockGrowthData = [
  { date: "Jan", aum: 12000 },
  { date: "Feb", aum: 18500 },
  { date: "Mar", aum: 24000 },
  { date: "Apr", aum: 32000 },
  { date: "May", aum: 48000 },
  { date: "Jun", aum: 65000 },
];

export default function TraderPortal() {
  const { data: trader, isLoading } = useQuery<Partial<TraderDashboardData> | null, Error>({
    queryKey: ["trader-portal-stats"],
    queryFn: async () => {
      const { data: responseData, error } = await callApi<ApiResponse<TraderDashboardData>>("/traders/me");
      if (error) throw new Error(error.message);
      return responseData?.data || null;
    },
  });

  if (isLoading)
    return (
      <div className="space-y-8 animate-pulse p-10">
        <Skeleton className="h-40 w-full rounded-3xl bg-white/5" />
        <div className="grid grid-cols-4 gap-6">
           {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-3xl bg-white/5" />)}
        </div>
        <Skeleton className="h-[400px] w-full rounded-3xl bg-white/5" />
      </div>
    );

  return (
    <div className="space-y-12 pb-20 mt-16 lg:mt-0 relative">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
            <div className="h-10 w-1 bg-emerald-500 rounded-full"></div>
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">Command Center</p>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl lg:text-6xl font-black tracking-tighter text-white uppercase leading-none">
            Trader <span className="text-emerald-400">Portal</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-slate-400 max-w-xl font-medium text-lg leading-relaxed">
            Manage your institutional strategy, monitor follower liquidity, and optimize your quantitative performance metrics.
          </motion.p>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
           <Link href="/dashboard/trader-portal/console">
             <Button className="h-16 px-10 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-emerald-500/20 group">
                Open Strategy Console
                <Activity className="ml-3 w-5 h-5 group-hover:scale-110 transition-transform" />
             </Button>
           </Link>
        </motion.div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 relative z-10">
        {[
          { label: "Assets Under Mgmt", value: `$${(trader?.totalAum || 0).toLocaleString()}`, icon: DollarSign, color: "text-emerald-400" },
          { label: "Active Followers", value: (trader?.totalFollowers || 0).toLocaleString(), icon: Users, color: "text-blue-400" },
          { label: "Total Commissions", value: `$${(trader?.totalEarnings || 0).toLocaleString()}`, icon: TrendingUp, color: "text-emerald-400" },
          { label: "System Win Rate", value: `${trader?.winRate || 0}%`, icon: Target, color: "text-amber-400" },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + (idx * 0.05) }}
          >
            <Card className="bg-slate-900/50 border-white/5 backdrop-blur-xl rounded-3xl p-6 hover:border-emerald-500/20 transition-colors group">
              <CardContent className="p-0 flex items-center gap-6">
                <div className={cn("p-4 rounded-2xl bg-white/[0.02] border border-white/5 group-hover:scale-110 transition-transform", stat.color)}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{stat.label}</p>
                  <p className="text-2xl font-black text-white mt-1 tracking-tight">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3 relative z-10">
        {/* Growth Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="lg:col-span-2">
          <Card className="bg-slate-900/50 border-white/5 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-2xl">
            <CardHeader className="p-10 pb-0 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-black text-white uppercase tracking-tighter">AUM <span className="text-emerald-500">Growth</span></CardTitle>
                <CardDescription className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Aggregate capital following your signals</CardDescription>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1 flex items-center gap-2">
                <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">+28.4% MoM</span>
              </div>
            </CardHeader>
            <CardContent className="h-[400px] p-10 pt-16">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockGrowthData}>
                  <defs>
                    <linearGradient id="colorAum" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#64748b", fontWeight: 800 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#64748b", fontWeight: 800 }} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", fontSize: "12px", fontWeight: "bold" }} />
                  <Area type="monotone" dataKey="aum" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorAum)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sidebar Cards */}
        <div className="space-y-8">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
            <Card className="bg-slate-900 border-white/10 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform">
                 <Calendar size={100} />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight mb-6 flex items-center gap-3">
                <Zap className="w-5 h-5 text-emerald-500" />
                Trading Schedule
              </h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">NY Market Open</span>
                  <div className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">Active</div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">London Close</span>
                  <span className="text-sm font-black text-white">4h 22m</span>
                </div>
                <div className="h-px bg-white/5 w-full" />
                <div className="p-4 bg-white/[0.02] rounded-xl border border-white/5">
                   <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] mb-1 italic leading-relaxed">
                     Drawdown management is the primary factor for network retention.
                   </p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>
            <Card className="bg-slate-900/50 border-white/5 backdrop-blur-xl rounded-[2rem] p-8">
              <h3 className="text-xl font-black text-white uppercase tracking-tight mb-6">Network Insights</h3>
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
                    <span className="text-slate-500">Retention Rate</span>
                    <span className="text-emerald-400">98.2%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[98.2%] shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  </div>
                </div>
                <Link href="/dashboard/trader-portal/followers">
                  <Button variant="ghost" className="w-full h-14 bg-white/5 border border-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[10px] rounded-xl transition-all">
                    Manage Follower Base
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
