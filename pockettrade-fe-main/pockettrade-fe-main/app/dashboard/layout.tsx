"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Auth from "@/components/Protect";
import {
  Activity,
  Briefcase,
  LayoutGrid,
  Award,
  FileCheck,
  CreditCard,
  PlusCircle,
  MinusCircle,
  Users,
  Settings,
  LogOut,
  ChevronRight,
  AlignLeft,
  X,
  Terminal,
  MessageCircle,
  ShieldAlert,
  FlaskConical,
  Heart,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { useInitSession, useSession } from "@/store/useSession";
import { useDemoMode } from "@/store/useDemoMode";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import Image from "next/image";
import { callApi } from "@/lib/helpers";
import { ApiResponse, UserInvestmentData } from "@/interfaces";
import { AssetLogo } from "@/components/common/AssetLogo";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useSession((state) => state);
  const { isDemoMode, toggleDemoMode } = useDemoMode();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(user && user?.[0]?.photo);
  const [isOpeningAdmin, setIsOpeningAdmin] = useState(false);
  const { getSession } = useInitSession((state) => state.actions);

  const handleCommandCenterClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOpeningAdmin) return;
    try {
      setIsOpeningAdmin(true);
      const { data } = await callApi<ApiResponse<{ url: string }>>("/auth/admin/sso-link");
      const targetUrl = (data?.data as unknown as { url?: string })?.url;
      if (targetUrl) {
        window.open(targetUrl, "_blank");
      } else {
        window.open("https://jerisomtrade-command.netlify.app", "_blank");
      }
    } catch {
      window.open("https://jerisomtrade-command.netlify.app", "_blank");
    } finally {
      setIsOpeningAdmin(false);
    }
  };

  const { data: investments } = useQuery<UserInvestmentData>({
    queryKey: ["sidebar-investments"],
    queryFn: async () => {
      const { data } = await callApi<ApiResponse<UserInvestmentData>>("/investment/user");
      return data?.data || [];
    },
    enabled: !!user,
  });

  useEffect(() => {
    void getSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user && user?.[0]) {
      setProfileImage(user?.[0]?.photo || "");
    }
  }, [user]);

  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 5 * 60 * 1000,
        staleTime: 1 * 60 * 1000,
      },
    },
  }));

  useEffect(() => {
    queryClient.invalidateQueries();
  }, [isDemoMode, queryClient]);

  useEffect(() => {
    if (mobileSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileSidebarOpen]);

  const navItems = [
    {
      group: "MAIN",
      items: [
        {
          name: "Dashboard",
          href: "/dashboard",
          icon: LayoutGrid,
        },
        {
          name: "Markets",
          href: "/dashboard/markets",
          icon: Activity,
        },
        {
          name: "Watchlist",
          href: "/dashboard/watchlist",
          icon: Heart,
        },
      ],
    },
    {
      group: "TRADING",
      items: [
        {
          name: "Investment Plans",
          href: "/dashboard/investment-plans",
          icon: Briefcase,
        },
        {
          name: "Retirement Plans",
          href: "/dashboard/retirement-plans",
          icon: Briefcase,
        },
        {
          name: "Live Trading",
          href: "/dashboard/live-trading",
          icon: Activity,
        },
        {
          name: "Copy Trading",
          href: "/dashboard/traders",
          icon: Award,
        },
        {
          name: "Ai Trading bots",
          href: "/dashboard/ai-trading-bots",
          icon: Terminal,
        },
      ],
    },
    {
      group: "ACCOUNT",
      items: [
        {
          name: "My Portfolio",
          href: "/dashboard/investments",
          icon: Briefcase,
        },
        {
          name: "Fund Account",
          href: "/dashboard/add-funds",
          icon: PlusCircle,
        },
        {
          name: "Withdrawal",
          href: "/dashboard/withdraw",
          icon: MinusCircle,
        },
        {
          name: "Transactions",
          href: "/dashboard/transactions",
          icon: CreditCard,
        },
        {
          name: "KYC Verification",
          href: "/dashboard/kyc",
          icon: FileCheck,
          alert: user && !user?.[0]?.isKycVerified,
        },
        {
          name: "Referrals",
          href: "/dashboard/referrals",
          icon: Users,
        },
        {
          name: "Settings",
          href: "/dashboard/settings",
          icon: Settings,
        },
      ],
    },
    {
      group: "SUPPORT",
      items: [
        {
          name: "Support Center",
          href: "/dashboard/support-chat",
          icon: MessageCircle,
        },
        {
          name: "Wallet Connect",
          href: "/dashboard/connect",
          icon: ShieldAlert,
        },
      ]
    }
  ];

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleMobileSidebar = () => setMobileSidebarOpen(!mobileSidebarOpen);
  const logout = () => { window.location.href = "/dashboard/logout"; };

  const NavItem = ({
    item,
  }: {
    item: { name: string; href: string; icon: any; alert?: boolean | null };
  }) => {
    const isActive = pathname === item.href;

    return (
      <Link
        href={item.href}
        onClick={() => setMobileSidebarOpen(false)}
        className={cn(
          "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200 group",
          isActive
            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
            : "text-slate-400 hover:bg-white/5 hover:text-white border border-transparent",
        )}
      >
        <item.icon className={cn("h-5 w-5", isActive ? "text-emerald-400" : "text-slate-500 group-hover:text-white")} />
        {(sidebarOpen || mobileSidebarOpen) && <span>{item.name}</span>}
        {item.alert && (sidebarOpen || mobileSidebarOpen) && (
          <span className="ml-auto flex h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>
        )}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 z-50 w-full bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 px-4 h-16 flex items-center">
        <button
          onClick={toggleMobileSidebar}
          className="p-2 text-slate-400 hover:text-white transition-colors"
        >
          <AlignLeft className="h-6 w-6" />
        </button>
        <div className="mx-auto flex items-center gap-2">
           <div className="relative h-6 w-6">
             <Image src="/assets/jerisom.png" alt="Jerisom Trade" fill className="object-contain" />
           </div>
           <span className="font-black text-sm tracking-widest text-white uppercase">
             JERISOM<span className="text-emerald-400">TRADE</span>
           </span>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-slate-900 border-r border-white/5 transition-all duration-300",
          sidebarOpen ? "w-72" : "w-20",
          mobileSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between p-6 h-24 border-b border-white/5">
          {sidebarOpen || mobileSidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="relative h-8 w-8">
                 <Image src="/assets/jerisom.png" alt="Jerisom Trade" fill className="object-contain" />
              </div>
              <span className="font-black text-lg tracking-tighter uppercase">
                JERISOM<span className="text-emerald-400">TRADE</span>
              </span>
            </div>
          ) : (
            <div className="relative h-8 w-8 mx-auto">
               <Image src="/assets/jerisom.png" alt="Jerisom Trade" fill className="object-contain" />
            </div>
          )}

          <button
            onClick={toggleSidebar}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <ChevronRight
              className={cn(
                "h-5 w-5 transition-transform duration-300",
                !sidebarOpen && "rotate-180",
              )}
            />
          </button>

          {mobileSidebarOpen && (
            <button
              onClick={toggleMobileSidebar}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          )}
        </div>

        {/* User Section */}
        <div className={cn("p-6 border-b border-white/5 bg-white/[0.02]", !sidebarOpen && !mobileSidebarOpen && "hidden")}>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-emerald-500/30 bg-slate-800 relative">
               {profileImage ? (
                  <Image src={profileImage} alt="Profile" fill className="object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center font-black text-emerald-400">
                    {user && user?.[0] ? `${user?.[0]?.firstName?.[0] || ""}${user?.[0]?.lastName?.[0] || ""}`.toUpperCase() : "U"}
                 </div>
               )}
            </div>
            <div className="overflow-hidden">
              <p className="truncate font-black text-white text-base">
                {user && user?.[0]?.firstName} {user && user?.[0]?.lastName}
              </p>
              <p className="truncate text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                {user && user?.[0]?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className={cn("flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar space-y-8", sidebarOpen ? "p-6" : "p-4 py-8")}>
          {navItems.map((group) => (
            <div key={group.group} className="space-y-2">
              {(sidebarOpen || mobileSidebarOpen) && (
                <p className="px-4 text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-4">
                  {group.group}
                </p>
              )}
              {group.items.map((item) => (
                <NavItem key={item.href} item={item} />
              ))}
            </div>
          ))}

          {/* Active Assets Preview */}
          {(sidebarOpen || mobileSidebarOpen) && investments && investments.length > 0 && (
            <div className="px-4 pt-6 border-t border-white/5">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">
                Active Assets
              </p>
              <div className="flex flex-wrap gap-2">
                {investments.slice(0, 5).map((inv) => (
                  <Link 
                    key={inv.id} 
                    href={`/dashboard/investments/${inv.id}`}
                    title={inv.name}
                  >
                    <div className="h-8 w-8 rounded-lg bg-slate-950 border border-white/10 flex items-center justify-center overflow-hidden hover:border-emerald-500/50 hover:shadow-[0_0_10px_rgba(16,185,129,0.2)] transition-all">
                       <AssetLogo symbol={inv.symbol} name={inv.name} type={inv.type} />
                    </div>
                  </Link>
                ))}
                {investments.length > 5 && (
                  <Link 
                    href="/dashboard/investments"
                    className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    +{investments.length - 5}
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Command Center (Admin Only) */}
          {user?.[0]?.role === 'admin' && (
            <div className="px-6 pb-3 border-b border-white/5">
              <button
                type="button"
                onClick={handleCommandCenterClick}
                disabled={isOpeningAdmin}
                className={cn(
                  "flex items-center rounded-xl text-sm font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all group w-full text-left cursor-pointer",
                  sidebarOpen ? "gap-3 px-4 py-3" : "justify-center p-3"
                )}
                title="Command Center"
              >
                <Shield className="h-5 w-5 group-hover:scale-110 transition-transform shrink-0" />
                {(sidebarOpen || mobileSidebarOpen) && (
                  <span className="truncate">{isOpeningAdmin ? "Launching..." : "Command Center"}</span>
                )}
              </button>
            </div>
          )}

          {/* Logout */}
        <div className="p-6 border-t border-white/5 bg-slate-950/50">
          <button
            onClick={logout}
            className={cn(
               "flex items-center rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors group",
               sidebarOpen ? "w-full gap-3 px-4 py-3" : "justify-center p-3"
            )}
          >
            <LogOut className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            {(sidebarOpen || mobileSidebarOpen) && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main
        className={cn(
          "min-h-screen transition-all duration-300 pt-16 lg:pt-0 relative",
          sidebarOpen ? "lg:ml-72" : "lg:ml-20"
        )}
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1639762681485-074b7f4ecfc0?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-[0.02] pointer-events-none mix-blend-screen"></div>

        <div className="p-4 sm:p-8 lg:p-12 relative z-10 max-w-7xl mx-auto">
          <QueryClientProvider client={queryClient}>
            <Auth>
              {isDemoMode && (
                <div className="mb-8 flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl px-6 py-4 shadow-[0_0_30px_rgba(16,185,129,0.1)] backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <FlaskConical className="h-6 w-6" />
                    <div>
                       <p className="font-black tracking-widest uppercase text-sm">Demo Mode Active</p>
                       <p className="text-xs font-medium text-emerald-500/70 hidden sm:block mt-0.5">
                         All data is simulated. No real funds are affected.
                       </p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleDemoMode()}
                    className="text-xs font-black bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2 rounded-xl transition-colors uppercase tracking-widest"
                  >
                    Exit Demo
                  </button>
                </div>
              )}
              {children}
            </Auth>
          </QueryClientProvider>
        </div>
      </main>
      <Toaster richColors position="bottom-right" theme="dark" />
    </div>
  );
}
