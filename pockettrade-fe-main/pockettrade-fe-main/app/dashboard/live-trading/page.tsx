import LiveTrading from "@/components/LiveTrading";
import { generatePageMetadata } from "@/components/common/PageMetaData";
import { Metadata } from "next";

export const generateMetadata = (): Metadata => {
  return generatePageMetadata({
    title: "Live Trading | Jerisom Trade",
    content: "Trade real-time markets with advanced tools.",
    url: "https://jerisomtrade.com/dashboard/live-trading",
  });
};

export default function LiveTradingPage() {
  return <LiveTrading />;
}
