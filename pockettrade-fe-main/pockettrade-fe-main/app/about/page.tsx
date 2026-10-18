"use client";

import { motion } from "framer-motion";
import {
  Users,
  BarChart,
  Shield,
  Lightbulb,
  CheckCircle,
  Building,
  Lock,
  Headset,
  Server,
  CreditCard,
  UserPlus,
  ArrowRight,
  TrendingUp,
  Globe,
  Clock,
  Briefcase,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AboutUs() {
  const metrics = [
    { title: "Total Transactions", value: "$91Million+", icon: BarChart },
    { title: "Active Investors", value: "49.6Thousand+", icon: Users },
  ];

  const features = [
    {
      icon: Building,
      title: "Legal Company",
      desc: "Fully registered and compliant financial institution.",
    },
    {
      icon: Shield,
      title: "High Reliability",
      desc: "Proven track record with 99.9% uptime for all trading.",
    },
    {
      icon: CreditCard,
      title: "Quick Withdrawal",
      desc: "Fast and secure withdrawal process directly to your account.",
    },
    {
      icon: UserPlus,
      title: "Referral Program",
      desc: "Earn passive income by inviting friends and family.",
    },
    {
      icon: Headset,
      title: "24/7 Support",
      desc: "Round the clock customer service to assist you anywhere.",
    },
    {
      icon: Server,
      title: "Dedicated Server",
      desc: "High-performance infrastructure for ultra-fast execution.",
    },
    {
      icon: Lock,
      title: "SSL Secured",
      desc: "Your data is encrypted and protected with industry standard SSL.",
    },
    {
      icon: Shield,
      title: "DDOS Protection",
      desc: "Advanced mitigation against malicious network attacks.",
    },
  ];

  const markets = [
    {
      title: "Forex",
      desc: "Trade 40+ major, minor, and exotic currency pairs",
      icon: Globe,
    },
    {
      title: "Indices",
      desc: "Trade 15 of the most famous global indices as CFDs",
      icon: BarChart,
    },
    {
      title: "Stocks",
      desc: "Trade the most covered & highest-profile asset classes",
      icon: Briefcase,
    },
    {
      title: "Metals",
      desc: "Trade metals including Gold and Silver",
      icon: TrendingUp,
    },
    {
      title: "Cryptos",
      desc: "Trade Bitcoin, Ethereum, Ripple and others",
      icon: Lock,
    },
    {
      title: "Energies",
      desc: "Trade Brent Crude Oil, WTI, Natural Gas and Coal",
      icon: Lightbulb,
    },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-start pt-32 pb-0 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[150px]"></div>
      </div>

      {/* Hero Header */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-6 text-center lg:text-left"
          >
            <span className="text-emerald-500 font-black tracking-widest uppercase mb-4 block">
              About Us
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight">
              We are Specialist in <br />
              <span className="gradient-text">Financial Solutions</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-xl mx-auto lg:mx-0">
              Managed portfolios built by experts to target sustainable,
              long-term results and the highest returns for your risk level.
            </p>
            <div className="pt-4 flex justify-center lg:justify-start">
              <Link 
                href="/signup"
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-10 py-5 rounded-2xl flex justify-center items-center gap-3 text-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
              >
                Open your account
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            {metrics.map((metric, idx) => (
              <div
                key={idx}
                className="glass-panel p-8 flex items-center justify-between hover:border-emerald-500/50 transition-all rounded-[2rem]"
              >
                <div className="flex items-center gap-6">
                  <div className="h-16 w-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-xl">
                    <metric.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black text-white">
                    {metric.value}
                  </h3>
                </div>
                <div className="bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full hidden sm:block border border-emerald-500/20">
                  {metric.title}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* History / Who We Are */}
      <section className="w-full py-24 relative">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-16">
            {[
              {
                icon: Globe,
                title: "Our Heritage",
                desc: "Founded with a vision to democratize trading, Jerisom Trade has grown from a boutique firm to a global financial leader. We've weathered market cycles, adapting our strategies to ensure our clients always have an edge.",
              },
              {
                icon: Users,
                title: "Our Culture",
                desc: "We believe that financial success should be accessible to everyone. Our team of analysts, engineers, and support staff work tirelessly in a collaborative environment driven by innovation, transparency, and a client-first mentality.",
              },
              {
                icon: Clock,
                title: "Looking Forward",
                desc: "As the financial landscape evolves, so do we. We continually invest in cutting-edge technology, from AI-driven algorithms to ultra-fast execution servers, ensuring you are always positioned at the forefront of the market.",
              },
            ].map((block, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex flex-col md:flex-row gap-8 items-start glass-panel p-8 md:p-12 rounded-[2.5rem] border-white/5 bg-slate-900/40"
              >
                <div className="shrink-0 h-20 w-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
                  <block.icon className="h-10 w-10" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-white mb-4">
                    {block.title}
                  </h3>
                  <p className="text-lg text-slate-400 leading-relaxed font-medium">
                    {block.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Regulated & Certified */}
      <section className="w-full py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-950/50"></div>
        <div className="container mx-auto px-4 relative z-10 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 space-y-8">
              <span className="text-emerald-500 font-black tracking-widest uppercase block">
                Our Guarantee
              </span>
              <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
                Regulated & <br/><span className="gradient-text">Certified</span>
              </h2>
              <p className="text-xl text-slate-400 font-medium">
                Jerisom Trade operates under strict regulatory guidelines to
                ensure your funds and personal information are always
                protected. Our operations are fully transparent and audited
                regularly by independent third parties.
              </p>
              <ul className="space-y-4">
                {[
                  "Fully Licensed Financial Institution",
                  "Segregated Client Funds",
                  "Regular External Audits",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-4 text-white font-bold text-lg glass-panel py-4 px-6 rounded-2xl"
                  >
                    <CheckCircle className="text-emerald-500 h-6 w-6 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:w-1/2 w-full">
              <div className="glass-panel p-4 md:p-8 rounded-[3rem] border-white/10 shadow-2xl relative">
                 <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/20 blur-[100px] z-[-1]"></div>
                <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-slate-900 border border-white/5">
                  <Image
                    src="/assets/certificate.jpg"
                    alt="Official Company Certificate"
                    fill
                    className="object-contain opacity-90"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="w-full py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-16">
          <div className="glass-panel px-8 py-4 rounded-full font-black text-xl md:text-2xl tracking-wide uppercase border-emerald-500/30 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
            Why choose Jerisom Trade
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              className="glass-panel p-8 rounded-[2rem] border-l-4 border-l-emerald-500 relative overflow-hidden group bg-slate-900/40"
            >
              <feature.icon className="absolute -right-4 -bottom-4 h-32 w-32 text-emerald-500/5 transform group-hover:scale-110 transition-transform duration-500" />
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-400 font-medium">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Popular Markets */}
      <section className="w-full py-24 relative">
         <div className="absolute inset-0 bg-gradient-to-b from-slate-950/0 via-emerald-950/5 to-slate-950/0"></div>
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
              Trade the world's <br/><span className="gradient-text">popular markets</span>
            </h2>
            <p className="text-xl text-slate-400 font-medium">
              Find your next trade with access to a wide range of markets.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {markets.map((market, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10, scale: 1.02 }}
                className="glass-panel p-8 rounded-[2.5rem] bg-white/[0.02] border-white/5 hover:border-emerald-500/30 transition-all duration-300"
              >
                <div className="h-20 w-20 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mb-8 shadow-inner">
                  <market.icon className="h-10 w-10 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-black text-white mb-3">
                  {market.title}
                </h3>
                <p className="text-slate-400 mb-8 font-medium">{market.desc}</p>
                <Link
                  href="/signup"
                  className="inline-flex items-center font-bold text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-wider text-sm"
                >
                  Learn more <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Banner CTA */}
      <section className="w-full py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="glass-panel border-emerald-500/30 p-12 md:p-20 rounded-[3rem] relative overflow-hidden text-center shadow-[0_0_50px_rgba(16,185,129,0.15)] bg-slate-900/60">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent pointer-events-none"></div>
          
          <h2 className="text-4xl md:text-6xl font-black text-white mb-8">
            Investors <span className="gradient-text">#1 Choice</span>
          </h2>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto font-medium">
            Join thousands of traders globally securing their financial future with Jerisom Trade's cutting-edge platform.
          </p>
          <div className="flex justify-center">
            <Link 
              href="/signup"
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-12 py-6 rounded-2xl flex justify-center items-center gap-3 text-xl transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)]"
            >
              Start Trading Now <ArrowRight className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
