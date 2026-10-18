"use client";

import { motion } from "framer-motion";
import { Globe, Server, Radio, Zap } from "lucide-react";

const nodes = [
  { x: "20%", y: "30%", city: "New York" },
  { x: "45%", y: "25%", city: "London" },
  { x: "70%", y: "40%", city: "Singapore" },
  { x: "85%", y: "35%", city: "Tokyo" },
  { x: "30%", y: "60%", city: "Sao Paulo" },
  { x: "55%", y: "55%", city: "Dubai" },
];

export default function GlobalReach() {
  return (
    <section className="w-full py-40 relative bg-slate-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-blue-500 font-bold tracking-[0.4em] uppercase text-xs mb-6"
            >
              Zero Lag Infrastructure
            </motion.div>
            <h2 className="text-4xl md:text-7xl font-black mb-8 tracking-tighter text-white leading-none">
              Connecting you to <br />
              <span className="text-blue-500">Global Liquidity</span>
            </h2>
            <p className="text-slate-400 text-xl font-medium leading-relaxed mb-12">
              Our proprietary global server network is strategically positioned next to 
              major financial centers to ensure sub-10ms execution speeds on every trade.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 glass-panel border-white/5 bg-white/[0.02] rounded-3xl">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6">
                  <Server className="h-6 w-6" />
                </div>
                <h4 className="text-xl font-black text-white mb-2 tracking-tight">8 Global Hubs</h4>
                <p className="text-slate-500 text-sm font-medium uppercase tracking-widest">Distributed node network</p>
              </div>
              <div className="p-8 glass-panel border-white/5 bg-white/[0.02] rounded-3xl">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6">
                  <Radio className="h-6 w-6" />
                </div>
                <h4 className="text-xl font-black text-white mb-2 tracking-tight">10ms Latency</h4>
                <p className="text-slate-500 text-sm font-medium uppercase tracking-widest">Ultra-fast execution</p>
              </div>
            </div>
          </div>

          <div className="relative aspect-square md:aspect-video lg:aspect-square">
            {/* Abstract Map Visual */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.1),transparent_70%)]"></div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 2 }}
              className="relative w-full h-full border border-white/5 rounded-[4rem] bg-slate-900/40 backdrop-blur-3xl overflow-hidden"
            >
              {/* Constellation Nodes */}
              {nodes.map((node, i) => (
                <div key={i} className="absolute transition-all" style={{ left: node.x, top: node.y }}>
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 3, delay: i * 0.5 }}
                    className="w-4 h-4 bg-blue-500 rounded-full blur-sm"
                  ></motion.div>
                  <div className="w-2 h-2 bg-white rounded-full absolute top-1 left-1"></div>
                  <div className="absolute top-6 left-0 whitespace-nowrap text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    {node.city}
                  </div>
                </div>
              ))}
              
              {/* Connection Lines (SVG) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                <motion.path
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  transition={{ duration: 3 }}
                  d="M 20 30 Q 45 25 70 40 L 85 35 M 30 60 L 55 55 L 70 40"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.5"
                  className="stroke-blue-500"
                />
              </svg>
              
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <Globe className="w-64 h-64 text-white" />
              </div>
              
              <div className="absolute bottom-10 left-10 p-6 glass-panel border-white/10 bg-blue-500/10 rounded-3xl backdrop-blur-2xl">
                 <div className="flex items-center gap-3">
                   <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping"></div>
                   <span className="text-xs font-black text-white tracking-[0.2em] uppercase">Status: Optimal</span>
                 </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
