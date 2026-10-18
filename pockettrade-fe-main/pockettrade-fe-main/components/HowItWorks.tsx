"use client";

import { motion } from "framer-motion";
import { Users, PieChart, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: <Users className="h-8 w-8 text-white" />,
    title: "Create Account",
    description: "Fill in your details in 30 seconds and gain instant access to the platform.",
    step: "1"
  },
  {
    icon: <PieChart className="h-8 w-8 text-white" />,
    title: "Deposit Funds",
    description: "Choose from various funding methods including Crypto and Bank transfers.",
    step: "2"
  },
  {
    icon: <TrendingUp className="h-8 w-8 text-white" />,
    title: "Predict & Win",
    description: "Select your asset, choose your time-frame, and execute your high-yield trade.",
    step: "3"
  }
];

export default function HowItWorks() {
  return (
    <section className="w-full bg-[#020617] py-40 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-32">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-emerald-500 font-bold tracking-[0.3em] uppercase text-xs mb-4"
          >
            Streamlined Process
          </motion.div>
          <h2 className="text-4xl md:text-7xl font-black mb-8 tracking-tighter">Start in <span className="text-emerald-400">Seconds</span></h2>
          <p className="text-slate-400 text-xl md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed">
            Trading has never been this accessible. Just three clinical steps to your first professional trade.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-20 md:gap-12 relative">
          {/* Connecting lines for desktop */}
          <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-[1px] bg-gradient-to-r from-emerald-500/0 via-emerald-500/20 to-emerald-500/0 z-0"></div>
          
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="flex flex-col items-center text-center group relative z-10"
            >
              <div className="w-24 h-24 rounded-[2.5rem] glass-panel border-white/10 flex items-center justify-center mb-10 relative group-hover:border-emerald-500/50 transition-all duration-500 bg-slate-900 group-hover:scale-110">
                <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-sm shadow-xl shadow-emerald-500/30 ring-4 ring-[#020617]">
                  {step.step}
                </div>
                {step.icon}
              </div>
              <h4 className="text-2xl font-black text-white mb-6 tracking-tight">{step.title}</h4>
              <p className="text-slate-500 font-medium text-lg leading-relaxed px-4">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
