"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Users, Copy, Share2, Mail, Gift, TrendingUp, UserPlus, Award } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { useSession } from "@/store/useSession";
import { ApiResponse, Referrals } from "@/interfaces";
import { callApi } from "@/lib/helpers";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useDemoMode } from "@/store/useDemoMode";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";

export default function DashboardReferrals() {
  const { user } = useSession((state) => state);
  const referralCode = user && user[0].referralCode;

  const referralLink = `https://jerisomtrade.com/signup?ref=${
    user && user[0].referralCode
  }`;

  const { isDemoMode } = useDemoMode();

  const { data: referral, error: queryError, isLoading } = useQuery<Referrals[], Error>({
    queryKey: ["referrals", isDemoMode],
    queryFn: async () => {
      if (isDemoMode) {
        return [
          {
            id: "demo-ref-1",
            referreeFirstName: "Alice",
            referreeLastName: "Johnson",
            referreeEmail: "alice.j@demo.com",
            hasInvested: true,
            created_at: new Date().toISOString(),
          },
          {
            id: "demo-ref-2",
            referreeFirstName: "Bob",
            referreeLastName: "Smith",
            referreeEmail: "bob.s@demo.com",
            hasInvested: false,
            created_at: new Date().toISOString(),
          },
        ] as any;
      }
      const { data: responseData, error } =
        await callApi<ApiResponse<Referrals[]>>("/referral/all");
      if (error) {
        throw new Error(
          error.message || "Something went wrong while fetching referrals.",
        );
      }
      return responseData?.data || [];
    },
  });

  useEffect(() => {
    if (queryError) {
      toast.error("Network Error", {
        description: queryError.message || "Failed to fetch referral data.",
      });
    }
  }, [queryError]);

  const totalReferrals = (referral && referral.length) || 0;
  const successfulReferrals = referral?.filter((r) => r.hasInvested).length ?? 0;
  const pendingReferrals = (referral && referral.filter((r) => !r.hasInvested).length) ?? 0;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied", {
      description: `${label} has been copied to clipboard.`,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="space-y-12 pb-20 mt-16 lg:mt-0 relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 relative z-10">
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="h-10 w-1 bg-emerald-500 rounded-full"></div>
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">Growth Program</p>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-6xl font-black tracking-tighter text-white uppercase leading-none"
          >
            Partner <span className="text-emerald-400">Network</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 max-w-xl font-medium text-lg leading-relaxed"
          >
            Expand the Jerisom ecosystem. Earn institutional-grade commission on every successful capital deployment from your network.
          </motion.p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 relative z-10">
        {[
          { label: "Network Size", value: totalReferrals, icon: Users, color: "text-blue-400", bgColor: "bg-blue-500/10" },
          { label: "Successful Deployments", value: successfulReferrals, icon: Award, color: "text-emerald-400", bgColor: "bg-emerald-500/10" },
          { label: "Pending Invitations", value: pendingReferrals, icon: Mail, color: "text-amber-400", bgColor: "bg-amber-500/10" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (i + 3) }}
          >
            <Card className="bg-slate-900/50 border-white/5 backdrop-blur-xl rounded-3xl">
              <CardContent className="p-8 flex items-center gap-6">
                <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg", stat.bgColor, stat.color)}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">
                    {stat.label}
                  </p>
                  <p className={cn("text-3xl font-black tracking-tighter text-white")}>
                    {stat.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8 relative z-10">
        <Card className="lg:col-span-2 bg-slate-900/40 border-white/5 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-10 pb-6">
            <CardTitle className="text-2xl font-black text-white uppercase tracking-tighter">Refer & <span className="text-emerald-500">Earn</span></CardTitle>
            <CardDescription className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">
              Your unique institutional referral credentials
            </CardDescription>
          </CardHeader>
          <CardContent className="px-10 pb-10 space-y-10">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Partner Link</p>
                <div className="relative group">
                  <Input
                    value={referralLink}
                    readOnly
                    className="h-14 bg-slate-950 border-white/5 text-slate-300 font-medium rounded-2xl pr-14 group-hover:border-emerald-500/30 transition-all"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopy(referralLink, "Referral link")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 text-emerald-400 hover:bg-emerald-500/10 rounded-xl"
                  >
                    <Copy className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Partner Code</p>
                <div className="relative group">
                  <Input
                    value={referralCode || "NONE"}
                    readOnly
                    className="h-14 bg-slate-950 border-white/5 text-emerald-400 font-black tracking-[0.2em] rounded-2xl pr-14 group-hover:border-emerald-500/30 transition-all"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => referralCode && handleCopy(referralCode, "Referral code")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 text-emerald-400 hover:bg-emerald-500/10 rounded-xl"
                  >
                    <Copy className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="h-px bg-white/5" />

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Share2, title: "Share Link", desc: "Distribute your partner link to your network." },
                { icon: UserPlus, title: "Network Growth", desc: "Friends join the Jerisom ecosystem via your link." },
                { icon: Gift, title: "Earn Rewards", desc: "Receive $50 credit for every qualifying investment." },
              ].map((step, i) => (
                <div key={i} className="space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                    <step.icon size={20} />
                  </div>
                  <h4 className="text-sm font-black text-white uppercase tracking-tight">{step.title}</h4>
                  <p className="text-[10px] font-medium text-slate-500 leading-relaxed uppercase tracking-widest">{step.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/40 border-white/5 backdrop-blur-3xl rounded-[2.5rem]">
          <CardHeader className="p-10 pb-6">
            <CardTitle className="text-xl font-black text-white uppercase tracking-tighter">Reward <span className="text-emerald-500">Milestones</span></CardTitle>
            <CardDescription className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Growth Progress Tracking</CardDescription>
          </CardHeader>
          <CardContent className="px-10 pb-10 space-y-8">
            <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
               <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.15em] leading-relaxed">
                 INVITE 5 FRIENDS WHO DEPLOY CAPITAL TO EARN A $250 INSTITUTIONAL BONUS.
               </p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {successfulReferrals}/5 COMPLETED
                </span>
                <span className="text-xs font-black text-white">
                  {((successfulReferrals / 5) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden shadow-inner relative">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(successfulReferrals / 5) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" 
                />
              </div>
              <p className="text-[9px] text-center text-slate-500 font-bold uppercase tracking-widest">
                {successfulReferrals >= 5 ? "BONUS UNLOCKED" : `${5 - successfulReferrals} MORE FOR $250 BONUS`}
              </p>
            </div>

            <div className="pt-6">
               <div className="p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] flex items-center gap-4 group hover:bg-white/[0.04] transition-all cursor-default">
                  <div className="h-12 w-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Earnings</p>
                    <p className="text-2xl font-black text-white">${(successfulReferrals * 50).toLocaleString()}</p>
                  </div>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
             <Users size={20} />
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Network <span className="text-emerald-500">History</span></h2>
        </div>
        
        <Card className="rounded-[2.5rem] border-white/5 overflow-hidden shadow-2xl bg-slate-900/40 backdrop-blur-3xl">
          {totalReferrals === 0 ? (
            <div className="p-20 text-center">
               <div className="h-20 w-20 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-slate-600 mx-auto mb-6">
                  <Users size={40} />
               </div>
               <p className="text-white font-black uppercase tracking-[0.2em] mb-2">Network is Empty</p>
               <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Share your partner link to start growing your network.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/[0.02] border-b border-white/5">
                  <tr>
                    <th className="py-8 px-10 text-left font-black text-slate-500 uppercase tracking-[0.2em] text-[10px]">Partner Identity</th>
                    <th className="py-8 text-left font-black text-slate-500 uppercase tracking-[0.2em] text-[10px]">Contact Detail</th>
                    <th className="py-8 text-left font-black text-slate-500 uppercase tracking-[0.2em] text-[10px]">Deployment Date</th>
                    <th className="py-8 pr-10 text-right font-black text-slate-500 uppercase tracking-[0.2em] text-[10px]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {referral?.map((r) => (
                    <tr key={r.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="py-6 px-10">
                        <span className="font-black text-white text-base tracking-tight uppercase group-hover:text-emerald-400 transition-colors">
                          {r.referreeFirstName} {r.referreeLastName}
                        </span>
                      </td>
                      <td className="py-6 font-bold text-slate-400 text-xs uppercase tracking-widest truncate max-w-[200px]">
                        {r.referreeEmail}
                      </td>
                      <td className="py-6 font-black text-slate-500 text-[10px] uppercase tracking-widest">
                        {formatDate(r.created_at)}
                      </td>
                      <td className="py-6 pr-10 text-right">
                        <Badge className={cn(
                          "font-black uppercase text-[9px] tracking-widest px-3 py-1 rounded-full border-transparent",
                          r.hasInvested ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                        )}>
                          {r.hasInvested ? "DEPLOYED" : "PENDING"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
