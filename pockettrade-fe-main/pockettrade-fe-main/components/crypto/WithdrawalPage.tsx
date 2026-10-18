"use client";

import { useState } from "react";
import { Clock, Wallet, AlertTriangle, Info } from "lucide-react";
import { toast } from "sonner";
import CryptoSelector, { supportedCryptocurrencies } from "@/components/crypto/CryptoSelector";
import { WithdrawFundsType, withdrawFundsSchema } from "@/lib/validators/validateWithZod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { callApi } from "@/lib/helpers";
import { ApiResponse, Wallet as IWallet } from "@/interfaces";
import { useQuery } from "@tanstack/react-query";
import { useDemoMode } from "@/store/useDemoMode";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// Shadcn UI Imports
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const QUICK_AMOUNTS = [100, 500, 1000, 2000];

export default function WithdrawalPage() {
  const [amount, setAmount] = useState(0);
  const [walletAddress, setWalletAddress] = useState("");
  const [success, setSuccess] = useState(false);
  const [availableBalance, setAvailableBalance] = useState<IWallet[]>([]);
  const { isDemoMode } = useDemoMode();

  const {
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<WithdrawFundsType>({
    resolver: zodResolver(withdrawFundsSchema),
    mode: "onChange",
  });

  const selectedCryptoId = watch("crypto");
  const selectedCrypto = supportedCryptocurrencies.find((c) => c.id === selectedCryptoId);

  useQuery<IWallet[], Error>({
    queryKey: ["balance", isDemoMode],
    queryFn: async () => {
      const { data: responseData, error } = await callApi<ApiResponse<IWallet[]>>("/wallet/user");
      if (error) throw new Error(error.message);
      if (!responseData?.data) throw new Error("No wallet balance found");
      setAvailableBalance(responseData.data);
      return responseData.data;
    },
  });

  const totalBalance = availableBalance.length > 0
    ? availableBalance[0].balance + availableBalance[0].portfolioBalance
    : 0;

  const onSubmit: SubmitHandler<WithdrawFundsType> = async (data) => {
    if (!walletAddress) {
      toast.error("Missing wallet address", { description: "Please enter a valid wallet address for withdrawal." });
      return;
    }

    try {
      const { data: responseData, error } = await callApi<ApiResponse<WithdrawFundsType>>("/transaction/withdraw", {
        address: walletAddress,
        crypto: data.crypto,
        amount,
      });
      if (error) throw new Error(error.message);
      if (responseData?.status === "success") {
        setSuccess(true);
        toast.success("Withdrawal request submitted", {
          description: `Your withdrawal of $${amount.toLocaleString()} has been submitted.`,
        });
        setAmount(0);
        setWalletAddress("");
        setValue("crypto", "");
      }
    } catch (err) {
      toast.error("Withdrawal Failed", { description: err instanceof Error ? err.message : "Something went wrong" });
      setAmount(0);
      setWalletAddress("");
      setValue("crypto", "");
    } finally {
      reset();
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto pb-20 mt-16 lg:mt-0">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="bg-slate-900/50 border-white/5 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-[100px] rounded-full -mr-20 -mt-20 pointer-events-none"></div>
          <CardHeader className="p-8 relative z-10">
            <CardTitle className="text-3xl font-black text-white tracking-tighter uppercase mb-2">
              Withdraw <span className="text-emerald-400">Funds</span>
            </CardTitle>
            <CardDescription className="text-sm font-medium text-slate-400">
              Transfer funds from your portfolio to your external crypto wallet.
            </CardDescription>
          </CardHeader>
        </Card>
      </motion.div>

      <AnimatePresence mode="wait">
        {success ? (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="bg-slate-900/50 border-white/5 backdrop-blur-xl">
              <CardContent className="p-12 flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Clock className="w-10 h-10 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white mb-2">Withdrawal Request Submitted</h2>
                  <p className="text-slate-400 font-medium">
                    Your request for <span className="text-white font-black">${amount.toLocaleString()}</span>
                    {selectedCrypto && <span className="text-slate-500"> ({selectedCrypto.symbol})</span>} has been submitted.
                  </p>
                  <p className="text-sm text-slate-500 mt-2">Funds will be transferred to your wallet within 1–24 hours.</p>
                </div>
                <div className="flex gap-4">
                  <Button variant="ghost" onClick={() => setSuccess(false)} className="h-12 px-6 bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-colors">
                    New Withdrawal
                  </Button>
                  <Button asChild className="h-12 px-6 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-widest transition-colors shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                    <Link href="/dashboard">View Dashboard</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Card className="bg-slate-900/50 border-white/5 backdrop-blur-xl">
              <CardContent className="p-8 space-y-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  {/* Available balance */}
                  <div className="bg-slate-950/50 border border-white/5 p-5 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Wallet className="w-5 h-5 text-slate-400" />
                      <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Available Balance</span>
                    </div>
                    <span className="text-2xl font-black text-white font-mono">
                      ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  {/* Amount */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">
                      Withdrawal Amount (USD)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-lg">$</span>
                      <Input
                        type="number"
                        className="w-full h-16 pl-9 pr-4 rounded-2xl bg-slate-950 border border-white/10 text-white text-2xl font-black focus-visible:ring-emerald-500/50 transition-all placeholder:text-slate-700"
                        placeholder="0.00"
                        value={amount || ""}
                        onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="grid grid-cols-5 gap-3">
                      {QUICK_AMOUNTS.map(q => (
                        <Button
                          key={q}
                          type="button"
                          variant="ghost"
                          onClick={() => setAmount(q)}
                          className={`h-11 rounded-xl font-black text-sm uppercase tracking-widest border transition-all ${
                            amount === q
                              ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                              : "border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          ${q >= 1000 ? `${q / 1000}k` : q}
                        </Button>
                      ))}
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setAmount(totalBalance)}
                        className={`h-11 rounded-xl font-black text-sm uppercase tracking-widest border transition-all ${
                          amount === totalBalance && totalBalance > 0
                            ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                            : "border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        Max
                      </Button>
                    </div>
                  </div>

                  {/* Crypto selector */}
                  <CryptoSelector
                    selectedCrypto={selectedCryptoId}
                    onSelectCrypto={(v) => setValue("crypto", v || "")}
                  />

                  {/* Wallet address */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">
                      Destination Wallet Address
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter your wallet address..."
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      className="w-full h-14 px-4 bg-slate-950 border border-white/10 text-white font-mono text-sm focus-visible:ring-emerald-500/50 placeholder:text-slate-700 placeholder:font-sans"
                    />
                  </div>

                  {/* Info alerts */}
                  <div className="space-y-3">
                    <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-amber-300">
                        <p className="font-black uppercase tracking-widest text-xs mb-1">Processing Time</p>
                        <p className="font-medium">Withdrawals are typically processed within 1–24 hours.</p>
                      </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-start gap-3">
                      <Info className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-slate-400">
                        <p className="font-black uppercase tracking-widest text-xs mb-1 text-white">Verification Required</p>
                        <p className="font-medium">For security, withdrawals over $1,000 may require identity verification.</p>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting || !selectedCryptoId || !walletAddress || amount <= 0}
                    className="w-full h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-all"
                  >
                    {isSubmitting ? "Processing..." : `Withdraw $${amount ? parseFloat(amount.toString()).toLocaleString() : "0.00"}`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
