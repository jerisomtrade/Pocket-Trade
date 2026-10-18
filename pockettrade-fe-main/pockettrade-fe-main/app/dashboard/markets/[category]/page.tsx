"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  RefreshCcw,
  LayoutGrid,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { callApi } from "@/lib/helpers";
import { ApiResponse } from "@/interfaces";
import InvestModal from "@/components/InvestModal";
import { PaginatedData } from "@/interfaces";
import { AssetLogo } from "@/components/common/AssetLogo";
import { motion } from "framer-motion";

interface Asset {
  id: string;
  name: string;
  symbol: string;
  type: string;
  price: number | null;
  change_percentage: number | null;
  volume: string | number | null;
  last_sync: string | null;
  sector?: string;
}

const CATEGORY_MAP: Record<string, string> = {
  crypto: "Cryptocurrency",
  stocks: "Global Stocks",
  energy: "Energy Markets",
  oil_gas: "Oil & Gas",
  forex: "Foreign Exchange",
  commodity: "Commodities & Metals",
};

export default function CategoryExplorer() {
  const params = useParams();
  const category = params.category as string;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 20;

  const {
    data: paginatedResponse,
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["assets", category, page],
    queryFn: async () => {
      const { data: responseData, error } = await callApi<
        ApiResponse<PaginatedData<Asset>>
      >(`/assets/type?type=${category}&page=${page}&limit=${limit}`);
      if (error) throw new Error(error.message);
      return responseData?.data;
    },
    refetchInterval: 30000,
  });

  const assets = paginatedResponse?.data || [];
  const meta = paginatedResponse?.meta;

  const filteredAssets = assets.filter(
    (asset) =>
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleInvest = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20 mt-16 lg:mt-0">
      {/* Header Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-slate-900/50 border border-white/5 p-8 rounded-3xl glass-panel relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full -mr-20 -mt-20 pointer-events-none"></div>

        <div className="space-y-4 relative z-10">
          <Link
            href="/dashboard/markets"
            className="inline-flex items-center text-xs font-black uppercase tracking-widest text-slate-500 hover:text-emerald-400 transition-colors group mb-4 bg-white/5 px-4 py-2 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Markets
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
              {CATEGORY_MAP[category] || "Asset Explorer"}
            </h1>
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              Live Feed
            </div>
          </div>
          <p className="text-slate-400 font-medium max-w-xl">
            Institutional liquidity for {CATEGORY_MAP[category]?.toLowerCase()}.
            Real-time execution and automated spreads.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={() => refetch()}
            className={`w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl transition-all text-white ${isFetching ? "animate-spin text-emerald-400 border-emerald-500/50" : ""}`}
          >
            <RefreshCcw className="w-5 h-5" />
          </button>
          <Link href="/dashboard/markets" className="h-12 px-6 flex items-center gap-2 bg-white text-slate-950 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-colors">
            <LayoutGrid className="w-4 h-4" />
            All Markets
          </Link>
        </div>
      </motion.div>

      {/* Controls Bar */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
          <input
            type="text"
            placeholder={`Search ${category} by name or symbol...`}
            className="w-full h-14 pl-14 pr-6 rounded-2xl bg-slate-900/50 border border-white/5 text-white font-bold focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-slate-600 glass-panel"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </motion.div>

      {/* Asset Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel bg-slate-900/50 border border-white/5 rounded-3xl overflow-hidden overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-white/5 border-b border-white/10">
              <th className="py-6 px-8 font-black text-slate-500 uppercase tracking-widest text-[10px]">
                Asset / Symbol
              </th>
              <th className="py-6 font-black text-slate-500 uppercase tracking-widest text-[10px]">
                Sector
              </th>
              <th className="py-6 font-black text-slate-500 uppercase tracking-widest text-[10px]">
                Price
              </th>
              <th className="py-6 font-black text-slate-500 uppercase tracking-widest text-[10px]">
                24h Change
              </th>
              <th className="py-6 font-black text-slate-500 uppercase tracking-widest text-[10px]">
                Volume
              </th>
              <th className="py-6 pr-8 text-right font-black text-slate-500 uppercase tracking-widest text-[10px]">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/5"></div>
                      <div className="space-y-2">
                        <div className="h-4 w-24 bg-white/5 rounded"></div>
                        <div className="h-3 w-12 bg-white/5 rounded"></div>
                      </div>
                    </div>
                  </td>
                  <td><div className="h-6 w-20 bg-white/5 rounded-full"></div></td>
                  <td><div className="h-5 w-20 bg-white/5 rounded"></div></td>
                  <td><div className="h-5 w-16 bg-white/5 rounded"></div></td>
                  <td><div className="h-5 w-24 bg-white/5 rounded"></div></td>
                  <td className="pr-8 text-right"><div className="h-10 w-24 bg-white/5 rounded-xl inline-block"></div></td>
                </tr>
              ))
            ) : filteredAssets?.length === 0 ? (
              <tr>
                <td colSpan={6} className="h-48 text-center text-slate-500 font-bold uppercase tracking-widest text-xs">
                  No assets found matching your search.
                </td>
              </tr>
            ) : (
              filteredAssets?.map((asset) => (
                <tr key={asset.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="py-5 px-8">
                    <div className="flex items-center gap-4">
                      <AssetLogo
                        symbol={asset.symbol}
                        name={asset.name}
                        type={asset.type === "stock" ? "stocks" : asset.type === "etf" ? "etfs" : asset.type}
                        className="h-10 w-10 transition-transform group-hover:scale-110"
                      />
                      <div>
                        <p className="font-black text-white">{asset.name}</p>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-0.5">
                          {asset.symbol}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="bg-white/5 border border-white/10 text-slate-400 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest">
                      {asset.sector || "General"}
                    </span>
                  </td>
                  <td className="font-mono font-bold text-white">
                    {asset.price !== null && asset.price !== undefined
                      ? `$${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`
                      : "$ —"}
                  </td>
                  <td>
                    {asset.change_percentage !== null &&
                    asset.change_percentage !== undefined ? (
                      <div className={`flex items-center gap-1 font-black text-sm ${asset.change_percentage >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                        {asset.change_percentage >= 0 ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4" />
                        )}
                        {Math.abs(asset.change_percentage).toFixed(2)}%
                      </div>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </td>
                  <td className="text-slate-400 font-medium text-sm">
                    {asset.volume
                      ? typeof asset.volume === "number"
                        ? asset.volume.toLocaleString()
                        : asset.volume
                      : "N/A"}
                  </td>
                  <td className="pr-8 text-right">
                    <button
                      onClick={() => handleInvest(asset)}
                      className="rounded-xl h-10 px-6 font-black text-xs uppercase tracking-widest bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] active:scale-95"
                    >
                      Invest
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </motion.div>

      {/* Pagination Controls */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Page {meta.currentPage} of {meta.totalPages} <span className="text-slate-600 mx-2">|</span> {meta.totalItems} assets
          </p>
          <div className="flex gap-2">
            <button
              className="h-10 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-black text-xs uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <button
              className="h-10 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-black text-xs uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= meta.totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Invest Modal Hook */}
      {selectedAsset && (
        <InvestModal
          asset={selectedAsset}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
