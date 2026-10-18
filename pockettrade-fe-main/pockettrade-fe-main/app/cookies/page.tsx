"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cookie, Settings, ShieldCheck, PieChart, Info } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const sections = [
  {
    title: "1. What are Cookies?",
    icon: Info,
    content: "Cookies are small text files that are stored on your device when you visit our website. They help us recognize your device and remember your preferences to provide a better trading experience."
  },
  {
    title: "2. How We Use Cookies",
    icon: PieChart,
    content: "We use cookies for essential platform functions, such as keeping you logged in, remembering your display settings, and analyzing how users interact with our platform to improve performance."
  },
  {
    title: "3. Types of Cookies We Use",
    icon: ShieldCheck,
    content: "We use strictly necessary cookies for security and authentication, functional cookies for preferences, and analytical cookies for performance tracking. We do not use third-party advertising cookies."
  },
  {
    title: "4. Managing Cookies",
    icon: Settings,
    content: "You can manage or disable cookies through your browser settings. However, please note that disabling essential cookies may affect the functionality of the trading platform."
  }
];

export default function CookiePolicy() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start pt-32 pb-20 relative overflow-hidden bg-slate-950">
      {/* Background decoration */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/5 blur-[150px]"></div>
      </div>

      <div className="w-full max-w-4xl mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="text-emerald-500 font-black tracking-widest uppercase mb-4 block text-xs">Transparency Report</span>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase mb-6 leading-tight">
            Cookie <span className="text-emerald-400">Policy</span>
          </h1>
          <p className="text-slate-400 text-lg font-medium max-w-2xl mx-auto">
            Transparent data management for a seamless institutional trading experience.
          </p>
        </motion.div>

        <div className="space-y-8">
          {sections.map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-panel p-8 md:p-12 rounded-[2.5rem] border-white/5 bg-slate-900/40 group hover:border-emerald-500/30 transition-all duration-500"
            >
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="shrink-0 h-16 w-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
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
          className="mt-20 text-center glass-panel p-12 rounded-[3rem] border-emerald-500/20 bg-emerald-500/5"
        >
          <div className="flex justify-center mb-6">
             <Cookie className="h-12 w-12 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">Manage your preferences</h2>
          <p className="text-slate-400 font-medium mb-8">You can adjust your cookie settings at any time within your account security panel.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="h-14 px-8 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase tracking-widest rounded-xl transition-all">
              <Link href="/dashboard/settings">Open Settings</Link>
            </Button>
            <Button variant="outline" asChild className="h-14 px-8 bg-white/5 border-white/10 text-white hover:bg-white/10 font-black uppercase tracking-widest rounded-xl transition-all">
              <Link href="/privacy">View Privacy Policy</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
