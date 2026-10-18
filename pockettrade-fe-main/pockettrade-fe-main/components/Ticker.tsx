"use client";

import { motion } from "framer-motion";
import { TrendingUp, Activity } from "lucide-react";

const tickerData = [
  { pair: "EUR/USD", value: "1.0854", change: "+0.02%", positive: true, label: "EUR" },
  { pair: "BTC/USD", value: "64,230", change: "+1.24%", positive: true, label: "BTC" },
  { pair: "TSLA", value: "174.12", change: "-0.45%", positive: false, label: "TSL" },
  { pair: "ETH/USD", value: "3,452", change: "+0.85%", positive: true, label: "ETH" },
  { pair: "XAU/USD", value: "2,384", change: "+0.12%", positive: true, label: "GOLD" },
  { pair: "GBP/JPY", value: "191.42", change: "-0.22%", positive: false, label: "GBP" },
];

export default function Ticker() {
  return (
    <section className="w-full mt-40 overflow-hidden py-12 glass-nav border-t border-b border-white/5 bg-slate-950/20">
      <motion.div 
        animate={{ x: [0, -1920] }}
        transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
        className="flex whitespace-nowrap gap-24 px-10"
      >
        {[...Array(6)].map((_, groupIndex) => (
          <div key={groupIndex} className="flex gap-24 items-center">
            {tickerData.map((item, i) => (
              <div key={`${groupIndex}-${i}`} className="flex items-center gap-5 group cursor-pointer hover:bg-white/5 p-3 rounded-2xl transition-all">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 flex items-center justify-center text-[10px] font-black tracking-tighter shadow-xl group-hover:border-emerald-500/30">
                  {item.label}
                </div>
                <div>
                  <div className="font-black text-white text-sm tracking-tight mb-1">{item.pair}</div>
                  <div className={`font-mono text-sm flex items-center gap-2 ${item.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {item.value} 
                    {item.positive ? <TrendingUp className="h-3 w-3" /> : <Activity className="h-3 w-3" />}
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 opacity-70">{item.change}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </motion.div>
    </section>
  );
}
