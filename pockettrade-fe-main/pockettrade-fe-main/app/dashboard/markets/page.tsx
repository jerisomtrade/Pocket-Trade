import MarketsHub from "@/components/MarketsHub";
import { generatePageMetadata } from "@/components/common/PageMetaData";
import { Metadata } from "next";

export const generateMetadata = (): Metadata => {
  return generatePageMetadata({
    title: "Global Markets | Jerisom Trade",
    content: "Explore global markets and discover trading opportunities.",
    url: "https://jerisomtrade.com/dashboard/markets",
  });
};

export default function MarketsPage() {
  return <MarketsHub />;
}
