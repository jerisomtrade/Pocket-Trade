"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Key, Eye, Fingerprint, ShieldAlert } from "lucide-react";

const securityFeatures = [
  { icon: <Lock />, title: "256-bit Encryption", desc: "Military-grade encryption for all data transmissions." },
  { icon: <Fingerprint />, title: "Biometric Access", desc: "Secure mobile login with FaceID and TouchID." },
  { icon: <Key />, title: "Cold Storage", desc: "98% of digital assets are stored in offline vaults." },
  { icon: <ShieldAlert />, title: "Fraud Protection", desc: "AI-driven real-time monitoring of all accounts." },
  { icon: <Eye />, title: "Privacy First", desc: "Zero-knowledge proofs for sensitive user data." },
  { icon: <Shield />, title: "Fully Regulated", desc: "Compliant with global financial standards." },
];

export default function SecurityInfrastructure() {
  return (
    <section className="w-full py-40 relative overflow-hidden bg-[#020617]">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center mb-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-emerald-500 font-bold tracking-[0.4em] uppercase text-xs mb-6"
          >
            Digital Fortress
          </motion.div>
          <h2 className="text-4xl md:text-7xl font-black mb-8 tracking-tighter text-white">
            Security at <br />
            <span className="text-emerald-500">Every Layer</span>
          </h2>
          <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            We employ bank-grade security protocols to ensure your capital and data are 
            protected by the most advanced technology in the industry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {securityFeatures.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-panel p-8 group border-white/5 hover:border-emerald-500/30 transition-all duration-500 bg-slate-950/40 rounded-[2rem]"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all">
                {feature.icon}
              </div>
              <h3 className="text-xl font-black text-white mb-3 tracking-tight">{feature.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed uppercase text-[10px] tracking-widest">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
        
        {/* Certificate section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-24 p-12 glass-panel border-white/5 bg-gradient-to-br from-slate-900/50 to-emerald-950/10 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-12"
        >
          <div className="flex-1">
            <h4 className="text-2xl font-black text-white mb-4 italic">"Industry-leading security is not a feature, it's our foundation."</h4>
            <p className="text-slate-400 font-medium">Jerisom Trade Security Team</p>
          </div>
          <div className="flex gap-8 shrink-0">
             {[...Array(3)].map((_, i) => (
               <div key={i} className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center bg-white/5 grayscale hover:grayscale-0 transition-all cursor-crosshair">
                 <Shield className="h-8 w-8 text-emerald-500/50" />
               </div>
             ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
