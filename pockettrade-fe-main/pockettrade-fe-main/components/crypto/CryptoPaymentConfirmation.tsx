"use client";

import React, { useState } from "react";
import { Copy, Upload, AlertTriangle } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { CryptoCurrency } from "./CryptoSelector";
import { toast } from "sonner";

// Shadcn UI Imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const WALLET_ADDRESSES: Record<string, string> = {
  bitcoin:    "bc1q64yrgytt2h8jfh0w4zkc7emtt8pt59pgdae8v7",
  ethereum:   "0x8eA7a3BBd6e3Fd3A5E0A6Ef78B5cA8A4ed2f0959",
  litecoin:   "ltc1qsm4u82deeu2hhhlhs0qel83q3qrcjjk30565ve",
  bnb:        "0x8eA7a3BBd6e3Fd3A5E0A6Ef78B5cA8A4ed2f0959",
  xrp:        "r9AutR4JxiTeyGqzgQPtSCmYZbchNPT549",
  solana:     "3j1EdVfR8D3jT3rz3bkrmvjgotGLgDXSLye8zSzss5nG",
  usdt_trc20: "TXtEJz5fBpc4KtYjFct6uZ3ccyve1nTb92",
  usdt_erc20: "0x8eA7a3BBd6e3Fd3A5E0A6Ef78B5cA8A4ed2f0959",
};

type Props = {
  amount: string;
  selectedCrypto: CryptoCurrency;
  onConfirmPayment: (walletAddress: string) => void;
  onBack: () => void;
  setPaymentProof: (file: File) => void;
};

const CryptoPaymentConfirmation: React.FC<Props> = ({
  amount,
  selectedCrypto,
  onConfirmPayment,
  onBack,
  setPaymentProof,
}) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const walletAddress = WALLET_ADDRESSES[selectedCrypto.id] || "Address not available";

  const getQRValue = () => {
    const amt = parseFloat(amount).toString();
    switch (selectedCrypto.id) {
      case "bitcoin":    return `bitcoin:${walletAddress}?amount=${amt}`;
      case "ethereum":   return `ethereum:${walletAddress}?value=${amt}`;
      case "bnb":        return `bnb:${walletAddress}?amount=${amt}`;
      case "solana":     return `solana:${walletAddress}?amount=${amt}`;
      case "xrp":        return `xrp:${walletAddress}`;
      case "litecoin":   return `litecoin:${walletAddress}?amount=${amt}`;
      default:           return walletAddress;
    }
  };

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={onBack}
        className="h-10 px-4 flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white font-black text-xs uppercase tracking-widest transition-colors hover:bg-white/10"
      >
        ← Back to Selection
      </Button>

      <div className="glass-panel bg-slate-900/50 border border-white/5 rounded-3xl p-8 space-y-8">
        <div>
          <h3 className="text-lg font-black text-white uppercase tracking-widest mb-2">Payment Details</h3>
          <p className="text-sm font-medium text-slate-400">
            Please send exactly{" "}
            <span className="font-black text-emerald-400">{amount} {selectedCrypto.symbol}</span>{" "}
            to the following address:
          </p>
        </div>

        {/* Wallet Address */}
        <div className="bg-slate-950/50 border border-white/5 p-5 rounded-2xl space-y-3">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">
            {selectedCrypto.name} {selectedCrypto.network ? `(${selectedCrypto.network})` : ""} Address
          </label>
          <div className="flex items-center gap-3">
            <Input
              value={walletAddress}
              readOnly
              className="flex-1 h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button
              onClick={() => {
                navigator.clipboard.writeText(walletAddress);
                toast.info("Copied!", { description: "Wallet address copied to clipboard." });
              }}
              variant="ghost"
              size="icon"
              className="w-12 h-12 flex items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-400 transition-colors"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* QR Code */}
        <div className="flex justify-center">
          <div className="bg-white p-4 rounded-2xl">
            <QRCodeCanvas value={getQRValue()} size={180} level="H" />
            <p className="text-center mt-2 text-xs font-black text-slate-400 uppercase tracking-widest">Scan to pay</p>
          </div>
        </div>

        {/* Upload proof */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">
            Upload Payment Proof (Optional)
          </label>
          <div className="relative flex items-center gap-3">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) setPaymentProof(f); }}
              className="flex-1 h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-black file:bg-emerald-500/10 file:text-emerald-400 file:uppercase file:tracking-widest cursor-pointer hover:bg-white/10"
            />
            <Upload className="w-5 h-5 text-slate-500 absolute right-4 pointer-events-none" />
          </div>
        </div>

        {/* Warning */}
        <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-300 font-medium space-y-1">
            <p className="font-black uppercase tracking-widest text-xs">Important</p>
            <ul className="list-disc pl-4 space-y-1 text-amber-400/80">
              <li>Ensure you&apos;re sending from a wallet that supports {selectedCrypto.network || selectedCrypto.name}.</li>
              <li>Deposit credited after network confirmation.</li>
              <li>Larger amounts may require additional confirmations.</li>
            </ul>
          </div>
        </div>

        <Button
          onClick={() => { setIsSubmitted(true); onConfirmPayment(walletAddress); }}
          disabled={isSubmitted}
          className="w-full h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-black text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-all"
        >
          {isSubmitted ? "Processing..." : "I've Made This Payment"}
        </Button>
      </div>
    </div>
  );
};

export default CryptoPaymentConfirmation;
