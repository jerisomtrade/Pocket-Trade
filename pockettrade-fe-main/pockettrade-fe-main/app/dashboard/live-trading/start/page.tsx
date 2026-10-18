import LiveTradingView from "@/components/LiveTradingView";
import { generatePageMetadata } from "@/components/common/PageMetaData";
import { Metadata } from "next";

export const generateMetadata = (): Metadata => {
  return generatePageMetadata({
    title: "Trading Terminal | Jerisom Trade",
    content: "Execute live trades on our advanced terminal.",
    url: "https://jerisomtrade.com/dashboard/live-trading/start",
  });
};

export default function LiveTradingStartPage() {
  return <LiveTradingView />;
}
