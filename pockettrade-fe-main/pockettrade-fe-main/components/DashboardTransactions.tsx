"use client";

import { useState } from "react";
import {
  Search,
  Calendar,
  ArrowDownCircle,
  ArrowUpCircle,
  RefreshCw,
} from "lucide-react";
import { ApiResponse, Transaction } from "@/interfaces";
import { callApi } from "@/lib/helpers";
import { useQuery } from "@tanstack/react-query";
import { useDemoMode } from "@/store/useDemoMode";
import { motion } from "framer-motion";

// Shadcn UI Imports
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DashboardTransactions() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>("all");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { isDemoMode } = useDemoMode();

  const { isLoading } = useQuery<Transaction[], Error>({
    queryKey: ["transaction", isDemoMode],
    queryFn: async () => {
      const { data: responseData, error } = await callApi<ApiResponse<Transaction[]>>("/transaction/user");
      if (error) throw new Error(error.message || "Something went wrong while fetching your transactions.");
      if (!responseData?.data) throw new Error("No transaction found");
      setTransactions(responseData.data);
      return responseData.data;
    },
  });

  const filteredTransactions = transactions
    .filter(t => activeTab === "all" || t.type === activeTab)
    .filter(t =>
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.reference.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(t => statusFilter === "all" || t.status === statusFilter);

  const formatDate = (dateString: string) =>
    new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      completed: "outline",
      pending: "outline",
      failed: "destructive",
    };
    const styles: Record<string, string> = {
      completed: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10",
      pending: "text-amber-400 border-amber-500/20 bg-amber-500/10",
      failed: "text-red-400 border-red-500/20 bg-red-500/10",
    };
    return (
      <Badge className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 ${styles[status] || "bg-white/5 text-slate-400 border-white/10"}`}>
        {status}
      </Badge>
    );
  };

  const getTypeIcon = (type: string) => {
    if (type === "Deposit") return <ArrowDownCircle className="h-5 w-5 text-emerald-400" />;
    if (type === "withdrawal") return <ArrowUpCircle className="h-5 w-5 text-red-400" />;
    return <RefreshCw className="h-5 w-5 text-blue-400" />;
  };

  const getAmountColor = (type: string) =>
    type === "Deposit" ? "text-emerald-400" : type === "withdrawal" ? "text-red-400" : "text-blue-400";

  const getAmountPrefix = (type: string) =>
    type === "Deposit" ? "+" : type === "withdrawal" ? "-" : "";

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20 mt-16 lg:mt-0">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="bg-slate-900/50 border-white/5 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full -mr-20 -mt-20 pointer-events-none"></div>
          <CardHeader className="p-8 relative z-10">
            <CardTitle className="text-3xl font-black text-white tracking-tighter uppercase mb-2">
              Transaction <span className="text-emerald-400">Ledger</span>
            </CardTitle>
            <CardDescription className="text-sm font-medium text-slate-400">
              Complete history of all account activity and settlements.
            </CardDescription>
          </CardHeader>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="bg-slate-900/50 border-white/5 backdrop-blur-xl">
          <CardContent className="p-6 space-y-6">
            {/* Filters */}
            <div className="flex flex-col gap-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-white/5 border border-white/10 p-1 h-12 gap-1">
                  <TabsTrigger value="all" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-slate-950 font-black uppercase tracking-widest text-[10px] px-6 h-full transition-all">All</TabsTrigger>
                  <TabsTrigger value="Deposit" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-slate-950 font-black uppercase tracking-widest text-[10px] px-6 h-full transition-all">Deposits</TabsTrigger>
                  <TabsTrigger value="withdrawal" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-slate-950 font-black uppercase tracking-widest text-[10px] px-6 h-full transition-all">Withdrawals</TabsTrigger>
                  <TabsTrigger value="Investment" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-slate-950 font-black uppercase tracking-widest text-[10px] px-6 h-full transition-all">Investments</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-grow group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                  <Input
                    placeholder="Search by description or reference..."
                    className="h-12 pl-12 bg-slate-950/50 border-white/5 text-white font-bold focus-visible:ring-emerald-500/50 placeholder:text-slate-600"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-12 bg-slate-950/50 border-white/5 text-white font-bold focus:ring-emerald-500/50 sm:w-52">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10 text-white font-bold">
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Transactions Table */}
            <div className="rounded-2xl border border-white/5 overflow-hidden overflow-x-auto custom-scrollbar">
              <Table>
                <TableHeader className="bg-white/5 border-b border-white/5">
                  <TableRow className="hover:bg-transparent border-none">
                    <TableHead className="py-5 px-6 font-black text-slate-500 uppercase tracking-widest text-[10px]">Description</TableHead>
                    <TableHead className="py-5 px-6 font-black text-slate-500 uppercase tracking-widest text-[10px]">Date</TableHead>
                    <TableHead className="py-5 px-6 font-black text-slate-500 uppercase tracking-widest text-[10px]">Type</TableHead>
                    <TableHead className="py-5 px-6 font-black text-slate-500 uppercase tracking-widest text-[10px]">Amount</TableHead>
                    <TableHead className="py-5 px-6 font-black text-slate-500 uppercase tracking-widest text-[10px] text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i} className="animate-pulse border-white/5">
                        <TableCell colSpan={5} className="h-16 bg-white/5"></TableCell>
                      </TableRow>
                    ))
                  ) : filteredTransactions.length === 0 ? (
                    <TableRow className="hover:bg-transparent border-none">
                      <TableCell colSpan={5} className="h-48 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <Calendar className="h-10 w-10 text-slate-600" />
                          <div>
                            <p className="text-white font-black text-lg mb-1">No transactions found</p>
                            <p className="text-slate-500 font-medium text-sm">
                              {searchTerm || statusFilter !== "all"
                                ? "Try adjusting your filters."
                                : "Your transaction history will appear here."}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.map((tx) => (
                      <TableRow key={tx.id} className="hover:bg-white/[0.02] border-white/5 transition-colors">
                        <TableCell className="py-5 px-6">
                          <div className="font-bold text-white text-sm">{tx.description}</div>
                          <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-0.5 font-mono">Ref: {tx.reference}</div>
                        </TableCell>
                        <TableCell className="py-5 px-6 text-sm font-medium text-slate-400">
                          {tx.created_at ? formatDate(tx.created_at) : "—"}
                        </TableCell>
                        <TableCell className="py-5 px-6">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(tx.type)}
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{tx.type}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-5 px-6">
                          <span className={`text-lg font-black font-mono ${getAmountColor(tx.type)}`}>
                            {getAmountPrefix(tx.type)}${tx.amount.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell className="py-5 px-6 text-right">
                          {getStatusBadge(tx.status)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
