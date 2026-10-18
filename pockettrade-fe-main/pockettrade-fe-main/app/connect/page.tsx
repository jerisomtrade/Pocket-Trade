"use client";

import { Card } from "@/components/ui/card";
import { Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const getLogo = (domain: string) =>
  `https://img.logo.dev/${domain}?token=pk_BOmLLlQRSWe2uLPHrJzmmA`;

export const wallets = [
  { id: "metamask", name: "MetaMask", icon: getLogo("metamask.io") },
  { id: "trust-wallet", name: "Trust Wallet", icon: getLogo("trustwallet.com") },
  { id: "coinbase", name: "Coinbase Wallet", icon: getLogo("coinbase.com") },
  { id: "walletconnect", name: "WalletConnect", icon: getLogo("walletconnect.com") },
  { id: "ledger", name: "Ledger", icon: getLogo("ledger.com") },
  { id: "trezor", name: "Trezor", icon: getLogo("trezor.io") },
  { id: "safepal", name: "SafePal", icon: getLogo("safepal.com") },
  { id: "exodus", name: "Exodus", icon: getLogo("exodus.com") },
  { id: "phantom", name: "Phantom", icon: getLogo("phantom.app") },
  { id: "solflare", name: "Solflare", icon: getLogo("solflare.com") },
  { id: "crypto-com", name: "Crypto.com", icon: getLogo("crypto.com") },
  { id: "binance-chain", name: "Binance Wallet", icon: getLogo("binance.com") },
  { id: "okx", name: "OKX Wallet", icon: getLogo("okx.com") },
  { id: "kraken", name: "Kraken", icon: getLogo("kraken.com") },
  { id: "kucoin", name: "KuCoin Wallet", icon: getLogo("kucoin.com") },
  { id: "bybit", name: "Bybit Wallet", icon: getLogo("bybit.com") },
  { id: "atomic", name: "Atomic Wallet", icon: getLogo("atomicwallet.io") },
  { id: "math", name: "Math Wallet", icon: getLogo("mathwallet.org") },
  { id: "tokenpocket", name: "TokenPocket", icon: getLogo("tokenpocket.pro") },
  { id: "bitkeep", name: "BitKeep", icon: getLogo("bitkeep.com") },
  { id: "coin98", name: "Coin98", icon: getLogo("coin98.com") },
  { id: "1inch", name: "1inch Wallet", icon: getLogo("1inch.io") },
  { id: "myetherwallet", name: "MyEtherWallet", icon: getLogo("myetherwallet.com") },
  { id: "huobi", name: "Huobi Wallet", icon: getLogo("huobi.com") },
];

export default function WalletConnectPage() {
  return (
    <div className="min-h-screen bg-[#020617] flex flex-col">
      <header className="w-full border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <span className="font-black text-lg tracking-tighter text-white uppercase">
          JERISOM<span className="text-emerald-400">TRADE</span>
        </span>
        <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Secure Connection
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center px-4 py-12">
        <div className="w-full max-w-5xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-white mb-2">
              Connect your <span className="gradient-text">Wallet</span>
            </h1>
            <p className="text-slate-400 font-medium">
              Connect with one of our available wallet providers to continue.
            </p>
          </div>

          <Card className="p-8 md:p-12 bg-slate-900/50 border-white/5 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
              <Shield className="w-64 h-64 text-emerald-500" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 relative z-10">
              {wallets.map((wallet, index) => (
                <motion.div
                  key={wallet.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                >
                  <Link href={`/connect/${wallet.id}`}>
                    <div className="flex flex-col items-center justify-center p-6 border border-white/5 rounded-3xl bg-white/[0.02] hover:bg-emerald-500/5 hover:border-emerald-500/30 transition-all cursor-pointer h-40 group relative">
                      <div className="w-16 h-16 rounded-2xl bg-slate-950/50 shadow-inner flex items-center justify-center mb-4 group-hover:scale-110 transition-transform p-3 border border-white/5 relative overflow-hidden">
                        <Image
                          src={wallet.icon}
                          alt={wallet.name}
                          fill
                          className="object-contain p-3"
                          unoptimized
                        />
                      </div>
                      <span className="font-bold text-xs text-center uppercase tracking-widest text-slate-400 group-hover:text-emerald-400 transition-colors px-2">
                        {wallet.name}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 flex items-center justify-center gap-3 text-xs font-bold text-slate-500 uppercase tracking-[0.2em] border-t border-white/5 pt-8">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>Institutional Grade Encryption • End-to-End Secure Connection</span>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
