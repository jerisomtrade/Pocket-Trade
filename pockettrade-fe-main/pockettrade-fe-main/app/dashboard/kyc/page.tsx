import DashboardKyc from "@/components/Kyc";
import { generatePageMetadata } from "@/components/common/PageMetaData";
import { Metadata } from "next";

export const generateMetadata = (): Metadata => {
  return generatePageMetadata({
    title: "KYC Verification | Jerisom Trade",
    content:
      "Complete your identity verification to unlock full institutional features and ensure secure transactions on Jerisom Trade.",
    url: "https://jerisomtrade.com/dashboard/kyc",
  });
};

export default function KYCVerification() {
  return (
    <>
      <DashboardKyc />
    </>
  );
}
