"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, Lock, FileText, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const sections = [
  {
    title: "1. Introduction",
    icon: Shield,
    content: "Welcome to Jerisom Trade. These Terms of Service govern your use of our website and services. By accessing or using our platform, you agree to be bound by these Terms. If you disagree with any part of the Terms, then you may not access our services."
  },
  {
    title: "2. Account Registration",
    icon: Lock,
    content: "When you create an account with us, you must provide accurate, complete, and current information. You are responsible for safeguarding the password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account."
  },
  {
    title: "3. Investment Risks",
    icon: FileText,
    content: "All investments involve risk, including the possible loss of principal. Past performance does not guarantee future results. Jerisom Trade does not provide personalized investment advice, and the information provided on our platform should not be construed as such."
  },
  {
    title: "4. User Conduct",
    icon: CheckCircle,
    content: "You agree not to use our platform in any way that violates applicable laws or regulations, to impersonate others, or to engage in any conduct that restricts or inhibits anyone's use of our services."
  },
  {
    title: "5. Intellectual Property",
    icon: Shield,
    content: "The content, features, and functionality of our platform are owned by Jerisom Trade and are protected by copyright, trademark, and other intellectual property laws."
  }
];

export default function TermsOfService() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start pt-32 pb-20 relative overflow-hidden bg-slate-950">
      {/* Background decoration */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/5 blur-[150px]"></div>
      </div>

      <div className="w-full max-w-4xl mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="text-emerald-500 font-black tracking-widest uppercase mb-4 block text-xs">Legal Documentation</span>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase mb-6 leading-tight">
            Terms of <span className="text-emerald-400">Service</span>
          </h1>
          <p className="text-slate-400 text-lg font-medium max-w-2xl mx-auto">
            Last updated: May 2026. Please read these terms carefully before using our institutional platform.
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
          <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">Have questions about our terms?</h2>
          <p className="text-slate-400 font-medium mb-8">Our legal and compliance team is available to assist you with any inquiries.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="h-14 px-8 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase tracking-widest rounded-xl transition-all">
              <Link href="/contact">Contact Legal Team</Link>
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
