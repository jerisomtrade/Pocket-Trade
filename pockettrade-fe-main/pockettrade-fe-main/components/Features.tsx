"use client";

import { motion, Variants } from "framer-motion";
import {
  Zap,
  BarChart3,
  ShieldCheck,
  Globe,
  Lock,
  Smartphone,
} from "lucide-react";

const features = [
  {
    icon: <Zap className="h-10 w-10 text-emerald-400" />,
    title: "Ultra-Low Latency",
    description:
      "Execute market predictions in under 10ms. Our proprietary global network ensures zero lag at critical entry moments.",
    color: "hover:border-emerald-500/30",
    bg: "bg-emerald-500/10",
    glow: "group-hover:bg-emerald-500/20",
  },
  {
    icon: <BarChart3 className="h-10 w-10 text-blue-400" />,
    title: "Institutional Yields",
    description:
      "Secure the industry's highest payouts—up to 95% on successful trades across 80+ global assets including FX and Crypto.",
    color: "hover:border-blue-500/30",
    bg: "bg-blue-500/10",
    glow: "group-hover:bg-blue-500/20",
  },
  {
    icon: <ShieldCheck className="h-10 w-10 text-indigo-400" />,
    title: "Fortified Security",
    description:
      "Experience absolute peace of mind with 2FA, cold storage for assets, and real-time fraud monitoring on every account.",
    color: "hover:border-indigo-500/30",
    bg: "bg-indigo-500/10",
    glow: "group-hover:bg-indigo-500/20",
  },
];

export default function Features() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <section
      id="features"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32"
    >
      <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-emerald-500 font-bold tracking-[0.3em] uppercase text-xs mb-4"
          >
            Institutional Power
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-7xl font-black tracking-tighter mb-8 leading-[0.9]"
          >
            Engineered for the{" "}
            <span className="text-emerald-400">Winning Edge</span>
          </motion.h2>
          <p className="text-slate-400 text-xl md:text-2xl font-medium leading-relaxed">
            We've stripped away the complexity of trading to give you a pure,
            high-performance interface built for speed.
          </p>
        </div>
        <div className="flex gap-4 p-2 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl">
          <div className="w-14 h-14 rounded-xl border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer">
            <Globe className="h-6 w-6" />
          </div>
          <div className="w-14 h-14 rounded-xl border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer">
            <Lock className="h-6 w-6" />
          </div>
          <div className="w-14 h-14 rounded-xl border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer">
            <Smartphone className="h-6 w-6" />
          </div>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-10"
      >
        {features.map((feature, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            whileHover={{ y: -16 }}
            className={`glass-panel p-12 group border-white/5 ${feature.color} transition-all duration-500 relative overflow-hidden`}
          >
            <div
              className={`absolute top-0 right-0 w-32 h-32 ${feature.bg} blur-[60px] rounded-full translate-x-12 -translate-y-12 opacity-0 group-hover:opacity-100 transition-opacity`}
            ></div>

            <div
              className={`${feature.bg} w-20 h-20 rounded-[2rem] flex items-center justify-center mb-10 border border-white/10 ${feature.glow} transition-all relative z-10`}
            >
              {feature.icon}
            </div>
            <h3 className="text-2xl font-black mb-6 text-white tracking-tight relative z-10">
              {feature.title}
            </h3>
            <p className="text-slate-400 leading-relaxed font-medium text-lg relative z-10">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
