"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ApiResponse, Investment } from "@/interfaces";
import { callApi } from "@/lib/helpers";
import { useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import {
  Check,
  TrendingUp,
  ArrowLeft,
  Search,
  ChevronRight,
} from "lucide-react";
import { AssetLogo } from "@/components/common/AssetLogo";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

type CryptoPriceMap = { [id: string]: { price: number; change: number } };

const CRYPTOS = [
  { id: "bitcoin",  name: "Bitcoin",       symbol: "BTC", coingeckoId: "bitcoin" },
  { id: "ethereum", name: "Ethereum",      symbol: "ETH", coingeckoId: "ethereum" },
  { id: "solana",   name: "Solana",        symbol: "SOL", coingeckoId: "solana" },
  { id: "litecoin", name: "Litecoin",      symbol: "LTC", coingeckoId: "litecoin" },
  { id: "bnb",      name: "Binance Coin",  symbol: "BNB", coingeckoId: "binancecoin" },
  { id: "xrp",      name: "XRP",           symbol: "XRP", coingeckoId: "ripple" },
  { id: "usdt_trc20", name: "USDT (TRC20)", symbol: "USDT", coingeckoId: "tether" },
  { id: "usdt_erc20", name: "USDT (ERC20)", symbol: "USDT", coingeckoId: "tether" },
];

export const INVESTMENT_PLANS = [
  { id: "STARTER PLAN",  name: "Starter",   min: 500,    max: 4999,   duration: "3 Weeks", roi: "8 - 12%",  isPopular: false, description: "Perfect for beginners",          features: ["Daily ROI", "Standard market research", "Educational resources", "Standard support"] },
  { id: "SILVER PLAN",   name: "Silver",    min: 5000,   max: 9999,   duration: "3 Weeks", roi: "18 - 22%", isPopular: true,  description: "For active investors",           features: ["Daily ROI", "Advanced market research", "Real-time data", "Priority support"] },
  { id: "GOLD PLAN",     name: "Gold",      min: 10000,  max: 24999,  duration: "1 Month", roi: "25 - 29%", isPopular: false, description: "For serious investors",          features: ["Daily ROI", "Professional-grade research", "Dedicated advisor", "Exclusive opportunities"] },
  { id: "PLATINUM PLAN", name: "Platinum",  min: 25000,  max: 49999,  duration: "1 Month", roi: "30 - 34%", isPopular: false, description: "Institutional grade",            features: ["Daily ROI", "Premium data feeds", "Custom strategies", "24/7 Premium support"] },
  { id: "DIAMOND PLAN",  name: "Diamond",   min: 50000,  max: 99999,  duration: "1 Month", roi: "35 - 39%", isPopular: false, description: "Elite wealth management",        features: ["Daily ROI", "Tax-loss harvesting", "Dedicated advisor", "VIP Events access"] },
  { id: "VIP ELITE PLAN (UNLIMITED)", name: "VIP Elite", min: 100000, max: 1000000, duration: "2 Weeks", roi: "45 - 49%", isPopular: false, description: "Unlimited potential", features: ["Unlimited Max", "Fast turnover", "Institutional liquidity", "White-glove service"] },
];

export default function NewInvestmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const [step, setStep] = useState<1 | 2 | 3>(1); // 1=select asset, 2=select plan, 3=confirm
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCrypto, setSelectedCrypto] = useState<typeof CRYPTOS[0] | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<typeof INVESTMENT_PLANS[0] | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);

  const planId = searchParams.get("plan");
  useEffect(() => {
    if (planId) {
      const plan = INVESTMENT_PLANS.find((p) => p.id === planId);
      if (plan) setSelectedPlan(plan);
    }
  }, [planId]);

  const { data: cryptoPrices = {}, isLoading: pricesLoading } = useQuery<CryptoPriceMap, Error>({
    queryKey: ["crypto-prices"],
    queryFn: async () => {
      const ids = [...new Set(CRYPTOS.map(c => c.coingeckoId))].join(",");
      const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`);
      const data = await res.json();
      const formatted: CryptoPriceMap = {};
      CRYPTOS.forEach(c => {
        if (data[c.coingeckoId]) {
          formatted[c.id] = { price: data[c.coingeckoId].usd, change: data[c.coingeckoId].usd_24h_change };
        }
      });
      return formatted;
    },
    refetchInterval: 30000,
  });

  const filteredCryptos = CRYPTOS.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleConfirm = async () => {
    if (!selectedCrypto || !selectedPlan || investmentAmount <= 0) return;

    const roiMatch = selectedPlan.roi.match(/(\d+)\s*-\s*(\d+)/);
    const avgRoi = roiMatch ? (parseInt(roiMatch[1]) + parseInt(roiMatch[2])) / 2 : 0;
    const estimatedReturn = ((investmentAmount * avgRoi) / 100).toFixed(2);

    setSubmitting(true);
    try {
      const { data: responseData, error } = await callApi<ApiResponse<Investment>>("/investment/create", {
        isRetirement: false,
        plan: selectedPlan.id,
        type: "crypto",
        symbol: selectedCrypto.symbol,
        name: selectedCrypto.name,
        amount: investmentAmount,
      });

      if (error) throw new Error(error.message);

      if (responseData?.status === "success") {
        toast.success("Investment Launched!", {
          description: `${selectedCrypto.name} — ${selectedPlan.name} Plan. Est. return: $${estimatedReturn} (${selectedPlan.roi}%)`,
        });
        queryClient.invalidateQueries({ queryKey: ["investments"] });
        queryClient.invalidateQueries({ queryKey: ["balance"] });
        setTimeout(() => router.push("/dashboard/investments"), 1500);
      }
    } catch (err) {
      toast.error("Investment failed", {
        description: err instanceof Error ? err.message : "Something went wrong",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-y-8 max-w-7xl mx-auto pb-20 mt-16 lg:mt-0">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between bg-slate-900/50 border border-white/5 p-8 rounded-3xl glass-panel relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full -mr-20 -mt-20 pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">
            New <span className="text-emerald-400">Investment</span>
          </h1>
          <p className="text-sm font-medium text-slate-400">
            {step === 1 && "Select a digital asset to invest in."}
            {step === 2 && `Choose an investment plan for ${selectedCrypto?.name}.`}
            {step === 3 && "Review and confirm your investment."}
          </p>
          {/* Step indicator */}
          <div className="flex items-center gap-3 mt-4">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border transition-all ${step >= s ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'bg-white/5 border-white/10 text-slate-500'}`}>
                  {step > s ? <Check className="w-3 h-3" /> : s}
                </div>
                {s < 3 && <div className={`w-8 h-0.5 ${step > s ? 'bg-emerald-500' : 'bg-white/10'}`}></div>}
              </div>
            ))}
          </div>
        </div>
        {step > 1 && (
          <button onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)} className="relative z-10 w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
      </motion.div>

      {/* Step 1: Select Asset */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex flex-col gap-y-6">
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
              <input
                type="text"
                placeholder="Search crypto assets..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full h-14 pl-14 pr-6 rounded-2xl glass-panel bg-slate-900/50 border border-white/5 text-white font-bold focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-slate-600"
              />
            </div>

            <div className="glass-panel bg-slate-900/50 border border-white/5 rounded-3xl overflow-hidden">
              <div className="divide-y divide-white/5">
                {filteredCryptos.map((crypto, i) => {
                  const price = cryptoPrices[crypto.id];
                  return (
                    <motion.button
                      key={crypto.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => { setSelectedCrypto(crypto); setStep(2); }}
                      className="w-full p-6 flex items-center justify-between hover:bg-white/[0.03] transition-colors text-left group"
                    >
                      <div className="flex items-center gap-4">
                        <AssetLogo symbol={crypto.symbol} name={crypto.name} type="crypto" className="h-12 w-12 group-hover:scale-110 transition-transform" />
                        <div>
                          <div className="font-black text-white text-lg">{crypto.name}</div>
                          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{crypto.symbol}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="font-mono font-black text-white text-lg">
                            {pricesLoading ? "..." : price ? `$${price.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "—"}
                          </div>
                          {price && (
                            <div className={`text-xs font-black ${price.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                              {price.change >= 0 ? '+' : ''}{price.change.toFixed(2)}%
                            </div>
                          )}
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Select Plan */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex flex-col gap-y-6">
            {/* Amount input */}
            <div className="glass-panel bg-slate-900/50 border border-white/5 rounded-3xl p-8 flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex items-center gap-4 flex-1">
                {selectedCrypto && <AssetLogo symbol={selectedCrypto.symbol} name={selectedCrypto.name} type="crypto" className="h-12 w-12" />}
                <div>
                  <div className="font-black text-xl text-white">{selectedCrypto?.name}</div>
                  <div className="text-xs font-black text-slate-500 uppercase tracking-widest">{selectedCrypto?.symbol}</div>
                </div>
              </div>
              <div className="flex-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Investment Amount (USD)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black">$</span>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    className="w-full h-14 pl-8 pr-4 rounded-2xl bg-slate-950 border border-white/10 text-white text-xl font-black focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-slate-700"
                    value={investmentAmount || ""}
                    onChange={e => setInvestmentAmount(Number(e.target.value))}
                  />
                </div>
                {selectedPlan && (
                  <p className="text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-widest">
                    Min: ${selectedPlan.min.toLocaleString()} {selectedPlan.max ? `| Max: $${selectedPlan.max.toLocaleString()}` : "| Max: Unlimited"}
                  </p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {INVESTMENT_PLANS.map((plan, i) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedPlan(plan)}
                  className={`relative glass-panel rounded-3xl p-6 cursor-pointer transition-all flex flex-col border ${
                    selectedPlan?.id === plan.id
                      ? "border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.15)]"
                      : "border-white/5 bg-slate-900/50 hover:border-white/20"
                  }`}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                      Most Popular
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className={`text-xl font-black mb-1 ${selectedPlan?.id === plan.id ? 'text-emerald-400' : 'text-white'}`}>{plan.name}</h3>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">{plan.duration}</div>
                    <div className="text-3xl font-black text-white mb-1">{plan.roi}</div>
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                      <span className="text-emerald-400 font-black text-xs uppercase tracking-widest">Est. ROI</span>
                    </div>
                    <p className="text-slate-400 text-sm font-medium mb-4">{plan.description}</p>
                    <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-4">
                      ${plan.min.toLocaleString()} — {plan.max ? `$${plan.max.toLocaleString()}` : "Unlimited"}
                    </div>
                    <ul className="flex flex-col gap-y-2 mb-6">
                      {plan.features.slice(0, 3).map(f => (
                        <li key={f} className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                          <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {selectedPlan?.id === plan.id ? (
                    <button
                      onClick={(e) => { e.stopPropagation(); setStep(3); }}
                      disabled={!investmentAmount || investmentAmount < plan.min || (plan.max !== null && investmentAmount > plan.max)}
                      className="w-full h-12 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.2)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Review Order
                    </button>
                  ) : (
                    <div className="w-full h-12 rounded-2xl border border-white/10 flex items-center justify-center text-slate-400 font-black text-xs uppercase tracking-widest">
                      Select Plan
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="max-w-xl mx-auto flex flex-col gap-y-6">
            <div className="glass-panel bg-slate-900/50 border border-white/5 rounded-3xl p-8 flex flex-col gap-y-6">
              <div className="flex items-center gap-4">
                {selectedCrypto && <AssetLogo symbol={selectedCrypto.symbol} name={selectedCrypto.name} type="crypto" className="h-14 w-14" />}
                <div>
                  <div className="font-black text-2xl text-white">{selectedCrypto?.name}</div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{selectedCrypto?.symbol}</div>
                </div>
              </div>

              <div className="flex flex-col gap-y-4 border-t border-white/5 pt-6">
                {[
                  { label: "Strategy", value: selectedPlan?.name || "" },
                  { label: "ROI Potential", value: selectedPlan?.roi || "" },
                  { label: "Duration", value: selectedPlan?.duration || "" },
                  { label: "Allocation", value: `$${investmentAmount.toLocaleString()}` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
                    <span className="font-black text-white">{value}</span>
                  </div>
                ))}
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex justify-between items-center">
                <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">Total Investment</span>
                <span className="text-2xl font-black text-emerald-400">${investmentAmount.toLocaleString()}</span>
              </div>

              <button
                onClick={handleConfirm}
                disabled={submitting}
                className="w-full h-16 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 text-slate-950 font-black text-lg uppercase tracking-widest shadow-[0_0_40px_rgba(16,185,129,0.3)] transition-all"
              >
                {submitting ? "LAUNCHING..." : "LAUNCH INVESTMENT"}
              </button>
              <p className="text-[10px] text-center font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                By confirming, you authorize the allocation of <span className="text-emerald-400">${investmentAmount.toLocaleString()}</span> to this managed position.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
