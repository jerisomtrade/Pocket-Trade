"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, Eye, Server, Fingerprint, ShieldAlert, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Lock, title: "Cold Storage", desc: "98% of user digital assets are stored in geographically distributed offline vaults, untouched by external network factors." },
  { icon: Fingerprint, title: "Multi-Factor Auth", desc: "Rigorous 2FA requirements for all account withdrawals and sensitive security setting changes." },
  { icon: Server, title: "Encrypted Infrastructure", desc: "Our global server network utilizes AES-256 military-grade encryption for all data at rest and in transit." },
  { icon: Eye, title: "Real-time Monitoring", desc: "Advanced AI algorithms monitor all platform activity 24/7 to detect and prevent fraudulent transactions." }
];

export default function SecurityPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start pt-32 pb-20 relative overflow-hidden bg-slate-950">
      {/* Background decoration */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/5 blur-[150px]"></div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-24"
        >
          <span className="text-emerald-500 font-black tracking-widest uppercase mb-4 block text-xs">Fortress Architecture</span>
          <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase mb-6 leading-[0.9]">
            Institutional <br />
            <span className="text-emerald-400">Security</span>
          </h1>
          <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto mt-8">
            Your asset sovereignty is our primary mission. We've built a multi-layered defense system to protect your capital.
          </p>
        </motion.div>

        {/* Security Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-32">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-panel p-12 rounded-[3rem] border-white/5 bg-slate-900/40 flex flex-col items-start group hover:border-emerald-500/30 transition-all duration-500"
            >
              <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-8 group-hover:scale-110 transition-transform">
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tight">{feature.title}</h3>
              <p className="text-lg text-slate-400 font-medium leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Deep Security */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
           <motion.div 
             initial={{ opacity: 0, x: -30 }}
             whileInView={{ opacity: 1, x: 0 }}
             className="space-y-12"
           >
              <div>
                 <h2 className="text-4xl md:text-6xl font-black text-white leading-tight uppercase tracking-tight">Our Security <br/><span className="text-emerald-400">Standards</span></h2>
                 <p className="text-xl text-slate-400 font-medium mt-6">
                    Jerisom Trade operates with a zero-trust architecture. Every component of our system is designed to isolate risk and ensure absolute integrity.
                 </p>
              </div>

              <div className="space-y-6">
                 {[
                   "SOC 2 Type II Compliant Infrastructure",
                   "Annual Independent Penetration Testing",
                   "Bug Bounty Program for Security Research",
                   "Internal Security & Compliance Audits"
                 ].map((item, i) => (
                   <div key={i} className="flex items-center gap-4 text-white font-bold text-lg glass-panel py-5 px-8 rounded-2xl border-white/5">
                     <CheckCircle className="text-emerald-500 h-6 w-6 shrink-0" /> {item}
                   </div>
                 ))}
              </div>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             className="glass-panel p-12 rounded-[4rem] border-emerald-500/20 bg-emerald-500/5 flex flex-col items-center text-center relative overflow-hidden"
           >
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                 <ShieldCheck size={300} className="text-emerald-400" />
              </div>
              
              <div className="h-24 w-24 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-10 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                 <ShieldAlert className="h-12 w-12" />
              </div>
              
              <h3 className="text-3xl font-black text-white mb-6 uppercase tracking-tight">Insured Custody</h3>
              <p className="text-lg text-slate-400 font-medium leading-relaxed mb-10">
                In addition to our technical safeguards, all digital assets held on our platform are covered by an institutional insurance policy against potential security breaches.
              </p>
              
              <Button asChild className="h-16 px-12 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase tracking-widest rounded-2xl transition-all">
                <Link href="/faq">Learn about Custody</Link>
              </Button>
           </motion.div>
        </div>
      </div>
    </main>
  );
}
