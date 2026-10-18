"use client";

import { useState } from "react";
import { CheckCircle2, Wallet, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import CryptoSelector, { supportedCryptocurrencies } from "@/components/crypto/CryptoSelector";
import CryptoPaymentConfirmation from "@/components/crypto/CryptoPaymentConfirmation";
import { AddFundsType, addFundsSchema } from "@/lib/validators/validateWithZod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { callApi } from "@/lib/helpers";
import { ApiResponse } from "@/interfaces";
import { FormErrorMessage } from "@/components/common";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// Shadcn UI Imports
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const QUICK_AMOUNTS = [100, 500, 1000, 5000];

export default function DepositPage() {
  const [amount, setAmount] = useState(0);
  const [success, setSuccess] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const { push } = useRouter();

  const {
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<AddFundsType>({
    resolver: zodResolver(addFundsSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const selectedCryptoId = watch("crypto");
  const selectedCrypto = selectedCryptoId
    ? supportedCryptocurrencies.find((c) => c.id === selectedCryptoId)
    : undefined;

  const onSubmit: SubmitHandler<AddFundsType> = async () => {
    if (!amount || !selectedCryptoId) {
      toast.error("Missing information", { description: "Please enter an amount and select a cryptocurrency." });
      return;
    }
    setShowConfirmation(true);
  };

  const handleConfirmPayment = async (walletAddress: string) => {
    const formValues = getValues();
    const formData = new FormData();
    formData.append("crypto", formValues.crypto);
    formData.append("amount", amount.toString());
    formData.append("address", walletAddress);
    if (paymentProof) formData.append("paymentProof", paymentProof);

    try {
      const { data: responseData, error } = await callApi<ApiResponse<AddFundsType>>("/transaction/deposit", formData);
      if (error) throw new Error(error.message);
      if (responseData?.status === "success") {
        setSuccess(true);
        setShowConfirmation(false);
        toast.success("Payment confirmation received", {
          description: `Your deposit of $${amount} will be processed shortly.`,
        });
      }
    } catch (err) {
      toast.error("Upload Failed", { description: err instanceof Error ? err.message : "Something went wrong" });
    } finally {
      reset();
      setPaymentProof(null);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto pb-20 mt-16 lg:mt-0">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="bg-slate-900/50 border-white/5 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full -mr-20 -mt-20 pointer-events-none"></div>
          <CardHeader className="p-8 relative z-10">
            <CardTitle className="text-3xl font-black text-white tracking-tighter uppercase mb-2">
              Add <span className="text-emerald-400">Funds</span>
            </CardTitle>
            <CardDescription className="text-sm font-medium text-slate-400">
              Fund your account using cryptocurrency for instant trading access.
            </CardDescription>
          </CardHeader>
        </Card>
      </motion.div>

      <AnimatePresence mode="wait">
        {success ? (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="bg-slate-900/50 border-white/5 backdrop-blur-xl">
              <CardContent className="p-12 flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white mb-2">Payment Confirmation Received</h2>
                  <p className="text-slate-400 font-medium">Your deposit of <span className="text-emerald-400 font-black">${amount}</span> is being processed.</p>
                  <p className="text-sm text-slate-500 mt-2">Funds will appear after network confirmations are complete.</p>
                </div>
                <div className="flex gap-4">
                  <Button variant="ghost" onClick={() => setSuccess(false)} className="h-12 px-6 bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest hover:bg-white/10">
                    Add More Funds
                  </Button>
                  <Button asChild className="h-12 px-6 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                    <Link href="/dashboard">View Dashboard</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : showConfirmation && selectedCrypto ? (
          <motion.div key="confirmation" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <CryptoPaymentConfirmation
              amount={amount.toString()}
              selectedCrypto={selectedCrypto}
              onConfirmPayment={handleConfirmPayment}
              onBack={() => setShowConfirmation(false)}
              setPaymentProof={setPaymentProof}
            />
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Card className="bg-slate-900/50 border-white/5 backdrop-blur-xl">
              <CardContent className="p-8 space-y-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  {/* Amount */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">
                      Amount to Add (USD equivalent)
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
                    <div className="grid grid-cols-4 gap-3">
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
                    </div>
                  </div>

                  {/* Crypto selector */}
                  <div className="space-y-2">
                    <CryptoSelector
                      selectedCrypto={selectedCryptoId}
                      onSelectCrypto={(v) => setValue("crypto", v || "")}
                    />
                    {errors.crypto && <FormErrorMessage error={errors.crypto} errorMsg={errors.crypto.message} />}
                  </div>

                  {/* Info box */}
                  <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl flex items-start gap-3">
                    <Wallet className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-300 font-medium">
                      <p className="font-black uppercase tracking-widest text-xs mb-1">Processing Time</p>
                      <p>Deposits are typically credited after 1–6 network confirmations depending on the cryptocurrency.</p>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                  >
                    {isSubmitting ? "Processing..." : "Continue to Payment"}
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
