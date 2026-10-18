"use client";

import { AssetLogo } from "@/components/common/AssetLogo";
import { ApiResponse, UserInvestmentData } from "@/interfaces";
import { UserInvestment, Wallet } from "@/interfaces/ApiResponse";
import { callApi } from "@/lib/helpers";
import { useSession } from "@/store/useSession";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronRight,
  Filter,
  Plus,
  Search,
  TrendingDown,
  TrendingUp,
  Bot,
  PieChart,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDemoMode } from "@/store/useDemoMode";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface CryptoPriceData {
  price: number;
  change: number;
}

type CryptoPriceMap = Record<string, CryptoPriceData>;

const SUPPORTED_CRYPTOS: Record<string, { name: string; coingeckoId: string }> =
  {
    BTC: { name: "Bitcoin", coingeckoId: "bitcoin" },
    ETH: { name: "Ethereum", coingeckoId: "ethereum" },
    LTC: { name: "Litecoin", coingeckoId: "litecoin" },
    BNB: { name: "Binance Coin", coingeckoId: "binancecoin" },
    SOL: { name: "Solana", coingeckoId: "solana" },
    USDT: { name: "USDT", coingeckoId: "tether" },
    USDT_TRC20: { name: "USDT (TRC20)", coingeckoId: "tether" },
    USDT_ERC20: { name: "USDT (ERC20)", coingeckoId: "tether" },
  };

export default function DashboardInvestments() {
  const router = useRouter();
  const { user } = useSession((state) => state);
  const { isDemoMode } = useDemoMode();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const { data: investments = [], isLoading: loading } = useQuery<
    UserInvestmentData,
    Error
  >({
    queryKey: ["investments", isDemoMode],
    queryFn: async () => {
      const { data: responseData, error } =
        await callApi<ApiResponse<UserInvestmentData>>("/investment/user");
      if (error) throw new Error(error.message);
      return responseData?.data || [];
    },
  });

  const { data: cryptoPrices = {}, isLoading: isLoadingPrices } = useQuery<
    CryptoPriceMap,
    Error
  >({
    queryKey: ["crypto-prices"],
    queryFn: async () => {
      try {
        const uniqueIds = Array.from(
          new Set(Object.values(SUPPORTED_CRYPTOS).map((c) => c.coingeckoId)),
        );
        const ids = uniqueIds.join(",");
        const res = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
        );
        const data = await res.json();

        const formatted: CryptoPriceMap = {};
        Object.entries(SUPPORTED_CRYPTOS).forEach(
          ([symbol, { coingeckoId }]) => {
            if (data[coingeckoId]) {
              formatted[symbol] = {
                price: data[coingeckoId].usd,
                change: data[coingeckoId].usd_24h_change,
              };
            }
          },
        );

        return formatted;
      } catch (err) {
        return {};
      }
    },
    refetchInterval: 30000,
  });

  const { data: balance } = useQuery<Wallet[], Error>({
    queryKey: ["balance", isDemoMode],
    queryFn: async () => {
      const { data: responseData, error } =
        await callApi<ApiResponse<Wallet[]>>("/wallet/user");
      if (error) throw new Error(error.message);
      return responseData?.data || [];
    },
  });

  const { data: userBots = [] } = useQuery<any[], Error>({
    queryKey: ["user-bots", isDemoMode],
    queryFn: async () => {
      const { data: responseData, error } =
        await callApi<ApiResponse<any[]>>("/trading/user/bots");
      if (error) throw new Error(error.message);
      return responseData?.data || [];
    },
  });

  const handleNewInvestment = () => {
    router.push("/dashboard/new-investment");
  };

  const handleViewInvestment = (id: string) => {
    router.push(`/dashboard/investments/${id}`);
  };

  const { totalValue, totalProfitValue } = (investments || []).reduce(
    (acc, item) => {
      const principal = parseFloat(item.amount?.toString() || "0");
      const currentProfit = parseFloat(item.dailyprofit?.toString() || "0");
      return {
        totalValue: acc.totalValue + principal + currentProfit,
        totalProfitValue: acc.totalProfitValue + currentProfit,
      };
    },
    { totalValue: 0, totalProfitValue: 0 },
  );

  const displayPortfolioValue =
    totalValue > 0 ? totalValue : (balance?.[0]?.portfolioBalance ?? 0);
  const displayTotalProfit =
    totalValue > 0 ? totalProfitValue : (user?.[0]?.totalProfit ?? 0);

  const totalChange =
    (investments || []).reduce((acc, investment) => {
      return acc + +investment.percentageprofit;
    }, 0) || 0;

  const filteredInvestments = investments.filter((inv) => {
    if (activeTab !== "all" && activeTab !== "crypto" && activeTab !== "bots") {
      if (inv.type !== activeTab) return false;
    }
    if (activeTab === "crypto" && inv.type !== "crypto") return false;

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        inv.name.toLowerCase().includes(search) ||
        inv.symbol.toLowerCase().includes(search)
      );
    }
    return true;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20 mt-16 lg:mt-0">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/50 border border-white/5 p-8 rounded-3xl glass-panel relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full -mr-20 -mt-20 pointer-events-none"></div>

        <div className="relative z-10">
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">
            My <span className="text-emerald-400">Portfolio</span>
          </h1>
          <p className="text-sm font-medium text-slate-400">
            Track and manage your institutional investments.
          </p>
        </div>

        <div className="relative z-10 w-full sm:w-auto">
          <button
            onClick={handleNewInvestment}
            className="w-full sm:w-auto h-12 px-6 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
          >
            <Plus className="w-4 h-4" /> New Investment
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-panel bg-slate-900/50 border border-white/5 rounded-3xl p-8 relative overflow-hidden"
      >
        <div className="flex items-center gap-2 mb-8">
          <PieChart className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-black text-white uppercase tracking-widest">
            Portfolio Summary
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
              Total Value
            </p>
            <h3 className="text-3xl font-black text-white">
              $
              {displayPortfolioValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </h3>
            {investments?.length > 0 && user?.[0] && (
              <div className="flex items-center mt-2 text-sm font-black">
                {displayTotalProfit >= 0 ? (
                  <TrendingUp className="text-emerald-400 h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="text-red-400 h-4 w-4 mr-1" />
                )}
                <span
                  className={
                    displayTotalProfit >= 0
                      ? "text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20"
                      : "text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20"
                  }
                >
                  {displayTotalProfit >= 0 ? "+" : ""}$
                  {Math.abs(displayTotalProfit).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            )}
          </div>

          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
              Today's Returns
            </p>
            <h3 className="text-3xl font-black text-white">
              {+(user?.[0]?.dailyProfitChange || "0") >= 0 ? "+" : ""}$
              {Math.abs(user?.[0]?.dailyProfitChange || 0).toLocaleString(
                undefined,
                { minimumFractionDigits: 2, maximumFractionDigits: 2 },
              )}
            </h3>
            {investments?.length > 0 && (
              <div className="flex items-center mt-2 text-sm font-black">
                {totalChange >= 0 ? (
                  <TrendingUp className="text-emerald-400 h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="text-red-400 h-4 w-4 mr-1" />
                )}
                <span
                  className={
                    totalChange >= 0
                      ? "text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20"
                      : "text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20"
                  }
                >
                  {totalChange >= 0 ? "+" : ""}
                  {totalChange.toFixed(2)}%
                </span>
              </div>
            )}
          </div>

          <div className="sm:col-span-2 md:col-span-1">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
              Active Allocations
            </p>
            <h3 className="text-3xl font-black text-white">
              {investments?.length || 0}
            </h3>
            <div className="flex gap-2 mt-3 flex-wrap">
              {investments?.filter((i) => i.type === "crypto").length > 0 && (
                <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 uppercase tracking-widest">
                  {investments.filter((i) => i.type === "crypto").length} Crypto
                </span>
              )}
              {userBots.length > 0 && (
                <span className="text-[10px] font-black text-purple-400 bg-purple-500/10 px-2 py-1 rounded border border-purple-500/20 uppercase tracking-widest">
                  {userBots.length} Bots
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex w-full overflow-x-auto custom-scrollbar pb-2 gap-2">
            {[
              { id: "all", label: "All Assets" },
              { id: "crypto", label: "Crypto" },
              { id: "bots", label: "AI Bots" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === tab.id
                    ? "bg-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                    : "bg-slate-900/50 border border-white/5 text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <div className="relative flex-grow group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
              <input
                placeholder="Search allocations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-900/50 border border-white/5 text-white font-bold focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-slate-600 glass-panel"
              />
            </div>
            <div className="relative">
              <button
                onClick={() => setShowFilterMenu((v) => !v)}
                className={`w-12 h-12 flex items-center justify-center rounded-xl border transition-colors glass-panel ${showFilterMenu ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-slate-900/50 border-white/5 text-slate-400 hover:text-white hover:bg-white/5"}`}
              >
                <Filter className="h-4 w-4" />
              </button>
              {showFilterMenu && (
                <div className="absolute right-0 top-14 z-50 w-40 rounded-xl bg-slate-900 border border-white/10 shadow-xl overflow-hidden">
                  {[
                    { id: "all", label: "All Assets" },
                    { id: "crypto", label: "Crypto" },
                    { id: "bots", label: "AI Bots" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => { setActiveTab(opt.id); setShowFilterMenu(false); }}
                      className={`w-full text-left px-4 py-3 text-xs font-black uppercase tracking-widest transition-colors ${activeTab === opt.id ? "text-emerald-400 bg-emerald-500/10" : "text-slate-400 hover:text-white hover:bg-white/5"}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {activeTab !== "bots" && (
          <div className="glass-panel bg-slate-900/50 border border-white/5 rounded-3xl overflow-hidden overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="py-5 px-6 font-black text-slate-500 uppercase tracking-widest text-[10px]">
                    Asset
                  </th>
                  <th className="py-5 px-6 font-black text-slate-500 uppercase tracking-widest text-[10px]">
                    Current Price
                  </th>
                  <th className="py-5 px-6 font-black text-slate-500 uppercase tracking-widest text-[10px]">
                    Units
                  </th>
                  <th className="py-5 px-6 font-black text-slate-500 uppercase tracking-widest text-[10px]">
                    Total Value
                  </th>
                  <th className="py-5 px-6 font-black text-slate-500 uppercase tracking-widest text-[10px]">
                    Profit / Loss
                  </th>
                  <th className="py-5 px-6 font-black text-slate-500 uppercase tracking-widest text-[10px] text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={6} className="h-20 bg-white/5"></td>
                    </tr>
                  ))
                ) : filteredInvestments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="h-40 text-center font-bold text-slate-500 uppercase tracking-widest text-xs"
                    >
                      No investments found.
                    </td>
                  </tr>
                ) : (
                  filteredInvestments.map((investment) => {
                    const isCrypto = investment.type === "crypto";
                    const symbol = investment.symbol.toUpperCase();
                    const meta = isCrypto ? SUPPORTED_CRYPTOS[symbol] : null;
                    const priceData = isCrypto ? cryptoPrices[symbol] : null;

                    const price = isCrypto
                      ? (priceData?.price ?? 0)
                      : Number(investment.price);

                    const principal = Number(investment.amount || 0);
                    const currentProfit = Number(investment.dailyprofit || 0);
                    const currentValue = principal + currentProfit;

                    const shares =
                      Number(investment.shares) === 1 &&
                      principal > price &&
                      price > 0
                        ? currentValue / price
                        : Number(investment.shares);

                    return (
                      <tr
                        key={investment.id}
                        className="group hover:bg-white/[0.02] transition-colors cursor-pointer"
                        onClick={() => handleViewInvestment(investment.id)}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <AssetLogo
                              symbol={symbol}
                              name={meta?.name ?? investment.name}
                              type={investment.type}
                              className="h-10 w-10 transition-transform group-hover:scale-110"
                            />
                            <div>
                              <div className="font-black text-white text-base">
                                {meta?.name ?? investment.name}
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                  {symbol}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 font-mono font-bold text-white">
                          {isCrypto && isLoadingPrices
                            ? "..."
                            : `$${price.toFixed(2)}`}
                        </td>
                        <td className="py-4 px-6 font-mono font-medium text-slate-300">
                          {shares.toFixed(4)}
                        </td>
                        <td className="py-4 px-6 font-mono font-bold text-white text-lg">
                          {isCrypto && isLoadingPrices
                            ? "..."
                            : `$${currentValue.toFixed(2)}`}
                        </td>
                        <td className="py-4 px-6">
                          <div
                            className={`font-black text-sm ${+investment.percentageprofit > 0 ? "text-emerald-400" : +investment.percentageprofit < 0 ? "text-red-400" : "text-slate-400"}`}
                          >
                            ${Number(investment.dailyprofit || 0).toFixed(2)}
                            <span className="ml-1 opacity-70">
                              (
                              {Number(investment.percentageprofit || 0).toFixed(
                                2,
                              )}
                              %)
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button className="h-8 w-8 inline-flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {(activeTab === "all" || activeTab === "bots") &&
          userBots.length > 0 && (
            <div className="glass-panel bg-slate-900/50 border border-white/5 rounded-3xl overflow-hidden p-6 mt-6">
              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                <Bot className="w-4 h-4 text-purple-400" /> Active AI Bots
              </h3>
              <div className="grid gap-4">
                {userBots.map((bot) => (
                  <div
                    key={bot.id}
                    className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                        <Bot className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-black text-white">{bot.name}</h4>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">
                          Autonomous Trading AI
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Operational
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
