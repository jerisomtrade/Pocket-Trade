"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard") || pathname?.startsWith("/connect");

  return (
    <>
      {!isDashboard && <Navbar />}
      <div className="flex-1 flex flex-col">
        {children}
      </div>
      {!isDashboard && <Footer />}
    </>
  );
}
