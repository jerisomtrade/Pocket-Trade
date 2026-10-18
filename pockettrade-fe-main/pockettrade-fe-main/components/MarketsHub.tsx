"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bitcoin,
  ChevronRight,
  Loader2,
  TrendingUp,
  TrendingDown,
  Globe,
  Coins,
  BarChart3,
  Building2,
  Activity,
  Zap,
} from "lucide-react";
import { callApi } from "@/lib/helpers/callApi";
import { useDemoMode } from "@/store/useDemoMode";
import { motion } from "framer-motion";

const initialCategories = [
  {
    title: "Cryptocurrency",
    id: "crypto",
    description:
      "Trade Bitcoin, Ethereum and top decentralized digital assets with deep liquidity.",
    icon: Bitcoin,
    color: "from-emerald-500 to-teal-500",
    performance: "...",
    isHot: true,
  },
  {
    title: "Forex",
    id: "forex",
    description:
      "Trade major, minor and exotic currency pairs with tight spreads and high leverage.",
    icon: Globe,
    color: "from-blue-500 to-indigo-500",
    performance: "...",
    isHot: false,
  },
  {
    title: "Stocks",
    id: "stock",
    description:
      "Invest in shares of leading global companies across various sectors.",
    icon: Building2,
    color: "from-sky-500 to-blue-600",
    performance: "...",
    isHot: false,
  },
  {
    title: "Commodities",
    id: "commodity",
    description: "Access global markets for Gold, Silver, and precious metals.",
    icon: Coins,
    color: "from-amber-500 to-orange-500",
    performance: "...",
    isHot: false,
  },
  {
    title: "ETFs",
    id: "etf",
    description:
      "Diversify your portfolio with Exchange Traded Funds tracking major sectors.",
    icon: BarChart3,
    color: "from-purple-500 to-pink-500",
    performance: "...",
    isHot: false,
  },
  {
    title: "Energy",
    id: "energy",
    description:
      "Trade energy markets including Solar, Wind, and renewable resources.",
    icon: Activity,
    color: "from-rose-500 to-orange-500",
    performance: "...",
    isHot: true,
  },
  {
    title: "Oil & Gas",
    id: "oil_gas",
    description:
      "Access institutional liquidity in Crude Oil, Natural Gas and Heating Oil.",
    icon: Zap,
    color: "from-slate-700 to-slate-900",
    performance: "...",
    isHot: false,
  },
];

interface MarketSummary {
  categories: Array<{ type: string; performance: string }>;
  tickers: Array<{
    symbol: string;
    name: string;
    price: number;
    change_percentage: number;
    change_dollar: number;
  }>;
}

export default function MarketsHub() {
  const [categories, setCategories] = useState(initialCategories);
  const [tickers, setTickers] = useState<MarketSummary["tickers"]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isDemoMode } = useDemoMode();

  useEffect(() => {
    const fetchSummary = async () => {
      const { data, error } = await callApi<any>("/assets/summary");
      if (data && data.data) {
        const summary: MarketSummary = data.data;

        setCategories((prev) =>
          prev.map((cat) => {
            const catPerf = summary.categories.find((c) => c.type === cat.id);
            return {
              ...cat,
              performance: catPerf
                ? `${Number(catPerf.performance) > 0 ? "+" : ""}${Number(catPerf.performance).toFixed(2)}%`
                : "0.00%",
            };
          }),
        );

        setTickers(summary.tickers);
      }
      setIsLoading(false);
    };

    fetchSummary();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20 mt-16 lg:mt-0">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 bg-slate-900/50 border border-white/5 p-8 rounded-3xl glass-panel relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full -mr-20 -mt-20 pointer-events-none"></div>

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase">
              Global <span className="text-emerald-400">Markets</span>
            </h1>
            <p className="text-slate-400 font-medium mt-2 max-w-xl">
              Discover opportunities across digital assets, currencies,
              commodities and global equities. Real-time institutional data at
              your fingertips.
            </p>
          </div>
          {isLoading && (
            <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
          )}
        </div>
      </motion.div>

      {/* Market Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-panel bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden overflow-x-auto custom-scrollbar"
      >
        <div className="p-4 flex items-center justify-between whitespace-nowrap min-w-max gap-8 px-8">
          <div className="flex gap-10">
            {tickers.length > 0 ? (
              tickers.map((ticker) => (
                <div key={ticker.symbol} className="flex items-center gap-3">
                  <span className="text-slate-500 text-xs uppercase tracking-widest font-black">
                    {ticker.symbol.replace("OANDA:", "").replace("_", "/")}
                  </span>
                  <span className="font-mono text-white font-bold">
                    $
                    {Number(ticker.price).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <span
                    className={`text-sm font-black flex items-center ${ticker.change_percentage >= 0 ? "text-emerald-400" : "text-red-400"}`}
                  >
                    {ticker.change_percentage >= 0 ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {Number(Math.abs(ticker.change_percentage)).toFixed(2)}%
                  </span>
                </div>
              ))
            ) : (
              <div className="flex gap-10 opacity-50 animate-pulse">
                {["BTC/USD", "ETH/USD", "SOL/USD"].map((s) => (
                  <div key={s} className="flex items-center gap-3">
                    <span className="text-slate-500 text-xs uppercase tracking-widest font-black">
                      {s}
                    </span>
                    <span className="font-mono text-white font-bold">$...</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Link
            href="/dashboard/live-trading"
            className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl"
          >
            Live Feed
          </Link>
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, i) => (
          <Link key={category.id} href={`/dashboard/markets/${category.id}`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="group glass-panel bg-slate-900/50 border border-white/5 rounded-3xl p-6 relative overflow-hidden transition-all hover:border-emerald-500/30 cursor-pointer h-full flex flex-col"
            >
              <div
                className={`absolute top-0 right-0 w-32 h-32 -mr-12 -mt-12 rounded-full bg-gradient-to-br ${category.color} opacity-5 group-hover:opacity-10 transition-opacity blur-[40px]`}
              />

              <div className="relative z-10 flex-1">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center text-white mb-6 shadow-xl shadow-emerald-500/10 group-hover:scale-110 transition-transform duration-300`}
                >
                  <category.icon className="w-7 h-7" />
                </div>

                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-2xl font-black text-white group-hover:text-emerald-400 transition-colors">
                    {category.title}
                  </h2>
                  <span
                    className={`text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest border ${category.performance.startsWith("+") || category.performance === "..." ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}
                  >
                    {category.performance}
                  </span>
                </div>

                <p className="text-sm text-slate-400 font-medium leading-relaxed mb-6">
                  {category.description}
                </p>
              </div>

              <div className="relative z-10 flex items-center text-emerald-500 text-xs font-black uppercase tracking-widest group-hover:gap-2 transition-all mt-auto pt-4 border-t border-white/5">
                Browse Assets
                <ChevronRight className="w-4 h-4 ml-1" />
              </div>

              {category.isHot && (
                <div className="absolute top-6 right-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                  Hot
                </div>
              )}
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
