"use client";

import React from "react";
import { motion } from "framer-motion";
import { Briefcase, Users, Zap, Globe, Rocket, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const roles = [
  { title: "Senior Quant Analyst", location: "San Francisco / Remote", type: "Full-Time", team: "Engineering" },
  { title: "Financial Compliance Officer", location: "London / Hybrid", type: "Full-Time", team: "Legal" },
  { title: "Senior Frontend Engineer", location: "Remote", type: "Contract", team: "Product" },
  { title: "Customer Success Lead", location: "Singapore", type: "Full-Time", team: "Support" }
];

export default function CareersPage() {
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
          <span className="text-emerald-500 font-black tracking-widest uppercase mb-4 block text-xs">Join the Evolution</span>
          <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase mb-6 leading-[0.9]">
            Build the Future of <br />
            <span className="text-emerald-400">Finance</span>
          </h1>
          <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto mt-8">
            We're looking for visionary thinkers and disciplined builders to scale the world's most advanced asset prediction ecosystem.
          </p>
        </motion.div>

        {/* Culture Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-32">
          {[
            { icon: Rocket, title: "Hyper-Growth", desc: "Work at the intersection of high-frequency finance and cutting-edge tech." },
            { icon: Globe, title: "Global Impact", desc: "Our platform serves institutional and retail traders across 150+ countries." },
            { icon: Users, title: "Elite Team", desc: "Collaborate with specialists from top-tier financial and tech institutions." }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-panel p-10 rounded-[3rem] border-white/5 bg-slate-900/40 text-center flex flex-col items-center"
            >
              <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-8">
                <item.icon className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">{item.title}</h3>
              <p className="text-slate-400 font-medium leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">Open Positions</h2>
            <div className="hidden md:flex gap-4">
               {["All", "Engineering", "Legal", "Support"].map(cat => (
                 <button key={cat} className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-white hover:border-emerald-500/50 transition-all">{cat}</button>
               ))}
            </div>
          </div>

          {roles.map((role, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group glass-panel p-8 rounded-[2rem] border-white/5 bg-slate-900/40 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-emerald-500/30 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-6">
                <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 group-hover:text-emerald-400 transition-all">
                  <Briefcase className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-xl font-black text-white uppercase tracking-tight">{role.title}</h4>
                  <div className="flex gap-4 mt-1">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{role.team}</span>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">•</span>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{role.location}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-8">
                 <span className="text-[10px] font-black text-emerald-500/50 uppercase tracking-widest border border-emerald-500/20 px-4 py-2 rounded-lg">{role.type}</span>
                 <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-slate-500 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">
                    <ArrowRight className="h-5 w-5" />
                 </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Benefits CTA */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-32 glass-panel p-12 md:p-20 rounded-[4rem] border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden text-center"
        >
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
             <Zap size={300} className="text-emerald-400" />
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight">Don't see the <br/><span className="text-emerald-400">perfect role?</span></h2>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto font-medium">We're always looking for exceptional talent. Send us your resume and we'll keep you in mind for future opportunities.</p>
          <Button asChild className="h-16 px-12 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase tracking-widest rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all">
            <Link href="/contact">Send Open Application</Link>
          </Button>
        </motion.div>
      </div>
    </main>
  );
}
