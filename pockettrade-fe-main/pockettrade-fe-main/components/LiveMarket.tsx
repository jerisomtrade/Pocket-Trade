"use client";

import { motion } from "framer-motion";
import { TradingViewAdvancedChart } from "./TradingViewChart";
import { Info, TrendingUp } from "lucide-react";

export default function LiveMarket() {
  return (
    <section id="markets" className="w-full py-32 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-6"
            >
              <TrendingUp className="h-3 w-3" /> Professional Terminal
            </motion.div>
            <h2 className="text-4xl md:text-7xl font-black mb-8 tracking-tighter text-white">
              Institutional <br />
              <span className="text-blue-500">Market Intelligence</span>
            </h2>
            <p className="text-slate-400 text-xl font-medium leading-relaxed">
              Experience the power of real-time technical analysis with our integrated TradingView terminal.
              Execute with the same data the pros use.
            </p>
          </div>
          
          <div className="glass-panel p-6 bg-slate-900/50 border-white/5 flex items-center gap-4 max-w-sm rounded-[2rem]">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
              <Info className="h-6 w-6" />
            </div>
            <div className="text-xs text-slate-400 font-medium leading-normal">
              Fully interactive dashboard with over 100+ technical indicators and drawing tools built-in.
            </div>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(37,99,235,0.2)] bg-[#131722]"
        >
          <TradingViewAdvancedChart symbol="BITSTAMP:BTCUSD" />
        </motion.div>
      </div>
    </section>
  );
}
