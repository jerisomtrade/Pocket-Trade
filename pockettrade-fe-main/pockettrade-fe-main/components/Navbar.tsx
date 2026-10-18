"use client";

import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, ArrowRight, TrendingUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  const opacity = useTransform(scrollY, [0, 100], [0, 1]);
  const blur = useTransform(scrollY, [0, 100], [0, 12]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "circOut" }}
        className={cn(
          "fixed w-full z-50 transition-all duration-300 border-b",
          scrolled
            ? "py-4 bg-[#020617]/80 backdrop-blur-xl border-white/10 shadow-2xl"
            : "py-6 bg-transparent border-transparent",
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center gap-3">
                <div className="relative h-10 w-10">
                  <Image
                    src="/assets/jerisom.png"
                    alt="Jerisom Trade"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="font-black text-2xl tracking-tighter text-white uppercase">
                  JERISOM<span className="text-emerald-400">TRADE</span>
                </span>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-10">
                <Link
                  href="/#features"
                  className="text-slate-400 hover:text-white transition-all duration-200 font-bold text-sm uppercase tracking-widest"
                >
                  Features
                </Link>
                <div className="relative group cursor-pointer">
                  <span className="text-slate-400 group-hover:text-white transition-all duration-200 font-bold text-sm uppercase tracking-widest flex items-center gap-1">
                    Markets <ChevronDown className="h-3 w-3" />
                  </span>
                  <div className="absolute top-full left-0 mt-4 w-48 glass-panel opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-2">
                    <Link
                      href="/crypto"
                      className="block p-3 hover:bg-white/5 rounded-lg text-xs font-bold text-slate-400 hover:text-white transition-colors"
                    >
                      CRYPTO MARKETS
                    </Link>
                    <Link
                      href="/cryptocurrency"
                      className="block p-3 hover:bg-white/5 rounded-lg text-xs font-bold text-slate-400 hover:text-white transition-colors"
                    >
                      CRYPTOCURRENCY
                    </Link>
                  </div>
                </div>
                <Link
                  href="/about"
                  className="text-slate-400 hover:text-white transition-all duration-200 font-bold text-sm uppercase tracking-widest"
                >
                  About
                </Link>
                <Link
                  href="/faq"
                  className="text-slate-400 hover:text-white transition-all duration-200 font-bold text-sm uppercase tracking-widest"
                >
                  FAQ
                </Link>
              </div>
            </div>

            {/* Call to Actions */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                href="/login"
                className="text-slate-400 hover:text-white font-bold text-sm uppercase tracking-widest transition-colors px-2"
              >
                Login
              </Link>
              <Link href="/signup">
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 20px rgba(16,185,129,0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-7 py-3 rounded-xl flex items-center gap-2 transition-all text-sm"
                >
                  START TRADING <ArrowRight className="h-4 w-4" />
                </motion.button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-slate-300 hover:text-white p-2"
              >
                {isOpen ? (
                  <X className="h-7 w-7" />
                ) : (
                  <Menu className="h-7 w-7" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[100] md:hidden"
            />
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="md:hidden fixed top-0 right-0 h-screen w-[85%] z-[101] glass-panel border-l border-white/10 rounded-none bg-[#020617]/95 backdrop-blur-3xl shadow-2xl overflow-y-auto"
            >
              <div className="flex justify-end p-6">
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 p-2"
                >
                  <X className="h-8 w-8" />
                </button>
              </div>

              <div className="px-10 py-4 space-y-10">
                <div className="space-y-6">
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">
                    Navigation
                  </p>
                  <Link
                    href="/#features"
                    onClick={() => setIsOpen(false)}
                    className="block text-4xl font-black text-white hover:text-emerald-400 transition-colors tracking-tighter"
                  >
                    Features
                  </Link>
                  <Link
                    href="/#markets"
                    onClick={() => setIsOpen(false)}
                    className="block text-4xl font-black text-white hover:text-emerald-400 transition-colors tracking-tighter"
                  >
                    Markets
                  </Link>
                  <Link
                    href="/about"
                    onClick={() => setIsOpen(false)}
                    className="block text-4xl font-black text-white hover:text-emerald-400 transition-colors tracking-tighter"
                  >
                    About
                  </Link>
                  <Link
                    href="/faq"
                    onClick={() => setIsOpen(false)}
                    className="block text-4xl font-black text-white hover:text-emerald-400 transition-colors tracking-tighter"
                  >
                    FAQ
                  </Link>
                </div>

                <div className="pt-10 border-t border-white/5 flex flex-col gap-6">
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="text-xl font-bold text-white py-4 border border-white/5 rounded-2xl text-center hover:bg-white/5 transition-all"
                  >
                    Login to Terminal
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setIsOpen(false)}
                    className="bg-emerald-500 text-slate-950 w-full font-black px-8 py-5 rounded-2xl flex justify-center items-center gap-3 text-xl shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"
                  >
                    START TRADING <ArrowRight className="h-6 w-6" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
