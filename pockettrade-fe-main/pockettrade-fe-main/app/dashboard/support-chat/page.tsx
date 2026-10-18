import SupportChat from "@/components/SupportChat";
import { generatePageMetadata } from "@/components/common/PageMetaData";
import { Metadata } from "next";

export const generateMetadata = (): Metadata => {
  return generatePageMetadata({
    title: "Support Center | Jerisom Trade",
    content: "Direct access to our institutional support desk for real-time assistance.",
    url: "https://jerisomtrade.com/dashboard/support-chat",
  });
};

export default function SupportChatPage() {
  return <SupportChat />;
}
