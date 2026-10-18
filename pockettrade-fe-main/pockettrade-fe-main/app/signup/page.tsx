"use client";

import { motion } from "framer-motion";
import { SignUpForm } from "@/components/auth/SignUpForm";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Shield, Zap, Globe, RefreshCcw } from "lucide-react";
import { Suspense } from "react";

function SignUpLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-t-2 border-emerald-500 animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-r-2 border-blue-500 animate-spin" style={{ animationDirection: 'reverse' }}></div>
      </div>
      <p className="mt-4 text-emerald-500 font-bold tracking-widest text-sm uppercase">Loading Terminal...</p>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <main className="min-h-screen flex relative overflow-hidden bg-[#020617]">
      {/* Decorative background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[150px]"></div>
      </div>

      <div className="w-full flex">
        {/* Left Form Section */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-12 lg:px-24 py-12 pt-28 lg:pt-32 z-10 min-h-screen">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link href="/" className="inline-flex items-center text-slate-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass-panel p-8 sm:p-12 rounded-[2.5rem] border-white/5 bg-slate-900/60 shadow-2xl relative"
          >
             <Suspense fallback={<SignUpLoading />}>
               <SignUpForm />
             </Suspense>
          </motion.div>
          
          <div className="mt-auto pt-12 flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
             <span>&copy; {new Date().getFullYear()} JERISOM TRADE</span>
             <Link href="/support" className="hover:text-emerald-400 transition-colors">Need Help?</Link>
          </div>
        </div>

        {/* Right Info Section */}
        <div className="hidden lg:flex w-1/2 bg-slate-900 relative z-10 flex-col items-center justify-center p-12 overflow-hidden border-l border-white/5">
          <div className="absolute inset-0 z-0">
             <Image 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
                alt="Data Visualization"
                fill
                className="object-cover opacity-10"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent"></div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-10 max-w-lg text-left"
          >
            <div className="mb-10">
               <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black tracking-widest uppercase mb-6">
                 <Shield className="h-3 w-3" /> Secure Platform
               </div>
               <h2 className="text-4xl font-black text-white leading-tight">
                 Welcome to the <br/><span className="text-emerald-400">Future of Trading</span>
               </h2>
            </div>
            
            <div className="space-y-6">
               {[
                 { 
                   icon: Zap, 
                   title: "Lightning Fast Execution", 
                   desc: "Orders matched and executed in under 1 millisecond. Never miss a market movement." 
                 },
                 { 
                   icon: Globe, 
                   title: "Global Liquidity", 
                   desc: "Direct market access to deep institutional liquidity pools across 80+ global assets." 
                 },
                 { 
                   icon: RefreshCcw, 
                   title: "Automated Payouts", 
                   desc: "Instant settlement on mature positions directly to your secure cold storage wallet." 
                 }
               ].map((feature, i) => (
                 <div key={i} className="flex gap-4 p-5 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm group hover:border-emerald-500/30 transition-colors">
                    <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                       <feature.icon className="h-6 w-6 text-emerald-400" />
                    </div>
                    <div>
                       <h3 className="text-white font-black text-lg mb-1">{feature.title}</h3>
                       <p className="text-slate-400 text-sm font-medium leading-relaxed">{feature.desc}</p>
                    </div>
                 </div>
               ))}
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
