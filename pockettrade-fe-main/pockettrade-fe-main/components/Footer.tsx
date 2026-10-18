"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { TrendingUp, Mail, ArrowUpRight, Send, Camera, Code, Briefcase } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const handleNewsletterSubmit = () => {
    if (!newsletterEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success("Subscribed!", { description: "You'll receive market intelligence updates shortly." });
    setNewsletterEmail("");
  };

  const footerLinks = {
    Platform: [
      { name: "Features", href: "/#features" },
      { name: "Markets", href: "/#markets" },
      { name: "Payouts", href: "/payouts" },
      { name: "Security", href: "/security" },
    ],
    Company: [
      { name: "About Us", href: "/about" },
      { name: "FAQ", href: "/faq" },
      { name: "Contact", href: "/contact" },
      { name: "Careers", href: "/careers" },
    ],
    Legal: [
      { name: "Terms", href: "/terms" },
      { name: "Privacy", href: "/privacy" },
      { name: "Risk Disclosure", href: "/risk" },
      { name: "Cookies", href: "/cookies" },
    ]
  };

  return (
    <footer className="pt-40 pb-20 relative overflow-hidden bg-slate-950">
      {/* Decorative glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-t from-emerald-500/10 via-emerald-500/5 to-transparent blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20 px-8 sm:px-12 py-16 sm:py-24 glass-panel border-white/5 bg-slate-900/40 rounded-[3rem]">
          
          <div className="lg:col-span-5">
            <Link href="/" className="flex items-center gap-3 mb-10 group">
              <div className="relative h-12 w-12 group-hover:scale-110 transition-transform">
                <Image src="/assets/jerisom.png" alt="Jerisom Trade" fill className="object-contain" />
              </div>
              <span className="font-black text-3xl tracking-tighter text-white uppercase">
                JERISOM<span className="text-emerald-400">TRADE</span>
              </span>
            </Link>
            <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-sm mb-12">
              The premier ecosystem for professional asset predictions. Built for speed, precision, and absolute sovereignty.
            </p>
            <div className="flex gap-4">
               {[
                 { icon: <Send className="h-5 w-5" />, href: "#", name: "Twitter" },
                 { icon: <Camera className="h-5 w-5" />, href: "#", name: "Instagram" },
                 { icon: <Code className="h-5 w-5" />, href: "#", name: "Github" },
                 { icon: <Briefcase className="h-5 w-5" />, href: "#", name: "Linkedin" }
               ].map((social, i) => (
                 <a 
                   key={i} 
                   href={social.href} 
                   title={social.name}
                   className="w-14 h-14 rounded-2xl border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-emerald-500 hover:border-emerald-500 transition-all duration-300 shadow-xl"
                 >
                   {social.icon}
                 </a>
               ))}
            </div>
          </div>
          
          <div className="lg:col-span-4 grid grid-cols-2 gap-12">
            <div>
              <h4 className="text-white font-black uppercase tracking-[0.2em] text-[10px] mb-10">Platform</h4>
              <ul className="space-y-5">
                {footerLinks.Platform.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-slate-500 hover:text-emerald-400 font-bold text-sm tracking-tight flex items-center group">
                      {link.name}
                      <ArrowUpRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-all -translate-y-1 translate-x-1" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-black uppercase tracking-[0.2em] text-[10px] mb-10">Company</h4>
              <ul className="space-y-5">
                {footerLinks.Company.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-slate-500 hover:text-emerald-400 font-bold text-sm tracking-tight flex items-center group">
                      {link.name}
                      <ArrowUpRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-all -translate-y-1 translate-x-1" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-[10px] mb-10">Newsletter</h4>
            <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">Join 50K+ traders receiving weekly market intelligence and platform updates.</p>
            <div className="relative group">
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleNewsletterSubmit()}
                className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-5 text-xs font-black text-white focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-slate-700"
              />
              <button
                onClick={handleNewsletterSubmit}
                className="absolute right-2 top-2 bottom-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 rounded-xl flex items-center justify-center transition-all shadow-lg active:scale-95"
              >
                <Mail className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between pt-12 border-t border-white/5 text-[10px] font-black tracking-[0.3em] text-slate-600 uppercase">
          <p className="mb-6 md:mb-0">
            &copy; {currentYear} JERISOM TRADE ASSET MANAGEMENT. ALL RIGHTS RESERVED.
          </p>
          <div className="flex flex-wrap justify-center gap-8">
             {footerLinks.Legal.map((link) => (
               <Link key={link.name} href={link.href} className="hover:text-white transition-colors">
                 {link.name}
               </Link>
             ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
