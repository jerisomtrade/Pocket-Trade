import WithdrawalPage from "@/components/crypto/WithdrawalPage";
import { generatePageMetadata } from "@/components/common/PageMetaData";
import { Metadata } from "next";

export const generateMetadata = (): Metadata => {
  return generatePageMetadata({
    title: "Withdraw Funds | Jerisom Trade",
    content: "Withdraw your funds easily from your portfolio to your preferred crypto wallet.",
    url: "https://jerisomtrade.com/dashboard/withdraw",
  });
};

export default function WithdrawFunds() {
  return <WithdrawalPage />;
}
