import DashboardTransactions from "@/components/DashboardTransactions";
import { generatePageMetadata } from "@/components/common/PageMetaData";
import { Metadata } from "next";

export const generateMetadata = (): Metadata => {
  return generatePageMetadata({
    title: "Transactions | Jerisom Trade",
    content: "View and filter your complete transaction history.",
    url: "https://jerisomtrade.com/dashboard/transactions",
  });
};

export default function TransactionsPage() {
  return <DashboardTransactions />;
}
