"use client";

import { motion } from "framer-motion";

const stats = [
  { label: "Volume Traded", value: "$4.2B+", color: "text-white" },
  { label: "Active Traders", value: "150K+", color: "text-emerald-400" },
  { label: "Avg. Latency", value: "10ms", color: "text-white" },
  { label: "Expert Support", value: "24/7", color: "text-white" },
];

export default function Stats() {
  return (
    <section className="w-full py-32 bg-slate-950 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-12 text-center relative z-10">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="group"
          >
            <div className={`text-4xl md:text-6xl font-black mb-4 ${stat.color} tracking-tighter group-hover:scale-110 transition-transform duration-500`}>
              {stat.value}
            </div>
            <div className="text-slate-500 font-bold tracking-[0.2em] text-[10px] md:text-xs uppercase">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Atmospheric detail */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-900/50 to-transparent pointer-events-none"></div>
    </section>
  );
}
