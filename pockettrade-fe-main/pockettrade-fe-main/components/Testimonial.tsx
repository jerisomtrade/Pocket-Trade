"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";

export default function Testimonial() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-40">
      <div className="glass-panel p-12 md:p-24 relative overflow-hidden flex flex-col md:flex-row items-center gap-16 rounded-[3rem] border-white/5 bg-slate-900/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2"></div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="w-32 h-32 md:w-56 md:h-56 rounded-[3rem] bg-gradient-to-br from-emerald-400 to-blue-500 flex-shrink-0 flex items-center justify-center p-1.5 shadow-2xl relative z-10"
        >
          <div className="w-full h-full rounded-[2.8rem] bg-slate-950 flex items-center justify-center overflow-hidden">
             <span className="text-4xl md:text-7xl font-black text-white tracking-tighter">MK</span>
          </div>
          <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-xl border-4 border-slate-900">
            <Zap className="h-6 w-6 text-slate-950 fill-slate-950" />
          </div>
        </motion.div>
        
        <div className="flex-1 relative z-10">
          <div className="flex gap-1.5 mb-10">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + (i * 0.1) }}
              >
                <Zap className="h-6 w-6 text-emerald-400 fill-emerald-400" />
              </motion.div>
            ))}
          </div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl md:text-5xl font-bold text-white mb-10 leading-[1.1] tracking-tight italic"
          >
            "Jerisom Trade completely changed my perspective on binary trading. The execution speed is unmatched, and the interface makes decision-making effortless."
          </motion.p>
          <div className="flex items-center gap-6">
            <div className="h-[2px] w-12 bg-emerald-500"></div>
            <div>
              <div className="font-black text-white text-2xl tracking-tight">Marcus King</div>
              <div className="text-slate-500 font-bold tracking-[0.2em] text-xs uppercase mt-1">Professional Day Trader</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
