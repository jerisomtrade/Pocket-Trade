"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  ArrowLeft,
  Users,
  Award,
  ShieldCheck,
  Zap,
  Target,
  BarChart4,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { callApi } from "@/lib/helpers";
import { ApiResponse } from "@/interfaces";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import CopyModal from "@/components/CopyModal";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TraderProfileData {
  id: string;
  displayName: string;
  bio: string;
  avatarUrl: string | null;
  riskLevel: "low" | "medium" | "high";
  winRate: number;
  totalProfitPercent: number;
  totalFollowers: number;
  commissionRate: number;
  minCopyAmount: number;
  stats: {
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    avgTradePercent: number;
  };
  history: Array<{
    id: string;
    symbol: string;
    direction: string;
    status: string;
    profitLossPercent: number;
    closedAt: string;
  }>;
}

// Mock chart data for premium look
const chartData = [
  { day: "Day 1", pnl: 0 },
  { day: "Day 5", pnl: 2.4 },
  { day: "Day 10", pnl: 4.1 },
  { day: "Day 15", pnl: 3.8 },
  { day: "Day 20", pnl: 7.2 },
  { day: "Day 25", pnl: 6.9 },
  { day: "Day 30", pnl: 10.4 },
];

export default function TraderProfile() {
  const params = useParams();
  const id = params.id as string;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: trader, isLoading } = useQuery<TraderProfileData | null, Error>(
    {
      queryKey: ["trader", id],
      queryFn: async () => {
        const { data: responseData, error } = await callApi<
          ApiResponse<TraderProfileData>
        >(`/traders/${id}`);
        if (error) throw new Error(error.message);
        return responseData?.data || null;
      },
    },
  );

  if (isLoading)
    return (
      <div className="space-y-8 mt-16 lg:mt-0">
        <Skeleton className="h-48 w-full rounded-3xl" />
        <div className="grid gap-6 md:grid-cols-4">
           <Skeleton className="h-32 rounded-3xl" />
           <Skeleton className="h-32 rounded-3xl" />
           <Skeleton className="h-32 rounded-3xl" />
           <Skeleton className="h-32 rounded-3xl" />
        </div>
        <Skeleton className="h-96 rounded-3xl" />
      </div>
    );
    
  if (!trader) return (
    <div className="h-[60vh] flex flex-col items-center justify-center text-center">
       <div className="h-20 w-20 bg-white/5 border border-white/5 rounded-3xl flex items-center justify-center mb-6 text-slate-500">
          <Target size={40} />
       </div>
       <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Trader Not Found</h1>
       <p className="text-slate-500 mt-2 mb-8">This profile may have been deactivated or removed.</p>
       <Button asChild className="bg-emerald-500 text-slate-950 font-black uppercase tracking-widest px-8 h-12 rounded-xl">
          <Link href="/dashboard/traders">Back to Leaderboard</Link>
       </Button>
    </div>
  );

  return (
    <div className="space-y-12 pb-20 mt-16 lg:mt-0 relative overflow-hidden">
      {/* Header Visual Decoration */}
      <div className="absolute top-0 right-0 -mr-32 -mt-32 w-128 h-128 bg-emerald-500/[0.03] blur-[150px] rounded-full pointer-events-none"></div>

      {/* Navigation */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <Link
          href="/dashboard/traders"
          className="inline-flex items-center text-[10px] font-black text-slate-500 hover:text-emerald-400 uppercase tracking-[0.2em] transition-colors group"
        >
          <ArrowLeft className="w-3 h-3 mr-2 group-hover:-translate-x-1 transition-transform" />
          Leaderboard
        </Link>
      </motion.div>

      {/* Profile Header */}
      <div className="flex flex-col lg:flex-row gap-10 items-start relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <Avatar className="h-40 w-40 rounded-[2.5rem] border-4 border-white/5 bg-slate-900 shadow-2xl">
            <AvatarImage
              src={trader.avatarUrl || ""}
              className="object-cover"
            />
            <AvatarFallback className="bg-emerald-500/10 text-emerald-400 text-4xl font-black uppercase">
              {trader.displayName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-slate-950 p-2 rounded-2xl shadow-xl">
             <ShieldCheck size={20} />
          </div>
        </motion.div>

        <div className="flex-1 space-y-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tighter"
              >
                {trader.displayName}
              </motion.h1>
              <Badge className="bg-emerald-500 text-slate-950 font-black uppercase tracking-widest px-3 py-1 text-[10px]">
                CERTIFIED EXPERT
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  "font-black uppercase text-[10px] tracking-widest px-3 py-1 border-white/10",
                  trader.riskLevel === 'low' ? 'text-emerald-400' : 
                  trader.riskLevel === 'medium' ? 'text-amber-400' : 
                  'text-red-400'
                )}
              >
                {trader.riskLevel} Risk Profile
              </Badge>
            </div>
            <p className="text-slate-400 max-w-3xl text-lg font-medium leading-relaxed">
              {trader.bio ||
                "Specialized in high-conviction directional strategies and algorithmic liquidity capture. Focused on consistent capital preservation."}
            </p>
          </div>

          <div className="flex flex-wrap gap-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-emerald-400">
                 <Users size={18} />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Network Size</p>
                 <p className="text-sm font-black text-white">{trader.totalFollowers.toLocaleString()} Copiers</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-emerald-400">
                 <Target size={18} />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Track Record</p>
                 <p className="text-sm font-black text-white">Institutional Grade</p>
              </div>
            </div>
          </div>
        </div>

        <Card className="lg:w-80 w-full bg-slate-900 border-white/5 shadow-2xl p-8 rounded-[2rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-emerald-500/10 blur-3xl rounded-full transition-all group-hover:bg-emerald-500/20"></div>
          <div className="space-y-6 relative z-10">
            <div className="flex justify-between items-end">
               <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Profit Share</p>
                  <p className="text-3xl font-black text-white tracking-tighter">{trader.commissionRate}%</p>
               </div>
               <Badge className="bg-emerald-500/10 text-emerald-400 border-transparent font-black text-[9px] uppercase tracking-widest mb-1">Mirroring Active</Badge>
            </div>
            
            <div className="space-y-4">
              <Button
                onClick={() => setIsModalOpen(true)}
                className="w-full h-14 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase tracking-widest rounded-xl shadow-[0_10px_30px_rgba(16,185,129,0.15)] transition-all active:scale-[0.98]"
              >
                Copy Strategy
              </Button>
              <p className="text-[9px] text-center text-slate-500 font-bold uppercase tracking-[0.2em]">
                Minimum Allocation: ${trader.minCopyAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Performance Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 relative z-10">
        {[
          {
            label: "Total ROI",
            value: `+${trader.totalProfitPercent}%`,
            icon: TrendingUp,
            color: "text-emerald-400",
            bgColor: "bg-emerald-500/10",
          },
          {
            label: "Precision Rate",
            value: `${trader.winRate}%`,
            icon: Award,
            color: "text-blue-400",
            bgColor: "bg-blue-500/10",
          },
          {
            label: "Avg. Profit",
            value: `+${trader.stats.avgTradePercent}%`,
            icon: Zap,
            color: "text-amber-400",
            bgColor: "bg-amber-500/10",
          },
          {
            label: "Total Vol.",
            value: trader.stats.totalTrades,
            icon: BarChart4,
            color: "text-slate-400",
            bgColor: "bg-white/5",
          },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * idx }}
          >
            <Card className="bg-slate-900/50 border-white/5 backdrop-blur-xl rounded-3xl hover:bg-slate-900 transition-colors">
              <CardContent className="p-8 flex items-center gap-6">
                <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg", stat.bgColor, stat.color)}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">
                    {stat.label}
                  </p>
                  <p className={cn("text-2xl font-black tracking-tighter", stat.color)}>
                    {stat.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Analytics & History */}
      <div className="grid gap-8 lg:grid-cols-3 relative z-10">
        {/* Growth Chart */}
        <Card className="lg:col-span-2 bg-slate-900/40 border-white/5 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-10 pb-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-black text-white uppercase tracking-tighter">Performance <span className="text-emerald-500">Analytics</span></CardTitle>
              <CardDescription className="text-slate-500 font-medium uppercase tracking-widest text-[10px] mt-1">
                Verified growth trajectory (Last 30 Days)
              </CardDescription>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-inner">
               <TrendingUp size={20} />
            </div>
          </CardHeader>
          <CardContent className="h-[400px] w-full p-0 pt-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPnl" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(255,255,255,0.03)"
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#475569", fontWeight: 700 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#475569", fontWeight: 700 }}
                  tickFormatter={(val) => `+${val}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderRadius: "16px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                  }}
                  itemStyle={{ color: "#10b981", fontWeight: 900, textTransform: "uppercase", fontSize: "10px" }}
                  labelStyle={{ color: "#94a3b8", fontWeight: 700, marginBottom: "4px" }}
                />
                <Area
                  type="monotone"
                  dataKey="pnl"
                  stroke="#10b981"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorPnl)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Consistency Card */}
        <Card className="bg-slate-900/40 border-white/5 backdrop-blur-3xl rounded-[2.5rem]">
          <CardHeader className="p-10 pb-6">
            <CardTitle className="text-xl font-black text-white uppercase tracking-tighter">Strategic <span className="text-emerald-500">Metrics</span></CardTitle>
            <CardDescription className="text-slate-500 font-medium uppercase tracking-widest text-[10px] mt-1">Risk & Consistency Analysis</CardDescription>
          </CardHeader>
          <CardContent className="px-10 pb-10 space-y-10">
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Profit Factor
                </span>
                <span className="text-xl font-black text-white">2.14</span>
              </div>
              <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden flex shadow-inner">
                <div className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" style={{ width: "70%" }} />
                <div className="h-full bg-red-500/50" style={{ width: "30%" }} />
              </div>
              <div className="flex justify-between text-[8px] font-black uppercase tracking-widest">
                 <span className="text-emerald-400">70% Profits</span>
                 <span className="text-red-400">30% Drawdown</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <BarChart4 size={16} className="text-emerald-400" /> Avg. Monthly
                </div>
                <span className="font-black text-emerald-400">+12.4%</span>
              </div>
              <div className="flex justify-between items-center p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <ShieldCheck size={16} className="text-red-400" /> Max Drawdown
                </div>
                <span className="font-black text-red-500">-4.2%</span>
              </div>
            </div>

            <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-start gap-3">
               <Zap size={16} className="text-emerald-400 shrink-0 mt-0.5" />
               <p className="text-[9px] font-medium text-emerald-500/70 leading-relaxed uppercase tracking-widest">
                 System indicates institutional-level capital management and risk aversion. Highly suitable for stable growth portfolios.
               </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* History Table */}
      <div className="space-y-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
             <BarChart4 size={20} />
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Verified <span className="text-emerald-500">History</span></h2>
        </div>
        
        <Card className="rounded-[2.5rem] border-white/5 overflow-hidden shadow-2xl bg-slate-900/40 backdrop-blur-3xl">
          <Table>
            <TableHeader className="bg-white/[0.02]">
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="py-8 px-10 font-black text-slate-500 uppercase tracking-[0.2em] text-[10px]">Strategic Asset</TableHead>
                <TableHead className="py-8 font-black text-slate-500 uppercase tracking-[0.2em] text-[10px]">Position Bias</TableHead>
                <TableHead className="py-8 font-black text-slate-500 uppercase tracking-[0.2em] text-[10px]">Settlement Status</TableHead>
                <TableHead className="py-8 font-black text-slate-500 uppercase tracking-[0.2em] text-[10px]">Terminal P&L %</TableHead>
                <TableHead className="py-8 pr-10 text-right font-black text-slate-500 uppercase tracking-[0.2em] text-[10px]">Completion Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trader.history?.length === 0 ? (
                <TableRow className="hover:bg-transparent border-transparent">
                  <TableCell
                    colSpan={5}
                    className="h-40 text-center"
                  >
                    <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-xs">No settlements recorded</p>
                  </TableCell>
                </TableRow>
              ) : (
                trader.history?.map((trade) => (
                  <TableRow key={trade.id} className="group hover:bg-white/[0.02] border-white/5 transition-colors">
                    <TableCell className="py-6 px-10">
                       <span className="font-black text-white text-base tracking-tight uppercase group-hover:text-emerald-400 transition-colors">{trade.symbol}</span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "font-black uppercase text-[9px] tracking-widest px-3 py-1 rounded-full border-transparent",
                          trade.direction === "buy" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                        )}
                      >
                        {trade.direction === 'buy' ? 'Long Bias' : 'Short Bias'}
                      </Badge>
                    </TableCell>
                    <TableCell className="capitalize text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                      {trade.status}
                    </TableCell>
                    <TableCell>
                      <div
                        className={cn(
                          "flex items-center gap-1.5 font-black text-lg tracking-tight",
                          trade.profitLossPercent >= 0 ? "text-emerald-400" : "text-red-400"
                        )}
                      >
                        {trade.profitLossPercent >= 0 ? (
                          <ArrowUpRight className="w-5 h-5" />
                        ) : (
                          <ArrowDownRight className="w-5 h-5" />
                        )}
                        {Math.abs(trade.profitLossPercent).toFixed(2)}%
                      </div>
                    </TableCell>
                    <TableCell className="pr-10 text-right text-slate-500 font-black uppercase tracking-widest text-[10px]">
                      {new Date(trade.closedAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Copy Modal Hook */}
      <CopyModal
        trader={trader as any}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
