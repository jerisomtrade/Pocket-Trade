"use client";

import { motion } from "framer-motion";
import { TradingViewMiniChart } from "./TradingViewChart";
import { ArrowUpRight, ArrowDownRight, Zap } from "lucide-react";

const assets = [
  { name: "Bitcoin", symbol: "BINANCE:BTCUSDT", category: "Crypto", price: "64,230.15", change: "+1.24%", positive: true },
  { name: "Ethereum", symbol: "BINANCE:ETHUSDT", category: "Crypto", price: "3,452.40", change: "+0.85%", positive: true },
  { name: "EUR/USD", symbol: "FX:EURUSD", category: "Forex", price: "1.0854", change: "+0.02%", positive: true },
  { name: "Gold", symbol: "OANDA:XAUUSD", category: "Commodities", price: "2,384.12", change: "+0.15%", positive: true },
  { name: "Tesla", symbol: "NASDAQ:TSLA", category: "Stocks", price: "174.12", change: "-0.45%", positive: false },
  { name: "Apple", symbol: "NASDAQ:AAPL", category: "Stocks", price: "182.52", change: "+0.32%", positive: true },
];

export default function AssetShowcase() {
  return (
    <section id="markets" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
      <div className="text-center mb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-6"
        >
          <Zap className="h-3 w-3" /> Live Global Markets
        </motion.div>
        <h2 className="text-4xl md:text-7xl font-black mb-8 tracking-tighter">
          Diversity in every <br />
          <span className="gradient-text">Asset Class</span>
        </h2>
        <p className="text-slate-400 text-xl md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed">
          Predict the price movements of the world's most liquid assets. From digital currencies to precious metals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {assets.map((asset, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel p-8 group border-white/5 hover:border-emerald-500/30 transition-all duration-500 rounded-[2.5rem] relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">{asset.category}</div>
                <h3 className="text-2xl font-black text-white tracking-tight">{asset.name}</h3>
              </div>
              <div className={`p-2 rounded-xl border ${asset.positive ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                {asset.positive ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
              </div>
            </div>

            <div className="mb-6">
              <div className="text-3xl font-black text-white tracking-tighter mb-1">${asset.price}</div>
              <div className={`text-sm font-bold ${asset.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {asset.change} <span className="text-slate-500 text-[10px] ml-1 uppercase">24h</span>
              </div>
            </div>

            <div className="h-24 w-full relative">
              <TradingViewMiniChart 
                symbol={asset.symbol} 
                positive={asset.positive}
              />
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
