"use client";

import { motion } from "framer-motion";
import { LoginForm } from "@/components/auth/LoginForm";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex relative overflow-hidden bg-[#020617]">
      {/* Decorative background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[150px]"></div>
      </div>

      <div className="w-full flex">
        {/* Left Form Section */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-12 lg:px-24 py-12 pt-28 lg:pt-32 z-10 min-h-screen">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
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
             <LoginForm />
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
                src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop"
                alt="Trading Chart"
                fill
                className="object-cover opacity-20"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-10 max-w-lg text-center"
          >
            <div className="flex justify-center mb-8">
               <div className="relative h-20 w-20 p-4 bg-white/5 rounded-3xl backdrop-blur-md border border-white/10 shadow-2xl flex items-center justify-center">
                  <Image src="/assets/jerisom.png" alt="Jerisom Trade" fill className="object-contain p-3" />
               </div>
            </div>
            <h2 className="text-4xl font-black text-white mb-6 leading-tight">
              Institutional-grade <br/><span className="text-emerald-400">trading platform</span>
            </h2>
            <p className="text-slate-400 text-lg font-medium leading-relaxed mb-10">
              Access deep liquidity, ultra-low latency execution, and advanced analytics all from a single unified interface.
            </p>
            
            <div className="grid grid-cols-2 gap-4 text-left">
               {[
                 { title: "0.0 Pips", subtitle: "Ultra-low Spreads" },
                 { title: "< 1ms", subtitle: "Execution Speed" },
                 { title: "80+", subtitle: "Global Assets" },
                 { title: "24/7", subtitle: "Live Support" }
               ].map((stat, i) => (
                 <div key={i} className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-sm">
                    <p className="text-2xl font-black text-white mb-1">{stat.title}</p>
                    <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest">{stat.subtitle}</p>
                 </div>
               ))}
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
