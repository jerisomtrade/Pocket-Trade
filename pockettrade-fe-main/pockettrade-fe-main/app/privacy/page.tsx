"use client";

import React from "react";
import { motion } from "framer-motion";
import { Eye, Shield, Lock, Database, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const sections = [
  {
    title: "1. Information We Collect",
    icon: Database,
    content: "We collect information you provide directly to us when you create an account, complete your profile, or communicate with us. This includes identity data, contact details, and financial information necessary for institutional trading."
  },
  {
    title: "2. How We Use Information",
    icon: Search,
    content: "We use the information we collect to provide, maintain, and improve our services, to process your transactions, and to comply with legal and regulatory requirements including KYC and AML protocols."
  },
  {
    title: "3. Data Security",
    icon: Shield,
    content: "We implement industry-standard security measures, including end-to-end encryption and cold storage, to protect your data from unauthorized access, alteration, or destruction."
  },
  {
    title: "4. Information Sharing",
    icon: Lock,
    content: "We do not share your personal information with third parties except as required by law, to provide our services, or with your explicit consent."
  },
  {
    title: "5. Your Privacy Rights",
    icon: Eye,
    content: "You have the right to access, correct, or delete your personal data. You can manage your privacy settings directly within your account dashboard."
  }
];

export default function PrivacyPolicy() {
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
          <span className="text-emerald-500 font-black tracking-widest uppercase mb-4 block text-xs">Privacy Framework</span>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase mb-6 leading-tight">
            Privacy <span className="text-emerald-400">Policy</span>
          </h1>
          <p className="text-slate-400 text-lg font-medium max-w-2xl mx-auto">
            Your data sovereignty is our priority. Learn how we protect and manage your personal information.
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
          <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">Need more information?</h2>
          <p className="text-slate-400 font-medium mb-8">Our Data Protection Officer is ready to answer any questions regarding your privacy.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="h-14 px-8 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase tracking-widest rounded-xl transition-all">
              <Link href="/contact">Inquire about Privacy</Link>
            </Button>
            <Button variant="outline" asChild className="h-14 px-8 bg-white/5 border-white/10 text-white hover:bg-white/10 font-black uppercase tracking-widest rounded-xl transition-all">
              <Link href="/signup">Return to Signup</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
