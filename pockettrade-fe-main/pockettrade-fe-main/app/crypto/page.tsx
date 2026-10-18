"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

export default function CryptoPage() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-screener.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      width: "100%",
      height: "800",
      defaultColumn: "overview",
      screener_type: "crypto_mkt",
      displayCurrency: "USD",
      colorTheme: "dark",
      locale: "en",
      isTransparent: true,
    });
    
    const container = document.getElementById("tradingview-widget-container");
    if (container) {
      container.innerHTML = '';
      container.appendChild(script);
    }
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-start pt-32 pb-20 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[150px]"></div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
            All <span className="gradient-text">Cryptocurrencies</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-slate-400 font-medium">
            Explore a complete list of supported cryptocurrencies on Jerisom Trade. View real-time details, prices, and trading availability.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-panel p-4 md:p-8 rounded-[2.5rem] border-white/5 bg-slate-900/40 relative overflow-hidden min-h-[800px]"
        >
          <div id="tradingview-widget-container" className="w-full h-full rounded-2xl overflow-hidden" />
        </motion.div>
      </div>
    </main>
  );
}
