import DashboardInvestments from "@/components/DashboardInvestments";
import { generatePageMetadata } from "@/components/common/PageMetaData";
import { Metadata } from "next";

export const generateMetadata = (): Metadata => {
  return generatePageMetadata({
    title: "Investments | Jerisom Trade",
    content: "View and manage your investment portfolio.",
    url: "https://jerisomtrade.com/dashboard/investments",
  });
};

export default function InvestmentsPage() {
  return <DashboardInvestments />;
}
