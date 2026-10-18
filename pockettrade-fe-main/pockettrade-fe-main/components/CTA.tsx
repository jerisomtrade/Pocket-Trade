"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CTA() {
  const router = useRouter();

  return (
    <section className="w-full pb-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          whileInView={{ scale: [0.95, 1], opacity: [0, 1] }}
          transition={{ duration: 0.8 }}
          className="w-full h-[500px] rounded-[3rem] bg-gradient-to-br from-emerald-500 via-blue-600 to-indigo-700 p-[1px] flex items-center justify-center shadow-[0_20px_80px_rgba(16,185,129,0.3)] relative overflow-hidden group"
        >
          {/* Animated background detail */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)] group-hover:scale-150 transition-transform duration-1000"></div>
          
          <div className="w-full h-full rounded-[2.95rem] bg-slate-950 flex flex-col items-center justify-center text-center px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-10 border border-emerald-500/20"
            >
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            </motion.div>
            
            <h2 className="text-4xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-none">
              Ready to Master the <br />
              <span className="gradient-text">Global Markets?</span>
            </h2>
            <p className="text-slate-400 text-xl md:text-2xl font-medium max-w-2xl mb-12 leading-relaxed">
              Join 150,000+ traders who have already secured their financial edge. Your journey to the top starts with a single click.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(255,255,255,0.2)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/signup")}
                className="bg-white text-slate-950 font-black px-12 py-6 rounded-2xl flex items-center justify-center gap-3 text-xl transition-all shadow-2xl"
              >
                Open Free Account <ArrowRight className="h-6 w-6 text-emerald-500" />
              </motion.button>

              <button
                onClick={() => router.push("/faq")}
                className="glass-panel text-white font-black px-12 py-6 rounded-2xl flex items-center justify-center gap-3 text-xl hover:bg-white/5 transition-all"
              >
                View Documentation
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
