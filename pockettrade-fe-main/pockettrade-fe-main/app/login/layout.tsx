import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Jerisom Trade",
  description: "Sign in to your Jerisom Trade account to access the trading terminal and manage your portfolio.",
  openGraph: {
    title: "Login | Jerisom Trade",
    description: "Access the premier institutional trading platform.",
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
