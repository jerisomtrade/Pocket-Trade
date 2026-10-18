"use client";

import { motion } from "framer-motion";
import { HelpCircle, ChevronRight, Zap } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    q: "How fast are trades executed?",
    a: "Our proprietary matching engine ensures trades are executed in under one millisecond, completely bypassing traditional broker slippage and ensuring your entry price is exact."
  },
  {
    q: "How do payouts work?",
    a: "If your market prediction is correct at the exact time of trade maturity, you instantly receive your principal plus the asset's active payout percentage (up to 95%). This is settled instantly into your account balance."
  },
  {
    q: "Is my capital secure?",
    a: "Yes. Jerisom Trade adheres to military-grade encryption and strict internal liquidity protocols. 98% of user digital assets are stored in cold storage vaults, untouched by external market factors."
  },
  {
    q: "How do I withdraw my profits?",
    a: "Withdrawals are automated. Navigate to your dashboard, select your preferred withdrawal method (Crypto, Bank, or Wallet), and funds will bridge instantly to your linked account within minutes."
  },
  {
    q: "What markets can I trade?",
    a: "We offer 80+ global assets including major and minor Forex pairs, Cryptocurrencies (BTC, ETH, etc.), Commodities (Gold, Silver), and US Stocks (Tesla, Apple, Google)."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <main className="flex min-h-screen flex-col items-center justify-start pt-48 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[35%] h-[35%] rounded-full bg-indigo-500/10 blur-[100px]"></div>
        <div className="absolute bottom-[10%] left-[-5%] w-[45%] h-[45%] rounded-full bg-emerald-500/10 blur-[120px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full text-center mb-24"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-emerald-500/30 text-emerald-400 text-sm font-black tracking-widest uppercase mb-8">
          <HelpCircle className="h-4 w-4" /> Global Support
        </div>
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
          Platform <br />
          <span className="gradient-text">Knowledge Base</span>
        </h1>
        <p className="max-w-2xl mx-auto text-xl md:text-2xl text-slate-400 font-medium leading-relaxed">
          Everything you need to know about mastering the Jerisom Trade platform.
        </p>
      </motion.div>

      <div className="w-full space-y-6">
        {faqs.map((faq, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            key={index} 
            className={`glass-panel overflow-hidden border transition-all duration-300 rounded-[2rem] ${openIndex === index ? 'border-emerald-500/30 bg-white/[0.03]' : 'border-white/5 bg-transparent'}`}
          >
            <button 
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full text-left p-8 font-black text-xl text-white flex justify-between items-center focus:outline-none group"
            >
              <span className="flex items-center gap-4">
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-colors ${openIndex === index ? 'bg-emerald-500 text-slate-950' : 'bg-white/5 text-slate-500'}`}>
                  0{index + 1}
                </span>
                {faq.q}
              </span>
              <div className={`w-10 h-10 rounded-full border border-white/10 flex items-center justify-center transition-all duration-300 ${openIndex === index ? 'rotate-90 bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'text-slate-500 group-hover:text-white group-hover:bg-white/5'}`}>
                <ChevronRight className="h-5 w-5" />
              </div>
            </button>
            <motion.div 
              initial={false}
              animate={{ height: openIndex === index ? "auto" : 0, opacity: openIndex === index ? 1 : 0 }}
              className="px-8 text-slate-400 text-lg md:text-xl font-medium leading-relaxed overflow-hidden"
            >
              <div className="pb-10 pt-2 pl-12 max-w-3xl">
                {faq.a}
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Still have questions? */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="mt-32 p-12 glass-panel border-white/5 bg-slate-900/40 rounded-[3rem] w-full flex flex-col items-center text-center"
      >
        <Zap className="h-12 w-12 text-emerald-400 mb-8" />
        <h3 className="text-3xl font-black text-white mb-6">Still have questions?</h3>
        <p className="text-slate-400 text-lg font-medium mb-10 max-w-xl">
          Our global support team is available 24/7 to assist you with any platform-related inquiries.
        </p>
        <button className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-12 py-5 rounded-2xl transition-all shadow-xl shadow-emerald-500/20">
          Contact Support Now
        </button>
      </motion.div>
    </main>
  );
}
