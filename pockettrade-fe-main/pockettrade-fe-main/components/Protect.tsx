"use client";

import { useSession } from "@/store";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { Loader } from "./common";

type AuthProps = {
  children: ReactNode;
  exclude?: string[];
};

const Auth = ({ children, exclude = [] }: AuthProps) => {
  const { user, loading } = useSession((state) => state);
  const router = useRouter();
  const pathname = usePathname();

  if (loading || !pathname)
    return <Loader message="Validating auth status..." />;

  const isDashboardRoute = pathname.includes("/dashboard");

  if (exclude.includes(pathname)) return children;

  const redirect = (route: string) => {
    setTimeout(() => {
      router.replace(route);
    }, 500);
  };

  // If user is NOT signed in and on a dashboard route, redirect to login
  if (isDashboardRoute && !user) {
    if (typeof window !== "undefined") {
      localStorage.setItem("redirectAfterLogin", pathname);
    }

    redirect("/login");
    return <Loader message="Redirecting to login..." />;
  }

  return children;
};

export default Auth;
