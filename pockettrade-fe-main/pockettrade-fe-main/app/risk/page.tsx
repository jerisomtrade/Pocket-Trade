"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, TrendingDown, ShieldAlert, BarChart3, HelpCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const sections = [
  {
    title: "1. High Risk Investment",
    icon: ShieldAlert,
    content: "Trading complex financial instruments involves a high level of risk and may not be suitable for all investors. The high degree of leverage can work against you as well as for you."
  },
  {
    title: "2. Market Volatility",
    icon: TrendingDown,
    content: "Financial markets are subject to rapid and unexpected changes in price. Factors such as economic events, political instability, and market sentiment can cause significant price fluctuations."
  },
  {
    title: "3. No Guarantees",
    icon: BarChart3,
    content: "Past performance is not indicative of future results. Jerisom Trade does not guarantee profits or the avoidance of losses. You should only invest capital that you can afford to lose."
  },
  {
    title: "4. Technical Risks",
    icon: HelpCircle,
    content: "Trading on an electronic platform involves risks such as hardware or software failure and internet connectivity issues. While we maintain robust infrastructure, these factors can affect trade execution."
  }
];

export default function RiskDisclosure() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start pt-32 pb-20 relative overflow-hidden bg-slate-950">
      {/* Background decoration */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-red-500/5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-amber-500/5 blur-[150px]"></div>
      </div>

      <div className="w-full max-w-4xl mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="text-red-500 font-black tracking-widest uppercase mb-4 block text-xs">Risk Warning</span>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase mb-6 leading-tight">
            Risk <span className="text-red-500">Disclosure</span>
          </h1>
          <p className="text-slate-400 text-lg font-medium max-w-2xl mx-auto">
            Trading involves significant risk of loss. Please ensure you fully understand the risks involved before trading.
          </p>
        </motion.div>

        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-500/10 border border-red-500/20 p-8 rounded-[2rem] flex items-start gap-6 mb-12"
          >
            <AlertTriangle className="h-10 w-10 text-red-500 shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight mb-2">Important Warning</h2>
              <p className="text-red-400/80 font-medium leading-relaxed">
                Trading in financial markets carries a high level of risk and may result in the loss of all your invested capital. You should not invest more than you can afford to lose.
              </p>
            </div>
          </motion.div>

          {sections.map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-panel p-8 md:p-12 rounded-[2.5rem] border-white/5 bg-slate-900/40 group hover:border-red-500/30 transition-all duration-500"
            >
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="shrink-0 h-16 w-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                  <section.icon className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">
                    {section.title}
                  </h3>
                  <p className="text-lg text-slate-400 leading-relaxed font-medium">
                    {section.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-20 text-center glass-panel p-12 rounded-[3rem] border-white/10 bg-slate-900/60"
        >
          <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">Need further clarification?</h2>
          <p className="text-slate-400 font-medium mb-8">Our compliance officers are available to discuss our risk management protocols with you.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="h-14 px-8 bg-white text-slate-950 hover:bg-slate-200 font-black uppercase tracking-widest rounded-xl transition-all">
              <Link href="/contact">Contact Compliance</Link>
            </Button>
            <Button variant="outline" asChild className="h-14 px-8 bg-white/5 border-white/10 text-white hover:bg-white/10 font-black uppercase tracking-widest rounded-xl transition-all">
              <Link href="/faq">View FAQs</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
