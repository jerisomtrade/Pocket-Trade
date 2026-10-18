"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Wallet,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "@/store/useSession";
import { useDemoMode } from "@/store/useDemoMode";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { callApi } from "@/lib/helpers";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

declare global {
  interface Window {
    TradingView: any;
  }
}

export default function LiveTradingView() {
  const { actions } = useSession((state) => state);
  const { isDemoMode } = useDemoMode();
  const queryClient = useQueryClient();
  const containerRef = useRef<HTMLDivElement>(null);
  const [symbol, setSymbol] = useState("BTCUSD");
  const [orderType, setOrderType] = useState("rise");
  const [amount, setAmount] = useState<number>(0);
  const [duration, setDuration] = useState("1m");
  const [loading, setLoading] = useState(false);

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

  const displayBalance = balanceData?.data?.[0]?.balance ?? 0;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      if (containerRef.current) {
        new window.TradingView.widget({
          container_id: containerRef.current.id,
          width: "100%",
          height: 600,
          symbol: `BITSTAMP:${symbol}`,
          interval: "1",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          toolbar_bg: "#020617",
          enable_publishing: false,
          allow_symbol_change: true,
          details: true,
          hotlist: true,
          calendar: true,
          show_popup_button: true,
          popup_width: "1000",
          popup_height: "650",
          backgroundColor: "rgba(2, 6, 23, 0.5)",
          gridColor: "rgba(255, 255, 255, 0.05)",
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [symbol]);

  const router = useRouter();

  const handleStartTrade = async () => {
    if (amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (amount > displayBalance) {
      toast.error("Insufficient balance");
      return;
    }

    setLoading(true);

    try {
      const { error } = await callApi("/trading/live/execute", {
        symbol,
        amount,
        orderType,
        duration,
      });

      if (error) {
        toast.error(error.message || "Failed to execute trade");
      } else {
        toast.success(
          `Trade executed: ${symbol} ${orderType.toUpperCase()} for $${amount}`,
        );
        queryClient.invalidateQueries({ queryKey: ["balance"] });
        queryClient.invalidateQueries({ queryKey: ["investments"] });
        queryClient.invalidateQueries({ queryKey: ["transactions"] });
        actions.getSession();
        router.push("/dashboard/live-trading");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-y-6 max-w-[1600px] mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center gap-4 bg-slate-900/50 border border-white/5 p-4 rounded-3xl glass-panel">
        <Link href="/dashboard/live-trading" className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-colors text-slate-400 hover:text-white">
           <ArrowLeft className="h-6 w-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-white tracking-tighter">
            LIVE <span className="text-emerald-400">TERMINAL</span>
          </h1>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Institutional Execution Environment
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Chart Area */}
        <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-y-6">
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="rounded-3xl border border-white/5 shadow-2xl overflow-hidden glass-panel bg-[#020617]/80">
            <div id="tradingview_widget" ref={containerRef} className="w-full h-[600px]" />
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {["BTCUSD", "ETHUSD", "XRPUSD", "SOLUSD"].map((s) => (
              <button
                key={s}
                onClick={() => setSymbol(s)}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-center gap-3 ${
                  symbol === s
                    ? "border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.15)] text-white"
                    : "border-white/5 bg-slate-900/50 hover:bg-white/5 text-slate-400 hover:text-white"
                }`}
              >
                <div className={`h-8 w-8 rounded-full flex items-center justify-center font-black text-xs ${symbol === s ? 'bg-emerald-500 text-slate-950' : 'bg-white/10'}`}>
                  {s.substring(0, 1)}
                </div>
                <span className="text-sm font-black tracking-widest">{s}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Order Entry Area */}
        <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-y-6">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="rounded-3xl border border-white/5 shadow-2xl glass-panel bg-slate-900/80 sticky top-24">
            <div className="p-6 flex flex-col gap-y-8">
              
              {/* Balance */}
              <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/5">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Available Balance
                  </p>
                  <Wallet className="h-4 w-4 text-emerald-400" />
                </div>
                <p className="text-2xl font-black text-white">
                  {balanceData ? `$${displayBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : "Loading..."}
                </p>
              </div>

              {/* Order Type */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setOrderType("rise")}
                  className={`h-20 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all border ${
                    orderType === "rise"
                      ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                      : "bg-white/5 border-white/10 text-slate-500 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <TrendingUp className="h-6 w-6" />
                  <span className="text-xs font-black uppercase tracking-widest">Buy / Long</span>
                </button>
                <button
                  onClick={() => setOrderType("fall")}
                  className={`h-20 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all border ${
                    orderType === "fall"
                      ? "bg-red-500/20 border-red-500/50 text-red-400 shadow-[0_0_30px_rgba(239,68,68,0.2)]"
                      : "bg-white/5 border-white/10 text-slate-500 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <TrendingDown className="h-6 w-6" />
                  <span className="text-xs font-black uppercase tracking-widest">Sell / Short</span>
                </button>
              </div>

              {/* Inputs */}
              <div className="flex flex-col gap-y-6">
                <div className="flex flex-col gap-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    Position Size (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full h-14 pl-8 pr-4 rounded-2xl bg-slate-950 border border-white/10 text-white text-lg font-black focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-slate-700"
                      value={amount || ""}
                      onChange={(e) => setAmount(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    Expiration Time
                  </label>
                  <select 
                    value={duration} 
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full h-14 px-4 rounded-2xl bg-slate-950 border border-white/10 text-white font-bold focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all appearance-none cursor-pointer"
                  >
                    <option value="1m">1 Minute</option>
                    <option value="5m">5 Minutes</option>
                    <option value="15m">15 Minutes</option>
                    <option value="1h">1 Hour</option>
                  </select>
                </div>
              </div>

              {/* Execution Details */}
              <div className="pt-6 border-t border-white/10 flex flex-col gap-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Payout Rate</span>
                  <span className="text-sm font-black text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">+85.00%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Potential Return</span>
                  <span className="text-xl font-black text-white">
                    ${(amount * 0.85).toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={handleStartTrade}
                  disabled={loading}
                  className={`w-full h-16 mt-4 font-black text-lg rounded-2xl transition-all flex items-center justify-center gap-2 uppercase tracking-widest shadow-2xl ${
                    orderType === 'rise' 
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20' 
                    : 'bg-red-500 hover:bg-red-400 text-white shadow-red-500/20'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading ? "EXECUTING..." : (
                    <>
                      <Zap className="h-5 w-5 fill-current" />
                      EXECUTE {orderType === 'rise' ? 'BUY' : 'SELL'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
