import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | Jerisom Trade",
  description: "Reset your Jerisom Trade account password securely.",
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
