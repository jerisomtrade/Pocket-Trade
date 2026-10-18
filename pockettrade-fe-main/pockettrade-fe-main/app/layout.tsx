import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import LayoutWrapper from "@/components/LayoutWrapper";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({ subsets: ["latin"] });

const appName = process.env.NEXT_PUBLIC_APP_NAME || "Pocket Trade";
const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: {
    default: `${appName} | Institutional Crypto Trading Platform`,
    template: `%s | ${appName}`
  },
  description: `Experience institutional-grade crypto trading with ${appName}. Secure, fast, and professional trading for serious investors.`,
  keywords: ["crypto trading", "institutional trading", "bitcoin", "ethereum", "pocket trade", "professional trading"],
  authors: [{ name: `${appName} Team` }],
  creator: appName,
  publisher: appName,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: appName,
    title: `${appName} | Institutional Crypto Trading Platform`,
    description: "The next-generation institutional trading platform for serious investors.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: appName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jerisom Trade | Institutional Crypto Trading Platform",
    description: "The next-generation institutional trading platform for serious investors.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark", "font-sans", geist.variable)}>
      <body className={`${inter.className} gradient-bg min-h-screen antialiased text-white flex flex-col`}>
        <Toaster richColors position="bottom-right" theme="dark" />
        <LayoutWrapper>
          <Providers>
            {children}
          </Providers>
        </LayoutWrapper>
      </body>
    </html>
  );
}
