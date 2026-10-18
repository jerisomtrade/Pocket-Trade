"use client";

import { useQuery } from "@tanstack/react-query";

interface CompanyInfo {
  phone?: string | null;
  email?: string | null;
}

const COMPANY_EMAIL = process.env.NEXT_PUBLIC_COMPANY_EMAIL || "support@pockettrade.com";

export function useCompanyInfo() {
  const { data, isLoading } = useQuery<CompanyInfo>({
    queryKey: ["company-info"],
    queryFn: async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
        const baseApiUrl = backendUrl.endsWith('/api/v1')
          ? backendUrl
          : `${backendUrl.replace(/\/+$/, '')}/api/v1`;
        const res = await fetch(`${baseApiUrl}/user/company`);
        if (!res.ok) return { phone: null, email: COMPANY_EMAIL };
        const json = await res.json();
        return {
          phone: json?.data?.phone ?? null,
          email: COMPANY_EMAIL,
        };
      } catch {
        return { phone: null, email: COMPANY_EMAIL };
      }
    },
    staleTime: 5 * 60 * 1000, // cache for 5 mins
  });

  return {
    phone: data?.phone ?? null,
    email: data?.email ?? COMPANY_EMAIL,
    isLoading,
  };
}
