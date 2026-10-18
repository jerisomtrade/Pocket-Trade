"use client";

import React, { useState } from "react";
import {
  Award,
  Users,
  Star,
  Search,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { callApi } from "@/lib/helpers";
import { ApiResponse } from "@/interfaces";
import { Skeleton } from "@/components/ui/skeleton";
import CopyModal from "@/components/CopyModal";
import TraderRegistrationModal from "@/components/TraderRegistrationModal";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Trader {
  id: string;
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  riskLevel: 'low' | 'medium' | 'high';
  assetFocus: 'stocks' | 'crypto' | 'both';
  winRate: number;
  totalProfitPercent: number;
  totalFollowers: number;
  commissionRate: number;
  minCopyAmount: number;
}

export default function TraderLeaderboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTrader, setSelectedTrader] = useState<Trader | null>(null);
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);

  const { data: traders, isLoading } = useQuery<Trader[], Error>({
    queryKey: ["traders"],
    queryFn: async () => {
      const { data: responseData, error } = await callApi<ApiResponse<any>>("/traders");
      if (error) throw new Error(error.message);
      // Handle both paginated ({ data: [...], meta: {...} }) and plain array responses
      const payload = responseData?.data;
      return Array.isArray(payload) ? payload : (payload?.data ?? []);
    },
  });

  const { data: traderStatus } = useQuery({
    queryKey: ["trader-status"],
    queryFn: async () => {
      const { data, error } = await callApi<ApiResponse<any>>("/traders/me");
      if (error) return null;
      return data?.data;
    },
  });

  const isTrader = !!traderStatus;

  const filteredTraders = traders?.filter(trader => 
    trader.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = (trader: Trader) => {
    setSelectedTrader(trader);
    setIsCopyModalOpen(true);
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
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">Institutional Grade</p>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-6xl font-black tracking-tighter text-white uppercase leading-none"
          >
            Market <span className="text-emerald-400">Experts</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 max-w-xl font-medium text-lg leading-relaxed"
          >
            Mirror institutional-grade strategies from elite performers. Automated real-time trade execution with full transparency.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="relative group min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
            <Input 
              placeholder="Search expert traders..."
              className="h-14 pl-12 bg-slate-900 border-white/5 focus:border-emerald-500/50 text-white font-bold rounded-2xl transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {isTrader ? (
            <Link href="/dashboard/trader-portal">
              <Button 
                className="h-14 px-8 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 font-black uppercase tracking-widest rounded-2xl transition-all"
              >
                Trader Portal
              </Button>
            </Link>
          ) : (
            <Button 
              onClick={() => setIsRegModalOpen(true)}
              className="h-14 px-8 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-emerald-500/10 transition-all active:scale-[0.98]"
            >
              Become a Trader
            </Button>
          )}
        </motion.div>
      </div>

      {/* Featured Traders */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 relative z-10">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="bg-slate-900/50 border-white/5 backdrop-blur-xl rounded-3xl p-6">
               <div className="flex items-center gap-4 mb-6">
                  <Skeleton className="h-16 w-16 rounded-2xl" />
                  <div className="space-y-2">
                     <Skeleton className="h-4 w-32" />
                     <Skeleton className="h-3 w-20" />
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-4 mb-6">
                  <Skeleton className="h-16 rounded-2xl" />
                  <Skeleton className="h-16 rounded-2xl" />
               </div>
               <Skeleton className="h-12 w-full rounded-xl" />
            </Card>
          ))
        ) : (
          <AnimatePresence>
            {filteredTraders?.slice(0, 3).map((trader, idx) => (
              <motion.div
                key={trader.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
              >
                <Card className="group relative overflow-hidden bg-slate-900/50 border-white/5 backdrop-blur-xl rounded-3xl hover:border-emerald-500/30 transition-all duration-500 hover:shadow-[0_0_50px_rgba(16,185,129,0.05)]">
                  {/* Decorative element */}
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    {idx === 0 ? (
                      <Star className="fill-emerald-400 text-emerald-400 w-16 h-16" />
                    ) : (
                      <Award className="text-emerald-400 w-16 h-16" />
                    )}
                  </div>

                  <CardHeader className="p-8 pb-4">
                    <div className="flex items-center gap-5">
                      <div className="relative">
                        <Avatar className="h-20 w-20 rounded-2xl border-2 border-white/5 bg-slate-800 shadow-2xl">
                          <AvatarImage src={trader.avatarUrl || ""} className="object-cover" />
                          <AvatarFallback className="bg-emerald-500/10 text-emerald-400 font-black text-2xl">
                            {trader.displayName.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {idx === 0 && (
                          <div className="absolute -top-2 -left-2 bg-emerald-500 text-slate-950 font-black text-[8px] uppercase px-2 py-1 rounded-full shadow-lg">
                            TOP #1
                          </div>
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-black text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tight">
                           {trader.displayName}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1.5 text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">
                          <Users className="w-3 h-3 text-emerald-500" /> {trader.totalFollowers} Copiers
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-8 pt-4 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl group-hover:bg-emerald-500/5 transition-colors">
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Total Profit</p>
                        <p className={`text-2xl font-black ${trader.totalProfitPercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {trader.totalProfitPercent >= 0 ? '+' : ''}{trader.totalProfitPercent}%
                        </p>
                      </div>
                      <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl group-hover:bg-white/[0.04] transition-colors">
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Win Rate</p>
                        <p className="text-2xl font-black text-white">{trader.winRate}%</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button 
                        asChild 
                        variant="outline" 
                        className="flex-1 h-14 bg-white/5 border-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest rounded-2xl transition-all"
                      >
                        <Link href={`/dashboard/traders/${trader.id}`}>View Stats</Link>
                      </Button>
                      <Button 
                        onClick={() => handleCopy(trader)}
                        className="flex-1 h-14 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-emerald-500/10 transition-all active:scale-[0.98]"
                      >
                        Copy
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Leaderboard Table */}
      <div className="space-y-6 relative z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Elite Rank <span className="text-emerald-500">Board</span></h2>
          <div className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-widest text-[10px]">
            <TrendingUp size={14} className="text-emerald-500" />
            Live Rankings
          </div>
        </div>
        
        <Card className="rounded-[2.5rem] border-white/5 overflow-hidden shadow-2xl bg-slate-900/40 backdrop-blur-3xl">
          <Table>
            <TableHeader className="bg-white/[0.02]">
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="py-8 px-10 font-black text-slate-500 uppercase tracking-[0.2em] text-[10px]">Expert Identity</TableHead>
                <TableHead className="py-8 font-black text-slate-500 uppercase tracking-[0.2em] text-[10px]">Risk Protocol</TableHead>
                <TableHead className="py-8 font-black text-slate-500 uppercase tracking-[0.2em] text-[10px]">Focus Sector</TableHead>
                <TableHead className="py-8 font-black text-slate-500 uppercase tracking-[0.2em] text-[10px]">Total ROI</TableHead>
                <TableHead className="py-8 font-black text-slate-500 uppercase tracking-[0.2em] text-[10px]">Network Size</TableHead>
                <TableHead className="py-8 pr-10 text-right font-black text-slate-500 uppercase tracking-[0.2em] text-[10px]">Strategic Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-white/5"><TableCell colSpan={6} className="py-4 px-10"><Skeleton className="h-12 w-full rounded-xl" /></TableCell></TableRow>
                ))
              ) : (
                filteredTraders?.map((trader) => (
                  <TableRow key={trader.id} className="group hover:bg-white/[0.02] border-white/5 transition-colors">
                    <TableCell className="py-6 px-10">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 rounded-xl border border-white/5 bg-slate-800">
                          <AvatarImage src={trader.avatarUrl || ""} className="object-cover" />
                          <AvatarFallback className="bg-emerald-500/10 text-emerald-400 font-black uppercase text-base">{trader.displayName[0]}</AvatarFallback>
                        </Avatar>
                        <div className="font-black text-white text-base tracking-tight uppercase group-hover:text-emerald-400 transition-colors">{trader.displayName}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn(
                        "font-black uppercase text-[9px] tracking-widest px-3 py-1 rounded-full border-transparent",
                        trader.riskLevel === 'low' ? 'bg-emerald-500/10 text-emerald-400' : 
                        trader.riskLevel === 'medium' ? 'bg-amber-500/10 text-amber-400' : 
                        'bg-red-500/10 text-red-400'
                      )}>
                        {trader.riskLevel} Risk
                      </Badge>
                    </TableCell>
                    <TableCell className="capitalize text-slate-400 font-bold text-sm tracking-wide">{trader.assetFocus}</TableCell>
                    <TableCell className={`font-black text-lg ${trader.totalProfitPercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {trader.totalProfitPercent >= 0 ? '+' : ''}{trader.totalProfitPercent}%
                    </TableCell>
                    <TableCell className="text-slate-500 font-bold">{trader.totalFollowers.toLocaleString()}</TableCell>
                    <TableCell className="pr-10 text-right">
                      <Button 
                        onClick={() => handleCopy(trader)}
                        className="bg-transparent text-emerald-400 font-black uppercase tracking-widest text-[11px] hover:bg-emerald-500/10 hover:text-emerald-300 transition-all group/btn"
                      >
                        Mirror Strategy
                        <ChevronRight className="ml-1 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {!isLoading && (!filteredTraders || filteredTraders.length === 0) && (
             <div className="p-20 text-center">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-white/[0.02] border border-white/5 text-slate-500 mb-6">
                   <Search size={32} />
                </div>
                <p className="text-white font-black uppercase tracking-widest">No Experts Found</p>
                <p className="text-slate-500 text-sm mt-2">Adjust your search parameters and try again.</p>
             </div>
          )}
        </Card>
      </div>

      {/* Modals Hook */}
      {selectedTrader && (
        <CopyModal 
          trader={selectedTrader} 
          isOpen={isCopyModalOpen} 
          onClose={() => setIsCopyModalOpen(false)} 
        />
      )}
      <TraderRegistrationModal 
        isOpen={isRegModalOpen} 
        onClose={() => setIsRegModalOpen(false)} 
      />
    </div>
  );
}
