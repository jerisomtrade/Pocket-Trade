import DashboardRetirement from "@/components/DashboardRetirement";
import { generatePageMetadata } from "@/components/common/PageMetaData";
import { Metadata } from "next";

export const generateMetadata = (): Metadata => {
  return generatePageMetadata({
    title: "Retirement Planning | Jerisom Trade",
    content: "Build a secure financial future with our institutional-grade retirement plans and tax-efficient account structures.",
    url: "https://jerisomtrade.com/dashboard/retirement-plans",
  });
};

export default function RetirementPlans() {
  return <DashboardRetirement />;
}
