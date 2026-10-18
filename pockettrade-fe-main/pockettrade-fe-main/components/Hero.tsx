"use client";

import { motion } from "framer-motion";
import { ArrowRight, Activity } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-10 md:mt-20 flex flex-col items-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-emerald-500/30 text-emerald-400 text-sm font-medium mb-8"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        Institutional Trading Infrastructure Online
      </motion.div>

      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8"
      >
        Master the Art of <br />
        <span className="gradient-text">Asset Predictions</span>
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="max-w-3xl mx-auto text-lg md:text-2xl text-slate-400 mb-12 font-medium leading-relaxed"
      >
        Join the global elite. Execute high-speed binary trades with up to 95% payouts, 
        zero slippage, and institutional-grade security on our world-class platform.
      </motion.p>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-6"
      >
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(16,185,129,0.4)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/signup")}
          className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-10 py-5 rounded-2xl flex justify-center items-center gap-3 text-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
        >
          Get Started Now <ArrowRight className="h-6 w-6" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/cryptocurrency")}
          className="w-full sm:w-auto glass-panel font-bold px-10 py-5 rounded-2xl flex justify-center items-center gap-3 text-xl text-white transition-all"
        >
          Explore Markets <Activity className="h-6 w-6 text-emerald-400" />
        </motion.button>
      </motion.div>

      {/* Platform Mockup Visual */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: "circOut" }}
        className="relative mt-16 sm:mt-24 w-full max-w-5xl group animate-float"
      >
        <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
        <div className="relative glass-panel border-white/10 rounded-2xl sm:rounded-[2rem] p-2 sm:p-4 overflow-hidden shadow-2xl">
          <div className="w-full bg-slate-950/50 rounded-xl sm:rounded-2xl flex border border-white/5 h-[220px] sm:h-auto sm:aspect-[16/9]">

            {/* Sidebar — hidden on mobile */}
            <div className="hidden sm:flex w-12 md:w-16 border-r border-white/5 flex-col items-center py-6 gap-6 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              </div>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-8 h-8 rounded-lg bg-white/5 border border-white/5"></div>
              ))}
            </div>

            {/* Main Area */}
            <div className="flex-1 p-3 sm:p-4 md:p-8 flex flex-col min-w-0">
              {/* Header row — always single row */}
              <div className="flex items-center justify-between mb-3 sm:mb-8 gap-2">
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="h-2 w-16 sm:w-32 bg-white/10 rounded-full"></div>
                  <div className="h-5 px-2 bg-emerald-500/20 rounded flex items-center shrink-0">
                    <span className="text-emerald-500 text-[8px] sm:text-[10px] font-bold tracking-widest uppercase">Live</span>
                  </div>
                </div>
                <div className="px-3 sm:px-6 py-1.5 sm:py-3 bg-slate-900 rounded-lg sm:rounded-xl flex items-center border border-white/10 shadow-inner shrink-0">
                  <span className="text-emerald-400 font-mono text-[11px] sm:text-lg font-black tracking-tighter">$64,230.15</span>
                  <span className="ml-1 sm:ml-2 text-emerald-500/50 text-[9px] sm:text-xs font-bold">+1.24%</span>
                </div>
              </div>

              {/* Chart */}
              <div className="flex-1 relative bg-white/[0.02] overflow-hidden rounded-xl sm:rounded-2xl flex items-end border border-white/5 px-2 sm:px-10 pb-3 sm:pb-6 gap-0.5 sm:gap-0">
                {[40, 60, 45, 80, 55, 90, 70, 85, 60, 75, 50, 65, 80, 95, 70].map((h, i) => (
                  <motion.div
                    key={i}
                    className={`flex-1 rounded-t-sm sm:rounded-t-lg bg-gradient-to-t from-emerald-500/0 ${i % 4 === 0 ? 'to-rose-500/40' : 'to-emerald-500/40'}`}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 1, delay: 0.8 + (i * 0.05) }}
                  />
                ))}

                {/* Floating Indicator — hidden on mobile */}
                <motion.div
                  animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                  className="hidden sm:flex absolute top-1/4 right-1/4 glass-panel px-4 py-2 rounded-2xl border-emerald-500/50 items-center gap-3 shadow-2xl backdrop-blur-2xl"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-xs text-white font-black tracking-widest">+92.4% REVENUE</span>
                </motion.div>

                {/* Grid Lines */}
                <div className="absolute inset-0 grid grid-cols-1 grid-rows-4 pointer-events-none opacity-20">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="border-t border-white/10 w-full"></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Trade Panel — desktop only */}
            <div className="hidden lg:flex w-64 border-l border-white/5 p-6 flex-col gap-6">
              <div className="space-y-4">
                <div className="h-1 text-[10px] font-black text-slate-500 uppercase tracking-widest">Prediction Amount</div>
                <div className="h-12 w-full bg-white/5 rounded-xl border border-white/10 flex items-center px-4 justify-between">
                  <span className="text-white font-bold">$1,000</span>
                  <span className="text-slate-500 text-xs">USD</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-1 text-[10px] font-black text-slate-500 uppercase tracking-widest">Expiration Time</div>
                <div className="h-12 w-full bg-white/5 rounded-xl border border-white/10 flex items-center px-4 justify-between">
                  <span className="text-white font-bold">1 Minute</span>
                  <span className="text-emerald-500 text-xs">NEW</span>
                </div>
              </div>
              <div className="mt-auto flex flex-col gap-3">
                <div className="h-14 w-full bg-rose-500/10 rounded-2xl border border-rose-500/30 flex items-center justify-center text-rose-500 font-black tracking-widest hover:bg-rose-500/20 transition-colors cursor-pointer">SELL / PUT</div>
                <div className="h-14 w-full bg-emerald-500/90 rounded-2xl border border-emerald-500/30 flex items-center justify-center text-slate-950 font-black tracking-widest hover:bg-emerald-400 transition-colors cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.3)]">BUY / CALL</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
