import DashboardSettings from "@/components/DashboardSettings";
import { generatePageMetadata } from "@/components/common/PageMetaData";
import { Metadata } from "next";

export const generateMetadata = (): Metadata => {
  return generatePageMetadata({
    title: "Account Settings | Jerisom Trade",
    content: "Manage your institutional account security, sessions, and preferences.",
    url: "https://jerisomtrade.com/dashboard/settings",
  });
};

export default function Settings() {
  return <DashboardSettings />;
}
