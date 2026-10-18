import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account | Jerisom Trade",
  description: "Join Jerisom Trade and start trading with institutional-grade tools and deep liquidity.",
  openGraph: {
    title: "Create Account | Jerisom Trade",
    description: "Join the future of institutional trading.",
  },
};

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
