import LogoutPage from "@/components/auth/Logout";
import { generatePageMetadata } from "@/components/common/PageMetaData";
import { Metadata } from "next";

export const generateMetadata = (): Metadata => {
  return generatePageMetadata({
    title: "Logout | Jerisom Trade",
    content: "Safely terminate your trading session.",
    url: "https://jerisomtrade.com/dashboard/logout",
  });
};

export default function Logout() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <LogoutPage />
    </div>
  );
}
