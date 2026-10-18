import NewInvestment from "@/components/NewInvestment";
import { generatePageMetadata } from "@/components/common/PageMetaData";
import { Metadata } from "next";

export const generateMetadata = (): Metadata => {
  return generatePageMetadata({
    title: "New Investment | Jerisom Trade",
    content: "Start a new investment in crypto assets with institutional strategies.",
    url: "https://jerisomtrade.com/dashboard/new-investment",
  });
};

export default function NewInvestmentPage() {
  return <NewInvestment />;
}
