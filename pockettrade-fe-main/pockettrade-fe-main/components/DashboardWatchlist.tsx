"use client";

import { AssetLogo } from "@/components/common/AssetLogo";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Heart, Search, TrendingUp, TrendingDown, X, Eye, ShoppingCart, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import { ApiResponse, Wishlist } from "@/interfaces";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { callApi } from "@/lib/helpers";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function DashboardWatchlist() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: wishlist = [], isLoading, error: queryError } = useQuery<Wishlist[], Error>({
    queryKey: ["watchlist"],
    queryFn: async () => {
      const { data: responseData, error } = await callApi<ApiResponse<Wishlist[]>>("/wishlist/user");
      if (error) throw new Error(error.message || "Failed to fetch watchlist.");
      return responseData?.data || [];
    },
  });

  useEffect(() => {
    if (queryError) {
      toast.error("Network Error", {
        description: queryError.message || "Failed to load your watchlist.",
      });
    }
  }, [queryError]);

  const removeFromWishlist = async (id: string) => {
    // Optimistic update
    const previousData = queryClient.getQueryData<Wishlist[]>(["watchlist"]);
    queryClient.setQueryData(["watchlist"], (old: Wishlist[] | undefined) => 
      old?.filter(item => item.wishlist.id !== id) || []
    );

    try {
      const { data: responseData, error } = await callApi<ApiResponse<null>>(`/wishlist/delete`, { wishlistId: id });
      if (error) throw new Error(error.message);
      if (responseData?.status === "success") {
        toast.success("Watchlist Updated", {
          description: "Asset successfully removed from your watchlist.",
        });
        queryClient.invalidateQueries({ queryKey: ["watchlist"] });
      }
    } catch (err) {
      // Rollback
      queryClient.setQueryData(["watchlist"], previousData);
      toast.error("Operation Failed", {
        description: err instanceof Error ? err.message : "Failed to remove asset.",
      });
    }
  };

  const filteredWishlist = wishlist.filter(
    (item) =>
      item?.wishlist?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.wishlist?.symbol?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12 pb-20 mt-16 lg:mt-0 relative">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 relative z-10">
        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
            <div className="h-10 w-1 bg-emerald-500 rounded-full"></div>
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">Personal Curation</p>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl lg:text-6xl font-black tracking-tighter text-white uppercase leading-none">
            My <span className="text-emerald-400">Watchlist</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-slate-400 max-w-xl font-medium text-lg leading-relaxed">
            Track and monitor high-potential assets. Keep your preferred investments within reach for rapid deployment.
          </motion.p>
        </div>
      </div>

      <Card className="bg-slate-900/40 border-white/5 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden relative z-10 shadow-2xl">
        <CardHeader className="p-10 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
             <CardTitle className="text-2xl font-black text-white uppercase tracking-tighter">Market <span className="text-emerald-500">Observation</span></CardTitle>
             <CardDescription className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Real-time performance of curated assets</CardDescription>
          </div>
          <div className="relative group min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
            <Input
              placeholder="FILTER WATCHLIST..."
              className="h-12 pl-12 bg-slate-950 border-white/5 text-xs font-black tracking-widest uppercase rounded-xl transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        
        <CardContent className="px-0 pb-0">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <div className="p-20 text-center space-y-4">
                 <div className="h-12 w-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto"></div>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Synchronizing Watchlist...</p>
              </div>
            ) : filteredWishlist.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-20 text-center">
                 <div className="h-20 w-20 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-slate-600 mx-auto mb-6">
                    <Heart size={40} />
                 </div>
                 <p className="text-white font-black uppercase tracking-[0.2em] mb-2">{searchTerm ? "No Matches Found" : "Your Watchlist is Empty"}</p>
                 <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                   {searchTerm ? "Refine your search parameters." : "Add assets to keep track of their institutional performance."}
                 </p>
                 {!searchTerm && (
                   <Button onClick={() => router.push("/dashboard/markets")} className="mt-8 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase tracking-widest px-8 rounded-xl">
                      Explore Markets
                   </Button>
                 )}
              </motion.div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/[0.02] border-b border-white/5">
                    <tr>
                      <th className="py-8 px-10 text-left font-black text-slate-500 uppercase tracking-[0.2em] text-[10px]">Asset Identity</th>
                      <th className="py-8 text-left font-black text-slate-500 uppercase tracking-[0.2em] text-[10px]">Market Valuation</th>
                      <th className="py-8 text-left font-black text-slate-500 uppercase tracking-[0.2em] text-[10px]">Volatility (24H)</th>
                      <th className="py-8 pr-10 text-right font-black text-slate-500 uppercase tracking-[0.2em] text-[10px]">System Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredWishlist.map((item, i) => {
                       const isUp = (Number(item.metrics.change_percentage) || 0) >= 0;
                       return (
                        <motion.tr 
                          key={item.wishlist.id} 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="group hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="py-6 px-10">
                            <div className="flex items-center gap-4">
                               <div className="h-12 w-12 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-center p-2 group-hover:border-emerald-500/50 transition-all">
                                  <AssetLogo 
                                    symbol={item.wishlist.symbol} 
                                    name={item.wishlist.name} 
                                    type={item.wishlist.type as any || (item.wishlist.brand === "Broad Market" ? "etfs" : "stocks")} 
                                  />
                               </div>
                               <div>
                                  <p className="font-black text-white uppercase tracking-tight group-hover:text-emerald-400 transition-colors">{item.wishlist.name}</p>
                                  <div className="flex items-center gap-2 mt-0.5">
                                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.wishlist.symbol}</span>
                                     <span className="h-1 w-1 bg-slate-700 rounded-full"></span>
                                     <span className="text-[10px] font-black text-emerald-500/70 uppercase tracking-widest">{item.wishlist.brand}</span>
                                  </div>
                               </div>
                            </div>
                          </td>
                          <td className="py-6">
                             <p className="text-lg font-black text-white tracking-tighter">${Number(item.metrics.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                             <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-0.5">Market Price (USD)</p>
                          </td>
                          <td className="py-6">
                             <div className={cn("flex items-center gap-1.5 font-black text-sm", isUp ? "text-emerald-400" : "text-red-400")}>
                                {isUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                <span>{isUp ? "+" : ""}{Number(item.metrics.change_percentage).toFixed(2)}%</span>
                             </div>
                          </td>
                          <td className="py-6 pr-10">
                            <div className="flex items-center justify-end gap-3">
                               <Button
                                  onClick={() => router.push(`/dashboard/new-investment?symbol=${encodeURIComponent(item.wishlist.symbol)}&name=${encodeURIComponent(item.wishlist.name)}`)}
                                  className="h-10 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase text-[10px] tracking-widest px-6 rounded-xl shadow-lg shadow-emerald-500/10"
                               >
                                  Deploy
                               </Button>
                               <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => removeFromWishlist(item.wishlist.id)}
                                  className="h-10 w-10 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                               >
                                  <X className="h-5 w-5" />
                               </Button>
                            </div>
                          </td>
                        </motion.tr>
                       );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
