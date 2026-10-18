"use client";

import { motion } from "framer-motion";
import { Bitcoin, Shield, Zap, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Cryptocurrency() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start pt-32 pb-20 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[150px]"></div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-20"
        >
          <span className="text-emerald-500 font-black tracking-widest uppercase mb-4 block">
            Digital Assets
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
            <span className="gradient-text">Cryptocurrency</span>
          </h1>
          <p className="text-xl text-slate-400 font-medium">
            Invest in the future of finance with our secure cryptocurrency
            platform. Buy, sell, and store digital assets with confidence.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="glass-panel p-8 md:p-10 rounded-[2.5rem] border-white/5 bg-slate-900/40 relative"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="h-14 w-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Bitcoin className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">Popular Cryptocurrencies</h2>
                <p className="text-slate-400">Invest in established digital assets</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-10">
              {[
                { name: "Bitcoin (BTC)", symbol: "₿", color: "bg-orange-500" },
                { name: "Ethereum (ETH)", symbol: "Ξ", color: "bg-blue-500" },
                { name: "Solana (SOL)", symbol: "S", color: "bg-green-500" },
                { name: "Polkadot (DOT)", symbol: "P", color: "bg-purple-500" },
              ].map((crypto, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-2xl glass-panel bg-white/[0.02] border-white/5 hover:border-emerald-500/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 ${crypto.color} rounded-full flex items-center justify-center text-white font-black text-lg shadow-lg`}>
                      {crypto.symbol}
                    </div>
                    <span className="text-white font-bold">{crypto.name}</span>
                  </div>
                  <Link 
                    href="/dashboard/new-investment"
                    className="px-6 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold hover:bg-emerald-500 hover:text-slate-950 transition-all"
                  >
                    Buy
                  </Link>
                </div>
              ))}
            </div>

            <Link 
              href="/crypto"
              className="w-full py-4 rounded-xl glass-panel border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold hover:bg-emerald-500/10 transition-colors gap-2"
            >
              View All Cryptocurrencies <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="glass-panel p-8 md:p-10 rounded-[2.5rem] border-white/5 bg-slate-900/40 relative"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="h-14 w-14 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Zap className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">Crypto Features</h2>
                <p className="text-slate-400">Secure and convenient crypto investing</p>
              </div>
            </div>

            <ul className="space-y-6">
              {[
                "Trading available 24/7/365",
                "Cold storage security for 95% of assets",
                "Recurring investments available",
                "Low transaction fees",
                "Easy fiat on/off ramps",
                "Detailed price charts and analytics",
              ].map((feature, idx) => (
                <li key={idx} className="flex items-center gap-4 text-slate-300 font-medium text-lg">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                  {feature}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-24"></div>

        <div className="max-w-5xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black text-center mb-16"
          >
            Our Cryptocurrency <span className="gradient-text">Security Measures</span>
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Lock,
                title: "Cold Storage",
                desc: "95% of all crypto assets are stored offline in air-gapped cold storage vaults.",
              },
              {
                icon: Shield,
                title: "Insurance",
                desc: "Digital assets are insured against theft and cybersecurity breaches.",
              },
              {
                icon: Zap,
                title: "Compliance",
                desc: "We follow strict regulatory guidelines to ensure legal compliance globally.",
              },
            ].map((measure, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass-panel p-8 rounded-[2rem] text-center border-white/5 hover:border-emerald-500/20 transition-colors"
              >
                <div className="bg-emerald-500/10 p-4 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-6 border border-emerald-500/20 shadow-inner">
                  <measure.icon className="h-8 w-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{measure.title}</h3>
                <p className="text-slate-400 font-medium leading-relaxed">
                  {measure.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
