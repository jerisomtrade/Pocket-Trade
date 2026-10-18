import AiTradingBots from "@/components/AiTradingBots";
import { generatePageMetadata } from "@/components/common/PageMetaData";
import { Metadata } from "next";

export const generateMetadata = (): Metadata => {
  return generatePageMetadata({
    title: "AI Trading Bots | Jerisom Trade",
    content: "Deploy advanced neural network bots to automate your trading strategy 24/7.",
    url: "https://jerisomtrade.com/dashboard/ai-trading-bots",
  });
};

export default function AiTradingBotsPage() {
  return <AiTradingBots />;
}
