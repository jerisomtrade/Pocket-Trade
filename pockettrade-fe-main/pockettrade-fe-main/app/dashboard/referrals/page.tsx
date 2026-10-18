import DashboardReferrals from "@/components/DashboardReferral";
import { generatePageMetadata } from "@/components/common/PageMetaData";
import { Metadata } from "next";

export const generateMetadata = (): Metadata => {
  return generatePageMetadata({
    title: "Referral Network | Jerisom Trade",
    content: "Grow your network and earn institutional rewards by referring others to Jerisom Trade.",
    url: "https://jerisomtrade.com/dashboard/referrals",
  });
};

export default function Referrals() {
  return <DashboardReferrals />;
}
