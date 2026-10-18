"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { callApi } from "@/lib/helpers";
import { ApiResponse } from "@/interfaces";
import Link from "next/link";

function AuthHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your account...");

  const verifyToken = searchParams.get("verify");

  useEffect(() => {
    if (!verifyToken) {
      setStatus("error");
      setMessage("No verification token found.");
      return;
    }

    const performVerification = async () => {
      try {
        const { data, error } = await callApi<ApiResponse>(`/auth/verify-account?verificationToken=${verifyToken}`);
        
        if (error) {
          setStatus("error");
          setMessage(error.message || "Verification failed. The link may be expired.");
        } else {
          setStatus("success");
          setMessage("Your account has been successfully verified!");
        }
      } catch (err) {
        setStatus("error");
        setMessage("An unexpected error occurred during verification.");
      }
    };

    performVerification();
  }, [verifyToken]);

  return (
    <div className="w-full max-w-md relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 md:p-12 rounded-[2.5rem] border-white/5 bg-slate-900/60 shadow-2xl text-center"
      >
        {status === "loading" && (
          <>
            <Loader2 className="w-16 h-16 text-emerald-400 animate-spin mx-auto mb-6" />
            <h1 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">Verifying...</h1>
            <p className="text-slate-400 font-medium leading-relaxed">{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>
            <h1 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">Verified!</h1>
            <p className="text-slate-400 font-medium leading-relaxed mb-8">{message}</p>
            <Link href="/login" className="w-full">
              <Button className="w-full h-14 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all gap-2">
                Continue to Login <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
              <XCircle className="w-10 h-10 text-red-400" />
            </div>
            <h1 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">Verification Failed</h1>
            <p className="text-slate-400 font-medium leading-relaxed mb-8">{message}</p>
            <div className="flex flex-col gap-3">
              <Link href="/login" className="w-full">
                <Button variant="outline" className="w-full h-12 border-white/10 text-white hover:bg-white/5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all">
                  Back to Login
                </Button>
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#020617] px-4">
      {/* Decorative background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[150px]"></div>
      </div>

      <Suspense fallback={<Loader2 className="w-12 h-12 text-emerald-400 animate-spin" />}>
        <AuthHandler />
      </Suspense>
    </main>
  );
}
