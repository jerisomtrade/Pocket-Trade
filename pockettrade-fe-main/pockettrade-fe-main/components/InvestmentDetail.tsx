"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, ArrowDownRight, Loader2, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { ApiResponse } from "@/interfaces";
import { UserInvestment } from "@/interfaces/ApiResponse";
import { callApi } from "@/lib/helpers";
import { useQuery } from "@tanstack/react-query";
import { AssetLogo } from "@/components/common/AssetLogo";
import { motion } from "framer-motion";

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

const getInvestmentPrice = (
  investment: UserInvestment,
  cryptoPrices: CryptoPriceMap,
) => {
  if (investment.type === "crypto" && SUPPORTED_CRYPTOS[investment.symbol]) {
    return cryptoPrices[investment.symbol]?.price ?? Number(investment.price);
  }
  return Number(investment.price);
};

const getChangePercentage = (
  investment: UserInvestment,
  cryptoPrices: CryptoPriceMap,
) => {
  if (investment.type === "crypto" && SUPPORTED_CRYPTOS[investment.symbol]) {
    return (
      cryptoPrices[investment.symbol]?.change ??
      Number(investment.change_percentage)
    );
  }
  return Number(investment.change_percentage);
};

const getTotalValue = (
  investment: UserInvestment,
) => {
  const principal = Number(investment.amount || 0);
  const currentProfit = Number(investment.dailyprofit || 0);
  return (principal + currentProfit).toFixed(2);
};

export default function InvestmentDetailClient({
  investmentId,
}: {
  investmentId: string;
}) {
  const router = useRouter();
  const [investment, setInvestment] = useState<UserInvestment[] | null>(null);

  const { data: cryptoPrices = {}, isLoading: isCryptoLoading } = useQuery<
    CryptoPriceMap,
    Error
  >({
    queryKey: ["crypto-prices"],
    queryFn: async () => {
      const uniqueIds = Array.from(
        new Set(Object.values(SUPPORTED_CRYPTOS).map((c) => c.coingeckoId)),
      );
      const ids = uniqueIds.join(",");
      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
      );
      const data = await res.json();

      const formatted: CryptoPriceMap = {};
      Object.entries(SUPPORTED_CRYPTOS).forEach(([symbol, { coingeckoId }]) => {
        if (data[coingeckoId]) {
          formatted[symbol] = {
            price: data[coingeckoId].usd,
            change: data[coingeckoId].usd_24h_change,
          };
        }
      });

      return formatted;
    },
    refetchInterval: 30000,
  });

  const { isLoading, error } = useQuery<UserInvestment[], Error>({
    queryKey: ["investment", investmentId],
    queryFn: async () => {
      const { data: responseData, error } = await callApi<
        ApiResponse<UserInvestment[]>
      >(`/investment/find?investmentId=${investmentId}`);

      if (error) {
        throw new Error(error.message || "Failed to fetch investment data");
      }

      if (!responseData?.data) {
        throw new Error("No investment found");
      }

      setInvestment(responseData.data);
      return responseData.data;
    },
  });

  const handleBack = () => {
    router.push("/dashboard/investments");
  };

  const investmentDetails = useMemo(() => {
    if (!investment?.[0]) return null;

    const currentPrice = getInvestmentPrice(investment[0], cryptoPrices);
    const changePercentage = getChangePercentage(investment[0], cryptoPrices);
    const totalValue = getTotalValue(investment[0]);

    return {
      currentPrice,
      changePercentage,
      totalValue,
      isPositive: changePercentage > 0,
    };
  }, [investment, cryptoPrices]);

  if (isLoading || isCryptoLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (error || !investment) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8 space-y-4">
        <h2 className="text-xl font-black text-white">
          {error ? "Error loading investment" : "Investment not found"}
        </h2>
        <button onClick={handleBack} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-6 py-2 rounded-xl transition-colors">
          Back to Portfolio
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20 mt-16 lg:mt-0">
      {/* Header Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-slate-900/50 border border-white/5 p-8 rounded-3xl glass-panel relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full -mr-20 -mt-20 pointer-events-none"></div>
        
        <div className="relative z-10 flex items-center gap-6">
          <button 
            onClick={handleBack}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-4">
            <AssetLogo
              symbol={investment[0]?.symbol}
              name={investment[0]?.name}
              type={investment[0]?.type}
              className="h-14 w-14"
            />
            <div>
              <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-1">
                {investment[0]?.name}
              </h1>
              <div className="flex items-center gap-3">
                <span className="text-sm font-black text-slate-500 uppercase tracking-widest">{investment[0]?.symbol}</span>
                {investment[0]?.type && (
                  <span className="text-[10px] bg-white/5 text-slate-400 border border-white/10 px-2 py-0.5 rounded-md uppercase tracking-widest font-black">
                    {investment[0]?.type}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative z-10 w-full md:w-auto">
          <button
            className="w-full md:w-auto h-12 px-8 flex items-center justify-center bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
            onClick={() => router.push(`/dashboard/new-investment`)}
          >
            Increase Allocation
          </button>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Details */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="md:col-span-2 space-y-8">
          <div className="glass-panel bg-slate-900/50 border border-white/5 rounded-3xl p-8 relative overflow-hidden">
            <h2 className="text-sm font-black text-white uppercase tracking-widest mb-8">Position Overview</h2>
            
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-2">Market Price</p>
                <div className="flex items-center gap-4">
                  <h3 className="text-4xl font-black text-white">
                    ${investmentDetails?.currentPrice.toFixed(2)}
                  </h3>
                  <div className={`flex items-center gap-1 font-black text-sm px-2 py-1 rounded-lg border ${investmentDetails?.isPositive ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-red-400 bg-red-500/10 border-red-500/20'}`}>
                    {investmentDetails?.isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                    <span>{Math.abs(investmentDetails?.changePercentage ?? 0).toFixed(2)}%</span>
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-2">Units Held</p>
                <h3 className="text-4xl font-black text-white font-mono">
                  {(() => {
                    const principal = Number(investment[0]?.amount || 0);
                    const currentPrice = investmentDetails?.currentPrice ?? 0;
                    const currentProfit = Number(investment[0]?.dailyprofit || 0);
                    const currentValue = principal + currentProfit;
                    
                    return (currentPrice > 0) 
                      ? (currentValue / currentPrice).toFixed(4)
                      : Number(investment[0]?.shares).toFixed(4);
                  })()}
                </h3>
              </div>
            </div>

            <div className="h-px w-full bg-white/5 mb-8"></div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-2">Total Value</p>
                <h3 className="text-2xl font-black text-white">
                  ${investmentDetails?.totalValue}
                </h3>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-2">Unrealized P&L</p>
                <div className={`text-2xl font-black ${+(investment[0]?.percentageprofit ?? 0) >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {+(investment[0]?.percentageprofit ?? 0) >= 0 ? "+" : "-"}
                  ${Math.abs(+(investment[0]?.dailyprofit ?? 0)).toFixed(2)}{" "}
                  <span className="text-base opacity-70">
                    ({Math.abs(+(investment[0]?.percentageprofit ?? 0)).toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>

            <div className="h-px w-full bg-white/5 mb-8"></div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-2">Initial Allocation</p>
                <p className="text-lg font-black text-slate-300">
                  ${Number(investment[0]?.amount || 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-2">Strategy Type</p>
                <p className="text-lg font-black text-slate-300 uppercase tracking-widest">
                  {investment[0]?.plan || "Standard"}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Info Box */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="md:col-span-1">
          <div className="glass-panel bg-slate-900/50 border border-white/5 rounded-3xl p-8 space-y-8 sticky top-24">
            <div>
              <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-3">About {investment[0]?.name}</h4>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">
                {investment[0]?.type?.toLowerCase().includes("stock") &&
                  `This represents a fractional or full ownership in ${investment[0]?.name}. Stocks are a key component of a diversified portfolio, offering potential for long-term capital appreciation and dividends.`}
                {investment[0]?.type?.toLowerCase().includes("etf") &&
                  `An Exchange Traded Fund (ETF) that provides exposure to a basket of assets related to ${investment[0]?.name}. ETFs offer instant diversification and professional management.`}
                {investment[0]?.type?.toLowerCase().includes("crypto") &&
                  `A digital asset investment in ${investment[0]?.name}. Cryptocurrencies are known for their high volatility and potential for significant returns in the digital economy.`}
                {investment[0]?.type?.toLowerCase().includes("retirement") &&
                  `A specialized ${investment[0]?.retirementAccountType || ""} retirement plan designed for long-term tax-advantaged growth to secure your financial future.`}
                {!["stock", "etf", "crypto", "retirement"].some(t => investment[0]?.type?.toLowerCase().includes(t)) && 
                  `A managed investment position in ${investment[0]?.name}. Our AI-driven strategies monitor market conditions 24/7 to optimize returns for this ${investment[0]?.type} asset.`}
              </p>
            </div>

            <div className="h-px w-full bg-white/5"></div>

            <div>
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Asset Class</h4>
              <div className="inline-block bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-xs px-3 py-1.5 rounded-lg">
                {investment[0]?.type}
              </div>
            </div>

            <div className="h-px w-full bg-white/5"></div>

            <div>
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Execution Date</h4>
              <p className="text-white font-black">
                {investment[0]?.created_at &&
                  format(new Date(investment[0]?.created_at), "MMMM dd, yyyy")}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
