"use client";

import React from "react";
import {
  Play,
  History,
  Wallet,
  BarChart3,
  TrendingUp,
  Activity,
  ArrowUpRight,
  TrendingDown,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "@/store/useSession";
import { useDemoMode } from "@/store/useDemoMode";
import { useQuery } from "@tanstack/react-query";
import { callApi } from "@/lib/helpers";
import { motion } from "framer-motion";

// Shadcn UI Imports
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LiveTradeStats {
  stats: {
    totalTrades: number;
    wonTrades: number;
    totalProfit: number;
  };
  trades: any[];
  bots: any[];
}

export default function LiveTrading() {
  const { user } = useSession((state) => state);
  const { isDemoMode } = useDemoMode();

  const { data: liveData } = useQuery<{ data: LiveTradeStats }>({
    queryKey: ["live-trade-stats"],
    queryFn: async () => {
      const { data, error } = await callApi<{ data: LiveTradeStats }>(
        "/trading/live/stats",
      );
      if (error) throw new Error(error.message);
      return data as { data: LiveTradeStats };
    },
    refetchInterval: 10000,
  });

  const { data: balanceData } = useQuery<{ data: any[] }>({
    queryKey: ["balance", isDemoMode],
    queryFn: async () => {
      const { data, error } = await callApi<{ data: any[] }>("/wallet/user");
      if (error) throw new Error(error.message);
      return data as { data: any[] };
    },
    refetchOnMount: true,
    staleTime: 0,
  });

  const userBalance = balanceData?.data?.[0]?.balance ?? 0;

  const trades = liveData?.data?.trades || [];
  const ongoingTrades = trades.filter((t: any) => t.status === "open");
  const endedTrades = trades.filter((t: any) => t.status !== "open");

  const liveStats = liveData?.data?.stats;
  const winRate =
    liveStats?.totalTrades && liveStats.totalTrades > 0
      ? ((liveStats.wonTrades / liveStats.totalTrades) * 100).toFixed(2)
      : "0.00";

  const totalProfit = liveStats?.totalProfit || 0;
  const isProfitPositive = totalProfit > 0;
  const isProfitNegative = totalProfit < 0;

  const scrollToOngoing = () => {
    const element = document.getElementById("ongoing-trades");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const stats = [
    {
      label: "Total Trades",
      value: liveStats?.totalTrades?.toString() || "0",
      icon: Activity,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      label: "Win Rate",
      value: `${winRate}%`,
      icon: BarChart3,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
    {
      label: isProfitPositive ? "Total Profit" : "Total Loss",
      value: `$${Math.abs(totalProfit).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      icon: isProfitPositive ? TrendingUp : TrendingDown,
      color: isProfitPositive
        ? "text-emerald-400"
        : isProfitNegative
          ? "text-red-400"
          : "text-amber-400",
      bgColor: isProfitPositive
        ? "bg-emerald-500/10"
        : isProfitNegative
          ? "bg-red-500/10"
          : "bg-amber-500/10",
      borderColor: isProfitPositive
        ? "border-emerald-500/20"
        : isProfitNegative
          ? "border-red-500/20"
          : "border-amber-500/20",
    },
    {
      label: "Available Balance",
      value: `$${userBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      icon: Wallet,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20 mt-16 lg:mt-0">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-slate-900/50 border-white/5 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full -mr-20 -mt-20 pointer-events-none"></div>
          <CardContent className="p-8 lg:p-12 relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-4 max-w-xl text-left">
              <Badge
                variant="outline"
                className="gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border-emerald-500/20 text-emerald-400 text-xs font-black tracking-widest uppercase mb-2"
              >
                <Activity className="h-3 w-3" /> Live Markets
              </Badge>
              <h1 className="text-4xl font-black text-white leading-tight">
                Institutional <br />
                <span className="text-emerald-400">Trading Terminal</span>
              </h1>
              <p className="text-slate-400 font-medium leading-relaxed">
                Experience real-time execution with advanced analytics. Access
                deep liquidity pools and trade with precision across global
                markets.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button
                  asChild
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black h-12 px-8 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all uppercase tracking-widest text-sm"
                >
                  <Link href="/dashboard/live-trading/start">
                    <Play className="mr-2 h-4 w-4 fill-current" /> Enter
                    Terminal
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  onClick={scrollToOngoing}
                  className="bg-white/5 border-white/10 hover:bg-white/10 text-white font-black h-12 px-8 rounded-xl transition-all uppercase tracking-widest text-sm"
                >
                  <History className="mr-2 h-4 w-4" /> Active Positions
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            key={stat.label}
          >
            <Card className="glass-panel bg-slate-900/50 border-white/5 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 rounded-2xl ${stat.bgColor} ${stat.color} border ${stat.borderColor}`}
                  >
                    <stat.icon className="h-6 w-6" />
                  </div>
                  {stat.label === "Win Rate" && (
                    <Badge
                      variant="outline"
                      className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border-emerald-500/20 px-2 py-1"
                    >
                      <ArrowUpRight className="h-3 w-3 mr-1" /> +0.5%
                    </Badge>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-black text-white">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Ongoing Trades Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        id="ongoing-trades"
        className="space-y-6"
      >
        <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl font-black text-white">Active Positions</h2>
          <Badge
            variant="outline"
            className="gap-2 text-xs font-bold uppercase tracking-widest text-emerald-500 bg-emerald-500/10 border-emerald-500/20 px-3 py-1.5 rounded-full"
          >
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
            Live
          </Badge>
        </div>

        <Card className="bg-slate-900/50 border-white/5 backdrop-blur-xl overflow-hidden">
          <CardContent className="p-0">
            {ongoingTrades.length === 0 ? (
              <div className="p-16 text-center space-y-4">
                <div className="h-20 w-20 bg-slate-950/50 border border-white/5 rounded-full flex items-center justify-center mx-auto">
                  <Activity className="h-10 w-10 text-slate-600" />
                </div>
                <div>
                  <p className="text-white font-black text-lg mb-1">
                    No Active Positions
                  </p>
                  <p className="text-slate-500 font-medium">
                    Your ongoing market operations will appear here.
                  </p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {ongoingTrades.map((trade: any) => (
                  <div
                    key={trade.id}
                    className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-black text-lg text-white">
                          {trade.symbol}
                        </span>
                        <Badge
                          className={`text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest border ${trade.orderType === "rise" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}
                        >
                          {trade.orderType}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-6 text-sm font-medium">
                        <p className="text-slate-400">
                          Size:{" "}
                          <span className="text-white font-bold">
                            ${trade.amount}
                          </span>
                        </p>
                        <p className="text-slate-400">
                          Entry:{" "}
                          <span className="text-white font-bold font-mono">
                            ${Number(trade.entryPrice || "0").toFixed(2)}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="sm:text-right flex flex-row sm:flex-col justify-between items-center sm:items-end">
                      <Badge className="text-[10px] font-black text-emerald-400 animate-pulse bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
                        Processing Execution...
                      </Badge>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">
                        <span className="text-slate-400">{trade.duration}</span>{" "}
                        timeframe
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Ended Trades Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="space-y-6 pt-4 text-left"
      >
        <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl font-black text-white">Execution History</h2>
          <Button
            variant="link"
            asChild
            className="text-emerald-400 hover:text-emerald-300 text-xs font-bold uppercase tracking-widest p-0 transition-colors"
          >
            <Link
              href="/dashboard/live-trading/start"
              className="flex items-center gap-1"
            >
              Terminal <ArrowUpRight className="w-3 h-3" />
            </Link>
          </Button>
        </div>

        <Card className="bg-slate-900/50 border-white/5 backdrop-blur-xl overflow-hidden">
          <CardContent className="p-0 text-center">
            {endedTrades.length === 0 ? (
              <div className="p-16 text-center space-y-4">
                <div className="h-20 w-20 bg-slate-950/50 border border-white/5 rounded-full flex items-center justify-center mx-auto text-slate-600">
                  <History className="h-10 w-10" />
                </div>
                <div>
                  <p className="text-white font-black text-lg mb-1">
                    Clean Slate
                  </p>
                  <p className="text-slate-500 font-medium mb-6">
                    Your settlement history will be recorded here after
                    positions are closed.
                  </p>
                </div>
                <Button
                  variant="outline"
                  asChild
                  className="border border-white/10 hover:bg-white/5 text-white font-black px-6 py-2.5 rounded-xl transition-all uppercase tracking-widest text-xs"
                >
                  <Link href="/dashboard/live-trading/start">
                    Initialize Terminal
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {endedTrades.map((trade: any) => (
                  <div
                    key={trade.id}
                    className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="text-left">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-black text-white">
                          {trade.symbol}
                        </span>
                        <Badge
                          className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest border ${trade.orderType === "rise" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}
                        >
                          {trade.orderType}
                        </Badge>
                      </div>
                      <p className="text-xs font-medium text-slate-500">
                        Size:{" "}
                        <span className="text-white">${trade.amount}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-black text-lg ${trade.profit > 0 ? "text-emerald-400" : trade.profit < 0 ? "text-red-400" : "text-slate-400"}`}
                      >
                        {trade.profit > 0 ? "+" : ""}
                        {trade.profit > 0
                          ? `$${trade.profit}`
                          : `$${trade.profit}`}
                      </p>
                      <Badge
                        variant="secondary"
                        className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-0.5"
                      >
                        {trade.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
