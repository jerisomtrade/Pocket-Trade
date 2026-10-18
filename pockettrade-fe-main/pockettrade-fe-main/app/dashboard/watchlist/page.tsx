import DashboardWatchlist from "@/components/DashboardWatchlist";
import { generatePageMetadata } from "@/components/common/PageMetaData";
import { Metadata } from "next";

export const generateMetadata = (): Metadata => {
  return generatePageMetadata({
    title: "Market Watchlist | Jerisom Trade",
    content: "Monitor high-potential institutional assets and track their real-time performance.",
    url: "https://jerisomtrade.com/dashboard/watchlist",
  });
};

export default function Watchlist() {
  return <DashboardWatchlist />;
}
