import DashboardHome from "@/components/DashboardHome";
import { generatePageMetadata } from "@/components/common/PageMetaData";
import { Metadata } from "next";

export const generateMetadata = (): Metadata => {
  return generatePageMetadata({
    title: "Dashboard | Jerisom Trade",
    content:
      "View and manage your portfolio, investments, and transactions. Track your progress and make informed decisions with insights into your asset allocation, profits, and available funds.",
    url: "https://jerisomtrade.com/dashboard",
  });
};

export default function Dashboard() {
  return <DashboardHome />;
}
