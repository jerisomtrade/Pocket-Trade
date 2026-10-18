"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, DollarSign, Zap, BarChart, ShieldCheck, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const payoutTiers = [
  { asset: "Forex Majors", payout: "Up to 95%", desc: "EUR/USD, GBP/USD, USD/JPY", color: "text-emerald-400" },
  { asset: "Crypto Assets", payout: "Up to 92%", desc: "BTC, ETH, SOL, XRP", color: "text-blue-400" },
  { asset: "US Stocks", payout: "Up to 88%", desc: "TSLA, AAPL, AMZN, GOOGL", color: "text-purple-400" },
  { asset: "Commodities", payout: "Up to 90%", desc: "Gold, Silver, Oil", color: "text-amber-400" }
];

export default function PayoutsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start pt-32 pb-20 relative overflow-hidden bg-slate-950">
      {/* Background decoration */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/5 blur-[150px]"></div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-24"
        >
          <span className="text-emerald-500 font-black tracking-widest uppercase mb-4 block text-xs">Profit Maximization</span>
          <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase mb-6 leading-[0.9]">
            Industry Leading <br />
            <span className="text-emerald-400">Payouts</span>
          </h1>
          <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto mt-8">
            Maximize your returns with our institutional-grade payout structure. Get paid instantly on every successful prediction.
          </p>
        </motion.div>

        {/* Payout Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
          {payoutTiers.map((tier, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-panel p-10 rounded-[3rem] border-white/5 bg-slate-900/40 relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-500"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                 <TrendingUp size={120} className={tier.color} />
              </div>
              
              <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">{tier.asset}</h3>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-10">{tier.desc}</p>
              
              <div className={`text-5xl font-black mb-4 ${tier.color} tracking-tighter`}>{tier.payout}</div>
              <p className="text-slate-400 text-sm font-medium">Return on Investment</p>
            </motion.div>
          ))}
        </div>

        {/* Payout Mechanism */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
           <motion.div 
             initial={{ opacity: 0, x: -30 }}
             whileInView={{ opacity: 1, x: 0 }}
             className="space-y-8"
           >
              <h2 className="text-4xl md:text-6xl font-black text-white leading-tight uppercase tracking-tight">How Payouts <br/><span className="text-emerald-400">Work</span></h2>
              <p className="text-xl text-slate-400 font-medium leading-relaxed">
                When your trade prediction is correct at the time of expiration, your account is instantly credited with your initial investment plus the specified payout percentage.
              </p>
              <ul className="space-y-6">
                {[
                  { icon: Zap, title: "Instant Settlement", desc: "No waiting periods. Funds are available immediately after trade closure." },
                  { icon: ShieldCheck, title: "Guaranteed Rates", desc: "The payout rate you see at entry is exactly what you get at exit." },
                  { icon: BarChart, title: "Dynamic Scaling", desc: "Rates update in real-time based on market volatility and liquidity." }
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-6 items-start">
                    <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-white uppercase tracking-tight">{item.title}</h4>
                      <p className="text-slate-500 text-sm font-medium">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
           </motion.div>
           
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             className="glass-panel p-12 rounded-[4rem] border-white/5 bg-slate-900/60 relative overflow-hidden"
           >
              <div className="flex justify-between items-center mb-12">
                 <h3 className="text-2xl font-black text-white uppercase tracking-tight">Profit Example</h3>
                 <div className="h-12 w-12 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950">
                    <DollarSign className="h-6 w-6" />
                 </div>
              </div>
              <div className="space-y-8">
                 <div className="flex justify-between items-end border-b border-white/5 pb-4">
                    <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">Investment</span>
                    <span className="text-3xl font-black text-white">$1,000.00</span>
                 </div>
                 <div className="flex justify-between items-end border-b border-white/5 pb-4">
                    <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">Asset Payout (95%)</span>
                    <span className="text-3xl font-black text-emerald-400">+$950.00</span>
                 </div>
                 <div className="flex justify-between items-end pt-4">
                    <span className="text-white font-black uppercase tracking-widest text-sm">Total Return</span>
                    <span className="text-5xl font-black text-white tracking-tighter">$1,950.00</span>
                 </div>
              </div>
              <div className="mt-12 p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-center">
                 <p className="text-emerald-400 font-black uppercase tracking-widest text-xs italic">Settled instantly to your wallet</p>
              </div>
           </motion.div>
        </div>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="glass-panel p-12 md:p-20 rounded-[3rem] border-emerald-500/20 bg-emerald-500/5 text-center"
        >
          <h2 className="text-3xl md:text-5xl font-black text-white mb-8">Ready to maximize your <span className="text-emerald-400">returns?</span></h2>
          <Button asChild className="h-16 px-12 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl">
            <Link href="/signup">Start Trading Now <ArrowUpRight className="h-5 w-5 ml-2" /></Link>
          </Button>
        </motion.div>
      </div>
    </main>
  );
}
