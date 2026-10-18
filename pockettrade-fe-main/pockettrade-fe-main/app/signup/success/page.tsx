"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle2, ArrowRight, ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SignUpSuccessPage() {
  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#020617] px-4">
      {/* Decorative background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[150px]"></div>
      </div>

      <div className="w-full max-w-2xl relative z-10 pt-32 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-panel p-8 md:p-16 rounded-[2.5rem] border-white/5 bg-slate-900/60 shadow-2xl text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20,
              delay: 0.3 
            }}
            className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/20"
          >
            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
            Registration <span className="text-emerald-400">Successful</span>
          </h1>
          
          <p className="text-slate-400 text-lg font-medium leading-relaxed mb-10 max-w-lg mx-auto">
            Your institutional trading account has been created. We've sent a verification link to your email address. Please complete the verification to unlock full terminal access.
          </p>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-10 flex items-center gap-4 text-left max-w-md mx-auto">
            <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20">
              <Mail className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-white font-bold text-sm uppercase tracking-widest">Verify Email</p>
              <p className="text-slate-500 text-xs font-medium">Check your inbox (and spam folder) for the verification link.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/" className="w-full sm:w-auto order-2 sm:order-1">
              <Button 
                variant="ghost" 
                className="w-full h-14 px-8 text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl font-black text-xs uppercase tracking-widest gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Home
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto order-1 sm:order-2">
              <Button className="w-full h-14 px-10 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all gap-2">
                Continue to Login <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </motion.div>

        <div className="mt-12 text-center">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
            &copy; {new Date().getFullYear()} JERISOM TRADE • INSTITUTIONAL GRADE TRADING
          </p>
        </div>
      </div>
    </main>
  );
}
