import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Verification | Jerisom Trade",
  description: "Verifying your Jerisom Trade account for secure trading.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
