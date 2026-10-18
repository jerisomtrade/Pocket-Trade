"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Globe, MessageSquare, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start pt-32 pb-20 relative overflow-hidden bg-slate-950">
      {/* Background decoration */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/5 blur-[150px]"></div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="text-emerald-500 font-black tracking-widest uppercase mb-4 block text-xs">Global Relations</span>
          <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase mb-6 leading-[0.9]">
            Get in <span className="text-emerald-400">Touch</span>
          </h1>
          <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto mt-8">
            Connect with our global support and institutional investment teams 24/7.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            {[
              { icon: Mail, title: "Email Support", desc: "Our team typically responds within 1 hour.", value: "support@pockettrade.com" },
              { icon: Phone, title: "Institutional Desk", desc: "For high-volume traders and partnerships.", value: "+1 (555) 123-4567" },
              { icon: MapPin, title: "Global Headquarters", desc: "Institutional Asset Management Center.", value: "Financial District, San Francisco, CA" },
              { icon: Clock, title: "Support Hours", desc: "We are always available for you.", value: "24/7 Global Availability" }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="glass-panel p-8 rounded-[2rem] border-white/5 bg-slate-900/40 group hover:border-emerald-500/30 transition-all"
              >
                <div className="flex gap-6 items-center">
                  <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                    <item.icon className="h-7 w-7" />
                  </div>
                  <div>
                    <h4 className="text-white font-black uppercase tracking-tight text-sm mb-1">{item.title}</h4>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">{item.desc}</p>
                    <p className="text-lg text-emerald-400 font-black tracking-tight">{item.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            <div className="glass-panel p-8 rounded-[2rem] border-emerald-500/20 bg-emerald-500/5">
               <div className="flex items-center gap-4 mb-6">
                  <Globe className="h-6 w-6 text-emerald-400" />
                  <h4 className="text-white font-black uppercase tracking-tight">Global Offices</h4>
               </div>
               <div className="flex flex-wrap gap-3">
                  {["London", "New York", "Singapore", "Tokyo", "Dubai"].map(city => (
                    <span key={city} className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest">{city}</span>
                  ))}
               </div>
            </div>
          </div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-7 glass-panel p-8 md:p-12 rounded-[3rem] border-white/5 bg-slate-900/40 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
               <MessageSquare size={200} className="text-emerald-400" />
            </div>

            <form className="space-y-8 relative z-10">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Full Name</label>
                  <Input placeholder="John Doe" className="h-14 bg-slate-950 border-white/10 rounded-2xl px-6 text-white font-bold focus:border-emerald-500/50" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Email Address</label>
                  <Input type="email" placeholder="john@example.com" className="h-14 bg-slate-950 border-white/10 rounded-2xl px-6 text-white font-bold focus:border-emerald-500/50" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Subject</label>
                <Input placeholder="Institutional Investment Inquiry" className="h-14 bg-slate-950 border-white/10 rounded-2xl px-6 text-white font-bold focus:border-emerald-500/50" />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Message</label>
                <Textarea placeholder="How can we help you today?" className="min-h-[150px] bg-slate-950 border-white/10 rounded-3xl px-6 py-6 text-white font-medium focus:border-emerald-500/50" />
              </div>

              <Button className="w-full h-16 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase tracking-[0.2em] rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.3)] flex items-center justify-center gap-3 transition-all active:scale-[0.98]">
                Send Message <Send className="h-5 w-5" />
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
