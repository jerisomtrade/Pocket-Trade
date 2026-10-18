"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ApiResponse } from "@/interfaces";
import { useInitSession } from "@/store/useSession";
import { callApi } from "@/lib/helpers";

export default function LogoutPage() {
  const router = useRouter();
  const actions = useInitSession((state) => state.actions);

  useEffect(() => {
    const handleLogout = async () => {
      try {
        const { error } = await callApi<ApiResponse>("/auth/sign-out");

        if (error) {
          toast.error("Logout Failed", {
            description: error.message || "Something went wrong.",
          });
          // Still clear session locally to be safe
          actions.clearSession();
          router.replace("/login");
        } else {
          actions.clearSession();
          toast.success("Signed Out", {
            description: "Session terminated successfully.",
          });
          router.replace("/login");
        }
      } catch (err) {
        toast.error("Logout Failed", {
          description: "An unexpected error occurred.",
        });
        actions.clearSession();
        router.replace("/login");
      }
    };

    handleLogout();
  }, [router, actions]);

  return (
    <div className="text-center space-y-4">
      <div className="h-10 w-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto"></div>
      <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Terminating Session...</p>
    </div>
  );
}
