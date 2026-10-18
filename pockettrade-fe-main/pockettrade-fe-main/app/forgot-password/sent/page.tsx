"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Mail, Shield, RefreshCw } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import { callApi } from "@/lib/helpers";
import { ApiResponse } from "@/interfaces";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

function SentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";
  const [isResending, setIsResending] = useState(false);

  const handleResend = async () => {
    if (!email) return;
    try {
      setIsResending(true);
      const { error } = await callApi<ApiResponse>("/auth/password/forgot", {
        email,
      });
      if (error) throw new Error(error.message);
      toast.success("Link resent", {
        description: `A new reset link has been sent to ${email}.`,
      });
    } catch (err) {
      toast.error("Failed to resend", {
        description: err instanceof Error ? err.message : "Please try again.",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-8"
      >
        <Mail className="w-10 h-10 text-emerald-400" />
      </motion.div>

      <h1 className="text-3xl md:text-4xl font-black mb-3 text-white">
        Check your <span className="gradient-text">Email</span>
      </h1>
      <p className="text-slate-400 font-medium mb-2">
        We sent a password reset link to
      </p>
      {email && (
        <p className="text-emerald-400 font-black text-lg mb-8 break-all">{email}</p>
      )}

      <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 mb-8 text-left space-y-3">
        {["Open the email we sent you.", "Click the reset link inside.", "Choose a new password."].map((step, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <span className="text-emerald-400 text-[10px] font-black">{i + 1}</span>
            </div>
            <span className="text-slate-300 text-sm font-medium">{step}</span>
          </div>
        ))}
      </div>

      <Button
        onClick={handleResend}
        disabled={isResending}
        variant="outline"
        className="w-full h-14 border-white/10 text-slate-300 hover:bg-white/5 hover:text-white rounded-2xl font-black uppercase tracking-widest text-xs bg-transparent mb-4 flex items-center justify-center gap-2"
      >
        <RefreshCw className={`w-4 h-4 ${isResending ? "animate-spin" : ""}`} />
        {isResending ? "Resending..." : "Resend Email"}
      </Button>

      <Link
        href="/login"
        className="text-slate-400 font-medium hover:text-white transition-colors text-sm"
      >
        Back to <span className="text-emerald-400 font-black ml-1">SIGN IN</span>
      </Link>
    </div>
  );
}

export default function ForgotPasswordSentPage() {
  return (
    <main className="min-h-screen flex relative overflow-hidden bg-[#020617]">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[150px]"></div>
      </div>

      <div className="w-full flex">
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
            className="glass-panel p-8 sm:p-12 rounded-[2.5rem] border-white/5 bg-slate-900/60 shadow-2xl"
          >
            <Suspense fallback={<div className="text-slate-400 text-center">Loading...</div>}>
              <SentContent />
            </Suspense>
          </motion.div>

          <div className="mt-auto pt-12 flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
            <span>&copy; {new Date().getFullYear()} JERISOM TRADE</span>
            <Link href="/support" className="hover:text-emerald-400 transition-colors">Need Help?</Link>
          </div>
        </div>

        <div className="hidden lg:flex w-1/2 bg-slate-900 relative z-10 flex-col items-center justify-center p-12 overflow-hidden border-l border-white/5">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2070&auto=format&fit=crop"
              alt="Security"
              fill
              className="object-cover opacity-10"
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
              <div className="h-20 w-20 p-4 bg-white/5 rounded-3xl border border-white/10 shadow-2xl flex items-center justify-center">
                <Shield className="h-10 w-10 text-emerald-400" />
              </div>
            </div>
            <h2 className="text-4xl font-black text-white mb-6 leading-tight">
              Almost <br /><span className="text-emerald-400">There</span>
            </h2>
            <p className="text-slate-400 text-lg font-medium leading-relaxed">
              The reset link expires in 15 minutes. Check your spam folder if you don't see the email.
            </p>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
