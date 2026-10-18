"use client";

import Hero from "@/components/Hero";
import Ticker from "@/components/Ticker";
import Stats from "@/components/Stats";
import AssetShowcase from "@/components/AssetShowcase";
import Features from "@/components/Features";
import LiveMarket from "@/components/LiveMarket";
import HowItWorks from "@/components/HowItWorks";
import SecurityInfrastructure from "@/components/SecurityInfrastructure";
import Testimonial from "@/components/Testimonial";
import GlobalReach from "@/components/GlobalReach";
import CTA from "@/components/CTA";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between pt-32 pb-0 relative overflow-hidden">
      
      {/* Decorative background elements */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[150px]"></div>
      </div>

      <Hero />
      <Ticker />
      <Stats />
      <AssetShowcase />
      <Features />
      <LiveMarket />
      <HowItWorks />
      <SecurityInfrastructure />
      <Testimonial />
      <GlobalReach />
      <CTA />

    </main>
  );
}
