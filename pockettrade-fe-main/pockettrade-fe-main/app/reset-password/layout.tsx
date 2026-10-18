import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password | Jerisom Trade",
  description: "Set a new secure password for your Jerisom Trade account.",
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
